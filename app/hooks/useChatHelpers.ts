import { useState, useEffect, useCallback, useRef } from 'react'
import { useChat } from '~/contexts/ChatContext'

/**
 * Hook for managing message input with typing indicators
 */
export function useChatInput(debounceMs: number = 1000) {
  const { currentConversation, sendMessage, startTyping, stopTyping } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle input change with typing indicator
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value)

      if (!currentConversation) return

      // Start typing indicator
      if (value.trim() && !isTyping) {
        setIsTyping(true)
        startTyping()
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Stop typing after debounce period
      if (value.trim()) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false)
          stopTyping()
        }, debounceMs)
      } else {
        setIsTyping(false)
        stopTyping()
      }
    },
    [currentConversation, isTyping, startTyping, stopTyping, debounceMs]
  )

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    try {
      await sendMessage(inputValue.trim())
      setInputValue('')
      setIsTyping(false)
      stopTyping()

      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    } catch (error) {
      console.error('[useChatInput] Failed to send message:', error)
    }
  }, [inputValue, sendMessage, stopTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping) {
        stopTyping()
      }
    }
  }, [isTyping, stopTyping])

  return {
    inputValue,
    setInputValue: handleInputChange,
    sendMessage: handleSendMessage,
    isTyping
  }
}

/**
 * Hook for filtering typing indicators for current conversation
 */
export function useTypingIndicators() {
  const { typingUsers, currentConversation } = useChat()

  const activeTypingUsers = typingUsers.filter(
    (user) => currentConversation && user.conversationId === currentConversation.id
  )

  const typingText =
    activeTypingUsers.length > 0
      ? activeTypingUsers.length === 1
        ? `${activeTypingUsers[0].userName} đang nhập...`
        : `${activeTypingUsers.length} người đang nhập...`
      : null

  return {
    typingUsers: activeTypingUsers,
    typingText,
    isAnyoneTyping: activeTypingUsers.length > 0
  }
}

/**
 * Hook for managing conversation selection and auto-join
 */
export function useConversationSelect() {
  const { currentConversation, setCurrentConversation, joinConversation, leaveConversation } =
    useChat()

  const selectConversation = useCallback(
    async (conversationId: string, conversation: any) => {
      // Leave current conversation
      if (currentConversation) {
        await leaveConversation(currentConversation.id)
      }

      // Set new conversation
      setCurrentConversation(conversation)

      // Join new conversation
      await joinConversation(conversationId)
    },
    [currentConversation, setCurrentConversation, joinConversation, leaveConversation]
  )

  return {
    currentConversation,
    selectConversation
  }
}

/**
 * Hook for getting messages for current conversation
 */
export function useCurrentMessages() {
  const { messages, currentConversation, loadMessages } = useChat()

  const currentMessages = currentConversation ? messages[currentConversation.id] || [] : []

  const refreshMessages = useCallback(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id)
    }
  }, [currentConversation, loadMessages])

  return {
    messages: currentMessages,
    refreshMessages,
    hasMessages: currentMessages.length > 0
  }
}

/**
 * Hook for online status check
 */
export function useOnlineStatus(userId: string | null | undefined) {
  const { onlineUsers } = useChat()

  const isOnline = userId ? onlineUsers.has(userId) : false

  return { isOnline }
}

/**
 * Hook for auto-scrolling message list
 */
export function useAutoScroll(dependency: any[]) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, dependency)

  return scrollRef
}

/**
 * Hook for connection status monitoring
 */
export function useConnectionStatus() {
  const { isConnected } = useChat()
  const [wasDisconnected, setWasDisconnected] = useState(false)

  useEffect(() => {
    if (!isConnected && !wasDisconnected) {
      setWasDisconnected(true)
    } else if (isConnected && wasDisconnected) {
      // Reconnected
      setWasDisconnected(false)
    }
  }, [isConnected, wasDisconnected])

  return {
    isConnected,
    wasDisconnected,
    statusText: isConnected ? 'Đã kết nối' : 'Đang kết nối lại...'
  }
}
