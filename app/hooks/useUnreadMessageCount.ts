import { useMemo } from 'react'
import { useChat } from '~/contexts/ChatContext'
import { useAuth } from '~/contexts/AuthContext'

/**
 * Hook to calculate total unread message count across all conversations
 * Returns the sum of unreadCount from all conversation members where userId matches current user
 */
export function useUnreadMessageCount() {
  const { conversations } = useChat()
  const { profile } = useAuth()

  const totalUnread = useMemo(() => {
    if (!profile?.id || !conversations || conversations.length === 0) {
      return 0
    }

    return conversations.reduce((total, conversation) => {
      if (!conversation.members || conversation.members.length === 0) {
        return total
      }

      const currentUserMember = conversation.members.find(
        (member) => member.userId === profile.id
      )

      if (currentUserMember && currentUserMember.unreadCount) {
        return total + currentUserMember.unreadCount
      }

      return total
    }, 0)
  }, [conversations, profile?.id])

  return totalUnread
}
