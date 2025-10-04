import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import type { Message } from '~/types/chat.type'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useAuth } from '~/contexts/AuthContext'

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const { profile } = useAuth()
  const isOwnMessage = message.senderId === profile?.id

  const formatTime = () => {
    if (!message.sendAt) return ''
    try {
      return format(new Date(message.sendAt), 'HH:mm', { locale: vi })
    } catch {
      return ''
    }
  }

  const getInitials = () => {
    return 'U'
  }

  if (isOwnMessage) {
    return (
      <div className='flex items-start space-x-3 justify-end'>
        <div className='max-w-xs'>
          <div className='bg-blue-500 rounded-lg p-3'>
            <p className='text-sm text-white break-words'>{message.messageContent}</p>
          </div>
          <span className='text-xs text-gray-500 mt-1 block text-right'>{formatTime()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-start space-x-3'>
      <Avatar className='w-8 h-8'>
        <AvatarFallback className='bg-gray-200 text-xs'>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className='max-w-xs'>
        <div className='bg-gray-100 rounded-lg p-3'>
          <p className='text-sm text-gray-900 break-words'>{message.messageContent}</p>
        </div>
        <span className='text-xs text-gray-500 mt-1 block'>{formatTime()}</span>
      </div>
    </div>
  )
}
