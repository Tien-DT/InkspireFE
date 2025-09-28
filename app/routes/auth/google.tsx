import { useEffect } from 'react'

// Redirects the user to your Google OAuth endpoint quickly.
// It supports optional search params:
// - from: where to return after login
// - prompt: default 'select_account' to speed account switching
export default function GoogleAuthRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const from = url.searchParams.get('from') ?? '/'
    const prompt = url.searchParams.get('prompt') ?? 'select_account'

    // Build your backend OAuth URL or direct Google URL.
    // Prefer a backend endpoint if available via env.
    const apiBase = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL as
      | string
      | undefined
    const backendUrl = apiBase
      ? `${apiBase.replace(/\/$/, '')}/auth/google?from=${encodeURIComponent(from)}&prompt=${encodeURIComponent(prompt)}`
      : undefined

    const target = backendUrl ?? `/login` // Fallback so app doesn’t break
    window.location.assign(target)
  }, [])

  return (
    <div className='flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground'>
      Đang chuyển hướng đăng nhập Google…
    </div>
  )
}
