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
    totalNetAmount: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests?$select=id,status,amount,netAmount,platformFeeAmount`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const requests = Array.isArray(data) ? data : (data.value || data || [])
        const validRequests = requests.filter((r: any) => r && (r.id || r.Id))
        
        // Normalize data to handle both PascalCase and camelCase
        const normalizedRequests = validRequests.map((r: any) => ({
          id: r.Id || r.id,
          status: r.Status ?? r.status ?? 0,
          amount: r.Amount ?? r.amount ?? 0,
          platformFeeAmount: r.PlatformFeeAmount ?? r.platformFeeAmount,
          netAmount: r.NetAmount ?? r.netAmount
        }))
        
        const stats = {
          totalRequests: normalizedRequests.length,
          pendingRequests: normalizedRequests.filter((r: any) => r.status === 0).length,
          approvedRequests: normalizedRequests.filter((r: any) => r.status === 1).length,
          rejectedRequests: normalizedRequests.filter((r: any) => r.status === 2).length,
          totalAmount: normalizedRequests.reduce((sum: number, r: any) => sum + r.amount, 0),
          pendingAmount: normalizedRequests.filter((r: any) => r.status === 0)
            .reduce((sum: number, r: any) => sum + r.amount, 0),
          totalPlatformFee: normalizedRequests.reduce((sum: number, r: any) => 
            sum + (r.platformFeeAmount || r.amount * 0.2), 0),
          totalNetAmount: normalizedRequests.reduce((sum: number, r: any) => 
            sum + (r.netAmount || r.amount * 0.8), 0)
        }
        
        setStats(stats)
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
    <div className='space-y-4'>
      {/* Main stats cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng yêu cầu</CardTitle>
            <Banknote className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalRequests}</div>
            <p className='text-xs text-muted-foreground'>
              Tổng số tiền: {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Chờ xử lý</CardTitle>
            <Clock className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.pendingRequests}</div>
            <p className='text-xs text-muted-foreground'>
              Số tiền: {formatCurrency(stats.pendingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Đã duyệt</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.approvedRequests}</div>
            <p className='text-xs text-muted-foreground'>
              {((stats.approvedRequests / (stats.totalRequests || 1)) * 100).toFixed(0)}% tổng yêu cầu
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white dark:bg-slate-950 shadow-none border-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Từ chối</CardTitle>
            <XCircle className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.rejectedRequests}</div>
            <p className='text-xs text-muted-foreground'>
              {((stats.rejectedRequests / (stats.totalRequests || 1)) * 100).toFixed(0)}% tổng yêu cầu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform revenue card */}
      <Card className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-0'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-base font-bold text-purple-700'>
            Tổng hoa hồng nền tảng
          </CardTitle>
          <TrendingUp className='h-5 w-5 text-purple-600' />
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-purple-700'>
            {formatCurrency(stats.totalPlatformFee)}
          </div>
          <p className='text-sm text-purple-600 mt-2'>
            Từ tổng {formatCurrency(stats.totalAmount)} yêu cầu rút tiền (20% hoa hồng)
          </p>
          <div className='mt-3 pt-3 border-t border-purple-200'>
            <p className='text-sm text-gray-600'>
              Freelancer nhận: <span className='font-semibold text-green-600'>{formatCurrency(stats.totalNetAmount)}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
