import { Card } from '~/components/ui/card'

type TransactionStat = {
  value: string
  label: string
  subtext: string
  accentClass: string
}

const stats: TransactionStat[] = [
  { value: '1.320.000.000đ', label: 'Tổng doanh thu', subtext: '+12.5% so với tháng trước', accentClass: 'text-teal-600' },
  { value: '300.000.000đ', label: 'Đã chi tiêu', subtext: 'Chi phí vận hành', accentClass: 'text-blue-600' },
  { value: '90.000.000đ', label: 'Số tiền đang chờ', subtext: 'Đang xử lý', accentClass: 'text-amber-600' },
  { value: '750.000.000đ', label: 'Nợ phải thu', subtext: 'Từ khách hàng', accentClass: 'text-emerald-600' }
]

export function TransactionStatsCards() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='bg-white/90 p-5 shadow-sm backdrop-blur-sm'>
          <div className={`text-2xl font-bold ${stat.accentClass}`}>{stat.value}</div>
          <div className='mt-1 text-sm font-medium text-slate-700'>{stat.label}</div>
          <div className='mt-1 text-xs text-muted-foreground'>{stat.subtext}</div>
        </Card>
      ))}
    </div>
  )
}
