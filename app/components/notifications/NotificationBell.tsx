import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { NotificationList } from './NotificationList'
import { useNotifications } from '~/hooks/useNotifications'
import { useAuth } from '~/contexts/AuthContext'
import { requestNotificationPermission } from '~/lib/firebase'
import { toast } from 'sonner'

export function NotificationBell() {
  const { isAuthenticated } = useAuth()
  const { unreadCount, notifications, loading, markAsRead, markAllAsRead, deleteNotification, refresh } = useNotifications(isAuthenticated)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  // Check notification permission on mount and when dropdown opens
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Handle dropdown open change
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Refetch notifications when opening
      console.log('🔔 Notification bell opened - refetching notifications')
      refresh()
      
      // Refresh permission state
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission)
      }
      
      // Mark all as read if has unread
      if (unreadCount > 0) {
        console.log('🔔 Marking all notifications as read')
        markAllAsRead()
      }
    }
  }

  // Handle enable notifications
  const handleEnableNotifications = async () => {
    try {
      console.log('🔔 Requesting notification permission...')
      console.log('📊 Current permission:', Notification.permission)
      
      // Check if already denied
      if (Notification.permission === 'denied') {
        toast.error('Thông báo đã bị chặn. Vui lòng vào cài đặt trình duyệt để bật lại.', {
          duration: 5000,
          description: 'Click vào icon khóa bên cạnh URL → Thông báo → Cho phép'
        })
        return
      }
      
      // Check if already granted
      if (Notification.permission === 'granted') {
        toast.info('Thông báo đã được bật')
        setNotificationPermission('granted')
        return
      }
      
      // Request permission (only works if permission = 'default')
      const token = await requestNotificationPermission()
      
      if (token) {
        setNotificationPermission('granted')
        toast.success('Đã bật thông báo thành công!', {
          description: 'Bạn sẽ nhận thông báo ngay cả khi không mở ứng dụng'
        })
      } else {
        // Check permission again after request
        const newPermission = Notification.permission
        setNotificationPermission(newPermission)
        
        if (newPermission === 'denied') {
          toast.error('Bạn đã từ chối quyền thông báo', {
            duration: 5000,
            description: 'Vào cài đặt trình duyệt để bật lại'
          })
        } else {
          toast.error('Không thể bật thông báo. Vui lòng thử lại.')
        }
      }
    } catch (error) {
      console.error('❌ Error enabling notifications:', error)
      toast.error('Lỗi khi bật thông báo')
    }
  }
  
  // Handle open browser settings
  const handleOpenSettings = () => {
    toast.info('Hướng dẫn bật thông báo:', {
      duration: 10000,
      description: 'Chrome/Edge: Click vào icon khóa bên cạnh URL → Quyền của trang web → Thông báo → Cho phép\n\nFirefox: Click vào icon khóa → Xóa quyền và làm mới trang'
    })
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[400px] p-0"
        >
        {/* Show enable notifications button if not granted */}
        {notificationPermission !== 'granted' && (
          <div className={`p-3 border-b ${
            notificationPermission === 'denied' 
              ? 'bg-red-50 dark:bg-red-950/20' 
              : 'bg-blue-50 dark:bg-blue-950/20'
          }`}>
            {notificationPermission === 'denied' ? (
              // Permission denied - show instructions
              <>
                <p className="text-sm text-red-900 dark:text-red-100 mb-2 font-medium">
                  ⚠️ Thông báo đã bị chặn
                </p>
                <p className="text-xs text-red-800 dark:text-red-200 mb-3">
                  Để bật lại, vào cài đặt trình duyệt:
                  <br />
                  <strong>Click vào icon 🔒 khóa bên cạnh URL</strong>
                  <br />
                  → Quyền → Thông báo → Cho phép
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full" 
                  onClick={handleOpenSettings}
                >
                  Xem hướng dẫn chi tiết
                </Button>
              </>
            ) : (
              // Permission default - show enable button
              <>
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                  💡 Bật thông báo để nhận cập nhật ngay cả khi không mở ứng dụng
                </p>
                <Button 
                  size="sm" 
                  className="w-full" 
                  onClick={handleEnableNotifications}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Bật thông báo
                </Button>
              </>
            )}
          </div>
        )}
        
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
