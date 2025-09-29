import { useState } from 'react'
import { Search, Filter, Eye, Check, X, Flag, AlertTriangle, MoreHorizontal, Shield, User, FileText } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export default function AdminContentModeration() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data
  const stats = {
    totalReports: 156,
    pendingReviews: 23,
    approvedToday: 45,
    violationsToday: 8
  }

  const contentItems = [
    {
      id: 'MOD001',
      type: 'project',
      title: 'Thiết kế website bán hàng online',
      author: 'Công ty ABC',
      authorType: 'client',
      status: 'pending',
      reportReason: 'Nội dung không phù hợp',
      reportedBy: 'Nguyễn Văn A',
      reportedDate: '2024-03-15',
      description: 'Thiết kế và phát triển website bán hàng trực tuyến với tích hợp thanh toán...',
      riskLevel: 'medium'
    },
    {
      id: 'MOD002',
      type: 'profile',
      title: 'Profile freelancer - Trần Thị B',
      author: 'Trần Thị Bình',
      authorType: 'freelancer',
      status: 'approved',
      reportReason: 'Thông tin sai lệch',
      reportedBy: 'Lê Văn C',
      reportedDate: '2024-03-14',
      description: 'Freelancer chuyên về thiết kế UI/UX với 5 năm kinh nghiệm...',
      riskLevel: 'low'
    },
    {
      id: 'MOD003',
      type: 'project',
      title: 'Phát triển ứng dụng mobile',
      author: 'Startup XYZ',
      authorType: 'client',
      status: 'rejected',
      reportReason: 'Spam, nội dung trùng lặp',
      reportedBy: 'Admin System',
      reportedDate: '2024-03-13',
      description: 'Cần phát triển ứng dụng mobile đa nền tảng...',
      riskLevel: 'high'
    },
    {
      id: 'MOD004',
      type: 'proposal',
      title: 'Đề xuất cho dự án Marketing',
      author: 'Lê Minh Cường',
      authorType: 'freelancer',
      status: 'pending',
      reportReason: 'Giá cả không hợp lý',
      reportedBy: 'Doanh nghiệp DEF',
      reportedDate: '2024-03-12',
      description: 'Đề xuất chiến lược marketing toàn diện cho doanh nghiệp...',
      riskLevel: 'low'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt'
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Từ chối'
      case 'under_review': return 'Đang xem xét'
      default: return 'Không xác định'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800'
      case 'profile': return 'bg-purple-100 text-purple-800'
      case 'proposal': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'project': return 'Dự án'
      case 'profile': return 'Hồ sơ'
      case 'proposal': return 'Đề xuất'
      case 'review': return 'Đánh giá'
      default: return 'Khác'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return 'Không xác định'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportReason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt nội dung</h1>
        <p className="text-gray-600 mt-1">Quản lý và kiểm duyệt nội dung trên nền tảng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReports)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">+12 báo cáo mới hôm nay</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.pendingReviews)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Cần xử lý ưu tiên</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.approvedToday)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">+15% so với hôm qua</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vi phạm hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.violationsToday)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-red-600">Cần theo dõi</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Báo cáo vi phạm</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề, tác giả, lý do báo cáo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Loại nội dung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="project">Dự án</SelectItem>
                    <SelectItem value="profile">Hồ sơ</SelectItem>
                    <SelectItem value="proposal">Đề xuất</SelectItem>
                    <SelectItem value="review">Đánh giá</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                    <SelectItem value="under_review">Đang xem xét</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc nâng cao
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách nội dung cần kiểm duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Lý do báo cáo</TableHead>
                      <TableHead>Mức độ rủi ro</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày báo cáo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(item.type)}>
                            {getTypeText(item.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {item.authorType === 'client' ? <FileText className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{item.author}</p>
                              <p className="text-xs text-gray-600">
                                {item.authorType === 'client' ? 'Khách hàng' : 'Freelancer'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{item.reportReason}</p>
                            <p className="text-xs text-gray-600">Bởi: {item.reportedBy}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getRiskColor(item.riskLevel)}`}>
                            {getRiskText(item.riskLevel)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{item.reportedDate}</TableCell>
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
                              {item.status === 'pending' && (
                                <>
                                  <DropdownMenuItem className="text-green-600">
                                    <Check className="w-4 h-4 mr-2" />
                                    Phê duyệt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <X className="w-4 h-4 mr-2" />
                                    Từ chối
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                <Flag className="w-4 h-4 mr-2" />
                                Đánh dấu vi phạm
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Liên hệ tác giả
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Tạm khóa nội dung
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {filteredItems.length} trong tổng số {contentItems.length} mục
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách nội dung chờ duyệt sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách nội dung đã được duyệt sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách nội dung đã bị từ chối sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}