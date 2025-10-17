/**
 * Register Firebase Cloud Messaging Service Worker
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered successfully:', registration)
      
      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready
      console.log('Service Worker is ready')
      
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  } else {
    console.warn('Service Workers are not supported in this browser')
    return null
  }
}

/**
 * Unregister all service workers (for debugging)
 */
export async function unregisterServiceWorkers() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.unregister()
    }
    console.log('All service workers unregistered')
  }
}
