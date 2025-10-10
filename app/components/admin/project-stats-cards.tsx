import { Card } from '~/components/ui/card'

type ProjectStat = {
  value: string
  label: string
  accentClass: string
}

const stats: ProjectStat[] = [
  { value: '1.234', label: 'Tổng dự án', accentClass: 'text-teal-600' },
  { value: '856', label: 'Đang thực hiện', accentClass: 'text-blue-600' },
  { value: '378', label: 'Đã hoàn thành', accentClass: 'text-amber-600' },
  { value: '23', label: 'Bị trì hoãn', accentClass: 'text-red-600' }
]

export function ProjectStatsCards() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='bg-white/90 p-6 shadow-sm backdrop-blur-sm'>
          <div className='space-y-1'>
            <p className={`text-3xl font-bold ${stat.accentClass}`}>{stat.value}</p>
            <p className='text-sm text-slate-600'>{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
