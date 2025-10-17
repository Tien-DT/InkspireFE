import { useEffect, useState, useCallback } from 'react'
import { signalRNotificationService, type NotificationData } from '~/lib/signalr-notification'
import { useAuth } from '~/contexts/AuthContext'
import { toast } from 'sonner'

/**
 * Hook to manage NotificationHub SignalR connection and handle real-time notifications
 */
export function useNotificationHub() {
  const { isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  // Handle new notification received
  const handleNotificationReceived = useCallback((notification: NotificationData) => {
    console.log('📩 New notification:', notification)
    
    // Add to notification list
    setNotifications(prev => [notification, ...prev])
    
    // Update unread count
    if (!notification.isReaded) {
      setUnreadCount(prev => prev + 1)
    }
    
    // Show toast notification
    toast.info(notification.content, {
      description: new Date(notification.createdAt).toLocaleString('vi-VN'),
      duration: 5000
    })
  }, [])

  // Handle notification marked as read
  const handleNotificationRead = useCallback((notificationId: string) => {
    console.log('✅ Notification read:', notificationId)
    
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isReaded: true } : n))
    )
  }, [])

  // Handle all notifications marked as read
  const handleAllNotificationsRead = useCallback(() => {
    console.log('✅ All notifications read')
    
    setNotifications(prev => prev.map(n => ({ ...n, isReaded: true })))
    setUnreadCount(0)
  }, [])

  // Handle unread count changed
  const handleUnreadCountChanged = useCallback((count: number) => {
    console.log('📊 Unread count:', count)
    setUnreadCount(count)
  }, [])

  // Connect/disconnect based on authentication
  useEffect(() => {
    if (!isAuthenticated) {
      // Not authenticated - disconnect
      setIsConnected(false)
      signalRNotificationService.disconnect()
      return
    }

    // Authenticated - connect
    let mounted = true

    const connect = async () => {
      try {
        // Register handlers
        signalRNotificationService.registerHandlers({
          onNotificationReceived: handleNotificationReceived,
          onNotificationRead: handleNotificationRead,
          onAllNotificationsRead: handleAllNotificationsRead,
          onUnreadCountChanged: handleUnreadCountChanged
        })

        // Connect
        await signalRNotificationService.connect()
        
        if (mounted) {
          setIsConnected(true)
        }
      } catch (error) {
        console.error('❌ NotificationHub connection failed:', error)
        if (mounted) {
          setIsConnected(false)
        }
      }
    }

    connect()

    // Cleanup on unmount or logout
    return () => {
      mounted = false
      signalRNotificationService.clearHandlers()
      signalRNotificationService.disconnect()
      setIsConnected(false)
      setNotifications([])
      setUnreadCount(0)
    }
  }, [isAuthenticated, handleNotificationReceived, handleNotificationRead, handleAllNotificationsRead, handleUnreadCountChanged])

  return {
    isConnected,
    unreadCount,
    notifications,
    signalRService: signalRNotificationService
  }
}
