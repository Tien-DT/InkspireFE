import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '~/utils/cn'
import type { Conversation } from '~/types/chat.type'
import { useUserDetails } from '~/hooks/useUserDetails'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  currentUserId?: string | null
}

export function ConversationItem({ conversation, isActive, onClick, currentUserId }: ConversationItemProps) {
  // Find other member (not current user) for display
  const otherMember = conversation.members?.find((m) => m.userId !== currentUserId)
  const otherUser = otherMember?.user

  // Find current user's member to get unread count
  const currentUserMember = conversation.members?.find((m) => m.userId === currentUserId)

  // Fetch full user details
  const { userDetails } = useUserDetails(otherUser?.id)

  // Get initials for avatar
  const getInitials = () => {
    // Try userDetails from API first
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName[0]}${userDetails.lastName[0]}`.toUpperCase()
    }
    // Fallback to otherUser
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase()
    }
    if (userDetails?.email) {
      return userDetails.email[0].toUpperCase()
    }
    if (otherUser?.email) {
      return otherUser.email[0].toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const displayName = () => {
    // Try userDetails from API first
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName} ${userDetails.lastName}`
    }
    // Fallback to otherUser
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name} ${otherUser.last_name}`
    }
    // Fallback to email
    if (userDetails?.email) {
      return userDetails.email
    }
    if (otherUser?.email) {
      return otherUser.email
    }
    return 'Unknown User'
  }

  const displayEmail = () => {
    return userDetails?.email || otherUser?.email || 'No email'
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

  // Get unread count for CURRENT USER (not other member)
  const unreadCount = currentUserMember?.unreadCount || 0

  const relativeTime = formatTime()
  const statusDisplay = relativeTime ? `${displayEmail()} • ${relativeTime}` : displayEmail()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 overflow-hidden rounded-md px-3 py-3 text-left transition-colors',
        isActive ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'
      )}
    >
      <div className='relative flex-shrink-0'>
        <Avatar className='h-10 w-10'>
          <AvatarFallback className='bg-muted text-sm font-medium text-foreground'>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-1 overflow-hidden'>
        <div className='flex min-w-0 items-center justify-between gap-2'>
          <h3 className='min-w-0 flex-1 truncate text-base font-semibold text-foreground'>{displayName()}</h3>
          {unreadCount > 0 && (
            <span className='inline-flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground'>
          {conversation.latestMessage || 'Chưa có tin nhắn'}
        </p>
        <div className='flex min-w-0 items-center gap-2 pt-1 text-xs text-muted-foreground'>
          <span className='flex min-w-0 flex-1 items-center gap-1 truncate'>
            <span className='truncate whitespace-nowrap'>{statusDisplay}</span>
          </span>
        </div>
      </div>
    </button>
  )
}
