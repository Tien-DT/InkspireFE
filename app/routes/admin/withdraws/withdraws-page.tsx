import { WithdrawRequestStatsCards } from '~/components/admin/withdraw-stats-cards'
import { WithdrawRequestTable } from '~/components/admin/withdraw-table'

export default function WithdrawsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12'>
      <div className='mx-auto space-y-8'>
        <div>
          <h1 className='text-3xl font-bold text-sky-700'>Quản lý yêu cầu rút tiền</h1>
          <p className='text-sm text-slate-600'>Xem xét và xử lý các yêu cầu rút tiền từ người dùng.</p>
        </div>

        <WithdrawRequestStatsCards />

        <WithdrawRequestTable />
      </div>
    </div>
  )
}
