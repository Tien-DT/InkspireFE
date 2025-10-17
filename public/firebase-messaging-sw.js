// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase with your config
firebase.initializeApp({
  apiKey: "AIzaSyAj0ANy1ST6jQf9dt9Aq177etr2tKhXBj4",
  authDomain: "inkspire-a13b9.firebaseapp.com",
  projectId: "inkspire-a13b9",
  storageBucket: "inkspire-a13b9.firebasestorage.app",
  messagingSenderId: "1065153327057",
  appId: "1:1065153327057:web:1ae1b0d02ec59b5680faf0"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Inkspire Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.notificationId || 'default',
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Navigate to the appropriate page based on notification data
  const notificationData = event.notification.data;
  let urlToOpen = '/';
  
  if (notificationData) {
    const notificationType = parseInt(notificationData.notificationType || '0');
    
    // CV notifications (1-3)
    if (notificationType >= 1 && notificationType <= 3) {
      if (notificationData.recruitmentPostId) {
        urlToOpen = `/recruitment/${notificationData.recruitmentPostId}`;
      }
    }
    // Project notifications (11-20)
    else if (notificationType >= 11 && notificationType <= 20) {
      if (notificationData.projectId) {
        urlToOpen = `/projects/${notificationData.projectId}`;
      }
    }
    // Milestone notifications (21-30)
    else if (notificationType >= 21 && notificationType <= 30) {
      if (notificationData.projectId) {
        urlToOpen = `/projects/${notificationData.projectId}/milestones`;
      }
    }
    // Wallet notifications (31-40)
    else if (notificationType >= 31 && notificationType <= 40) {
      urlToOpen = '/wallet';
    }
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
