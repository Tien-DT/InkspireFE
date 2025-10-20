import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { toast } from 'sonner'

export function ForgotPasswordForm() {
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

  if (isSuccess) {
    return (
      <>
        <div className='flex flex-col items-center gap-2 text-center'>
          <div className='rounded-full bg-green-100 p-3 mb-2'>
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
          <h1 className='text-2xl font-bold text-slate-900'>Kiểm tra email của bạn</h1>
          <p className='text-sm text-muted-foreground max-w-sm'>
            Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>. 
            Link sẽ hết hạn sau <strong>5 phút</strong>.
          </p>
        </div>
        <div className='space-y-4'>
          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
            <p className='text-sm text-amber-800'>
              <strong>Lưu ý:</strong> Nếu bạn không thấy email, vui lòng kiểm tra thư mục spam hoặc junk.
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => setIsSuccess(false)}
              variant='outline'
              className='w-full'
            >
              Gửi lại email
            </Button>
            <Link to='/login'>
              <Button
                variant='ghost'
                className='w-full'
              >
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold text-slate-900'>Quên mật khẩu?</h1>
        <p className='text-sm text-muted-foreground'>
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>
      <form onSubmit={handleSubmit} className='grid gap-6 text-left'>
        <div className='grid gap-3'>
          <Label htmlFor='forgot-email'>Email</Label>
          <Input
            id='forgot-email'
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
        <Button
          type='submit'
          className='w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-500/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <ButtonSpinner className='text-white' />
              Đang gửi...
            </span>
          ) : (
            'Gửi link đặt lại mật khẩu'
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
