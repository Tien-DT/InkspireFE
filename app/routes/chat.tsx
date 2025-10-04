import React from 'react'
import { ConversationList } from '~/components/chat/ConversationList'
import { ChatHeader } from '~/components/chat/ChatHeader'
import { MessageList } from '~/components/chat/MessageList'
import { MessageInput } from '~/components/chat/MessageInput'
import { TypingIndicator } from '~/components/chat/TypingIndicator'
import { VideoCallDialog } from '~/components/call/VideoCallDialog'
import { IncomingCallDialog } from '~/components/call/IncomingCallDialog'
import { useChat } from '~/contexts/ChatContext'
import { useConnectionStatus } from '~/hooks/useChatHelpers'
import { Card } from '~/components/ui/card'

export default function Chat() {
  const { currentConversation } = useChat()
  const { isConnected, statusText } = useConnectionStatus()

  return (
    <div className='container mx-auto flex h-[calc(100vh-64px)] flex-col gap-4 px-4 py-6'>
      {!isConnected && (
        <div className='rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900'>
          {statusText}
        </div>
      )}

      <Card className='flex h-full min-h-0 flex-col gap-0 border shadow-sm md:flex-row'>
        <div className='min-h-0 border-b md:w-[320px] md:border-b-0 md:border-r'>
          <ConversationList />
        </div>
        <div className='flex flex-1 flex-col'>
          <ChatHeader conversation={currentConversation} />

          {currentConversation ? (
            <>
              <MessageList />
              <TypingIndicator />
              <MessageInput />
            </>
          ) : (
            <div className='flex flex-1 items-center justify-center px-6 text-sm text-muted-foreground'>
              Chọn một cuộc trò chuyện để bắt đầu.
            </div>
          )}
        </div>
      </Card>

      <VideoCallDialog />
      <IncomingCallDialog />
    </div>
  )
}
