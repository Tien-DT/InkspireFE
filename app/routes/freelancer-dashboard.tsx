import { useState } from 'react'
import { 
  Bell, 
  Calendar, 
  Clock, 
  DollarSign, 
  Eye, 
  FileText, 
  MoreHorizontal, 
  Star, 
  TrendingUp, 
  Users 
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Progress } from '~/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function FreelancerDashboard() {
  const [stats] = useState({
    totalEarnings: 45000000,
    activeProjects: 8,
    completedProjects: 127,
    averageRating: 4.9,
    totalReviews: 89,
    profileViews: 1247
  })

  const recentProjects = [
    {
      id: 1,
      title: "Thiết kế website bán hàng online",
      client: "Công ty ABC",
      clientAvatar: "/placeholder-avatar.jpg",
      status: "in-progress",
      progress: 75,
      deadline: "2024-02-15",
      budget: 15000000,
      priority: "high"
    },
    {
      id: 2,
      title: "Viết content cho campaign marketing",
      client: "Shop XYZ", 
      clientAvatar: "/placeholder-avatar.jpg",
      status: "review",
      progress: 100,
      deadline: "2024-02-10",
      budget: 8000000,
      priority: "medium"
    },
    {
      id: 3,
      title: "Phát triển ứng dụng mobile",
      client: "Startup DEF",
      clientAvatar: "/placeholder-avatar.jpg", 
      status: "completed",
      progress: 100,
      deadline: "2024-01-30",
      budget: 25000000,
      priority: "high"
    }
  ]

  const notifications = [
    {
      id: 1,
      type: "project",
      message: "Dự án 'Thiết kế website' có cập nhật mới",
      time: "2 giờ trước",
      isRead: false
    },
    {
      id: 2,
      type: "payment",
      message: "Đã nhận thanh toán 8,000,000 VNĐ",
      time: "5 giờ trước", 
      isRead: false
    },
    {
      id: 3,
      type: "review",
      message: "Nhận được đánh giá 5 sao từ khách hàng",
      time: "1 ngày trước",
      isRead: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Đang thực hiện'
      case 'review': return 'Chờ duyệt'
      case 'completed': return 'Hoàn thành'
      default: return 'Không xác định'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại, Nguyễn Văn An!</h1>
        <p className="text-gray-600">Đây là tổng quan về hoạt động freelancer của bạn hôm nay.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thu nhập</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dự án đang làm</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                <p className="text-xs text-blue-600 mt-1">3 dự án sắp deadline</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dự án hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                <p className="text-xs text-purple-600 mt-1">Tỷ lệ hoàn thành: 98%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-xs text-gray-600 mt-1">{stats.totalReviews} đánh giá</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dự án gần đây</CardTitle>
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{project.client}</span>
                          <Badge variant="secondary" className={getStatusColor(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuItem>Liên hệ khách hàng</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Deadline: {project.deadline}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
                          <span className={getPriorityColor(project.priority)}>
                            {project.priority === 'high' ? 'Cao' : project.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(project.budget)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt hồ sơ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stats.profileViews}</p>
                    <p className="text-sm text-gray-600">Lượt xem hồ sơ</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">98%</p>
                    <p className="text-sm text-gray-600">Tỷ lệ phản hồi</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full" size="sm">
                    Tối ưu hóa hồ sơ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thông báo</CardTitle>
                <Badge variant="secondary">{notifications.filter(n => !n.isRead).length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${!notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-400'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Xem tất cả thông báo
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Tạo dự án mới
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Tìm khách hàng
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Xem đánh giá
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Quản lý thu nhập
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}