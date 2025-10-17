import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '~/contexts/AuthContext'
import { useNotificationHub } from '~/hooks/useNotificationHub'
import type { NotificationData } from '~/lib/signalr-notification'

interface NotificationContextType {
  isConnected: boolean
  unreadCount: number
  notifications: NotificationData[]
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated } = useAuth()
  const notificationHub = useNotificationHub()

  // Only provide hub functionality when authenticated
  const value: NotificationContextType = {
    isConnected: isAuthenticated ? notificationHub.isConnected : false,
    unreadCount: isAuthenticated ? notificationHub.unreadCount : 0,
    notifications: isAuthenticated ? notificationHub.notifications : []
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
