import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '~/utils/cn'
import type { Conversation } from '~/types/chat.type'
import { useOnlineStatus } from '~/hooks/useChatHelpers'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  currentUserId?: string | null
}

export function ConversationItem({ conversation, isActive, onClick, currentUserId }: ConversationItemProps) {
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

  const relativeTime = formatTime()
  const statusLabel = isOnline ? 'Đang hoạt động' : 'Offline'
  const statusDisplay = relativeTime ? `${statusLabel} • ${relativeTime}` : statusLabel

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
        {isOnline && <span className='absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500' />}
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
          <span
            className={cn(
              'flex min-w-0 flex-1 items-center gap-1 truncate',
              isOnline ? 'text-emerald-600' : 'text-slate-400'
            )}
          >
            {isOnline && <span className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500' />}
            <span className='truncate whitespace-nowrap'>{statusDisplay}</span>
          </span>
        </div>
      </div>
    </button>
  )
}
