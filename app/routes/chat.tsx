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

export default function Chat() {
  const { currentConversation } = useChat()
  const { isConnected, statusText } = useConnectionStatus()

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 flex h-[calc(100vh-64px)]'>
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className='absolute top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center text-sm z-50'>
          {statusText}
        </div>
      )}

      {/* Left Sidebar - Conversation List */}
      <ConversationList />

      {/* Right Side - Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Chat Header */}
        <ChatHeader conversation={currentConversation} />

        {/* Chat Messages */}
        <MessageList />

        {/* Typing Indicator */}
        <TypingIndicator />

        {/* Message Input */}
        {currentConversation && <MessageInput />}
      </div>

      {/* Call Dialogs */}
      <VideoCallDialog />
      <IncomingCallDialog />
    </div>
  )
}
