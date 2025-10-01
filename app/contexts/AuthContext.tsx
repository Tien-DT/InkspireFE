import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '~/types/user.type'
import {
  getAccessTokenFromLS,
  getProfileFromLS,
  AUTH_CHANGE_EVENT,
  LocalStorageEventTarget,
  clearAllAuth,
  parseJwtPayload
} from '~/utils/auth'

interface AuthContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  profile: User | null
  setProfile: (profile: User | null) => void
  userName: string | null
  logout: () => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  // Function to extract user name from access token
  const extractUserName = (token: string | null): string | null => {
    if (!token) return null
    const payload = parseJwtPayload(token)
    if (!payload) return null

    // Try to get firstName and lastName
    const firstName = payload.firstName || payload.first_name || payload.given_name
    const lastName = payload.lastName || payload.last_name || payload.family_name

    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim()
    }
    if (firstName) return String(firstName).trim()
    if (lastName) return String(lastName).trim()

    // Fallback to name or email
    if (payload.name) return String(payload.name).trim()
    if (payload.email) return String(payload.email).trim()

    return null
  }

  // Function to refresh authentication state
  const refreshAuth = () => {
    const token = getAccessTokenFromLS()
    const storedProfile = getProfileFromLS()

    if (token) {
      setIsAuthenticated(true)
      setProfile(storedProfile)
      setUserName(extractUserName(token))
    } else {
      setIsAuthenticated(false)
      setProfile(null)
      setUserName(null)
    }
  }

  // Function to logout
  const logout = () => {
    clearAllAuth()
    setIsAuthenticated(false)
    setProfile(null)
    setUserName(null)
  }

  // Initialize auth state on mount
  useEffect(() => {
    refreshAuth()
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      refreshAuth()
    }

    const handleClearLS = () => {
      setIsAuthenticated(false)
      setProfile(null)
      setUserName(null)
    }

    LocalStorageEventTarget.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    LocalStorageEventTarget.addEventListener('clearLS', handleClearLS)

    // Also listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === 'access_token' || event.key === 'refresh_token' || event.key === 'profile') {
        refreshAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      LocalStorageEventTarget.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
      LocalStorageEventTarget.removeEventListener('clearLS', handleClearLS)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        userName,
        logout,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
