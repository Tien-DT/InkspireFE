import { TransactionStatsCards } from '~/components/admin/transaction-stats-cards'
import { TransactionTable } from '~/components/admin/transaction-table'

export default function TransactionsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12'>
      <div className='mx-auto space-y-8'>
        <div>
          <h1 className='text-3xl font-bold text-sky-700'>Quản lý giao dịch</h1>
          <p className='text-sm text-slate-600'>Theo dõi thanh toán, hóa đơn và các hoạt động tài chính.</p>
        </div>

        <TransactionStatsCards />

        <TransactionTable />
      </div>
    </div>
  )
}
