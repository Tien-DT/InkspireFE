import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging'

// Firebase configuration
// Lấy config từ Firebase Console: https://console.firebase.google.com/project/inkspire-a13b9/settings/general
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: 'inkspire-a13b9.firebaseapp.com',
  projectId: 'inkspire-a13b9',
  storageBucket: 'inkspire-a13b9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Setup Google provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection every time
})

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null
let messagingInitialized = false

async function initializeMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') {
    return null
  }

  if (messagingInitialized && messaging) {
    return messaging
  }

  try {
    const supported = await isSupported()
    if (supported) {
      messaging = getMessaging(app)
      messagingInitialized = true
      console.log('Firebase Messaging initialized successfully')
      return messaging
    } else {
      console.warn('Firebase Messaging not supported in this browser')
      return null
    }
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error)
    return null
  }
}

export { messaging }

// Request notification permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Ensure messaging is initialized
    const msg = await initializeMessaging()
    if (!msg) {
      console.warn('Firebase Messaging not available')
      return null
    }

    // Check if permission already granted
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted')
    } else if (Notification.permission === 'denied') {
      console.warn('Notification permission denied by user')
      return null
    } else {
      // Request permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.log('Notification permission denied')
        return null
      }
      console.log('Notification permission granted')
    }

    // Check VAPID key
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    console.log('🔑 VAPID key check:', vapidKey ? 'EXISTS (length: ' + vapidKey.length + ')' : 'MISSING')
    
    if (!vapidKey || vapidKey === 'YOUR_VAPID_KEY_HERE') {
      console.error('❌ VAPID key not configured! Add VITE_FIREBASE_VAPID_KEY to .env')
      console.error('❌ CRITICAL: Restart frontend with "npm run dev" after adding VAPID key!')
      return null
    }

    // Get FCM token
    console.log('📞 Calling getToken() with VAPID key...')
    const token = await getToken(msg, { vapidKey })

    if (token) {
      console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...')
      console.log('📊 Token length:', token.length)
      return token
    } else {
      console.error('❌ Failed to get FCM token - getToken() returned null')
      console.error('   Check: 1) Service Worker registered? 2) Permission granted? 3) VAPID key correct?')
      return null
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error)
    return null
  }
}

// Listen for foreground messages
export async function onMessageListener() {
  const msg = await initializeMessaging()
  
  if (!msg) {
    return new Promise(() => {})
  }

  return new Promise((resolve) => {
    onMessage(msg, (payload) => {
      console.log('📩 Foreground message received:', payload)
      resolve(payload)
    })
  })
}

export default app
