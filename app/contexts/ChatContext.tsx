import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import type { Conversation, Message, ChatMessageResponse, SendMessageRequest, TypingUser } from '~/types/chat.type'
import { MessageStatus } from '~/types/chat.type'
import { chatApi } from '~/apis/chat.api'
import { signalRChatService } from '~/lib/signalr'
import { chatStorage } from '~/utils/chat-storage'
import { useAuth } from './AuthContext'
import { parseJwtPayload } from '~/utils/auth'

// ===== Context Interface =====
interface ChatContextInterface {
  // State
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Record<string, Message[]>
  typingUsers: TypingUser[]
  onlineUsers: Set<string>
  isConnected: boolean
  isLoading: boolean

  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void
  loadConversations: () => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  createNewConversation: (userId: string) => Promise<Conversation>
  joinConversation: (conversationId: string) => Promise<void>
  leaveConversation: (conversationId: string) => Promise<void>
  startTyping: () => void
  stopTyping: () => void
  markAsRead: (messageId: string) => Promise<void>
  refreshConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextInterface | undefined>(undefined)

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}

// ===== Provider =====
interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { isAuthenticated, profile } = useAuth()

  // State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get current user ID from profile or JWT
  const currentUserId = useMemo(() => {
    if (profile?.id) return profile.id

    // Try to extract from JWT
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return null

    const payload = parseJwtPayload(token)
    return payload?.sub || null
  }, [profile])

  const currentUserName = useMemo(() => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    return profile?.email || 'User'
  }, [profile])

  // ===== Initialize =====
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear state on logout
      setConversations([])
      setCurrentConversation(null)
      setMessages({})
      setTypingUsers([])
      setOnlineUsers(new Set())
      setIsConnected(false)
      return
    }

    // Load from localStorage first
    const storedConversations = chatStorage.getConversations()
    const storedMessages = chatStorage.getAllMessages()

    setConversations(storedConversations)
    setMessages(storedMessages)

    // Initialize SignalR connection
    initializeSignalR()

    // Load fresh data from server
    loadConversations()

    return () => {
      // Cleanup
      signalRChatService.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // ===== Auto-join and load messages when conversation changes =====
  useEffect(() => {
    if (!currentConversation || !isConnected) return

    const conversationId = currentConversation.id

    // Join conversation for real-time updates
    const joinAndLoad = async () => {
      try {
        await signalRChatService.joinConversation(conversationId)
        console.log('[ChatContext] Joined conversation:', conversationId)

        // Load messages if not already loaded
        if (!messages[conversationId] || messages[conversationId].length === 0) {
          await loadMessages(conversationId)
        }

        // Reset unread count for current user when opening conversation
        if (currentUserId) {
          const currentUserMember = currentConversation.members?.find((m) => m.userId === currentUserId)
          if (currentUserMember && currentUserMember.unreadCount && currentUserMember.unreadCount > 0) {
            try {
              await chatApi.resetUnreadCount(currentUserMember.id)
              console.log('[ChatContext] Reset unread count for conversation:', conversationId)
              
              // Update local state
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        members: conv.members?.map((m) =>
                          m.userId === currentUserId ? { ...m, unreadCount: 0 } : m
                        )
                      }
                    : conv
                )
              )
            } catch (error) {
              console.error('[ChatContext] Failed to reset unread count:', error)
            }
          }
        }
      } catch (error) {
        console.error('[ChatContext] Failed to join conversation:', error)
      }
    }

    void joinAndLoad()

    // Cleanup: leave conversation when switching or unmounting
    return () => {
      void signalRChatService.leaveConversation(conversationId)
      console.log('[ChatContext] Left conversation:', conversationId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id, isConnected])

  // ===== SignalR Initialization =====
  const initializeSignalR = useCallback(async () => {
    try {
      // Register client handlers
      signalRChatService.registerHandlers({
        onMessageCreated: handleMessageCreated,
        onMessageUpdated: handleMessageUpdated,
        onMessageDeleted: handleMessageDeleted,
        onUserTyping: handleUserTyping,
        onUserStoppedTyping: handleUserStoppedTyping,
        onUserOnline: handleUserOnline,
        onUserOffline: handleUserOffline,
        onConversationUpdated: handleConversationUpdated
      })

      // Connect
      await signalRChatService.connect()
      setIsConnected(true)
    } catch (error) {
      console.error('[ChatContext] SignalR connection failed:', error)
      setIsConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ===== SignalR Event Handlers =====
  const handleMessageCreated = useCallback((message: ChatMessageResponse) => {
    const msg: Message = {
      id: message.id,
      conversationId: message.conversationId,
      messageContent: message.messageContent,
      senderId: message.senderId,
      sendAt: message.sendAt,
      receivedAt: message.receivedAt,
      readAt: message.readAt,
      status: message.status
    }

    // Update messages state
    setMessages((prev) => {
      const conversationMessages = prev[message.conversationId] || []
      const exists = conversationMessages.some((m) => m.id === message.id)

      if (exists) return prev

      const updated = [msg, ...conversationMessages]
      return { ...prev, [message.conversationId]: updated }
    })

    // Save to localStorage
    chatStorage.upsertMessage(message.conversationId, msg)

    // Update conversation's latest message and increment unread count
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === message.conversationId) {
          // Check if message is from another user and not in current conversation
          const isFromOtherUser = message.senderId !== currentUserId
          const isCurrentConversation = currentConversation?.id === message.conversationId
          
          // Increment unread count if message is from other user and not viewing this conversation
          const updatedMembers = conv.members?.map((member) => {
            if (member.userId === currentUserId && isFromOtherUser && !isCurrentConversation) {
              return { ...member, unreadCount: (member.unreadCount || 0) + 1 }
            }
            return member
          })

          return {
            ...conv,
            latestMessage: message.messageContent || '',
            updatedAt: message.sendAt,
            members: updatedMembers
          }
        }
        return conv
      })
    )
  }, [currentUserId, currentConversation])

  const handleMessageUpdated = useCallback((message: ChatMessageResponse) => {
    const msg: Message = {
      id: message.id,
      conversationId: message.conversationId,
      messageContent: message.messageContent,
      senderId: message.senderId,
      sendAt: message.sendAt,
      receivedAt: message.receivedAt,
      readAt: message.readAt,
      status: message.status
    }

    setMessages((prev) => {
      const conversationMessages = prev[message.conversationId] || []
      const updated = conversationMessages.map((m) => (m.id === message.id ? msg : m))
      return { ...prev, [message.conversationId]: updated }
    })

    chatStorage.upsertMessage(message.conversationId, msg)
  }, [])

  const handleMessageDeleted = useCallback((messageId: string) => {
    setMessages((prev) => {
      const newMessages = { ...prev }
      Object.keys(newMessages).forEach((conversationId) => {
        newMessages[conversationId] = newMessages[conversationId].filter((m) => m.id !== messageId)

        // Remove from storage
        const msg = prev[conversationId]?.find((m) => m.id === messageId)
        if (msg) {
          chatStorage.removeMessage(conversationId, messageId)
        }
      })
      return newMessages
    })
  }, [])

  const handleUserTyping = useCallback(
    (userId: string, userName: string) => {
      if (!currentConversation) return

      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === userId && u.conversationId === currentConversation.id)
        if (exists) return prev

        return [
          ...prev,
          {
            userId,
            userName,
            conversationId: currentConversation.id,
            timestamp: Date.now()
          }
        ]
      })

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId))
      }, 3000)
    },
    [currentConversation]
  )

  const handleUserStoppedTyping = useCallback((userId: string) => {
    setTypingUsers((prev) => prev.filter((u) => u.userId !== userId))
  }, [])

  const handleUserOnline = useCallback((userId: string) => {
    setOnlineUsers((prev) => new Set(prev).add(userId))
  }, [])

  const handleUserOffline = useCallback((userId: string) => {
    setOnlineUsers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
  }, [])

  const handleConversationUpdated = useCallback(async (conversationId: string) => {
    // Reload conversation details
    try {
      const response = await chatApi.getConversationById(conversationId)
      if (response.success && response.data) {
        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? response.data : conv)))
      }
    } catch (error) {
      console.error('[ChatContext] Failed to reload conversation:', error)
    }
  }, [])

  // ===== Actions =====
  const loadConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await chatApi.getMyConversations({ page: 1, pageSize: 50 })
      if (response.success && response.data) {
        setConversations(response.data)
        chatStorage.saveConversations(response.data)
      }
    } catch (error) {
      console.error('[ChatContext] Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true)
    try {
      const response = await chatApi.getConversationMessages(conversationId, { page: 1, pageSize: 100 })
      if (response.success && response.data) {
        setMessages((prev) => ({ ...prev, [conversationId]: response.data }))
        chatStorage.saveMessages(conversationId, response.data)
      }
    } catch (error) {
      console.error('[ChatContext] Failed to load messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentConversation || !content.trim()) return

      const request: SendMessageRequest = {
        conversationId: currentConversation.id,
        messageContent: content.trim(),
        senderId: currentUserId as string | null,
        status: MessageStatus.Sent
      }

      try {
        // Send via SignalR for real-time delivery
        await signalRChatService.sendMessage(request)
      } catch (error) {
        console.error('[ChatContext] Failed to send message:', error)
        // Fallback to REST API
        try {
          await chatApi.sendMessage(request)
        } catch (apiError) {
          console.error('[ChatContext] REST API send also failed:', apiError)
        }
      }
    },
    [currentConversation, currentUserId]
  )

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await signalRChatService.deleteMessage(messageId)
    } catch (error) {
      console.error('[ChatContext] Failed to delete message:', error)
    }
  }, [])

  const createNewConversation = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true)

        // Check if conversation already exists with this user
        const existingConversation = conversations.find((conv) =>
          conv.members?.some((member) => member.userId === userId)
        )

        if (existingConversation) {
          console.log('[ChatContext] Conversation already exists, switching to it:', existingConversation.id)
          setCurrentConversation(existingConversation)
          return existingConversation
        }

        // Create new conversation
        const response = await chatApi.createConversationWithUser(userId)
        const newConversation = response.data

        // Add to conversations list (check if not already added by backend)
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === newConversation.id)
          if (exists) return prev
          return [newConversation, ...prev]
        })

        // Save to localStorage
        chatStorage.saveConversations([newConversation, ...conversations])

        // Set as current conversation (useEffect will auto-join and load messages)
        setCurrentConversation(newConversation)

        return newConversation
      } catch (error) {
        console.error('[ChatContext] Failed to create conversation:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [conversations]
  )

  const joinConversation = useCallback(
    async (conversationId: string) => {
      try {
        await signalRChatService.joinConversation(conversationId)
        // Load messages for this conversation
        await loadMessages(conversationId)
      } catch (error) {
        console.error('[ChatContext] Failed to join conversation:', error)
      }
    },
    [loadMessages]
  )

  const leaveConversation = useCallback(async (conversationId: string) => {
    try {
      await signalRChatService.leaveConversation(conversationId)
    } catch (error) {
      console.error('[ChatContext] Failed to leave conversation:', error)
    }
  }, [])

  const startTyping = useCallback(() => {
    if (!currentConversation) return
    signalRChatService.startTyping(currentConversation.id, currentUserName)
  }, [currentConversation, currentUserName])

  const stopTyping = useCallback(() => {
    if (!currentConversation) return
    signalRChatService.stopTyping(currentConversation.id)
  }, [currentConversation])

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await chatApi.markAsRead(messageId)
    } catch (error) {
      console.error('[ChatContext] Failed to mark as read:', error)
    }
  }, [])

  const refreshConversations = useCallback(async () => {
    await loadConversations()
  }, [loadConversations])

  // ===== Context Value =====
  const value = useMemo<ChatContextInterface>(
    () => ({
      conversations,
      currentConversation,
      messages,
      typingUsers,
      onlineUsers,
      isConnected,
      isLoading,
      setCurrentConversation,
      loadConversations,
      loadMessages,
      sendMessage,
      deleteMessage,
      createNewConversation,
      joinConversation,
      leaveConversation,
      startTyping,
      stopTyping,
      markAsRead,
      refreshConversations
    }),
    [
      conversations,
      currentConversation,
      messages,
      typingUsers,
      onlineUsers,
      isConnected,
      isLoading,
      loadConversations,
      loadMessages,
      sendMessage,
      deleteMessage,
      createNewConversation,
      joinConversation,
      leaveConversation,
      startTyping,
      stopTyping,
      markAsRead,
      refreshConversations
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatProvider
