import { StatsCards } from '~/components/admin/stats-cards'
import { RecentActivity } from '~/components/admin/recent-activity'
import { QuickActions } from '~/components/admin/quick-actions'

export default function AdminHomePage() {
  return (
    <div className='min-h-screen bg-background p-6 md:p-8 lg:p-12'>
      <div className='mx-auto space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-primary'>Tổng quan bảng điều khiển</h1>
          <p className='text-muted-foreground'>Chào mừng trở lại! Hãy cập nhật tình hình hôm nay.</p>
        </div>

        <StatsCards />

        <div className='grid gap-6 lg:grid-cols-2'>
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
