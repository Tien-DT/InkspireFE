import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { MoreHorizontal, Phone, Video } from 'lucide-react'
import type { Conversation } from '~/types/chat.type'
import { useOnlineStatus } from '~/hooks/useChatHelpers'
import { useAuth } from '~/contexts/AuthContext'

interface ChatHeaderProps {
  conversation: Conversation | null
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const { profile } = useAuth()

  if (!conversation) {
    return (
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <p className='text-gray-500'>Chọn một cuộc trò chuyện</p>
          </div>
        </div>
      </div>
    )
  }

  // Find other member (not current user)
  const otherMember = conversation.members?.find((m) => m.userId !== profile?.id)
  const otherUser = otherMember?.user

  const { isOnline } = useOnlineStatus(otherUser?.id)

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

  return (
    <div className='bg-white border-b border-gray-200 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Avatar className='w-10 h-10'>
            <AvatarFallback className='bg-gray-200'>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='font-semibold text-gray-900'>{displayName()}</h3>
            <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isOnline ? '● Đang hoạt động' : 'Offline'}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='ghost' size='icon'>
            <Phone className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <Video className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
}
