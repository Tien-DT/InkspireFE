import { ProjectList } from '~/components/manage-project/ProjectList'
import { ProjectTabs } from '~/components/manage-project/ProjectTabs'
import { StatsCards } from '~/components/manage-project/StatsCards'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export default function ManageProject() {
  return (
    <main className='flex-1 px-4 md:px-8 lg:px-16 py-8'>
      <div className='max-w-[1400px] mx-auto'>
        {/* Page Header */}
        <div className='flex items-start justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-semibold text-[oklch(0.55_0.15_240)] mb-2'>Quản lý Công việc</h1>
            <p className='text-muted-foreground'>Theo dõi và quản lý tất cả dự án của bạn</p>
          </div>
          <Select defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='active'>Đang hoạt động</SelectItem>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <StatsCards />
        <ProjectTabs />
        <ProjectList />
      </div>
    </main>
  )
}
