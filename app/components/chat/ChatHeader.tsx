import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { MoreHorizontal, Phone, Video } from 'lucide-react'
import type { Conversation } from '~/types/chat.type'
import { useOnlineStatus } from '~/hooks/useChatHelpers'
import { useAuth } from '~/contexts/AuthContext'
import { useVideoCall } from '~/contexts/VideoCallContext'
import { CallType } from '~/types/call.type'

interface ChatHeaderProps {
  conversation: Conversation | null
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const { profile } = useAuth()
  const { initiateCall, isInCall } = useVideoCall()

  // Find other member (not current user)
  const otherMember = conversation?.members?.find((m) => m.userId !== profile?.id)
  const otherUser = otherMember?.user

  const { isOnline } = useOnlineStatus(otherUser?.id)

  if (!conversation) {
    return (
      <header className='flex h-16 items-center border-b px-6 text-sm text-muted-foreground'>
        Chọn một cuộc trò chuyện để xem nội dung.
      </header>
    )
  }

  const getInitials = () => {
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name[0]}${otherUser.last_name[0]}`.toUpperCase()
    }
    if (otherUser?.email) {
      return otherUser.email[0].toUpperCase()
    }
    return 'U'
  }

  const displayName = () => {
    if (otherUser?.first_name && otherUser?.last_name) {
      return `${otherUser.first_name} ${otherUser.last_name}`
    }
    if (otherUser?.email) {
      return otherUser.email
    }
    return 'Unknown User'
  }

  const handleVoiceCall = () => {
    console.log('[ChatHeader] Voice call clicked', { otherUserId: otherUser?.id, isInCall, conversationId: conversation.id })
    if (!otherUser?.id || isInCall) {
      console.log('[ChatHeader] Voice call blocked:', { hasOtherUser: !!otherUser?.id, isInCall })
      return
    }
    
    console.log('[ChatHeader] Initiating voice call...')
    initiateCall(
      conversation.id,
      otherUser.id,
      displayName(),
      CallType.Audio
    )
  }

  const handleVideoCall = () => {
    console.log('[ChatHeader] Video call clicked', { otherUserId: otherUser?.id, isInCall, conversationId: conversation.id })
    if (!otherUser?.id || isInCall) {
      console.log('[ChatHeader] Video call blocked:', { hasOtherUser: !!otherUser?.id, isInCall })
      return
    }
    
    console.log('[ChatHeader] Initiating video call...')
    initiateCall(
      conversation.id,
      otherUser.id,
      displayName(),
      CallType.Video
    )
  }

  return (
    <header className='flex h-16 items-center justify-between gap-4 border-b px-6'>
      <div className='flex items-center gap-3'>
        <Avatar className='h-10 w-10'>
          <AvatarFallback className='bg-muted text-sm font-medium text-foreground'>
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-0.5'>
          <h3 className='text-sm font-semibold text-foreground'>{displayName()}</h3>
          <p className={`text-xs ${isOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            {isOnline ? 'Đang hoạt động' : 'Offline'}
          </p>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleVoiceCall}
          disabled={isInCall}
          title='Gọi thoại'
        >
          <Phone className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleVideoCall}
          disabled={isInCall}
          title='Gọi video'
        >
          <Video className='h-5 w-5' />
        </Button>
        <Button variant='ghost' size='icon' title='Tùy chọn khác'>
          <MoreHorizontal className='h-5 w-5' />
        </Button>
      </div>
    </header>
  )
}
