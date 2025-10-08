import { Card, CardContent } from '~/components/ui/card'

type UserStat = {
  label: string
  value: string
}

const stats: UserStat[] = [
  { label: 'Tổng người dùng', value: '12.847' },
  { label: 'Hoạt động', value: '8.234' },
  { label: 'Không hoạt động', value: '4.613' },
  { label: 'Chờ duyệt', value: '47' }
]

export function UserStatsCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='border-border/40 bg-card shadow-sm'>
          <CardContent className='p-6'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>{stat.label}</p>
              <p className='text-3xl font-bold text-foreground'>{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
