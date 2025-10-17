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
  onNotificationReceived?: (notification: NotificationData) => void
  onNotificationRead?: (notificationId: string) => void
  onAllNotificationsRead?: () => void
  onUnreadCountChanged?: (count: number) => void
}

// ===== SignalR Notification Hub Service =====
class SignalRNotificationService {
  private connection: HubConnection | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private clientHandlers: INotificationClient = {}

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
      this.connection.onclose((error) => {
        console.error('[NotificationHub] Connection closed:', error)
        this.reconnectAttempts = 0
      })

      this.connection.onreconnecting((error) => {
        console.warn('[NotificationHub] Reconnecting...', error)
        this.reconnectAttempts++
      })

      this.connection.onreconnected((connectionId) => {
        console.log('[NotificationHub] ✅ Reconnected successfully:', connectionId)
        this.reconnectAttempts = 0
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
    if (!this.connection) return

    try {
      await this.connection.stop()
      console.log('[NotificationHub] Disconnected')
    } catch (error) {
      console.error('[NotificationHub] Disconnect error:', error)
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
