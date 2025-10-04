import { useEffect, useRef } from 'react'
import { MessageItem } from './MessageItem'
import { useCurrentMessages } from '~/hooks/useChatHelpers'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function MessageList() {
  const { messages } = useCurrentMessages()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = message.sendAt ? format(new Date(message.sendAt), 'yyyy-MM-dd') : 'unknown'
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, typeof messages>
  )

  const formatDate = (dateStr: string) => {
    if (dateStr === 'unknown') return 'Không xác định'
    try {
      const date = new Date(dateStr)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Hôm nay'
      }
      if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
        return 'Hôm qua'
      }
      return format(date, 'dd/MM/yyyy', { locale: vi })
    } catch {
      return dateStr
    }
  }

  if (messages.length === 0) {
    return (
      <div className='flex-1 overflow-y-auto p-4 bg-white flex items-center justify-center'>
        <p className='text-gray-500'>Chưa có tin nhắn nào</p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-white'>
      {Object.keys(groupedMessages)
        .sort()
        .reverse()
        .map((date) => (
          <div key={date}>
            <div className='text-center mb-4'>
              <span className='text-sm text-gray-500'>{formatDate(date)}</span>
            </div>
            <div className='space-y-4'>
              {groupedMessages[date]
                .sort((a, b) => {
                  const dateA = a.sendAt ? new Date(a.sendAt).getTime() : 0
                  const dateB = b.sendAt ? new Date(b.sendAt).getTime() : 0
                  return dateA - dateB
                })
                .map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
