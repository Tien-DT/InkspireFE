import { useEffect } from 'react'
import { getLastProvider } from '~/utils/auth'

// Smart, fast relogin entry. Chooses the quickest path based on last provider.
// Usage: navigate to /relogin?from=/protected
export default function ReloginRoute() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const from = url.searchParams.get('from') ?? '/'
    const provider = getLastProvider()

    if (provider === 'google') {
      window.location.replace(`/auth/google?prompt=select_account&from=${encodeURIComponent(from)}`)
      return
    }

    // Default back to password login page with redirect param
    const loginUrl = new URL(window.location.origin + '/login')
    loginUrl.searchParams.set('from', from)
    window.location.replace(loginUrl.toString())
  }, [])

  return (
    <div className='flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground'>
      Đang chuyển hướng để đăng nhập lại…
    </div>
  )
}

