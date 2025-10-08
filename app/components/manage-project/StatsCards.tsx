import { Clock, AlertCircle, XCircle, CheckCircle } from 'lucide-react'
import { Card } from '~/components/ui/card'

const stats = [
  {
    label: 'Dự án đang hoạt động',
    value: '3',
    icon: Clock,
    color: 'bg-[oklch(0.55_0.15_240)]'
  },
  {
    label: 'Chờ duyệt',
    value: '1',
    icon: AlertCircle,
    color: 'bg-[oklch(0.75_0.15_85)]'
  },
  {
    label: 'Cần sửa đổi',
    value: '1',
    icon: XCircle,
    color: 'bg-[oklch(0.6_0.22_25)]'
  },
  {
    label: 'Hoàn thành tháng này',
    value: '2',
    icon: CheckCircle,
    color: 'bg-[oklch(0.65_0.18_145)]'
  }
]

export function StatsCards() {
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
