import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useAuth } from '~/contexts/AuthContext'
import { authApi } from '~/apis/auth.api'
import {
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
  clearAllAuth,
  parseJwtPayload,
  getAccessTokenFromLS
} from '~/utils/auth'
import axiosClient from '~/lib/axios'

interface PersistLoginProps {
  children?: React.ReactNode
}

/**
 * Component để handle silent refresh khi reload trang
 * Kiểm tra và refresh token trước khi render app
 */
export default function PersistLogin({ children }: PersistLoginProps) {
  const { authReady, setAuthReady, refreshAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      try {
        // Minimum loading time - 1.5 seconds for better UX
        const startTime = Date.now()
        const minLoadTime = 1500

        // Safety check to ensure functions are available
        if (typeof getRefreshTokenFromLS !== 'function' || typeof getAccessTokenFromLS !== 'function') {
          console.error('Auth utility functions not available')
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, minLoadTime - elapsed)
          await new Promise((resolve) => setTimeout(resolve, remaining))
          setAuthReady(true)
          setIsLoading(false)
          return
        }

        const refreshToken = getRefreshTokenFromLS()
        const accessToken = getAccessTokenFromLS()

        // Nếu không có refresh token, không cần refresh
        if (!refreshToken) {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, minLoadTime - elapsed)
          await new Promise((resolve) => setTimeout(resolve, remaining))
          setAuthReady(true)
          setIsLoading(false)
          return
        }

        // Nếu có access token, kiểm tra xem có sắp hết hạn không
        if (accessToken) {
          const payload = parseJwtPayload(accessToken)
          if (payload?.exp) {
            const now = Math.floor(Date.now() / 1000)
            const exp = payload.exp as number
            const timeUntilExpiry = exp - now

            // Nếu token còn hiệu lực > 5 phút, không cần refresh
            if (timeUntilExpiry > 300) {
              refreshAuth()
              const elapsed = Date.now() - startTime
              const remaining = Math.max(0, minLoadTime - elapsed)
              await new Promise((resolve) => setTimeout(resolve, remaining))
              setAuthReady(true)
              setIsLoading(false)
              return
            }
          }
        }

        // Thực hiện silent refresh
        const response = await authApi.refreshToken(refreshToken)

        // Lưu token mới
        setAccessTokenToLS(response.access_token)

        // Nếu backend trả về refresh token mới (token rotation)
        if (response.refresh_token) {
          setRefreshTokenToLS(response.refresh_token)
        }

        // Cập nhật header mặc định cho axios client để các request sau dùng token mới
        axiosClient.defaults.headers.common.Authorization = `Bearer ${response.access_token}`

        // Refresh auth state
        refreshAuth()

        // Ensure minimum loading time
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, minLoadTime - elapsed)
        await new Promise((resolve) => setTimeout(resolve, remaining))

        window.dispatchEvent(new CustomEvent('session:refreshed'))
      } catch (error) {
        console.log('Silent refresh failed:', error)

        // Refresh thất bại, clear auth data
        clearAllAuth()

        // Ensure minimum loading time even on error
        const elapsed = Date.now() - Date.now()
        const remaining = Math.max(0, 1500 - elapsed)
        await new Promise((resolve) => setTimeout(resolve, remaining))

        // Phát tín hiệu cho session manager
        window.dispatchEvent(new CustomEvent('session:refreshed'))
      } finally {
        setAuthReady(true)
        setIsLoading(false)
      }
    }

    // Chỉ chạy một lần khi component mount
    if (!authReady) {
      attemptSilentRefresh()
    }
  }, [authReady, setAuthReady, refreshAuth])

  // Hiển thị loading spinner trong khi đang refresh
  if (isLoading || !authReady) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-blue-50 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/20'>
        <div className='flex flex-col items-center space-y-6'>
          {/* Full gradient spinner - solid center */}
          <div className='relative w-16 h-16'>
            <div className='w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-spin' />
          </div>
          <p className='text-sm text-muted-foreground animate-pulse'>Đang tải ứng dụng...</p>
        </div>
      </div>
    )
  }

  return children ? <>{children}</> : <Outlet />
}
