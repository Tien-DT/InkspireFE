import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useChat } from '~/contexts/ChatContext'
import { useConversationSelect } from '~/hooks/useChatHelpers'
import { ConversationItem } from './ConversationItem'
import { NewChatDialog } from './NewChatDialog'
import type { Conversation } from '~/types/chat.type'
import { useAuth } from '~/contexts/AuthContext'

export function ConversationList() {
  const { conversations, isLoading } = useChat()
  const { currentConversation, selectConversation } = useConversationSelect()
  const { profile } = useAuth()
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  const handleSelectConversation = async (conv: Conversation) => {
    await selectConversation(conv.id, conv)
  }

  if (isLoading) {
    return (
      <div className='w-80 bg-white border-r border-gray-200 flex items-center justify-center'>
        <p className='text-gray-500'>Đang tải...</p>
      </div>
    )
  }

  return (
    <>
      <div className='w-80 bg-white border-r border-gray-200 h-full flex flex-col'>
        <div className='p-4 border-b border-gray-200 min-h-[77px]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>Tin nhắn</h2>
            <Button
              size='sm'
              className='bg-teal-500 hover:bg-teal-600 text-white rounded-full w-8 h-8 p-0'
              onClick={() => setIsNewChatOpen(true)}
              title='Tạo cuộc trò chuyện mới'
            >
              <span className='text-lg'>+</span>
            </Button>
          </div>
        </div>

        <div className='overflow-y-auto flex-1'>
          {conversations.length === 0 ? (
            <div className='p-4 text-center text-gray-500'>
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConversation?.id === conv.id}
                onClick={() => handleSelectConversation(conv)}
                currentUserId={profile?.id}
              />
            ))
          )}
        </div>
      </div>

      <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} />
    </>
  )
}
