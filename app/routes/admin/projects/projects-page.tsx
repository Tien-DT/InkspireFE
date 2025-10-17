import { ProjectStatsCards } from '~/components/admin/project-stats-cards'
import { ProjectTable } from '~/components/admin/project-table'

export default function ProjectsPage() {
  return (
    <div className='min-h-screen bg-background p-3 md:p-4 lg:p-6'>
      <div className='mx-auto max-w-7xl space-y-3'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Quản lý dự án</h1>
          <p className='text-xs sm:text-sm text-slate-600'>Theo dõi tiến độ và chất lượng các dự án đang vận hành.</p>
        </div>

        <ProjectStatsCards />

        <ProjectTable />
      </div>
    </div>
  )
}
