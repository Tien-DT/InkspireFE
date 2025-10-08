import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Download, MoreHorizontal } from 'lucide-react'

type TransactionStatus = 'Hoàn thành' | 'Đang xử lý' | 'Đang chờ xét'

type TransactionRecord = {
  id: string
  type: string
  amount: string
  from: string
  to: string
  status: TransactionStatus
  date: string
}

const transactions: TransactionRecord[] = [
  {
    id: 'GD-001',
    type: 'Thanh toán',
    amount: '60.000.000đ',
    from: 'Công ty TNHH TechCorp',
    to: 'Nguyễn Văn An',
    status: 'Hoàn thành',
    date: '15/03/2024'
  },
  {
    id: 'GD-002',
    type: 'Rút tiền',
    amount: '30.000.000đ',
    from: 'Trần Thị Bình',
    to: 'Tài khoản ngân hàng',
    status: 'Đang xử lý',
    date: '14/03/2024'
  },
  {
    id: 'GD-003',
    type: 'Hoàn tiền',
    amount: '20.000.000đ',
    from: 'Hân Hằng',
    to: 'Marketing Pro',
    status: 'Đang xử lý',
    date: '13/03/2024'
  },
  {
    id: 'GD-004',
    type: 'Thanh toán',
    amount: '75.000.000đ',
    from: 'StartupXYZ',
    to: 'Lê Minh Cường',
    status: 'Đang chờ xét',
    date: '12/03/2024'
  }
]

const statusMap: Record<TransactionStatus, { label: string; className: string }> = {
  'Hoàn thành': { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700' },
  'Đang xử lý': { label: 'Đang xử lý', className: 'bg-amber-100 text-amber-700' },
  'Đang chờ xét': { label: 'Đang chờ xét', className: 'bg-rose-100 text-rose-700' }
}

const totalPages = 12

export function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1)

  const changePage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
      <CardHeader className='flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-lg font-semibold text-slate-900'>Lịch sử giao dịch</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button variant='outline' size='sm' className='gap-2'>
            <Download className='h-4 w-4' />
            Xuất báo cáo
          </Button>
          <Select defaultValue='all-types'>
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
          <Select defaultValue='all-status'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-status'>Tất cả trạng thái</SelectItem>
              <SelectItem value='completed'>Hoàn thành</SelectItem>
              <SelectItem value='processing'>Đang xử lý</SelectItem>
              <SelectItem value='pending'>Đang chờ xét</SelectItem>
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
