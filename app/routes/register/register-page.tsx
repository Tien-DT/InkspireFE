import type { AuthPanelHandle } from '~/layouts/auth-layout'

import { RegisterForm } from '~/components/auth/register-form'

function RegisterFooter() {
  return (
    <div className='flex flex-col items-center gap-1 border-t border-muted/40 pt-4 text-center text-xs text-muted-foreground md:flex-row md:justify-between md:text-left'>
      <a href='#' className='hover:text-emerald-600'>
        Chính sách bảo mật
      </a>
      <a href='#' className='hover:text-emerald-600'>
        Điều khoản dịch vụ
      </a>
    </div>
  )
}

export const handle: { authPanel: AuthPanelHandle } = {
  authPanel: {
    contentClassName: 'w-full max-w-md space-y-8 md:max-w-2xl',
    footer: <RegisterFooter />
  }
}

export default function RegisterPage() {
  return <RegisterForm />
}
