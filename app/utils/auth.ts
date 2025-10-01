import type { User } from '~/types/user.type'

export const LocalStorageEventTarget = new EventTarget()
export const AUTH_CHANGE_EVENT = 'authchange'

const dispatchAuthChange = () => {
  LocalStorageEventTarget.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
  dispatchAuthChange()
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
  dispatchAuthChange()
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

const decodeBase64Url = (segment: string) => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (base64.length % 4 || 4)) % 4
  const padded = base64 + '='.repeat(padLength)

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(padded)
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8')
  }

  return ''
}

export const parseJwtPayload = (token: string) => {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const decoded = decodeBase64Url(parts[1])
    return decoded ? (JSON.parse(decoded) as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const DISPLAY_NAME_CANDIDATES = [
  'name',
  'fullName',
  'full_name',
  'userName',
  'username',
  'preferred_username',
  'given_name',
  'displayName'
] as const

export const getUserNameFromAccessToken = (token?: string | null) => {
  if (!token) return null
  const payload = parseJwtPayload(token)
  if (!payload) return null

  for (const key of DISPLAY_NAME_CANDIDATES) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  const email = payload.email
  if (typeof email === 'string' && email.trim()) {
    return email.trim()
  }

  const sub = payload.sub
  if (typeof sub === 'string' && sub.trim()) {
    return sub.trim()
  }

  return null
}
