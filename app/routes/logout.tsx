import { useEffect } from 'react'
import { clearAllAuth } from '~/utils/auth'

// Clears local auth and sends users to relogin quickly
// Usage: navigate to /logout?from=/current
export default function LogoutRoute() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const from = url.searchParams.get('from') ?? '/'
    clearAllAuth()
    window.location.replace(`/relogin?from=${encodeURIComponent(from)}`)
  }, [])

  return (
    <div className='flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground'>
      Đang đăng xuất…
    </div>
  )
}

