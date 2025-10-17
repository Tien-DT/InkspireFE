import { formatDistanceToNow } from 'date-fns'
import { Check, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import type { Notification } from '~/types/notification'
import { getNotificationIcon, getNotificationColor } from '~/types/notification'
import { cn } from '~/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete
}: NotificationItemProps) {
  const isUnread = !notification.isReaded
  const icon = getNotificationIcon(notification.notiType || 0)
  const color = getNotificationColor(notification.notiType || 0)

  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : ''

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors',
        isUnread && 'bg-blue-50/50 dark:bg-blue-950/20'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn('text-2xl', color)}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm break-words',
          isUnread && 'font-semibold'
        )}>
          {notification.content}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {timeAgo}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMarkAsRead(notification.id)}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(notification.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
        </div>
      )}
    </div>
  )
}
