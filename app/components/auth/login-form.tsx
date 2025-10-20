import { useState, type FormEvent } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { useLogin } from '~/hooks/useAuth'
import { GoogleLoginButton } from '~/components/auth/google-login-button'
import { ForgotPasswordDialog } from '~/components/auth/forgot-password-dialog'
import { Link } from 'react-router'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { mutate: login, isPending } = useLogin()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      return
    }

    login({
      email,
      password,
      rememberMe
    })
  }

  return (
    <>
      {/* <LoadingOverlay show={isPending} message='Đang đăng nhập...' /> */}
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold text-slate-900'>Đăng nhập tài khoản</h1>
        <p className='text-sm text-muted-foreground'>
          Nhập email và mật khẩu để truy cập vào hành trình sáng tạo của bạn.
        </p>
      </div>
      <form onSubmit={handleSubmit} className='grid gap-6 text-left'>
        <div className='grid gap-3'>
          <Label htmlFor='login-email'>Email</Label>
          <Input
            id='login-email'
            type='email'
            placeholder='admin@freelancehub.com'
            autoComplete='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className='grid gap-3'>
          <div className='flex items-center'>
            <Label htmlFor='login-password'>Mật khẩu</Label>
            <div className='ml-auto'>
              <ForgotPasswordDialog />
            </div>
          </div>
          <div className='relative'>
            <Input
              id='login-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Nhập mật khẩu'
              autoComplete='current-password'
              className='pr-12'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              disabled={isPending}
            >
              {showPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='remember-me'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isPending}
            className='size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
          />
          <Label htmlFor='remember-me' className='text-sm font-normal cursor-pointer'>
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <Button
          type='submit'
          className='w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-500/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
          disabled={isPending}
        >
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <ButtonSpinner className='text-white' />
              Đang đăng nhập...
            </span>
          ) : (
            'Đăng nhập'
          )}
        </Button>
        <div className='relative text-center text-sm text-muted-foreground'>
          <span className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border' aria-hidden='true' />
          <span className='relative inline-flex bg-background px-3'>Hoặc tiếp tục với</span>
        </div>
        <GoogleLoginButton rememberMe={rememberMe} />
      </form>
      <div className='text-center text-sm text-muted-foreground'>
        Chưa có tài khoản?{' '}
        <Link to='/register' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
          Đăng ký ngay
        </Link>
      </div>
    </>
  )
}
