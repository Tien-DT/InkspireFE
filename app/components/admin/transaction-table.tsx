import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Download, MoreHorizontal } from 'lucide-react'
import { adminApi, type AdminTransaction } from '~/apis/admin.api'

type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Cancelled' | 'Unknown'

type TransactionRecord = {
  id: string
  type: string
  amount: string
  from: string
  to: string
  status: TransactionStatus
  date: string
}

const statusMap: Record<TransactionStatus, { label: string; className: string }> = {
  'Completed': { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700' },
  'Pending': { label: 'Đang xử lý', className: 'bg-amber-100 text-amber-700' },
  'Failed': { label: 'Thất bại', className: 'bg-rose-100 text-rose-700' },
  'Cancelled': { label: 'Đã hủy', className: 'bg-gray-100 text-gray-700' },
  'Unknown': { label: 'Không xác định', className: 'bg-gray-100 text-gray-700' }
}

export function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    status: undefined as string | undefined
  })

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getTransactions({
        page: currentPage,
        pageSize: 10,
        type: filters.type,
        status: filters.status
      })
      
      if (response.data) {
        const formattedTransactions = response.data.items.map((t: AdminTransaction) => ({
          id: t.id,
          type: t.type,
          amount: `${t.amount.toLocaleString('vi-VN')}đ`,
          from: t.fromUserName,
          to: t.toUserName,
          status: t.status as TransactionStatus,
          date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('vi-VN') : 'N/A'
        }))
        setTransactions(formattedTransactions)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setTransactions([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
  }

  const handleTypeFilter = (value: string) => {
    setFilters(prev => ({ ...prev, type: value === 'all-types' ? undefined : value }))
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value === 'all-status' ? undefined : value }))
    setCurrentPage(1)
  }

  const handleExportReport = async () => {
    try {
      const blob = await adminApi.exportTransactionsReport({ format: 'xlsx' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_report_${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  if (loading) {
    return (
      <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-96 animate-pulse bg-gray-200 rounded'></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
      <CardHeader className='flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-lg font-semibold text-slate-900'>Lịch sử giao dịch</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button variant='outline' size='sm' className='gap-2' onClick={handleExportReport}>
            <Download className='h-4 w-4' />
            Xuất báo cáo
          </Button>
          <Select defaultValue='all-types' onValueChange={handleTypeFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả loại' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-types'>Tất cả loại</SelectItem>
              <SelectItem value='payment'>Thanh toán</SelectItem>
              <SelectItem value='withdrawal'>Rút tiền</SelectItem>
              <SelectItem value='refund'>Hoàn tiền</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue='all-status' onValueChange={handleStatusFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-status'>Tất cả trạng thái</SelectItem>
              <SelectItem value='Completed'>Hoàn thành</SelectItem>
              <SelectItem value='Pending'>Đang xử lý</SelectItem>
              <SelectItem value='Failed'>Thất bại</SelectItem>
              <SelectItem value='Cancelled'>Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border/40 text-sm text-muted-foreground'>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Từ</TableHead>
                <TableHead>Đến</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const status = statusMap[transaction.status]
                return (
                  <TableRow key={transaction.id} className='border-border/40 text-sm'>
                    <TableCell className='font-medium text-slate-900'>{transaction.id}</TableCell>
                    <TableCell className='text-slate-700'>{transaction.type}</TableCell>
                    <TableCell className='font-semibold text-slate-900'>{transaction.amount}</TableCell>
                    <TableCell className='text-slate-700'>{transaction.from}</TableCell>
                    <TableCell className='text-slate-700'>{transaction.to}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className={`border-transparent px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-slate-600'>{transaction.date}</TableCell>
                    <TableCell>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className='mt-6 flex justify-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage > 1) {
                      changePage(currentPage - 1)
                    }
                  }}
                />
              </PaginationItem>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href='#'
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault()
                      changePage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href='#'
                  isActive={currentPage === totalPages}
                  onClick={(event) => {
                    event.preventDefault()
                    changePage(totalPages)
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage < totalPages) {
                      changePage(currentPage + 1)
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
