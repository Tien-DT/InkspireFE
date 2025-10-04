import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Search } from 'lucide-react'
import { userApi } from '~/apis/user.api'
import { chatApi } from '~/apis/chat.api'
import type { UserApiResponse } from '~/types/user.type'
import { useAuth } from '~/contexts/AuthContext'
import { useChat } from '~/contexts/ChatContext'
import { useConversationSelect } from '~/hooks/useChatHelpers'

interface UserListProps {
  onConversationCreated?: () => void
}

export function UserList({ onConversationCreated }: UserListProps) {
  const [users, setUsers] = useState<UserApiResponse[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserApiResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const { profile } = useAuth()
  const { refreshConversations } = useChat()
  const { selectConversation } = useConversationSelect()

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        const email = user.email.toLowerCase()
        return fullName.includes(query) || email.includes(query)
      })
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await userApi.getAllUsers()
      // Filter out current user
      const otherUsers = data.filter((u) => u.id !== profile?.id)
      setUsers(otherUsers)
      setFilteredUsers(otherUsers)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserClick = async (user: UserApiResponse) => {
    try {
      setIsCreatingChat(true)
      // Create or get existing conversation with this user
      const response = await chatApi.createConversationWithUser(user.id)

      if (response.success && response.data) {
        // Refresh conversations list
        await refreshConversations()

        // Select the new/existing conversation
        await selectConversation(response.data.id, response.data)

        // Notify parent to switch back to conversations tab
        if (onConversationCreated) {
          onConversationCreated()
        }
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const getInitials = (user: UserApiResponse) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  const getDisplayName = (user: UserApiResponse) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.email
  }

  const getRoleName = (role: number) => {
    const roles: Record<number, string> = {
      0: 'Client',
      1: 'Designer',
      2: 'Developer',
      3: 'Marketer',
      4: 'Project Manager'
    }
    return roles[role] || 'Unknown'
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
        Đang tải danh sách người dùng...
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='sticky top-0 z-10 border-b border-border bg-background pb-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Tìm kiếm người dùng...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {filteredUsers.length === 0 ? (
          <div className='rounded-md border border-dashed border-muted-foreground/30 px-4 py-6 text-center text-sm text-muted-foreground'>
            {searchQuery ? 'Không tìm thấy người dùng phù hợp.' : 'Chưa có người dùng nào.'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user)}
              disabled={isCreatingChat}
              className='flex w-full items-center gap-3 rounded-md border bg-background px-3 py-3 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60'
            >
              <Avatar className='h-10 w-10'>
                <AvatarFallback className='bg-muted text-sm font-medium text-foreground'>
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-col gap-1'>
                <h3 className='text-sm font-semibold text-foreground'>{getDisplayName(user)}</h3>
                <p className='text-xs text-muted-foreground'>{getRoleName(user.role)}</p>
                {user.phoneNumber && <p className='text-xs text-muted-foreground'>{user.phoneNumber}</p>}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
