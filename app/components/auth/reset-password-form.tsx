import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { toast } from 'sonner'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Link đặt lại mật khẩu không hợp lệ')
      navigate('/auth/forgot-password')
    }
  }, [token, navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        toast.error(data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold text-slate-900'>Đặt lại mật khẩu</h1>
        <p className='text-sm text-muted-foreground'>
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>
      <form onSubmit={handleSubmit} className='grid gap-6 text-left'>
        <div className='grid gap-3'>
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
              autoFocus
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
        <div className='grid gap-3'>
          <Label htmlFor='confirm-password'>Xác nhận mật khẩu</Label>
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
        <Button
          type='submit'
          className='w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-500/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
          disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 6}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <ButtonSpinner className='text-white' />
              Đang đặt lại...
            </span>
          ) : (
            'Đặt lại mật khẩu'
          )}
        </Button>
      </form>
      <div className='text-center text-sm text-muted-foreground'>
        Nhớ mật khẩu rồi?{' '}
        <Link to='/login' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
          Đăng nhập
        </Link>
      </div>
    </>
  )
}
