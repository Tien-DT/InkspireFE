import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useChat } from '~/contexts/ChatContext'

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewChatDialog = ({ open, onOpenChange }: NewChatDialogProps) => {
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { createNewConversation } = useChat()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId.trim()) {
      setError('Vui lòng nhập User ID')
      return
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId.trim())) {
      setError('User ID phải là UUID hợp lệ (ví dụ: 123e4567-e89b-12d3-a456-426614174000)')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      await createNewConversation(userId.trim())
      
      // Close dialog and reset form
      onOpenChange(false)
      setUserId('')
      setError(null)
    } catch (err: any) {
      console.error('Failed to create conversation:', err)
      
      // Parse error message
      const errorMessage = err?.response?.data?.message || err?.message || 'Không thể tạo cuộc trò chuyện'
      
      if (errorMessage.includes('not found')) {
        setError('Không tìm thấy người dùng với ID này')
      } else if (errorMessage.includes('already exists')) {
        setError('Cuộc trò chuyện với người này đã tồn tại')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen)
      if (!newOpen) {
        // Reset form when closing
        setUserId('')
        setError(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
          <DialogDescription>
            Nhập User ID của người bạn muốn trò chuyện
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="userId" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="userId"
                placeholder="ví dụ: 123e4567-e89b-12d3-a456-426614174000"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <p className="text-xs text-gray-500">
                User ID là UUID duy nhất của người dùng
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo cuộc trò chuyện'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
