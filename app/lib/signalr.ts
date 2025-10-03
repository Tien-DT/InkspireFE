import * as signalR from '@microsoft/signalr'
import type { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { getAccessTokenFromLS } from '~/utils/auth'
import type { ChatMessageResponse, SendMessageRequest } from '~/types/chat.type'
import type {
  CallOffer,
  CallAnswer,
  CallIceCandidate,
  CallRejection,
  CallEnd
} from '~/types/call.type'

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
  // Video Call Events
  onCallOffer?: (offer: CallOffer) => void
  onCallAnswer?: (answer: CallAnswer) => void
  onCallIceCandidate?: (data: CallIceCandidate) => void
  onCallRejected?: (data: CallRejection) => void
  onCallEnded?: (data: CallEnd) => void
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

    // ===== Video Call Events =====
    
    // CallOffer
    this.connection.on('CallOffer', (offer: CallOffer) => {
      console.log('[SignalR] CallOffer received:', offer.callId)
      this.onCallOffer?.(offer)
    })

    // CallAnswer
    this.connection.on('CallAnswer', (answer: CallAnswer) => {
      console.log('[SignalR] CallAnswer received:', answer.callId)
      this.onCallAnswer?.(answer)
    })

    // CallIceCandidate
    this.connection.on('CallIceCandidate', (data: CallIceCandidate) => {
      console.log('[SignalR] CallIceCandidate received')
      this.onCallIceCandidate?.(data)
    })

    // CallRejected
    this.connection.on('CallRejected', (data: CallRejection) => {
      console.log('[SignalR] CallRejected:', data.callId)
      this.onCallRejected?.(data)
    })

    // CallEnded
    this.connection.on('CallEnded', (data: CallEnd) => {
      console.log('[SignalR] CallEnded:', data.callId)
      this.onCallEnded?.(data)
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

  // ===== Video Call Methods =====

  /**
   * Send call offer to initiate call
   */
  async sendCallOffer(offer: CallOffer): Promise<void> {
    console.log('[SignalR] ===== ATTEMPTING TO SEND CALL OFFER =====')
    console.log('[SignalR] Connection state:', this.connection?.state)
    console.log('[SignalR] Is connected:', this.isConnected())
    
    if (!this.connection) {
      const error = 'SignalR connection is null'
      console.error('[SignalR]', error)
      throw new Error(error)
    }
    
    if (!this.isConnected()) {
      const error = `SignalR not connected (state: ${this.connection.state})`
      console.error('[SignalR]', error)
      throw new Error(error)
    }
    
    try {
      console.log('[SignalR] Offer details:', JSON.stringify({
        callId: offer.callId,
        callType: offer.callType,
        caller: offer.caller,
        receiver: offer.receiver,
        conversationId: offer.conversationId
      }, null, 2))
      
      await this.connection.invoke('SendCallOffer', offer)
      console.log('[SignalR] ===== CALL OFFER SENT SUCCESSFULLY =====')
    } catch (error) {
      console.error('[SignalR] ===== SEND CALL OFFER FAILED =====')
      console.error('[SignalR] Error:', error)
      throw error
    }
  }

  /**
   * Send call answer to accept call
   */
  async sendCallAnswer(answer: CallAnswer): Promise<void> {
    console.log('[SignalR] ===== ATTEMPTING TO SEND CALL ANSWER =====')
    console.log('[SignalR] Connection state:', this.connection?.state)
    console.log('[SignalR] Answer CallId:', answer.callId)
    console.log('[SignalR] Caller ID:', answer.callerId)
    
    if (!this.connection || !this.isConnected()) {
      const error = `SignalR not connected (state: ${this.connection?.state})`
      console.error('[SignalR]', error)
      throw new Error(error)
    }
    
    try {
      await this.connection.invoke('SendCallAnswer', answer)
      console.log('[SignalR] ===== CALL ANSWER SENT SUCCESSFULLY =====')
    } catch (error) {
      console.error('[SignalR] ===== SEND CALL ANSWER FAILED =====')
      console.error('[SignalR] Error:', error)
      throw error
    }
  }

  /**
   * Send ICE candidate for WebRTC connection
   */
  async sendCallIceCandidate(data: CallIceCandidate): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return // Silently fail for ICE candidates
    }
    try {
      await this.connection.invoke('SendCallIceCandidate', data)
    } catch (error) {
      console.warn('[SignalR] SendCallIceCandidate failed:', error)
    }
  }

  /**
   * Send call rejection
   */
  sendCallRejection(data: CallRejection): void {
    if (!this.connection || !this.isConnected()) {
      return
    }
    try {
      this.connection.invoke('SendCallRejection', data)
      console.log('[SignalR] Call rejection sent:', data.callId)
    } catch (error) {
      console.error('[SignalR] SendCallRejection failed:', error)
    }
  }

  /**
   * Send call end notification
   */
  sendCallEnd(data: CallEnd): void {
    if (!this.connection || !this.isConnected()) {
      return
    }
    try {
      this.connection.invoke('SendCallEnd', data)
      console.log('[SignalR] Call end sent:', data.callId)
    } catch (error) {
      console.error('[SignalR] SendCallEnd failed:', error)
    }
  }

  // ===== Call Event Handlers (to be set by VideoCallContext) =====
  
  onCallOffer?: (offer: CallOffer) => void
  onCallAnswer?: (answer: CallAnswer) => void
  onCallIceCandidate?: (data: CallIceCandidate) => void
  onCallRejected?: (data: CallRejection) => void
  onCallEnded?: (data: CallEnd) => void
}

// Export singleton instance
export const signalRChatService = new SignalRChatService()
export default signalRChatService
