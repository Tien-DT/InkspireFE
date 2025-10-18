import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Banknote, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function WithdrawRequestStatsCards() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmount: 0,
    pendingAmount: 0,
    totalPlatformFee: 0,
    totalNetAmount: 0,
    // CLIENT stats
    clientRequests: 0,
    clientTotalWithdraw: 0,
    freelancerRequests: 0,
    freelancerTotalWithdraw: 0
  })
  
  const [commissions, setCommissions] = useState({
    freelancerCommissionPercentage: 20,
    clientCommissionPercentage: 0
  })

  useEffect(() => {
    fetchStats()
    fetchCommissions()
  }, [])

  const fetchCommissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/AdminSettings/commission-percentages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setCommissions({
          freelancerCommissionPercentage: data.freelancerCommissionPercentage,
          clientCommissionPercentage: data.clientCommissionPercentage
        })
      }
    } catch (error) {
      console.error('Error fetching commission percentages:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Stats from backend:', data)
        
        // Map backend response (PascalCase) to frontend state (camelCase)
        setStats({
          totalRequests: data.totalRequests || 0,
          pendingRequests: data.pendingRequests || 0,
          approvedRequests: data.approvedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
          totalAmount: data.totalAmount || 0,
          pendingAmount: data.pendingAmount || 0,
          totalPlatformFee: data.totalPlatformFee || 0,
          totalNetAmount: data.totalNetAmount || 0,
          clientRequests: data.clientRequests || 0,
          clientTotalWithdraw: data.clientTotalWithdraw || 0,
          freelancerRequests: data.freelancerRequests || 0,
          freelancerTotalWithdraw: data.freelancerTotalWithdraw || 0
        })
      }
    } catch (error) {
      console.error('Error fetching withdraw stats:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className='space-y-2'>
      {/* Main stats cards */}
      <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Tổng yêu cầu</CardTitle>
            <Banknote className='h-4 w-4 text-muted-foreground flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>{stats.totalRequests}</div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Tổng số tiền: {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Chờ xử lý</CardTitle>
            <Clock className='h-4 w-4 text-yellow-600 flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>{stats.pendingRequests}</div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Số tiền: {formatCurrency(stats.pendingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Đã duyệt</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-green-600 flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>{stats.approvedRequests}</div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {((stats.approvedRequests / (stats.totalRequests || 1)) * 100).toFixed(0)}% tổng yêu cầu
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Từ chối</CardTitle>
            <XCircle className='h-4 w-4 text-red-600 flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>{stats.rejectedRequests}</div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {((stats.rejectedRequests / (stats.totalRequests || 1)) * 100).toFixed(0)}% tổng yêu cầu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform revenue card */}
      <Card className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-0'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
          <CardTitle className='text-sm sm:text-base font-bold text-purple-700'>
            Tổng hoa hồng nền tảng
          </CardTitle>
          <TrendingUp className='h-5 w-5 text-purple-600 flex-shrink-0' />
        </CardHeader>
        <CardContent className='p-3 sm:p-4'>
          <div className='text-2xl sm:text-3xl font-bold text-purple-700'>
            {formatCurrency(stats.totalPlatformFee)}
          </div>
          <p className='text-xs sm:text-sm text-purple-600 mt-1'>
            Từ tổng {formatCurrency(stats.totalAmount)} yêu cầu rút tiền
          </p>
          <div className='mt-2 pt-2 border-t border-purple-200'>
            <p className='text-xs sm:text-sm text-gray-600'>
              Người nhận: <span className='font-semibold text-green-600'>{formatCurrency(stats.totalNetAmount)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Role-based statistics */}
      <div className='grid gap-2 md:grid-cols-2'>
        {/* CLIENT stats */}
        <Card className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-sm sm:text-base font-bold text-blue-700'>
              Thống kê CLIENT
            </CardTitle>
            <Banknote className='h-5 w-5 text-blue-600 flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-xs sm:text-sm text-gray-600'>Số yêu cầu:</span>
                <span className='font-bold text-blue-700'>{stats.clientRequests}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs sm:text-sm text-gray-600'>Tổng rút:</span>
                <span className='font-bold text-blue-700'>{formatCurrency(stats.clientTotalWithdraw)}</span>
              </div>
              <div className='pt-2 border-t border-blue-200'>
                <p className='text-xs text-blue-600'>
                  {commissions.clientCommissionPercentage === 0 
                    ? '✓ Không mất phí hoa hồng (0% commission)'
                    : `ⓘ Có phí hoa hồng (${commissions.clientCommissionPercentage}% commission)`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FREELANCER stats */}
        <Card className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-sm sm:text-base font-bold text-purple-700'>
              Thống kê FREELANCER
            </CardTitle>
            <Banknote className='h-5 w-5 text-purple-600 flex-shrink-0' />
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-xs sm:text-sm text-gray-600'>Số yêu cầu:</span>
                <span className='font-bold text-purple-700'>{stats.freelancerRequests}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs sm:text-sm text-gray-600'>Tổng rút:</span>
                <span className='font-bold text-purple-700'>{formatCurrency(stats.freelancerTotalWithdraw)}</span>
              </div>
              <div className='pt-2 border-t border-purple-200'>
                <p className='text-xs text-purple-600'>
                  ⓘ Có phí hoa hồng ({commissions.freelancerCommissionPercentage}% commission)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
