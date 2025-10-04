import { useMemo, useState } from 'react'
import { MessageSquare, Search, Users } from 'lucide-react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { useChat } from '~/contexts/ChatContext'
import { useConversationSelect } from '~/hooks/useChatHelpers'
import { useAuth } from '~/contexts/AuthContext'
import type { Conversation } from '~/types/chat.type'
import { ConversationItem } from './ConversationItem'
import { UserList } from './UserList'

type ViewMode = 'conversations' | 'discover'

export function ConversationList() {
  const { conversations, isLoading } = useChat()
  const { currentConversation, selectConversation } = useConversationSelect()
  const { profile } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('conversations')
  const [chatSearch, setChatSearch] = useState('')

  const handleSelectConversation = async (conv: Conversation) => {
    await selectConversation(conv.id, conv)
  }

  const filteredConversations = useMemo(() => {
    const normalizedQuery = chatSearch.trim().toLowerCase()

    const sorted = [...conversations].sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return timeB - timeA
    })

    return sorted.filter((conversation) => {
      const otherMember = conversation.members?.find((m) => m.userId !== profile?.id)
      const otherUser = otherMember?.user

      if (!normalizedQuery) {
        return true
      }

      const candidateStrings = [
        otherUser?.first_name,
        otherUser?.last_name,
        otherUser?.email,
        conversation.latestMessage
      ]
        .filter(Boolean)
        .map((value) => value!.toString().toLowerCase())

      return candidateStrings.some((value) => value.includes(normalizedQuery))
    })
  }, [chatSearch, conversations, profile?.id])

  const emptyState = !isLoading && filteredConversations.length === 0

  return (
    <aside className='flex h-full max-w-full flex-col overflow-hidden bg-background'>
      <div className='flex flex-col gap-1 px-6 py-4'>
        <h2 className='text-lg font-semibold text-foreground'>Tin nhắn</h2>
      </div>

      <div className='flex h-full flex-col gap-4 overflow-hidden px-6 py-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='inline-flex items-center gap-1 rounded-full bg-muted/60 p-1 shadow-inner'>
            <button
              type='button'
              className={
                viewMode === 'conversations'
                  ? 'inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all'
                  : 'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground'
              }
              onClick={() => setViewMode('conversations')}
              aria-pressed={viewMode === 'conversations'}
            >
              <MessageSquare className='h-4 w-4' />
              Cuộc trò chuyện
            </button>
            <button
              type='button'
              className={
                viewMode === 'discover'
                  ? 'inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all'
                  : 'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground'
              }
              onClick={() => setViewMode('discover')}
              aria-pressed={viewMode === 'discover'}
            >
              <Users className='h-4 w-4' />
              Khám phá
            </button>
          </div>
        </div>

        {viewMode === 'conversations' ? (
          <div className='flex h-full flex-col overflow-hidden bg-background'>
            {/* 🔍 Search */}
            <div className='flex-shrink-0 p-2'>
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder='Tìm kiếm...'
                  className='h-9 w-full rounded-md bg-background pl-9 text-sm'
                />
              </div>
            </div>

            {/* 💬 Conversations */}
            <div className='flex-1 overflow-hidden'>
              {isLoading && conversations.length === 0 ? (
                <div className='flex h-full items-center justify-center text-xs text-muted-foreground px-2 text-center'>
                  Đang tải cuộc trò chuyện...
                </div>
              ) : emptyState ? (
                <div className='flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-muted-foreground'>
                  <MessageSquare className='h-8 w-8 text-muted-foreground/50' />
                  <p className='font-medium text-foreground text-sm'>Không tìm thấy cuộc trò chuyện</p>
                  <p>Thử điều chỉnh bộ lọc hoặc bắt đầu cuộc trò chuyện mới.</p>
                </div>
              ) : (
                <ScrollArea className='h-full w-full'>
                  <div className='flex flex-col gap-1 pr-1 pb-4'>
                    {filteredConversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={currentConversation?.id === conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        currentUserId={profile?.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        ) : (
          <div className='flex h-full flex-col gap-4 overflow-hidden'>
            <section className='flex h-full flex-col overflow-hidden rounded-xl bg-background p-2'>
              <Separator />

              <ScrollArea className='h-full w-full'>
                <div className='pb-4 pr-2'>
                  <UserList onConversationCreated={() => setViewMode('conversations')} />
                </div>
              </ScrollArea>
            </section>
          </div>
        )}
      </div>
    </aside>
  )
}
