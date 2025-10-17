/**
 * FCM Token Management Utilities
 */

const FCM_TOKEN_KEY = 'fcm_token'

export function saveFcmTokenToLS(token: string): void {
  try {
    localStorage.setItem(FCM_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error saving FCM token to localStorage:', error)
  }
}

export function getFcmTokenFromLS(): string | null {
  try {
    return localStorage.getItem(FCM_TOKEN_KEY)
  } catch (error) {
    console.error('Error getting FCM token from localStorage:', error)
    return null
  }
}

export function removeFcmTokenFromLS(): void {
  try {
    localStorage.removeItem(FCM_TOKEN_KEY)
  } catch (error) {
    console.error('Error removing FCM token from localStorage:', error)
  }
}
