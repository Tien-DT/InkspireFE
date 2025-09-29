import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  MoreHorizontal, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [stats] = useState({
    totalUsers: 12847,
    freelancers: 8234,
    clients: 4613,
    pendingApproval: 47
  })

  const users = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@example.com',
      role: 'freelancer',
      status: 'pending',
      joinDate: '15/01/2024',
      projects: 0,
      rating: null
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'tranthibinh@example.com',
      role: 'client',
      status: 'pending',
      joinDate: '20/02/2024',
      projects: 0,
      rating: null
    },
    {
      id: 3,
      name: 'Lê Minh Cường',
      email: 'leminhcuong@example.com',
      role: 'freelancer',
      status: 'suspended',
      joinDate: '10/11/2023',
      projects: 8,
      rating: 2.5
    },
    {
      id: 4,
      name: 'Lê Minh Tú',
      email: 'leminhtu@example.com',
      role: 'freelancer',
      status: 'suspended',
      joinDate: '10/11/2023',
      projects: 8,
      rating: 3.2
    },
    {
      id: 5,
      name: 'Nguyễn Văn Tuấn',
      email: 'nguyenvantuan@example.com',
      role: 'freelancer',
      status: 'active',
      joinDate: '15/01/2024',
      projects: 12,
      rating: 4.8
    },
    {
      id: 6,
      name: 'Trần Thị Nhung',
      email: 'tranthinhung@example.com',
      role: 'client',
      status: 'active',
      joinDate: '20/02/2024',
      projects: 5,
      rating: 4.9
    },
    {
      id: 7,
      name: 'Phạm Thu Hương',
      email: 'phamthuhuong@example.com',
      role: 'client',
      status: 'active',
      joinDate: '01/03/2024',
      projects: 5,
      rating: 4.8
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'pending': return 'Chờ duyệt'
      case 'suspended': return 'Tạm khóa'
      default: return 'Không xác định'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'freelancer': return 'Freelancer'
      case 'client': return 'Khách hàng'
      default: return 'Không xác định'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'freelancer': return 'bg-blue-100 text-blue-800'
      case 'client': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / 10)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600">Quản lý và giám sát người dùng nền tảng</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
              <p className="text-sm text-gray-600 mt-1">Tổng người dùng</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.freelancers)}</p>
              <p className="text-sm text-gray-600 mt-1">Freelancer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.clients)}</p>
              <p className="text-sm text-gray-600 mt-1">Khách hàng</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.pendingApproval}</p>
              <p className="text-sm text-gray-600 mt-1">Chờ phê duyệt</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="client">Khách hàng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Dự án</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRoleColor(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.joinDate}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.projects}
                    </TableCell>
                    <TableCell>
                      {user.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{user.rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          {user.status === 'pending' && (
                            <DropdownMenuItem>Phê duyệt</DropdownMenuItem>
                          )}
                          {user.status === 'active' && (
                            <DropdownMenuItem>Tạm khóa</DropdownMenuItem>
                          )}
                          {user.status === 'suspended' && (
                            <DropdownMenuItem>Kích hoạt</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}