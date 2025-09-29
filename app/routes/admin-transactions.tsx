import { useState } from 'react'
import { Search, Filter, Download, DollarSign, TrendingUp, TrendingDown, CreditCard, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

export default function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data
  const stats = {
    totalRevenue: 2450000000,
    monthlyRevenue: 350000000,
    totalTransactions: 1247,
    pendingWithdrawals: 45000000
  }

  const transactions = [
    {
      id: 'TXN001',
      type: 'project_payment',
      amount: 15000000,
      fee: 2250000,
      netAmount: 12750000,
      status: 'completed',
      date: '2024-03-15',
      projectTitle: 'Thiết kế website bán hàng',
      client: 'Công ty ABC',
      freelancer: 'Nguyễn Văn An',
      paymentMethod: 'banking'
    },
    {
      id: 'TXN002',
      type: 'withdrawal',
      amount: 8000000,
      fee: 50000,
      netAmount: 7950000,
      status: 'pending',
      date: '2024-03-14',
      freelancer: 'Trần Thị Bình',
      paymentMethod: 'banking',
      bankAccount: '1234567890 - Vietcombank'
    },
    {
      id: 'TXN003',
      type: 'refund',
      amount: 5000000,
      fee: 0,
      netAmount: 5000000,
      status: 'processing',
      date: '2024-03-13',
      projectTitle: 'Phát triển app mobile',
      client: 'Startup XYZ',
      reason: 'Hủy dự án theo yêu cầu khách hàng'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Chờ xử lý'
      case 'processing': return 'Đang xử lý'
      case 'failed': return 'Thất bại'
      default: return 'Không xác định'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project_payment': return 'bg-blue-100 text-blue-800'
      case 'withdrawal': return 'bg-purple-100 text-purple-800'
      case 'refund': return 'bg-orange-100 text-orange-800'
      case 'deposit': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'project_payment': return 'Thanh toán dự án'
      case 'withdrawal': return 'Rút tiền'
      case 'refund': return 'Hoàn tiền'
      case 'deposit': return 'Nạp tiền'
      default: return 'Khác'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.freelancer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Giao dịch & Thanh toán</h1>
        <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả giao dịch tài chính</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.2% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTransactions)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15.3% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ rút tiền</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingWithdrawals)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">23 yêu cầu đang chờ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo mã GD, tên người dùng, dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="project_payment">Thanh toán dự án</SelectItem>
                <SelectItem value="withdrawal">Rút tiền</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
                <SelectItem value="deposit">Nạp tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc nâng cao
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phí</TableHead>
                  <TableHead>Thực nhận</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Chi tiết</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(transaction.type)}>
                        {getTypeText(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatCurrency(transaction.fee)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(transaction.netAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{transaction.date}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {transaction.projectTitle && (
                          <p className="text-sm font-medium">{transaction.projectTitle}</p>
                        )}
                        {transaction.client && (
                          <p className="text-xs text-gray-600">KH: {transaction.client}</p>
                        )}
                        {transaction.freelancer && (
                          <p className="text-xs text-gray-600">FL: {transaction.freelancer}</p>
                        )}
                        {transaction.bankAccount && (
                          <p className="text-xs text-gray-600">{transaction.bankAccount}</p>
                        )}
                        {transaction.reason && (
                          <p className="text-xs text-gray-600">{transaction.reason}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {transaction.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                Phê duyệt
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Từ chối
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            Tải hóa đơn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}