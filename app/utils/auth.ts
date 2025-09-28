import type { User } from '~/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token') 
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

// Fast relogin helpers
const LAST_PROVIDER_KEY = 'last_provider'
const LAST_EMAIL_KEY = 'last_email'

export type AuthProvider = 'google' | 'password' | 'other'

export const setLastAuthContext = (provider: AuthProvider, email?: string) => {
  try {
    localStorage.setItem(LAST_PROVIDER_KEY, provider)
    if (email) localStorage.setItem(LAST_EMAIL_KEY, email)
  } catch {
    // access to localStorage may be blocked (e.g., privacy mode)
    void 0
  }
}

export const getLastProvider = (): AuthProvider | null =>
  (localStorage.getItem(LAST_PROVIDER_KEY) as AuthProvider | null) || null

export const clearLastProvider = () => {
  try {
    localStorage.removeItem(LAST_PROVIDER_KEY)
    localStorage.removeItem(LAST_EMAIL_KEY)
  } catch {
    void 0
  }
}

export const clearAllAuth = () => {
  clearLS()
  clearLastProvider()
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
