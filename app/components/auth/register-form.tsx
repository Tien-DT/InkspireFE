import { useState, type FormEvent } from 'react'
import {
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconPhone,
  IconUserCheck,
  IconUserCircle
} from '@tabler/icons-react'

import { GoogleIcon } from '~/components/icons/google-icon'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/utils/cn'
import { useRegister } from '~/hooks/useAuth'
import { ROLE_MAP, type RoleType } from '~/types/auth.type'
import { toast } from 'sonner'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [role, setRole] = useState<RoleType | ''>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const { mutate: register, isPending } = useRegister()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Vui lòng nhập đầy đủ họ và tên')
      return
    }

    if (!email || !password || !phoneNumber || !role) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (!agreeTerms) {
      toast.error('Vui lòng đồng ý với điều khoản dịch vụ')
      return
    }

    // Map role to number
    const roleNumber = ROLE_MAP[role]

    // Submit registration
    register({
      email: email.trim(),
      password,
      phoneNumber: phoneNumber.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: roleNumber,
      status: 0 // 0 = pending verification
    })
  }

  return (
    <>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-emerald-500'>Đăng ký</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Tạo tài khoản mới để khám phá hàng trăm dự án hấp dẫn và kết nối với cộng đồng sáng tạo.
        </p>
      </div>
      <div className='space-y-6'>
        <Button asChild variant='outline' className='w-full justify-center gap-3 rounded-xl border-muted/40 bg-background text-sm font-semibold shadow-sm hover:bg-muted/60'>
          <a href='/auth/google' onClick={() => localStorage.setItem('last_provider', 'google')}>
            <GoogleIcon className='size-5' />
            Đăng ký với Google
          </a>
        </Button>
        <div className='flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground'>
          <Separator className='flex-1 bg-muted' />
          hoặc điền thông tin
          <Separator className='flex-1 bg-muted' />
        </div>
        <form onSubmit={handleSubmit} className='grid gap-6 text-left'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='grid gap-2'>
              <Label htmlFor='register-first-name' className='text-sm font-semibold text-slate-900'>
                Họ <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconUserCircle className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-first-name'
                  type='text'
                  placeholder='Nguyễn'
                  required
                  className='pl-12'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='register-last-name' className='text-sm font-semibold text-slate-900'>
                Tên <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconUserCircle className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-last-name'
                  type='text'
                  placeholder='Văn An'
                  required
                  className='pl-12'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='register-email' className='text-sm font-semibold text-slate-900'>
                Email <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconMail className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-email'
                  type='email'
                  placeholder='admin@company.com'
                  autoComplete='email'
                  required
                  className='pl-12'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='register-phone' className='text-sm font-semibold text-slate-900'>
                Số điện thoại <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconPhone className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-phone'
                  type='tel'
                  placeholder='0123456789'
                  autoComplete='tel'
                  required
                  className='pl-12'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className='grid gap-2 md:col-span-2'>
              <Label htmlFor='register-role' className='text-sm font-semibold text-slate-900'>
                Vai trò <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconUserCheck className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <select
                  id='register-role'
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  required
                  disabled={isPending}
                  className={cn(
                    'flex h-11 w-full appearance-none rounded-xl border border-input bg-transparent pl-12 pr-10 text-sm font-medium text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <option value='' disabled hidden>
                    Chọn vai trò của bạn
                  </option>
                  <option value='client'>Khách hàng</option>
                  <option value='designer'>Nhà thiết kế</option>
                  <option value='developer'>Lập trình viên</option>
                  <option value='marketer'>Marketing</option>
                  <option value='project-manager'>Quản lý dự án</option>
                </select>
                <IconChevronDown className='pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='register-password' className='text-sm font-semibold text-slate-900'>
                Mật khẩu <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconLock className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Tối thiểu 8 ký tự'
                  autoComplete='new-password'
                  className='pl-12 pr-12'
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
            <div className='grid gap-2'>
              <Label htmlFor='register-confirm-password' className='text-sm font-semibold text-slate-900'>
                Xác nhận mật khẩu <span className='text-emerald-500'>*</span>
              </Label>
              <div className='relative'>
                <IconLock className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70' />
                <Input
                  id='register-confirm-password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập lại mật khẩu'
                  autoComplete='new-password'
                  className='pl-12 pr-12'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className='absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground'
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  disabled={isPending}
                >
                  {showConfirmPassword ? <IconEyeOff className='size-4' /> : <IconEye className='size-4' />}
                </Button>
              </div>
            </div>
          </div>
          <div className='space-y-3 text-sm text-muted-foreground'>
            <label htmlFor='register-terms' className='flex items-start gap-3'>
              <Checkbox 
                id='register-terms' 
                required 
                className='mt-1' 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                disabled={isPending}
              />
              <span className='leading-6'>
                Tôi đồng ý với{' '}
                <a href='#' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href='#' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
                  Chính sách bảo mật
                </a>
                .
              </span>
            </label>
          </div>
          <Button
            type='submit'
            className='w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-900/90'
            disabled={isPending}
          >
            {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </Button>
        </form>
        <p className='text-center text-sm text-muted-foreground'>
          Đã có tài khoản?{' '}
          <a href='/login' className='font-semibold text-emerald-600 underline-offset-4 hover:underline'>
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </>
  )
}


