import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, User, Briefcase, CreditCard } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { adminApi, type RecentActivity } from '~/apis/admin.api'

type ActivityItem = {
  id: string
  icon: React.ElementType
  title: string
  description: string
  time: string
  completed: boolean
  type: string
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_registration':
      return User
    case 'project_created':
      return Briefcase
    case 'transaction':
      return CreditCard
    default:
      return Clock
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes} phút trước`
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`
  } else {
    return date.toLocaleDateString('vi-VN')
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const fetchRecentActivities = async () => {
    try {
      const data = await adminApi.getRecentActivities(10)
      const formattedActivities = data.map((activity: RecentActivity) => ({
        id: activity.id,
        icon: getActivityIcon(activity.type),
        title: getActivityTitle(activity),
        description: activity.description,
        time: formatTimestamp(activity.timestamp),
        completed: activity.status === 'completed',
        type: activity.type
      }))
      setActivities(formattedActivities)
    } catch (error) {
      console.error('Failed to fetch recent activities:', error)
      // Use default data if API fails
      setActivities(getDefaultActivities())
    } finally {
      setLoading(false)
    }
  }

  const getActivityTitle = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'user_registration':
        return 'Người dùng mới đăng ký'
      case 'project_created':
        return 'Dự án mới được tạo'
      case 'transaction':
        return 'Giao dịch mới'
      default:
        return activity.description
    }
  }

  const getDefaultActivities = (): ActivityItem[] => [
    {
      id: '1',
      icon: CheckCircle2,
      title: 'Chưa có hoạt động',
      description: 'Hệ thống chưa ghi nhận hoạt động nào',
      time: 'N/A',
      completed: false,
      type: 'default'
    }
  ]

  if (loading) {
    return (
      <Card className='p-3 sm:p-4 shadow-none border-0 rounded-lg bg-white dark:bg-slate-950'>
        <div className='h-64 animate-pulse bg-gray-200 rounded-lg'></div>
      </Card>
    )
  }
  return (
    <Card className='p-3 sm:p-4 shadow-none border-0 rounded-lg bg-white dark:bg-slate-950'>
      <div className='space-y-2'>
        <div>
          <h2 className='text-base sm:text-lg font-semibold text-slate-900'>Hoạt động gần đây</h2>
          <p className='text-xs sm:text-sm text-muted-foreground'>Các hoạt động mới nhất trên hệ thống</p>
        </div>

        <div className='space-y-1'>
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className='flex gap-2'>
                <div className='mt-0.5 flex-shrink-0'>
                  {activity.completed ? (
                    <Icon className='h-4 w-4 sm:h-5 sm:w-5 text-emerald-500' />
                  ) : (
                    <Icon className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground' />
                  )}
                </div>
                <div className='flex-1 space-y-0'>
                  <p className='text-xs sm:text-sm font-medium leading-tight text-slate-900'>{activity.title}</p>
                  <p className='text-xs text-muted-foreground leading-tight'>{activity.description}</p>
                  <p className='text-xs text-muted-foreground leading-tight'>{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
