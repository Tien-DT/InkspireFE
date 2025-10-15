import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Banknote, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function WithdrawRequestStatsCards() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmount: 0,
    pendingAmount: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/WithdrawRequests?$select=id,status,amount`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const requests = data.value || data

        const stats = {
          totalRequests: requests.length,
          pendingRequests: requests.filter((r: any) => r.status === 0).length,
          approvedRequests: requests.filter((r: any) => r.status === 1).length,
          rejectedRequests: requests.filter((r: any) => r.status === 2).length,
          totalAmount: requests.reduce((sum: number, r: any) => sum + (r.amount || 0), 0),
          pendingAmount: requests
            .filter((r: any) => r.status === 0)
            .reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
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
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tổng yêu cầu</CardTitle>
          <Banknote className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalRequests}</div>
          <p className='text-xs text-muted-foreground'>Tổng số tiền: {formatCurrency(stats.totalAmount)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Chờ xử lý</CardTitle>
          <Clock className='h-4 w-4 text-yellow-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.pendingRequests}</div>
          <p className='text-xs text-muted-foreground'>Số tiền: {formatCurrency(stats.pendingAmount)}</p>
        </CardContent>
      </Card>

      <Card>
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

      <Card>
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
  )
}
