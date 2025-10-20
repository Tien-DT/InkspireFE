import { useState, type FormEvent } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { toast } from 'sonner'
import { getAccessTokenFromLS } from '~/utils/auth'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (currentPassword === newPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại')
      return
    }

    setIsSubmitting(true)

    try {
      const token = getAccessTokenFromLS()
      if (!token) {
        toast.error('Vui lòng đăng nhập lại')
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Đổi mật khẩu thành công!')
        handleClose()
      } else {
        toast.error(data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Change password error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu hiện tại và mật khẩu mới của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='current-password'>Mật khẩu hiện tại</Label>
            <div className='relative'>
              <Input
                id='current-password'
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder='Nhập mật khẩu hiện tại'
                autoComplete='current-password'
                className='pr-12'
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
                aria-label={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                disabled={isSubmitting}
              >
                {showCurrentPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
              </Button>
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='new-password'>Mật khẩu mới</Label>
            <div className='relative'>
              <Input
                id='new-password'
                type={showNewPassword ? 'text' : 'password'}
                placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)'
                autoComplete='new-password'
                className='pr-12'
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setShowNewPassword((prev) => !prev)}
                className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
                aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                disabled={isSubmitting}
              >
                {showNewPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
              </Button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className='text-xs text-red-500'>Mật khẩu phải có ít nhất 6 ký tự</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirm-password'>Xác nhận mật khẩu mới</Label>
            <div className='relative'>
              <Input
                id='confirm-password'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Nhập lại mật khẩu mới'
                autoComplete='new-password'
                className='pr-12'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className='text-xs text-red-500'>Mật khẩu xác nhận không khớp</p>
            )}
          </div>
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
              className='flex-1'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-emerald-500 text-white hover:bg-emerald-500/90'
              disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 6}
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <ButtonSpinner className='text-white' />
                  Đang xử lý...
                </span>
              ) : (
                'Đổi mật khẩu'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
