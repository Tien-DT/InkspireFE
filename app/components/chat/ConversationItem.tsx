import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import type { Conversation, ConversationMember } from '~/types/chat.type'
import { useOnlineStatus } from '~/hooks/useChatHelpers'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  currentUserId?: string | null
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  currentUserId
}: ConversationItemProps) {
  // Find other member (not current user)
  const otherMember = conversation.members?.find((m) => m.userId !== currentUserId)
  const otherUser = otherMember?.user

  const { isOnline } = useOnlineStatus(otherUser?.id)

  // Get initials for avatar
  const getInitials = () => {
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase()
    }
    if (otherUser?.email) {
      return otherUser.email[0].toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const displayName = () => {
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name} ${otherUser.last_name}`
    }
    if (otherUser?.email) {
      return otherUser.email
    }
    return 'Unknown User'
  }

  // Format timestamp
  const formatTime = () => {
    if (!conversation.updatedAt) return ''
    try {
      return formatDistanceToNow(new Date(conversation.updatedAt), {
        addSuffix: false,
        locale: vi
      })
    } catch {
      return ''
    }
  }

  // Get unread count
  const unreadCount = otherMember?.unreadCount || 0

  return (
    <div
      className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className='flex items-start space-x-3'>
        <div className='relative'>
          <Avatar className='w-10 h-10'>
            <AvatarFallback className='bg-gray-200'>{getInitials()}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-900 text-sm truncate'>{displayName()}</h3>
            <span className='text-xs text-gray-500'>{formatTime()}</span>
          </div>
          <p className='text-xs text-gray-600 truncate mt-1'>
            {conversation.latestMessage || 'Không có tin nhắn'}
          </p>
          <div className='flex items-center justify-between mt-1'>
            <span className='text-xs text-gray-500'>
              {isOnline ? '● Đang online' : 'Offline'}
            </span>
            {unreadCount > 0 && (
              <span className='bg-blue-500 text-white text-xs rounded-full px-2 py-0.5'>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
