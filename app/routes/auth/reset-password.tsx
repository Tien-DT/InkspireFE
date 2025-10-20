import type { AuthPanelHandle } from '~/layouts/auth-layout'
import { ResetPasswordForm } from '~/components/auth/reset-password-form'

export const handle: { authPanel: AuthPanelHandle } = {
  authPanel: {
    panelClassName: 'gap-4',
    contentClassName: 'w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
  }
}

export default function ResetPasswordPage() {
  return (
    <div className='animate-in fade-in zoom-in-95 duration-300'>
      <ResetPasswordForm />
    </div>
  )
}
