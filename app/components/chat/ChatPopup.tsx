import React, { useState } from 'react'
import { MessageSquareText, ChevronRight } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'
import { chatApi } from '~/apis/chat.api'
import { useAuth } from '~/contexts/AuthContext'
import type { Conversation } from '~/types/chat.type'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export function ChatPopup() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch recent conversations (top 5)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['chat-popup-conversations'],
    queryFn: async () => {
      const response = await chatApi.getMyConversations({ page: 1, pageSize: 5 })
      return response.data || []
    },
    enabled: false, // Only fetch when dropdown opens
    staleTime: 0, // Always refetch
    gcTime: 0 // Don't cache
  })

  const conversations = data || []

  // Calculate total unread count
  const unreadCount = conversations.reduce((total, conv) => {
    const member = conv.members?.find(m => m.userId === profile?.id)
    return total + (member?.unreadCount || 0)
  }, 0)

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
    console.log('💬 Chat popup hovered - refetching conversations')
    refetch()
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

  // Handle conversation click
  const handleConversationClick = (conversation: Conversation) => {
    setIsOpen(false)
    // Navigate to chat page with conversation selected
    navigate(`/chat?conversationId=${conversation.id}`)
  }

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          ) : conversations.length === 0 ? (
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
                    onClick={() => handleConversationClick(conversation)}
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
