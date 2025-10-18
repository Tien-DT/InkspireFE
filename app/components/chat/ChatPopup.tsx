import React, { useState, useEffect } from 'react'
import { MessageSquareText, ChevronRight, ArrowLeft, Send } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Link, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '~/apis/chat.api'
import { useAuth } from '~/contexts/AuthContext'
import { useChat } from '~/contexts/ChatContext'
import type { Conversation, Message } from '~/types/chat.type'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Input } from '~/components/ui/input'

export function ChatPopup() {
  const { profile } = useAuth()
  const { conversations: allConversations, messages: contextMessages, loadMessages, refreshConversations, unreadCount } = useChat()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')

  // Take top 5 conversations from context
  const conversations = allConversations.slice(0, 5)

  // unreadCount now comes directly from context (updates realtime via SignalR!)

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
      }
    }
  }, [closeTimeout])

  // Handle mouse enter - open dropdown
  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setIsOpen(true)
    console.log('💬 Chat popup hovered - refreshing conversations from context')
    // Context data is already updated via SignalR - just refresh from API if needed
    refreshConversations()
  }

  // Handle mouse leave - close dropdown with delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false)
    }, 300) // 300ms delay before closing
    setCloseTimeout(timeout)
  }

  // Handle dropdown open change (for manual control)
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  // Handle conversation click - open in popup
  const handleConversationClick = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedConversation(conversation)
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedConversation(null)
    setMessageText('')
  }

  // Load messages from context when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id && profile?.id) {
      loadMessages(selectedConversation.id)
      
      // Mark conversation as read
      const currentUserMember = selectedConversation.members?.find(m => m.userId === profile.id)
      if (currentUserMember && currentUserMember.unreadCount && currentUserMember.unreadCount > 0) {
        console.log('[ChatPopup] 📖 Marking conversation as read:', selectedConversation.id)
        chatApi.resetUnreadCount(currentUserMember.id).catch(err => {
          console.error('[ChatPopup] Failed to mark as read:', err)
        })
      }
    }
  }, [selectedConversation?.id, loadMessages, profile?.id])

  // ⭐ Refresh messages when popup is opened (hover) and conversation is already selected
  useEffect(() => {
    if (isOpen && selectedConversation?.id) {
      console.log('[ChatPopup] 🔄 Popup opened, refreshing messages for conversation:', selectedConversation.id)
      loadMessages(selectedConversation.id)
    }
  }, [isOpen, selectedConversation?.id, loadMessages])

  // Get messages for selected conversation from context (sort by sendAt - oldest first)
  const messages = selectedConversation?.id 
    ? (contextMessages[selectedConversation.id] || [])
        .slice() // Clone array
        .sort((a, b) => {
          // Sort by sendAt ascending (oldest first = oldest at TOP)
          const dateA = a.sendAt ? new Date(a.sendAt).getTime() : 0
          const dateB = b.sendAt ? new Date(b.sendAt).getTime() : 0
          return dateA - dateB // Ascending: oldest -> newest
        })
    : []
  const messagesLoading = false // Context loads in background

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!selectedConversation?.id) throw new Error('No conversation selected')
      return chatApi.sendMessage({
        conversationId: selectedConversation.id,
        messageContent: text,
        status: 1
      })
    },
    onSuccess: () => {
      setMessageText('')
      
      // Reload messages immediately to show the new message
      if (selectedConversation?.id) {
        console.log('[ChatPopup] ✅ Message sent, reloading messages...')
        loadMessages(selectedConversation.id)
        
        // Also refresh conversations to update latest message
        refreshConversations()
      }
    },
    onError: (error) => {
      console.error('Send message error:', error)
    }
  })

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = messageText.trim()
    if (!trimmed || sendMessageMutation.isPending) return
    sendMessageMutation.mutate(trimmed)
  }

  // DON'T auto-scroll - let user scroll naturally (oldest at top, newest at bottom)

  // Get other member info
  const getOtherMember = (conversation: Conversation) => {
    return conversation.members?.find(m => m.userId !== profile?.id)
  }

  // Format timestamp
  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: vi 
      })
    } catch {
      return ''
    }
  }

  // Get user initials
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return '?'
    const first = firstName?.charAt(0).toUpperCase() || ''
    const last = lastName?.charAt(0).toUpperCase() || ''
    return first + last || '?'
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquareText className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[380px] p-0" 
          sideOffset={8}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        {!selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">Tin nhắn</h3>
              <Link 
                to="/chat"
                className="text-xs text-primary hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả
              </Link>
            </div>

            {/* Conversations list */}
            <ScrollArea className="h-[400px]">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <MessageSquareText className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground text-center">
                Chưa có cuộc trò chuyện nào
              </p>
              <p className="text-xs text-muted-foreground/70 text-center mt-1">
                Bắt đầu trò chuyện với người dùng khác
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => {
                const otherMember = getOtherMember(conversation)
                const otherUser = otherMember?.user
                const isUnread = (otherMember?.unreadCount || 0) > 0
                
                return (
                  <button
                    key={conversation.id}
                    onClick={(e) => handleConversationClick(conversation, e)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left ${
                      isUnread ? 'bg-primary/5' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={otherUser?.first_name || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white text-sm">
                          {getUserInitials(otherUser?.first_name, otherUser?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      {isUnread && (
                        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <p className={`text-sm truncate ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                          {otherUser?.first_name && otherUser?.last_name 
                            ? `${otherUser.first_name} ${otherUser.last_name}`
                            : otherUser?.email || 'Unknown User'}
                        </p>
                        {conversation.updatedAt && (
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {conversation.latestMessage || 'Chưa có tin nhắn'}
                      </p>
                      {isUnread && otherMember && (
                        <Badge variant="default" className="mt-1 h-5 px-1.5 text-xs">
                          {otherMember.unreadCount} mới
                        </Badge>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-2" />
                  </button>
                )
              })}
            </div>
          )}
            </ScrollArea>

            {/* Footer - View all */}
            {conversations.length > 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <Link to="/chat" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center text-sm font-medium"
                    >
                      Xem thêm tin nhắn
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* Conversation Detail View */}
            {(() => {
              const otherMember = getOtherMember(selectedConversation)
              const otherUser = otherMember?.user
              
              return (
                <>
                  {/* Header with back button */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={otherUser?.first_name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white text-xs">
                        {getUserInitials(otherUser?.first_name, otherUser?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {otherUser?.first_name && otherUser?.last_name 
                          ? `${otherUser.first_name} ${otherUser.last_name}`
                          : otherUser?.email || 'Unknown User'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="h-[320px] px-4 py-2">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquareText className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">Chưa có tin nhắn</p>
                        <p className="text-xs text-muted-foreground/70">Gửi tin nhắn đầu tiên</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message: Message) => {
                          const isOwnMessage = message.senderId === profile?.id
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-lg px-3 py-2 ${
                                  isOwnMessage
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.messageContent || '(No content)'}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {message.sendAt ? format(new Date(message.sendAt), 'HH:mm') : ''}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-3">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 text-sm"
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )
            })()}
          </>
        )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
