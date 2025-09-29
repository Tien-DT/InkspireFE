import { useState } from 'react'
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, User, Phone, Mail, MoreHorizontal, Reply, Paperclip, Star } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Textarea } from '~/components/ui/textarea'

export default function AdminSupportFeedback() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  // Mock data
  const stats = {
    totalTickets: 324,
    openTickets: 45,
    resolvedToday: 28,
    avgResponseTime: '2.5 giờ'
  }

  const supportTickets = [
    {
      id: 'TK001',
      subject: 'Không thể thanh toán qua MoMo',
      customer: 'Nguyễn Văn An',
      customerType: 'client',
      email: 'anvn@example.com',
      phone: '0123456789',
      priority: 'high',
      status: 'open',
      category: 'payment',
      createdDate: '2024-03-15 14:30',
      lastUpdate: '2024-03-15 16:45',
      assignedTo: 'Trần Thị Mai',
      description: 'Tôi gặp lỗi khi thanh toán qua MoMo cho dự án web design. Hệ thống báo lỗi "Giao dịch thất bại" nhưng tiền đã bị trừ.',
      messages: 3,
      satisfaction: null
    },
    {
      id: 'TK002',
      subject: 'Tài khoản bị khóa không rõ lý do',
      customer: 'Lê Thị Bình',
      customerType: 'freelancer',
      email: 'binhlt@example.com',
      phone: '0987654321',
      priority: 'medium',
      status: 'pending',
      category: 'account',
      createdDate: '2024-03-14 09:15',
      lastUpdate: '2024-03-14 11:30',
      assignedTo: 'Phạm Văn Long',
      description: 'Tài khoản freelancer của tôi bị khóa đột ngột mà không có thông báo trước. Tôi cần được giải thích lý do.',
      messages: 5,
      satisfaction: null
    },
    {
      id: 'TK003',
      subject: 'Freelancer không hoàn thành công việc',
      customer: 'Công ty ABC',
      customerType: 'client',
      email: 'contact@abc.com',
      phone: '0369741258',
      priority: 'medium',
      status: 'resolved',
      category: 'dispute',
      createdDate: '2024-03-13 16:20',
      lastUpdate: '2024-03-14 10:00',
      assignedTo: 'Nguyễn Thu Hà',
      description: 'Freelancer đã nhận project nhưng không hoàn thành trong thời hạn và không phản hồi tin nhắn.',
      messages: 8,
      satisfaction: 4
    },
    {
      id: 'TK004',
      subject: 'Cần hỗ trợ sử dụng tính năng mới',
      customer: 'Đỗ Minh Tuấn',
      customerType: 'freelancer',
      email: 'tuandm@example.com',
      phone: '0147258369',
      priority: 'low',
      status: 'open',
      category: 'support',
      createdDate: '2024-03-12 13:45',
      lastUpdate: '2024-03-13 09:20',
      assignedTo: 'Vũ Thị Lan',
      description: 'Tôi cần hướng dẫn sử dụng tính năng tạo portfolio mới trên platform.',
      messages: 2,
      satisfaction: null
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Đang mở'
      case 'pending': return 'Chờ xử lý'
      case 'resolved': return 'Đã giải quyết'
      case 'closed': return 'Đã đóng'
      default: return 'Không xác định'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'bg-purple-100 text-purple-800'
      case 'account': return 'bg-blue-100 text-blue-800'
      case 'dispute': return 'bg-red-100 text-red-800'
      case 'support': return 'bg-green-100 text-green-800'
      case 'technical': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'payment': return 'Thanh toán'
      case 'account': return 'Tài khoản'
      case 'dispute': return 'Tranh chấp'
      case 'support': return 'Hỗ trợ'
      case 'technical': return 'Kỹ thuật'
      default: return 'Khác'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const renderSatisfactionStars = (rating: number | null) => {
    if (rating === null) return <span className="text-xs text-gray-400">Chưa đánh giá</span>
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ & Phản hồi</h1>
        <p className="text-gray-600 mt-1">Quản lý yêu cầu hỗ trợ và phản hồi từ người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng ticket</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTickets)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">+8 ticket mới hôm nay</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang mở</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.openTickets)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-red-600">Cần xử lý ưu tiên</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giải quyết hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.resolvedToday)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">+20% so với hôm qua</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thời gian phản hồi TB</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">Cải thiện 0.5h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tất cả ticket</TabsTrigger>
          <TabsTrigger value="open">Đang mở</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="resolved">Đã giải quyết</TabsTrigger>
          <TabsTrigger value="knowledge">Kiến thức</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề, khách hàng, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="open">Đang mở</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc nâng cao
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu hỗ trợ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Ưu tiên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Người xử lý</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{ticket.subject}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <MessageSquare className="w-3 h-3" />
                              <span>{ticket.messages} tin nhắn</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{ticket.customer}</p>
                              <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span>{ticket.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{ticket.assignedTo}</TableCell>
                        <TableCell>
                          {renderSatisfactionStars(ticket.satisfaction)}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{ticket.createdDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedTicket(ticket.id)}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="w-4 h-4 mr-2" />
                                Trả lời
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="w-4 h-4 mr-2" />
                                Gán cho nhân viên
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="w-4 h-4 mr-2" />
                                Gọi điện thoại
                              </DropdownMenuItem>
                              {ticket.status !== 'resolved' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Đánh dấu đã giải quyết
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {filteredTickets.length} trong tổng số {supportTickets.length} ticket
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

        <TabsContent value="open">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách ticket đang mở sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách ticket chờ xử lý sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách ticket đã giải quyết sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Cơ sở tri thức và FAQ sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Response Templates */}
      {selectedTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Mẫu phản hồi nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="text-left justify-start h-auto p-4">
                <div>
                  <p className="font-medium">Đã tiếp nhận yêu cầu</p>
                  <p className="text-sm text-gray-600 mt-1">Chúng tôi đã tiếp nhận yêu cầu của bạn và sẽ xử lý trong thời gian sớm nhất.</p>
                </div>
              </Button>
              <Button variant="outline" className="text-left justify-start h-auto p-4">
                <div>
                  <p className="font-medium">Cần thêm thông tin</p>
                  <p className="text-sm text-gray-600 mt-1">Để hỗ trợ bạn tốt hơn, vui lòng cung cấp thêm thông tin chi tiết.</p>
                </div>
              </Button>
              <Button variant="outline" className="text-left justify-start h-auto p-4">
                <div>
                  <p className="font-medium">Đã giải quyết</p>
                  <p className="text-sm text-gray-600 mt-1">Vấn đề của bạn đã được giải quyết. Vui lòng kiểm tra và phản hồi.</p>
                </div>
              </Button>
              <Button variant="outline" className="text-left justify-start h-auto p-4">
                <div>
                  <p className="font-medium">Chuyển đến chuyên viên</p>
                  <p className="text-sm text-gray-600 mt-1">Chúng tôi sẽ chuyển yêu cầu của bạn đến chuyên viên phù hợp.</p>
                </div>
              </Button>
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Nhập phản hồi của bạn..."
                className="min-h-24"
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Đính kèm file
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Lưu nháp
                  </Button>
                  <Button size="sm">
                    Gửi phản hồi
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}