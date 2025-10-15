import { AlertCircle, CheckCircle, Clock, Folder } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

interface StatsCardsProps {
  projectCounts: {
    all: number
    pending: number
    active: number
    completed: number
  }
  isLoading?: boolean
}

export function StatsCards({ projectCounts, isLoading = false }: StatsCardsProps) {
  const stats = [
    {
      label: 'Tất cả dự án',
      value: projectCounts.all,
      icon: Folder,
      chip: 'bg-muted text-foreground/80'
    },
    {
      label: 'Chờ duyệt',
      value: projectCounts.pending,
      icon: AlertCircle,
      chip: 'bg-amber-100 text-amber-800'
    },
    {
      label: 'Đang hoạt động',
      value: projectCounts.active,
      icon: Clock,
      chip: 'bg-sky-100 text-sky-800'
    },
    {
      label: 'Hoàn thành',
      value: projectCounts.completed,
      icon: CheckCircle,
      chip: 'bg-emerald-100 text-emerald-800'
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className='flex flex-col justify-between rounded-2xl border border-border/40 bg-card/95 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-border/30 hover:shadow-md'
        >
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold text-muted-foreground'>{stat.label}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stat.chip}`}>Hiện tại</span>
          </div>
          <div className='mt-6 flex items-end justify-between'>
            {isLoading ? (
              <Skeleton className='h-9 w-16 rounded-lg bg-muted/60' />
            ) : (
              <span className='text-3xl font-semibold tracking-tight text-foreground'>{stat.value}</span>
            )}
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 text-foreground/70'>
              <stat.icon className='h-5 w-5' />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
