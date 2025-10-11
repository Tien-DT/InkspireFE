import { useEffect, useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { adminApi } from '~/apis/admin.api'

type UserStat = {
  label: string
  value: string
}

export function UserStatsCards() {
  const [stats, setStats] = useState<UserStat[]>([
    { label: 'Tổng người dùng', value: '0' },
    { label: 'Hoạt động', value: '0' },
    { label: 'Không hoạt động', value: '0' },
    { label: 'Chờ duyệt', value: '0' }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      
      // Gọi tuần tự các API count và log để debug
      const activeUsers = await adminApi.getTotalUsersCount({ status: 1 })
      console.log('Active users:', activeUsers, typeof activeUsers)
      
      const suspendedUsers = await adminApi.getTotalUsersCount({ status: 2 })
      console.log('Suspended users:', suspendedUsers, typeof suspendedUsers)
      
      const pendingUsers = await adminApi.getTotalUsersCount({ status: 0 })
      console.log('Pending users:', pendingUsers, typeof pendingUsers)

      // Đảm bảo tất cả là số
      const active = Number(activeUsers) || 0
      const suspended = Number(suspendedUsers) || 0
      const pending = Number(pendingUsers) || 0
      
      // Tổng thực sự là tổng của tất cả status
      const actualTotal = active + suspended + pending

      setStats([
        { label: 'Tổng người dùng', value: actualTotal.toString() },
        { label: 'Hoạt động', value: active.toString() },
        { label: 'Không hoạt động', value: suspended.toString() },
        { label: 'Chờ duyệt', value: pending.toString() }
      ])
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
      // Giữ nguyên giá trị mặc định nếu lỗi
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='border-border/40 bg-card shadow-sm'>
            <CardContent className='p-4 sm:p-6'>
              <div className='h-16 sm:h-20 animate-pulse bg-gray-200 rounded'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4'>
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
