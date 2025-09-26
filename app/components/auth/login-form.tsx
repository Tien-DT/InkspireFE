import { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { GoogleIcon } from '~/components/icons/google-icon'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold text-slate-900'>Đăng nhập tài khoản</h1>
        <p className='text-sm text-muted-foreground'>Nhập email và mật khẩu để truy cập vào hành trình sáng tạo của bạn.</p>
      </div>
      <form className='grid gap-6 text-left'>
        <div className='grid gap-3'>
          <Label htmlFor='login-email'>Email</Label>
          <Input id='login-email' type='email' placeholder='admin@freelancehub.com' autoComplete='email' required />
        </div>
        <div className='grid gap-3'>
          <div className='flex items-center'>
            <Label htmlFor='login-password'>Mật khẩu</Label>
            <a href='#' className='ml-auto text-sm font-medium text-emerald-600 underline-offset-4 hover:underline'>
              Quên mật khẩu?
            </a>
          </div>
          <div className='relative'>
            <Input
              id='login-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Nhập mật khẩu'
              autoComplete='current-password'
              className='pr-12'
              required
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
            </Button>
          </div>
        </div>
        <Button type='submit' className='w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-500/90'>
          Đăng nhập
        </Button>
        <div className='relative text-center text-sm text-muted-foreground'>
          <span className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border' aria-hidden='true' />
          <span className='relative inline-flex bg-background px-3'>Hoặc tiếp tục với</span>
        </div>
        <Button asChild variant='outline' className='w-full justify-center gap-3 rounded-xl border-muted/40 bg-background text-sm font-semibold shadow-sm hover:bg-slate-50'>
          <a href='/auth/google' onClick={() => localStorage.setItem('last_provider', 'google')}>
            <GoogleIcon className='size-5' />
            Đăng nhập với Google
          </a>
        </Button>
      </form>
      <div className='text-center text-sm text-muted-foreground'>
        Chưa có tài khoản?{' '}
        <a href='/register' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
          Đăng ký ngay
        </a>
      </div>
    </>
  )
}

