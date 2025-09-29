import { useState } from 'react'
import { MoreHorizontal, Eye, Download, RefreshCw, DollarSign, CreditCard, Wallet } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  clientName?: string
  freelancer?: string
  projectTitle?: string
  paymentMethod: 'bank_transfer' | 'credit_card' | 'e_wallet' | 'crypto'
  fee: number
  netAmount: number
  description: string
  createdDate: string
  completedDate?: string
  failureReason?: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  onView?: (transaction: Transaction) => void
  onRefund?: (transactionId: string) => void
  onExport?: () => void
  onRefresh?: () => void
  isLoading?: boolean
}

export function TransactionTable({ 
  transactions, 
  onView, 
  onRefund, 
  onExport, 
  onRefresh,
  isLoading = false 
}: TransactionTableProps) {
  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'Nạp tiền'
      case 'withdrawal': return 'Rút tiền'
      case 'payment': return 'Thanh toán'
      case 'refund': return 'Hoàn tiền'
      case 'commission': return 'Hoa hồng'
      default: return type
    }
  }

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'bg-green-100 text-green-800'
      case 'withdrawal': return 'bg-red-100 text-red-800'
      case 'payment': return 'bg-blue-100 text-blue-800'
      case 'refund': return 'bg-yellow-100 text-yellow-800'
      case 'commission': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <DollarSign className="h-3 w-3" />
      case 'withdrawal': return <Wallet className="h-3 w-3" />
      case 'payment': return <CreditCard className="h-3 w-3" />
      case 'refund': return <RefreshCw className="h-3 w-3" />
      case 'commission': return <DollarSign className="h-3 w-3" />
      default: return null
    }
  }

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'pending': return 'Đang xử lý'
      case 'completed': return 'Hoàn thành'
      case 'failed': return 'Thất bại'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: Transaction['paymentMethod']) => {
    switch (method) {
      case 'bank_transfer': return 'Chuyển khoản'
      case 'credit_card': return 'Thẻ tín dụng'
      case 'e_wallet': return 'Ví điện tử'
      case 'crypto': return 'Tiền mã hóa'
      default: return method
    }
  }

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
          <p className="text-sm text-gray-600">Danh sách tất cả giao dịch trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã GD</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Khách hàng/Freelancer</TableHead>
              <TableHead>Dự án</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Phí</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(transaction.type)}
                    <Badge className={getTypeColor(transaction.type)}>
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Thực nhận: {formatCurrency(transaction.netAmount, transaction.currency)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>
                    {getStatusLabel(transaction.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {transaction.clientName && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {transaction.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{transaction.clientName}</span>
                      </div>
                    )}
                    {transaction.freelancer && (
                      <p className="text-xs text-gray-600">FL: {transaction.freelancer}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.projectTitle ? (
                    <p className="text-sm max-w-[200px] truncate" title={transaction.projectTitle}>
                      {transaction.projectTitle}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-400">Không có</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(transaction.fee, transaction.currency)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDateTime(transaction.createdDate)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(transaction)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Download receipt')}>
                        <Download className="mr-2 h-4 w-4" />
                        Tải biên lai
                      </DropdownMenuItem>
                      {transaction.status === 'completed' && 
                       transaction.type === 'payment' && (
                        <DropdownMenuItem 
                          onClick={() => onRefund?.(transaction.id)}
                          className="text-orange-600"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Hoàn tiền
                        </DropdownMenuItem>
                      )}
                      {transaction.status === 'failed' && transaction.failureReason && (
                        <DropdownMenuItem disabled>
                          <span className="text-xs text-red-600">
                            Lý do: {transaction.failureReason}
                          </span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Không có giao dịch nào</p>
        </div>
      )}
    </div>
  )
}