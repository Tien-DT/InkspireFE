import { useState, type FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { toast } from 'sonner'

interface ForgotPasswordDialogProps {
  trigger?: React.ReactNode
}

export function ForgotPasswordDialog({ trigger }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Đã gửi email! Vui lòng kiểm tra hộp thư của bạn.')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    // Reset state sau khi đóng dialog
    setTimeout(() => {
      setEmail('')
      setIsSuccess(false)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type='button'
            className='text-sm font-medium text-emerald-600 underline-offset-4 hover:underline'
          >
            Quên mật khẩu?
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        {isSuccess ? (
          <>
            <DialogHeader>
              <div className='flex flex-col items-center gap-3 text-center mb-2'>
                <div className='rounded-full bg-green-100 p-3'>
                  <svg
                    className='size-8 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <DialogTitle>Kiểm tra email của bạn</DialogTitle>
              </div>
              <DialogDescription className='text-center space-y-3'>
                <p>
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <strong className='text-foreground'>{email}</strong>.
                </p>
                <p>
                  Link sẽ hết hạn sau <strong className='text-foreground'>5 phút</strong>.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-3 mt-4'>
              <div className='rounded-lg border border-amber-200 bg-amber-50 p-3'>
                <p className='text-xs text-amber-800'>
                  <strong>Lưu ý:</strong> Nếu bạn không thấy email, vui lòng kiểm tra thư mục spam hoặc junk.
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant='outline'
                  className='w-full'
                >
                  Gửi lại email
                </Button>
                <Button
                  onClick={handleClose}
                  className='w-full bg-emerald-500 hover:bg-emerald-500/90'
                >
                  Đóng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Quên mật khẩu?</DialogTitle>
              <DialogDescription>
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
              <div className='space-y-2'>
                <Label htmlFor='dialog-forgot-email'>Email</Label>
                <Input
                  id='dialog-forgot-email'
                  type='email'
                  placeholder='admin@freelancehub.com'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              <div className='flex gap-3'>
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
                  className='flex-1 bg-emerald-500 hover:bg-emerald-500/90'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className='flex items-center justify-center gap-2'>
                      <ButtonSpinner className='text-white' />
                      Đang gửi...
                    </span>
                  ) : (
                    'Gửi link'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
