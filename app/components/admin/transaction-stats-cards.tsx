import { useEffect, useState } from 'react'
import { Card } from '~/components/ui/card'
import { adminApi } from '~/apis/admin.api'

type TransactionStat = {
  value: string
  label: string
  subtext: string
  accentClass: string
}

export function TransactionStatsCards() {
  const [stats, setStats] = useState<TransactionStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactionStats()
  }, [])

  const fetchTransactionStats = async () => {
    try {
      const data = await adminApi.getTransactionStats()
      const formattedStats: TransactionStat[] = [
        {
          value: `${data.totalRevenue.toLocaleString('vi-VN')}đ`,
          label: 'Tổng doanh thu',
          subtext: `${data.revenueGrowthPercentage > 0 ? '+' : ''}${data.revenueGrowthPercentage.toFixed(1)}% so với tháng trước`,
          accentClass: 'text-teal-600'
        },
        {
          value: `${data.monthlyRevenue.toLocaleString('vi-VN')}đ`,
          label: 'Doanh thu tháng',
          subtext: 'Trong 30 ngày qua',
          accentClass: 'text-blue-600'
        },
        {
          value: `${data.commissionEarned.toLocaleString('vi-VN')}đ`,
          label: 'Hoa hồng',
          subtext: 'Từ các dự án',
          accentClass: 'text-amber-600'
        },
        {
          value: `${data.serviceFees.toLocaleString('vi-VN')}đ`,
          label: 'Phí dịch vụ',
          subtext: 'Phí nền tảng',
          accentClass: 'text-emerald-600'
        }
      ]
      setStats(formattedStats)
    } catch (error) {
      console.error('Failed to fetch transaction stats:', error)
      // Use default data if API fails
      setStats(getDefaultStats())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultStats = (): TransactionStat[] => [
    { value: '0đ', label: 'Tổng doanh thu', subtext: 'Chưa có dữ liệu', accentClass: 'text-teal-600' },
    { value: '0đ', label: 'Doanh thu tháng', subtext: 'Chưa có dữ liệu', accentClass: 'text-blue-600' },
    { value: '0đ', label: 'Hoa hồng', subtext: 'Chưa có dữ liệu', accentClass: 'text-amber-600' },
    { value: '0đ', label: 'Phí dịch vụ', subtext: 'Chưa có dữ liệu', accentClass: 'text-emerald-600' }
  ]

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-white/90 p-5 shadow-sm backdrop-blur-sm'>
            <div className='h-20 animate-pulse bg-gray-200 rounded'></div>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='bg-white/90 p-5 shadow-sm backdrop-blur-sm'>
          <div className={`text-2xl font-bold ${stat.accentClass}`}>{stat.value}</div>
          <div className='mt-1 text-sm font-medium text-slate-700'>{stat.label}</div>
          <div className='mt-1 text-xs text-muted-foreground'>{stat.subtext}</div>
        </Card>
      ))}
    </div>
  )
}
