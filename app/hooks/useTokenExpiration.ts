import { useEffect, useCallback } from 'react'
import { parseJwtPayload, getAccessTokenFromLS, clearAllAuth } from '~/utils/auth'
import { useAuth } from '~/contexts/AuthContext'

interface TokenExpirationOptions {
  onTokenExpired?: () => void
  checkInterval?: number // in milliseconds
}

/**
 * Hook to handle token expiration
 * Automatically checks token expiration and handles cleanup
 */
export const useTokenExpiration = (options: TokenExpirationOptions = {}) => {
  const { onTokenExpired, checkInterval = 60000 } = options // Default 1 minute
  const { logout } = useAuth()

  const checkTokenExpiration = useCallback(() => {
    const token = getAccessTokenFromLS()
    if (!token) return

    const payload = parseJwtPayload(token)
    if (!payload || !payload.exp) return

    const currentTime = Math.floor(Date.now() / 1000)
    const expirationTime = payload.exp as number

    // Check if token expires in the next 5 minutes
    if (expirationTime - currentTime < 300) {
      console.warn('Token will expire soon')

      if (onTokenExpired) {
        onTokenExpired()
      } else {
        // Default behavior: logout user
        logout()
      }
    }
  }, [logout, onTokenExpired])

  useEffect(() => {
    // Check immediately
    checkTokenExpiration()

    // Set up interval
    const interval = setInterval(checkTokenExpiration, checkInterval)

    return () => clearInterval(interval)
  }, [checkTokenExpiration, checkInterval])

  return {
    checkTokenExpiration
  }
}

/**
 * Hook to get token expiration info
 */
export const useTokenInfo = () => {
  const token = getAccessTokenFromLS()
  const payload = parseJwtPayload(token)

  if (!payload || !payload.exp) {
    return {
      isExpired: true,
      expiresAt: null,
      timeUntilExpiry: 0
    }
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const expirationTime = payload.exp as number
  const timeUntilExpiry = Math.max(0, expirationTime - currentTime)

  return {
    isExpired: timeUntilExpiry <= 0,
    expiresAt: new Date(expirationTime * 1000),
    timeUntilExpiry
  }
}
