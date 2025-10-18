import { useState, useEffect, useCallback } from 'react'
import { notificationApi } from '~/apis/notificationApi'
import { requestNotificationPermission, onMessageListener } from '~/lib/firebase'
import type { Notification } from '~/types/notification'
import { toast } from 'sonner'
import { saveFcmTokenToLS, getFcmTokenFromLS } from '~/utils/fcmToken'

export function useNotifications(isAuthenticated: boolean = false) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Initialize FCM and register token
  const initializeFCM = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('⏭️ User not authenticated, skipping FCM initialization')
      return
    }

    if (initialized) {
      console.log('⏭️ FCM already initialized')
      return
    }

    console.log('🚀 Starting FCM initialization...')

    try {
      // Check if we already have a token in localStorage
      const existingToken = getFcmTokenFromLS()
      console.log('💾 Existing token in localStorage:', existingToken ? 'YES' : 'NO')
      
      // Request new token
      console.log('📱 Requesting FCM token...')
      const token = await requestNotificationPermission()
      
      if (token) {
        console.log('✅ Got FCM token:', token.substring(0, 20) + '...')
        setFcmToken(token)
        saveFcmTokenToLS(token)
        
        // Only register if it's a new token or different from existing
        if (!existingToken || existingToken !== token) {
          console.log('📤 Registering token with backend...')
          try {
            const response = await notificationApi.registerFcmToken(token)
            console.log('✅ Token registered with backend:', response)
            toast.success('Thông báo đẩy đã được kích hoạt!')
          } catch (apiError) {
            console.error('❌ Failed to register token with backend:', apiError)
            toast.error('Failed to enable push notifications')
          }
        } else {
          console.log('♻️ Token unchanged, skipping backend registration')
        }
        
        setInitialized(true)
      } else {
        console.warn('⚠️ Failed to get FCM token')
        toast.warning('Vui lòng cho phép thông báo trên trình duyệt để nhận thông báo')
      }
    } catch (error) {
      console.error('❌ Error initializing FCM:', error)
      toast.error('Lỗi kết nối thông báo đẩy')
    }
  }, [isAuthenticated, initialized])

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const response = await notificationApi.getMyNotifications(1, 50)
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error: any) {
      // Don't spam console with 401 errors (token expired)
      if (error?.response?.status === 401) {
        console.log('⚠️ Authentication required - please login')
        setNotifications([])
        setUnreadCount(0)
        return
      }
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      const response = await notificationApi.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data)
      }
    } catch (error: any) {
      // Don't spam console with 401 errors (token expired)
      if (error?.response?.status === 401) {
        console.log('⚠️ Authentication required - please login')
        setNotifications([])
        setUnreadCount(0)
        return
      }
      console.error('Error loading unread count:', error)
    }
  }, [isAuthenticated])

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isReaded: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isReaded: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Lỗi đánh dấu tất cả thông báo là đã đọc')
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      const wasUnread = notifications.find(n => n.id === notificationId)?.isReaded === false
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      toast.success('Đã xóa thông báo')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }, [notifications])

  // Listen for foreground messages
  useEffect(() => {
    if (!isAuthenticated) return

    const unsubscribe = onMessageListener().then((payload: any) => {
      console.log('Received foreground message:', payload)
      
      // Show toast notification
      toast.info(payload.notification?.title || 'New notification', {
        description: payload.notification?.body
      })

      // Reload notifications
      loadNotifications()
      loadUnreadCount()
    })

    return () => {
      // Cleanup if needed
    }
  }, [isAuthenticated, loadNotifications, loadUnreadCount])

  // Initialize FCM when user logs in
  useEffect(() => {
    if (isAuthenticated && !initialized) {
      initializeFCM()
    }
  }, [isAuthenticated, initialized, initializeFCM])

  // Load notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
      loadUnreadCount()
    } else {
      // Clear notifications when logged out
      setNotifications([])
      setUnreadCount(0)
      setInitialized(false)
    }
  }, [isAuthenticated, loadNotifications, loadUnreadCount])

  // Poll for updates every 30 seconds (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated, loadUnreadCount])

  return {
    notifications,
    unreadCount,
    loading,
    fcmToken,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  }
}
