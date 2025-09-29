import { useState } from 'react'
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 12847,
    freelancers: 8234,
    clients: 4613,
    activeProjects: 1234,
    inProgress: 856,
    pendingReview: 378,
    monthlyRevenue: 1320000000,
    commission: 750000000,
    premium: 350000000,
    advertising: 150000000,
    pendingApproval: 47,
    projects: 23,
    profiles: 24
  })

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'Freelancer mới đăng ký: Nguyễn Văn An',
      time: '2 phút trước',
      isNew: true
    },
    {
      id: 2,
      type: 'report',
      message: 'Dự án bị báo cáo: Thiết kế website bán hàng',
      time: '15 phút trước',
      isNew: true
    },
    {
      id: 3,
      type: 'payment',
      message: 'Tranh chấp thanh toán đã giải quyết: 60.000.000₫',
      time: '1 giờ trước',
      isNew: false
    },
    {
      id: 4,
      type: 'content',
      message: 'Nội dung đã bị xóa: Bình luận không phù hợp',
      time: '2 giờ trước',
      isNew: false
    },
    {
      id: 5,
      type: 'premium',
      message: 'Gói Premium được kích hoạt: Trần Thị Bình',
      time: '3 giờ trước',
      isNew: false
    }
  ]

  const quickActions = [
    {
      id: 1,
      title: 'Xem xét nội dung bị báo cáo',
      count: 12,
      action: 'Xem xét'
    },
    {
      id: 2,
      title: 'Phê duyệt dự án chờ duyệt',
      count: 23,
      action: 'Xem xét'
    },
    {
      id: 3,
      title: 'Xử lý yêu cầu rút tiền',
      count: 8,
      action: 'Xem xét'
    },
    {
      id: 4,
      title: 'Xác minh người dùng mới',
      count: 15,
      action: 'Xem xét'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan bảng điều khiển</h1>
        <p className="text-gray-600">Chào mừng trở lại!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Freelancer</span>
                <span className="font-medium">{formatNumber(stats.freelancers)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Khách hàng</span>
                <span className="font-medium">{formatNumber(stats.clients)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dự án đang hoạt động</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.activeProjects)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Đang thực hiện</span>
                <span className="font-medium">{formatNumber(stats.inProgress)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Chờ duyệt</span>
                <span className="font-medium">{formatNumber(stats.pendingReview)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+15%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hoa hồng</span>
                <span className="font-medium">{formatCurrency(stats.commission)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Premium</span>
                <span className="font-medium">{formatCurrency(stats.premium)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Advertising</span>
                <span className="font-medium">{formatCurrency(stats.advertising)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approval */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ phê duyệt</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApproval}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-red-600 mr-1 rotate-180" />
                  <span className="text-xs text-red-600 font-medium">-5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dự án</span>
                <span className="font-medium">{stats.projects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hồ sơ</span>
                <span className="font-medium">{stats.profiles}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <p className="text-sm text-gray-600">Các hoạt động và sự kiện mới nhất trên nền tảng</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.isNew ? 'bg-blue-600' : 'bg-gray-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <p className="text-sm text-gray-600">Các mục cần sự chú ý của bạn</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Badge variant="destructive" className="w-8 h-6 flex items-center justify-center">
                      {action.count}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">{action.title}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    {action.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}