import * as signalR from '@microsoft/signalr'
import type { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { getAccessTokenFromLS } from '~/utils/auth'
import type { ChatMessageResponse, SendMessageRequest } from '~/types/chat.type'

// ===== SignalR Client Interface =====
export interface IChatClient {
  onMessageCreated?: (message: ChatMessageResponse) => void
  onMessageUpdated?: (message: ChatMessageResponse) => void
  onMessageDeleted?: (messageId: string) => void
  onUserTyping?: (userId: string, userName: string) => void
  onUserStoppedTyping?: (userId: string) => void
  onUserOnline?: (userId: string) => void
  onUserOffline?: (userId: string) => void
  onConversationUpdated?: (conversationId: string) => void
}

// ===== SignalR Hub Connection Manager =====
class SignalRChatService {
  private connection: HubConnection | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private clientHandlers: IChatClient = {}

  /**
   * Get hub URL from environment
   */
  private getHubUrl(): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    // Remove trailing slash if exists
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    return `${cleanBaseUrl}/hubs/chat`
  }

  /**
   * Initialize SignalR connection with JWT authentication
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('[SignalR] Already connected')
      return
    }

    try {
      const token = getAccessTokenFromLS()
      if (!token) {
        throw new Error('No access token available for SignalR connection')
      }

      const hubUrl = this.getHubUrl()
      console.log('[SignalR] Connecting to:', hubUrl)

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
              console.error('[SignalR] Max reconnect attempts reached')
              return null // Stop reconnecting
            }
            return this.reconnectDelay * Math.pow(2, retryContext.previousRetryCount)
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Register client event handlers
      this.registerClientHandlers()

      // Connection lifecycle handlers
      this.connection.onclose((error) => {
        console.error('[SignalR] Connection closed:', error)
        this.reconnectAttempts = 0
      })

      this.connection.onreconnecting((error) => {
        console.warn('[SignalR] Reconnecting...', error)
        this.reconnectAttempts++
      })

      this.connection.onreconnected((connectionId) => {
        console.log('[SignalR] Reconnected successfully:', connectionId)
        this.reconnectAttempts = 0
      })

      // Start connection
      await this.connection.start()
      console.log('[SignalR] Connected successfully')
      
      // Notify online status
      await this.notifyOnline()
    } catch (error) {
      console.error('[SignalR] Connection failed:', error)
      throw error
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (!this.connection) return

    try {
      await this.notifyOffline()
      await this.connection.stop()
      console.log('[SignalR] Disconnected')
    } catch (error) {
      console.error('[SignalR] Disconnect error:', error)
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

    // MessageCreated
    this.connection.on('MessageCreated', (message: ChatMessageResponse) => {
      console.log('[SignalR] MessageCreated:', message)
      this.clientHandlers.onMessageCreated?.(message)
    })

    // MessageUpdated
    this.connection.on('MessageUpdated', (message: ChatMessageResponse) => {
      console.log('[SignalR] MessageUpdated:', message)
      this.clientHandlers.onMessageUpdated?.(message)
    })

    // MessageDeleted
    this.connection.on('MessageDeleted', (messageId: string) => {
      console.log('[SignalR] MessageDeleted:', messageId)
      this.clientHandlers.onMessageDeleted?.(messageId)
    })

    // UserTyping
    this.connection.on('UserTyping', (userId: string, userName: string) => {
      console.log('[SignalR] UserTyping:', userId, userName)
      this.clientHandlers.onUserTyping?.(userId, userName)
    })

    // UserStoppedTyping
    this.connection.on('UserStoppedTyping', (userId: string) => {
      console.log('[SignalR] UserStoppedTyping:', userId)
      this.clientHandlers.onUserStoppedTyping?.(userId)
    })

    // UserOnline
    this.connection.on('UserOnline', (userId: string) => {
      console.log('[SignalR] UserOnline:', userId)
      this.clientHandlers.onUserOnline?.(userId)
    })

    // UserOffline
    this.connection.on('UserOffline', (userId: string) => {
      console.log('[SignalR] UserOffline:', userId)
      this.clientHandlers.onUserOffline?.(userId)
    })

    // ConversationUpdated
    this.connection.on('ConversationUpdated', (conversationId: string) => {
      console.log('[SignalR] ConversationUpdated:', conversationId)
      this.clientHandlers.onConversationUpdated?.(conversationId)
    })
  }

  /**
   * Register custom client handlers
   */
  registerHandlers(handlers: IChatClient): void {
    this.clientHandlers = { ...this.clientHandlers, ...handlers }
  }

  // ========== Server Methods ==========

  /**
   * Join a conversation group
   */
  async joinConversation(conversationId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established')
    }
    await this.connection.invoke('JoinConversation', conversationId)
    console.log('[SignalR] Joined conversation:', conversationId)
  }

  /**
   * Leave a conversation group
   */
  async leaveConversation(conversationId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established')
    }
    await this.connection.invoke('LeaveConversation', conversationId)
    console.log('[SignalR] Left conversation:', conversationId)
  }

  /**
   * Send a message via SignalR (real-time)
   */
  async sendMessage(request: SendMessageRequest): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established')
    }
    await this.connection.invoke('SendMessage', request)
    console.log('[SignalR] Message sent:', request)
  }

  /**
   * Push message update
   */
  async pushMessageUpdate(messageId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established')
    }
    await this.connection.invoke('PushMessageUpdate', messageId)
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established')
    }
    await this.connection.invoke('DeleteMessage', messageId)
  }

  /**
   * Start typing indicator
   */
  async startTyping(conversationId: string, userName: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return // Silently fail for typing indicators
    }
    try {
      await this.connection.invoke('StartTyping', conversationId, userName)
    } catch (error) {
      console.warn('[SignalR] StartTyping failed:', error)
    }
  }

  /**
   * Stop typing indicator
   */
  async stopTyping(conversationId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return // Silently fail for typing indicators
    }
    try {
      await this.connection.invoke('StopTyping', conversationId)
    } catch (error) {
      console.warn('[SignalR] StopTyping failed:', error)
    }
  }

  /**
   * Notify online status
   */
  async notifyOnline(): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return
    }
    try {
      await this.connection.invoke('NotifyOnline')
    } catch (error) {
      console.warn('[SignalR] NotifyOnline failed:', error)
    }
  }

  /**
   * Notify offline status
   */
  async notifyOffline(): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return
    }
    try {
      await this.connection.invoke('NotifyOffline')
    } catch (error) {
      console.warn('[SignalR] NotifyOffline failed:', error)
    }
  }
}

// Export singleton instance
export const signalRChatService = new SignalRChatService()
export default signalRChatService
