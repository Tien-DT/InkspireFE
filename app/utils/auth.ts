import type { User } from '~/types/user.type'

export const LocalStorageEventTarget = typeof window !== 'undefined' ? new EventTarget() : null
export const AUTH_CHANGE_EVENT = 'authchange'

const dispatchAuthChange = () => {
  if (LocalStorageEventTarget) {
    LocalStorageEventTarget.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

const isBrowser = typeof window !== 'undefined'

export const setAccessTokenToLS = (access_token: string) => {
  if (!isBrowser) return
  localStorage.setItem('access_token', access_token)
  dispatchAuthChange()
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  if (!isBrowser) return
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  if (!isBrowser) return
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  if (LocalStorageEventTarget) {
    const clearLSEvent = new Event('clearLS')
    LocalStorageEventTarget.dispatchEvent(clearLSEvent)
    dispatchAuthChange()
  }
}

export const getAccessTokenFromLS = () => {
  if (!isBrowser) return ''
  return localStorage.getItem('access_token') || ''
}

export const getRefreshTokenFromLS = () => {
  if (!isBrowser) return ''
  return localStorage.getItem('refresh_token') || ''
}

// Fast relogin helpers
const LAST_PROVIDER_KEY = 'last_provider'
const LAST_EMAIL_KEY = 'last_email'

export type AuthProvider = 'google' | 'password' | 'other'

export const setLastAuthContext = (provider: AuthProvider, email?: string) => {
  if (!isBrowser) return
  try {
    localStorage.setItem(LAST_PROVIDER_KEY, provider)
    if (email) localStorage.setItem(LAST_EMAIL_KEY, email)
  } catch {
    // access to localStorage may be blocked (e.g., privacy mode)
    void 0
  }
}

export const getLastProvider = (): AuthProvider | null => {
  if (!isBrowser) return null
  return (localStorage.getItem(LAST_PROVIDER_KEY) as AuthProvider | null) || null
}

export const clearLastProvider = () => {
  if (!isBrowser) return
  try {
    localStorage.removeItem(LAST_PROVIDER_KEY)
    localStorage.removeItem(LAST_EMAIL_KEY)
  } catch {
    void 0
  }
}

export const clearAllAuth = () => {
  if (!isBrowser) return
  clearLS()
  clearLastProvider()
}

export const getProfileFromLS = () => {
  if (!isBrowser) return null
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  if (!isBrowser) return
  localStorage.setItem('profile', JSON.stringify(profile))
  dispatchAuthChange()
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

/**
 * Extract User profile from JWT access token payload
 * Supports both standard JWT claims and ASP.NET Identity claims (XML SOAP format)
 */
export const extractUserFromToken = (token: string): User | null => {
  if (!token) return null

  const payload = parseJwtPayload(token)
  if (!payload) return null

  console.log('JWT Payload:', payload)

  // ASP.NET Identity claim URIs
  const NAME_IDENTIFIER_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
  const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
  const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
  const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

  // Extract user ID
  // Priority: ASP.NET nameidentifier > sub > id > userId > user_id
  const id = (payload[NAME_IDENTIFIER_CLAIM] ||
    payload.sub ||
    payload.id ||
    payload.userId ||
    payload.user_id) as string

  if (!id) {
    console.warn('No user ID found in JWT payload')
    return null
  }

  // Extract email
  // Priority: ASP.NET emailaddress > email
  const email = (payload[EMAIL_CLAIM] || payload.email) as string

  if (!email) {
    console.warn('No email found in JWT payload')
    return null
  }

  // Extract full name from ASP.NET name claim
  // Format có thể là "FirstName LastName" hoặc chỉ tên
  const fullName = (payload[NAME_CLAIM] || payload.name || '') as string

  // Split full name thành first_name và last_name
  let first_name = ''
  let last_name = ''

  if (fullName) {
    const nameParts = fullName.trim().split(' ')
    if (nameParts.length > 0) {
      first_name = nameParts[0]
      last_name = nameParts.slice(1).join(' ')
    }
  }

  // Fallback: check individual first/last name claims
  if (!first_name) {
    first_name = (payload.firstName || payload.first_name || payload.given_name || payload.givenName || '') as string
  }

  if (!last_name) {
    last_name = (payload.lastName ||
      payload.last_name ||
      payload.family_name ||
      payload.familyName ||
      payload.surname ||
      '') as string
  }

  // Extract phone number
  const phone_number = (payload.phoneNumber || payload.phone_number || payload.phone || '') as string

  // Extract role
  // ASP.NET Identity stores role as string, need to parse to number
  let role = 0
  const roleValue = payload[ROLE_CLAIM] || payload.role
  if (typeof roleValue === 'number') {
    role = roleValue
  } else if (typeof roleValue === 'string') {
    role = parseInt(roleValue, 10) || 0
  }

  // Extract status
  // ASP.NET Identity stores status as string, need to parse to number
  let status = 1 // Default ACTIVE
  const statusValue = payload.status
  if (typeof statusValue === 'number') {
    status = statusValue
  } else if (typeof statusValue === 'string') {
    status = parseInt(statusValue, 10) || 1
  }

  // Extract email verification status
  // ASP.NET Identity stores as string "true"/"false"
  let email_verified = false
  const emailVerifiedValue = payload.email_verified || payload.emailVerified
  if (typeof emailVerifiedValue === 'boolean') {
    email_verified = emailVerifiedValue
  } else if (typeof emailVerifiedValue === 'string') {
    email_verified = emailVerifiedValue.toLowerCase() === 'true'
  }

  // Extract timestamps
  const created_at = payload.created_at as string | undefined
  const updated_at = payload.updated_at as string | undefined

  const user: User = {
    id,
    email,
    first_name: first_name || undefined,
    last_name: last_name || undefined,
    phone_number: phone_number || undefined,
    role,
    status,
    email_verified,
    created_at,
    updated_at
  }

  console.log('Extracted User from JWT:', user)

  return user
}
