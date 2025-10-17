import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User } from '~/types/user.type'
import {
  getAccessTokenFromLS,
  getProfileFromLS,
  AUTH_CHANGE_EVENT,
  LocalStorageEventTarget,
  clearAllAuth,
  parseJwtPayload
} from '~/utils/auth'
import { removeFcmTokenFromLS } from '~/utils/fcmToken'

interface AuthContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  profile: User | null
  setProfile: (p: User | null) => void
  userName: string | null
  logout: () => void
  refreshAuth: () => void
  authReady: boolean
  setAuthReady: (ready: boolean) => void
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  // Extract display name từ JWT
  const extractUserName = useCallback((token: string | null): string | null => {
    if (!token) return null
    const payload = parseJwtPayload(token)
    if (!payload) return null

    const first = payload.firstName ?? payload.first_name ?? payload.given_name
    const last = payload.lastName ?? payload.last_name ?? payload.family_name

    if (first && last) return `${String(first).trim()} ${String(last).trim()}`
    if (first) return String(first).trim()
    if (last) return String(last).trim()
    if (payload.name) return String(payload.name).trim()
    if (payload.email) return String(payload.email).trim()
    return null
  }, [])

  // Làm mới state auth từ localStorage
  const refreshAuth = useCallback(() => {
    const token = getAccessTokenFromLS()
    const storedProfile = getProfileFromLS()

    if (!token) {
      setIsAuthenticated(false)
      setProfile(null)
      setUserName(null)
      return
    }

    const payload = parseJwtPayload(token)
    if (payload?.exp) {
      const now = Math.floor(Date.now() / 1000)
      const exp = payload.exp as number
      if (exp <= now) {
        // Hết hạn: clear và reset state
        clearAllAuth()
        setIsAuthenticated(false)
        setProfile(null)
        setUserName(null)
        return
      }
    }

    setIsAuthenticated(true)
    setProfile(storedProfile)
    setUserName(extractUserName(token))
  }, [extractUserName])

  const logout = useCallback(() => {
    console.log('🚪 Logout called')
    
    // Clear LS + phát tín hiệu cho tab khác
    clearAllAuth()
    console.log('✅ Cleared auth')
    
    // Clear FCM token
    console.log('🗑️ Removing FCM token from localStorage...')
    removeFcmTokenFromLS()
    console.log('✅ FCM token removed:', localStorage.getItem('fcm_token') === null ? 'SUCCESS' : 'FAILED')
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth:logout', '1')
        localStorage.removeItem('auth:logout')
      } catch {
        // Ignore localStorage errors in private mode
      }
      window.dispatchEvent(new CustomEvent('session:expired'))
    }
    setIsAuthenticated(false)
    setProfile(null)
    setUserName(null)
  }, [])

  // Init khi mount
  useEffect(() => {
    refreshAuth()
    setAuthReady(true)
  }, [refreshAuth])

  // Nghe thay đổi trong cùng tab (event nội bộ) + các tab khác (storage)
  useEffect(() => {
    const handleAuthChange = () => refreshAuth()

    const handleStorage = (e: StorageEvent) => {
      if (!e.key) {
        // storage.clear() → reload state
        refreshAuth()
        return
      }
      // sync rõ ràng theo key
      if (
        e.key === 'access_token' ||
        e.key === 'refresh_token' ||
        e.key === 'profile' ||
        e.key === 'auth:logout' ||
        e.key === 'auth:login'
      ) {
        refreshAuth()
      }
    }

    if (LocalStorageEventTarget) {
      LocalStorageEventTarget.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      if (LocalStorageEventTarget) {
        LocalStorageEventTarget.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
      }
      window.removeEventListener('storage', handleStorage)
    }
  }, [refreshAuth])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        userName,
        logout,
        refreshAuth,
        authReady,
        setAuthReady
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
