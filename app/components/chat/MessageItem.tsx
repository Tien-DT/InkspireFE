import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useAuth } from '~/contexts/AuthContext'
import type { Message } from '~/types/chat.type'

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
      <div className='flex justify-end'>
        <div className='max-w-[70%] space-y-1 text-right'>
          <div className='rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground'>
            {message.messageContent}
          </div>
          <div className='flex items-center justify-end gap-1 text-xs text-muted-foreground'>
            <span>{formatTime()}</span>
            {message.readAt && (
              <svg className='h-3.5 w-3.5 text-primary-foreground/80' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
              </svg>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-end gap-3'>
      <Avatar className='h-9 w-9 flex-shrink-0'>
        <AvatarFallback className='bg-muted text-xs font-medium text-foreground'>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className='max-w-[70%] space-y-1'>
        <div className='rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-foreground'>
          {message.messageContent}
        </div>
        <span className='block text-xs text-muted-foreground'>{formatTime()}</span>
      </div>
    </div>
  )
}
