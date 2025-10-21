import { UserStatsCards } from '~/components/admin/user-stats-cards'
import { UserTable } from '~/components/admin/user-table'

export default function UsersPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12'>
      <div className='mx-auto max-w-7xl space-y-6 md:space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-primary'>Quản lý người dùng</h1>
          <p className='text-muted-foreground'>Quản lý và phân vai người dùng trên hệ thống.</p>
        </div>

        <UserStatsCards />

        <UserTable />
      </div>
    </div>
  )
}
