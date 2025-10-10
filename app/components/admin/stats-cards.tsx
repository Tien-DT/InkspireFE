import type { ComponentType, SVGProps } from 'react'
import { TrendingDown, TrendingUp, Users, Briefcase, Wallet, ShieldCheck } from 'lucide-react'
import { Card } from '~/components/ui/card'

type StatDetail = {
  label: string
  value: string
}

type StatItem = {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: ComponentType<SVGProps<SVGSVGElement>>
  details: StatDetail[]
}

const stats: StatItem[] = [
  {
    title: 'Tổng người dùng',
    value: '12.847',
    change: '+8.5%',
    trend: 'up',
    icon: Users,
    details: [
      { label: 'Freelancer', value: '8.274' },
      { label: 'Khách hàng', value: '4.573' }
    ]
  },
  {
    title: 'Dự án đang hoạt động',
    value: '1.234',
    change: '+4.3%',
    trend: 'up',
    icon: Briefcase,
    details: [
      { label: 'Đang triển khai', value: '862' },
      { label: 'Chờ duyệt', value: '372' }
    ]
  },
  {
    title: 'Doanh thu tháng',
    value: '1.320.000.000đ',
    change: '+12.8%',
    trend: 'up',
    icon: Wallet,
    details: [
      { label: 'Hoa hồng', value: '720.000.000đ' },
      { label: 'Phí dịch vụ', value: '380.000.000đ' },
      { label: 'Advertising', value: '220.000.000đ' }
    ]
  },
  {
    title: 'Chiến dịch cần duyệt',
    value: '47',
    change: '-3.2%',
    trend: 'down',
    icon: ShieldCheck,
    details: [
      { label: 'Đã duyệt', value: '23' },
      { label: 'Chờ duyệt', value: '24' }
    ]
  }
]

export function StatsCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon
        const isTrendingUp = stat.trend === 'up'
        const trendClasses = isTrendingUp
          ? 'bg-emerald-100 text-emerald-600'
          : 'bg-rose-100 text-rose-600'
        const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title} className='p-5 shadow-sm'>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Icon className='h-4 w-4 text-slate-400' />
                  <span>{stat.title}</span>
                </div>
                <p className='text-2xl font-semibold tracking-tight text-slate-900'>{stat.value}</p>
                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trendClasses}`}>
                  <TrendIcon className='h-3 w-3' />
                  <span>{stat.change}</span>
                </div>
                <div className='space-y-1 pt-1'>
                  {stat.details.map((detail) => (
                    <div key={detail.label} className='flex justify-between text-xs text-muted-foreground'>
                      <span>{detail.label}</span>
                      <span className='font-medium text-slate-900'>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
