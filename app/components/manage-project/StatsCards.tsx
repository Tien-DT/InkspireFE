import { Clock, AlertCircle, CheckCircle, Folder } from 'lucide-react'
import { Card } from '~/components/ui/card'

interface StatsCardsProps {
  projectCounts: {
    all: number
    pending: number
    active: number
    completed: number
  }
}

export function StatsCards({ projectCounts }: StatsCardsProps) {
  const stats = [
    {
      label: 'Tất cả dự án',
      value: projectCounts.all.toString(),
      icon: Folder,
      color: 'bg-gray-500'
    },
    {
      label: 'Chờ duyệt',
      value: projectCounts.pending.toString(),
      icon: AlertCircle,
      color: 'bg-[oklch(0.75_0.15_85)]'
    },
    {
      label: 'Đang hoạt động',
      value: projectCounts.active.toString(),
      icon: Clock,
      color: 'bg-[oklch(0.55_0.15_240)]'
    },
    {
      label: 'Hoàn thành',
      value: projectCounts.completed.toString(),
      icon: CheckCircle,
      color: 'bg-[oklch(0.65_0.18_145)]'
    }
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {stats.map((stat) => (
        <Card key={stat.label} className='p-6 flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>{stat.label}</p>
            <p className='text-3xl font-bold'>{stat.value}</p>
          </div>
          <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
            <stat.icon className='h-6 w-6 text-white' />
          </div>
        </Card>
      ))}
    </div>
  )
}
