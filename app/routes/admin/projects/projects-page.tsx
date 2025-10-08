import { ProjectStatsCards } from '~/components/admin/project-stats-cards'
import { ProjectTable } from '~/components/admin/project-table'

export default function ProjectsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12'>
      <div className='mx-auto space-y-8'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold text-slate-900'>Quản lý dự án</h1>
          <p className='text-sm text-slate-600'>Theo dõi tiến độ và chất lượng các dự án đang vận hành.</p>
        </div>

        <ProjectStatsCards />

        <ProjectTable />
      </div>
    </div>
  )
}
