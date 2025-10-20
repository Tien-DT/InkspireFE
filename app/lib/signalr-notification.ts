import * as signalR from '@microsoft/signalr'
import type { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { getAccessTokenFromLS } from '~/utils/auth'

// ===== Notification Data Interface =====
export interface NotificationData {
  id: string
  userId: string
  content: string
  notiType: number
  isReaded: boolean
  createdAt: string
  data?: Record<string, string>
}

// ===== SignalR Notification Client Interface =====
export interface INotificationClient {
  // Notifications
  onNotificationReceived?: (notification: NotificationData) => void
  onNotificationRead?: (notificationId: string) => void
  onAllNotificationsRead?: () => void
  onUnreadCountChanged?: (count: number) => void
  
  // Proposals
  onProposalCreated?: (proposal: any) => void
  onProposalUpdated?: (proposal: any) => void
  onProposalDeleted?: (proposalId: string) => void
  
  // Projects
  onProjectCreated?: (project: any) => void
  onProjectUpdated?: (project: any) => void
  onProjectStatusChanged?: (projectId: string, status: number) => void
  onMilestoneUpdated?: (milestone: any) => void
  onComplaintUpdated?: (complaint: any) => void
  
  // Wallet & Transactions
  onWalletBalanceChanged?: (newBalance: number, walletId: string) => void
  onTransactionCreated?: (transaction: any) => void
  
  // Subscriptions
  onSubscriptionChanged?: (subscription: any) => void
  onSubscriptionExpired?: (subscriptionId: string) => void
  
  // Recruitments & CVs
  onRecruitmentCreated?: (recruitment: any) => void
  onRecruitmentUpdated?: (recruitment: any) => void
  onCVSubmitted?: (cv: any) => void
  onCVStatusChanged?: (cvId: string, status: number) => void
}

// ===== SignalR Notification Hub Service =====
class SignalRNotificationService {
  private connection: HubConnection | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10 // Increased from 5 to 10
  private clientHandlers: INotificationClient = {}
  private reconnectTimer: NodeJS.Timeout | null = null
  private isManualDisconnect = false

  /**
   * Get hub URL from environment
   */
  private getHubUrl(): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    return `${cleanBaseUrl}/hubs/notifications`
  }

  /**
   * Initialize SignalR connection with JWT authentication
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('[NotificationHub] Already connected')
      return
    }

    try {
      const token = getAccessTokenFromLS()
      if (!token) {
        throw new Error('No access token available for NotificationHub connection')
      }

      const hubUrl = this.getHubUrl()
      console.log('[NotificationHub] Connecting to:', hubUrl)

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
              console.error('[NotificationHub] Max reconnect attempts reached')
              return null
            }
            // Exponential backoff: 2s, 4s, 8s, 16s, 30s
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Register client event handlers
      this.registerClientHandlers()

      // Connection lifecycle handlers
      this.connection.onclose(async (error) => {
        console.error('[NotificationHub] ❌ Connection closed:', error)
        this.reconnectAttempts = 0
        
        // If not manual disconnect, try to reconnect
        if (!this.isManualDisconnect) {
          console.log('[NotificationHub] 🔄 Will attempt manual reconnect in 5s...')
          this.scheduleReconnect()
        }
      })

      this.connection.onreconnecting((error) => {
        console.warn('[NotificationHub] 🔄 Auto-reconnecting...', error)
        this.reconnectAttempts++
        // Show toast to user
        if (typeof window !== 'undefined') {
          import('sonner').then(({ toast }) => {
            toast.warning('Đang kết nối lại...', { duration: 2000 })
          })
        }
      })

      this.connection.onreconnected((connectionId) => {
        console.log('[NotificationHub] ✅ Auto-reconnected successfully:', connectionId)
        this.reconnectAttempts = 0
        // Show success toast
        if (typeof window !== 'undefined') {
          import('sonner').then(({ toast }) => {
            toast.success('Đã kết nối lại!', { duration: 2000 })
          })
        }
      })

      // Start connection
      await this.connection.start()
      console.log('[NotificationHub] ✅ Connected successfully')
    } catch (error) {
      console.error('[NotificationHub] ❌ Connection failed:', error)
      throw error
    }
  }

  /**
   * Disconnect from NotificationHub
   */
  async disconnect(): Promise<void> {
    this.isManualDisconnect = true
    this.clearReconnectTimer()
    
    if (!this.connection) return

    try {
      await this.connection.stop()
      console.log('[NotificationHub] Disconnected')
    } catch (error) {
      console.error('[NotificationHub] Disconnect error:', error)
    }
  }

  /**
   * Schedule reconnect attempt
   */
  private scheduleReconnect(): void {
    this.clearReconnectTimer()
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[NotificationHub] ❌ Max reconnect attempts reached. Please reload page.')
      // Show persistent toast
      if (typeof window !== 'undefined') {
        import('sonner').then(({ toast }) => {
          toast.error('Mất kết nối. Vui lòng tải lại trang.', {
            duration: Infinity,
            action: {
              label: 'Tải lại',
              onClick: () => window.location.reload()
            }
          })
        })
      }
      return
    }
    
    const delay = Math.min(5000 * Math.pow(2, this.reconnectAttempts), 30000)
    console.log(`[NotificationHub] ⏱️ Scheduling reconnect attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts} in ${delay}ms`)
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.manualReconnect()
    }, delay)
  }

  /**
   * Manual reconnect attempt
   */
  private async manualReconnect(): Promise<void> {
    try {
      console.log(`[NotificationHub] 🔄 Manual reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
      
      // Clear old connection
      if (this.connection) {
        await this.connection.stop()
        this.connection = null
      }
      
      // Try to reconnect
      await this.connect()
      
      console.log('[NotificationHub] ✅ Manual reconnect successful!')
      this.reconnectAttempts = 0
      
      // Show success toast
      if (typeof window !== 'undefined') {
        import('sonner').then(({ toast }) => {
          toast.success('Đã kết nối lại thành công!', { duration: 3000 })
        })
      }
    } catch (error) {
      console.error('[NotificationHub] ❌ Manual reconnect failed:', error)
      // Schedule next attempt
      this.scheduleReconnect()
    }
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): HubConnectionState | null {
    return this.connection?.state || null
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  /**
   * Register client-side event handlers
   */
  private registerClientHandlers(): void {
    if (!this.connection) return

    // NotificationReceived
    this.connection.on('NotificationReceived', (notification: NotificationData) => {
      console.log('[NotificationHub] 📩 NotificationReceived:', notification)
      this.clientHandlers.onNotificationReceived?.(notification)
    })

    // NotificationRead
    this.connection.on('NotificationRead', (notificationId: string) => {
      console.log('[NotificationHub] ✅ NotificationRead:', notificationId)
      this.clientHandlers.onNotificationRead?.(notificationId)
    })

    // AllNotificationsRead
    this.connection.on('AllNotificationsRead', () => {
      console.log('[NotificationHub] ✅ AllNotificationsRead')
      this.clientHandlers.onAllNotificationsRead?.()
    })

    // UnreadCountChanged
    this.connection.on('UnreadCountChanged', (count: number) => {
      console.log('[NotificationHub] 📊 UnreadCountChanged:', count)
      this.clientHandlers.onUnreadCountChanged?.(count)
    })

    // ===== Proposals =====
    this.connection.on('ProposalCreated', (proposal: any) => {
      console.log('[NotificationHub] 💼 ProposalCreated:', proposal)
      this.clientHandlers.onProposalCreated?.(proposal)
    })

    this.connection.on('ProposalUpdated', (proposal: any) => {
      console.log('[NotificationHub] 💼 ProposalUpdated:', proposal)
      this.clientHandlers.onProposalUpdated?.(proposal)
    })

    this.connection.on('ProposalDeleted', (proposalId: string) => {
      console.log('[NotificationHub] 🗑️ ProposalDeleted:', proposalId)
      this.clientHandlers.onProposalDeleted?.(proposalId)
    })

    // ===== Projects =====
    this.connection.on('ProjectCreated', (project: any) => {
      console.log('[NotificationHub] 🚀 ProjectCreated:', project)
      this.clientHandlers.onProjectCreated?.(project)
    })

    this.connection.on('ProjectUpdated', (project: any) => {
      console.log('[NotificationHub] 🚀 ProjectUpdated:', project)
      this.clientHandlers.onProjectUpdated?.(project)
    })

    this.connection.on('ProjectStatusChanged', (projectId: string, status: number) => {
      console.log('[NotificationHub] 📊 ProjectStatusChanged:', projectId, status)
      this.clientHandlers.onProjectStatusChanged?.(projectId, status)
    })

    this.connection.on('MilestoneUpdated', (milestone: any) => {
      console.log('[NotificationHub] ⭐ MilestoneUpdated:', milestone)
      this.clientHandlers.onMilestoneUpdated?.(milestone)
    })

    this.connection.on('ComplaintUpdated', (complaint: any) => {
      console.log('[NotificationHub] ⚠️ ComplaintUpdated:', complaint)
      this.clientHandlers.onComplaintUpdated?.(complaint)
    })

    // ===== Wallet & Transactions =====
    this.connection.on('WalletBalanceChanged', (newBalance: number, walletId: string) => {
      console.log('[NotificationHub] 💰 WalletBalanceChanged:', newBalance, walletId)
      this.clientHandlers.onWalletBalanceChanged?.(newBalance, walletId)
    })

    this.connection.on('TransactionCreated', (transaction: any) => {
      console.log('[NotificationHub] 💸 TransactionCreated:', transaction)
      this.clientHandlers.onTransactionCreated?.(transaction)
    })

    // ===== Subscriptions =====
    this.connection.on('SubscriptionChanged', (subscription: any) => {
      console.log('[NotificationHub] 🎁 SubscriptionChanged:', subscription)
      this.clientHandlers.onSubscriptionChanged?.(subscription)
    })

    this.connection.on('SubscriptionExpired', (subscriptionId: string) => {
      console.log('[NotificationHub] ⏰ SubscriptionExpired:', subscriptionId)
      this.clientHandlers.onSubscriptionExpired?.(subscriptionId)
    })

    // ===== Recruitments & CVs =====
    this.connection.on('RecruitmentCreated', (recruitment: any) => {
      console.log('[NotificationHub] 📝 RecruitmentCreated:', recruitment)
      this.clientHandlers.onRecruitmentCreated?.(recruitment)
    })

    this.connection.on('RecruitmentUpdated', (recruitment: any) => {
      console.log('[NotificationHub] 📝 RecruitmentUpdated:', recruitment)
      this.clientHandlers.onRecruitmentUpdated?.(recruitment)
    })

    this.connection.on('CVSubmitted', (cv: any) => {
      console.log('[NotificationHub] 📄 CVSubmitted:', cv)
      this.clientHandlers.onCVSubmitted?.(cv)
    })

    this.connection.on('CVStatusChanged', (cvId: string, status: number) => {
      console.log('[NotificationHub] 📄 CVStatusChanged:', cvId, status)
      this.clientHandlers.onCVStatusChanged?.(cvId, status)
    })
  }

  /**
   * Register custom client handlers
   */
  registerHandlers(handlers: INotificationClient): void {
    this.clientHandlers = { ...this.clientHandlers, ...handlers }
  }

  /**
   * Clear all handlers
   */
  clearHandlers(): void {
    this.clientHandlers = {}
  }
}

// Export singleton instance
export const signalRNotificationService = new SignalRNotificationService()
export default signalRNotificationService
