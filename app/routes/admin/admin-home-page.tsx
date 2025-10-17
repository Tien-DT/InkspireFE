import { StatsCards } from '~/components/admin/stats-cards'
import { RecentActivity } from '~/components/admin/recent-activity'
import { QuickActions } from '~/components/admin/quick-actions'

export default function AdminHomePage() {
  return (
    <div className='min-h-screen bg-background p-3 md:p-4 lg:p-6'>
      <div className='mx-auto max-w-7xl space-y-3'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary'>Tổng quan bảng điều khiển</h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>Chào mừng trở lại! Hãy cập nhật tình hình hôm nay.</p>
        </div>

        <StatsCards />

        <div className='grid gap-2 lg:grid-cols-2'>
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
