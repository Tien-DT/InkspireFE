import { useChat } from '~/contexts/ChatContext'

/**
 * Hook to get total unread message count from ChatContext
 * Returns the unreadCount state from ChatContext (updates in realtime via SignalR)
 */
export function useUnreadMessageCount() {
  const { unreadCount } = useChat()
  return unreadCount
}
