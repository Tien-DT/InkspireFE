import type { AuthPanelHandle } from '~/layouts/auth-layout'

import { LoginForm } from '~/components/auth/login-form'

export const handle: { authPanel: AuthPanelHandle } = {
  authPanel: {
    panelClassName: 'gap-4',
    contentClassName: 'w-full max-w-sm space-y-8'
  }
}

export default function LoginPage() {
  return <LoginForm />
}
