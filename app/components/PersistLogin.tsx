import { useEffect } from 'react'
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
 * Không hiển thị UI - sử dụng hydrateFallback của React Router thay vào đó
 */
export default function PersistLogin({ children }: PersistLoginProps) {
  const { setAuthReady, refreshAuth } = useAuth()

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      try {
        // Safety check to ensure functions are available
        if (typeof getRefreshTokenFromLS !== 'function' || typeof getAccessTokenFromLS !== 'function') {
          console.error('Auth utility functions not available')
          setAuthReady(true)
          return
        }

        const refreshToken = getRefreshTokenFromLS()
        const accessToken = getAccessTokenFromLS()

        // Nếu không có refresh token, không cần refresh
        if (!refreshToken) {
          setAuthReady(true)
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
              setAuthReady(true)
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

        window.dispatchEvent(new CustomEvent('session:refreshed'))
      } catch (error) {
        console.log('Silent refresh failed:', error)

        // Refresh thất bại, clear auth data
        clearAllAuth()

        // Phát tín hiệu cho session manager
        window.dispatchEvent(new CustomEvent('session:refreshed'))
      } finally {
        setAuthReady(true)
      }
    }

    // Chỉ chạy một lần khi component mount
    attemptSilentRefresh()
  }, [setAuthReady, refreshAuth])

  return children ? <>{children}</> : <Outlet />
}
