import { useCallback } from 'react'
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

/**
 * Hook để thực hiện silent refresh token
 * Có thể được gọi từ các component khác khi cần
 */
export const useSilentRefresh = () => {
  const { refreshAuth } = useAuth()

  const performSilentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshTokenFromLS()

      if (!refreshToken) {
        console.log('No refresh token available for silent refresh')
        return false
      }

      console.log('Performing silent refresh...')
      const response = await authApi.refreshToken(refreshToken)

      // Lưu token mới
      setAccessTokenToLS(response.access_token)

      // Nếu backend trả về refresh token mới (token rotation)
      if (response.refresh_token) {
        setRefreshTokenToLS(response.refresh_token)
      }

      // Refresh auth state
      refreshAuth()

      // Phát tín hiệu cho session manager
      window.dispatchEvent(new CustomEvent('session:refreshed'))

      console.log('Silent refresh successful')
      return true
    } catch (error) {
      console.log('Silent refresh failed:', error)

      // Refresh thất bại, clear auth data
      clearAllAuth()

      // Phát tín hiệu cho session manager
      window.dispatchEvent(new CustomEvent('session:refreshed'))

      return false
    }
  }, [refreshAuth])

  const shouldRefresh = useCallback((): boolean => {
    const accessToken = getAccessTokenFromLS()
    const refreshToken = getRefreshTokenFromLS()

    // Nếu không có refresh token, không thể refresh
    if (!refreshToken) return false

    // Nếu không có access token, cần refresh
    if (!accessToken) return true

    // Kiểm tra thời gian hết hạn của access token
    const payload = parseJwtPayload(accessToken)
    if (payload?.exp) {
      const now = Math.floor(Date.now() / 1000)
      const exp = payload.exp as number
      const timeUntilExpiry = exp - now

      // Refresh nếu token hết hạn hoặc sắp hết hạn (< 5 phút)
      return timeUntilExpiry <= 300
    }

    return false
  }, [])

  return {
    performSilentRefresh,
    shouldRefresh
  }
}
