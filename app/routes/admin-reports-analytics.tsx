import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download, Filter, RefreshCw, Eye } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Badge } from '~/components/ui/badge'

export default function AdminReportsAnalytics() {
  const [dateRange, setDateRange] = useState('7days')
  const [reportType, setReportType] = useState('overview')

  // Mock analytics data
  const overviewStats = {
    totalRevenue: 2456789000,
    totalUsers: 12456,
    totalProjects: 8234,
    activeFreelancers: 3456,
    revenueGrowth: 12.5,
    userGrowth: 8.3,
    projectGrowth: 15.2,
    freelancerGrowth: 6.7
  }

  const chartData = {
    revenue: [
      { month: 'Jan', value: 180000000 },
      { month: 'Feb', value: 195000000 },
      { month: 'Mar', value: 220000000 },
      { month: 'Apr', value: 235000000 },
      { month: 'May', value: 245000000 },
      { month: 'Jun', value: 280000000 },
    ],
    users: [
      { month: 'Jan', freelancers: 2800, clients: 1200 },
      { month: 'Feb', freelancers: 2950, clients: 1350 },
      { month: 'Mar', freelancers: 3100, clients: 1450 },
      { month: 'Apr', freelancers: 3200, clients: 1580 },
      { month: 'May', freelancers: 3350, clients: 1670 },
      { month: 'Jun', freelancers: 3456, clients: 1789 },
    ],
    projects: [
      { category: 'Web Development', count: 2340, percentage: 28.4 },
      { category: 'Mobile App', count: 1876, percentage: 22.8 },
      { category: 'UI/UX Design', count: 1654, percentage: 20.1 },
      { category: 'Content Writing', count: 1234, percentage: 15.0 },
      { category: 'Digital Marketing', count: 987, percentage: 12.0 },
      { category: 'Others', count: 143, percentage: 1.7 },
    ]
  }

  const topPerformers = {
    freelancers: [
      { name: 'Nguyễn Văn A', rating: 4.9, projects: 45, revenue: 125000000 },
      { name: 'Trần Thị B', rating: 4.8, projects: 38, revenue: 98000000 },
      { name: 'Lê Minh C', rating: 4.7, projects: 42, revenue: 87000000 },
      { name: 'Phạm Thu D', rating: 4.9, projects: 31, revenue: 76000000 },
      { name: 'Hoàng Văn E', rating: 4.6, projects: 39, revenue: 72000000 },
    ],
    clients: [
      { name: 'Công ty ABC', projects: 23, totalSpent: 450000000 },
      { name: 'Startup XYZ', projects: 18, totalSpent: 320000000 },
      { name: 'Doanh nghiệp DEF', projects: 15, totalSpent: 275000000 },
      { name: 'Tập đoàn GHI', projects: 12, totalSpent: 230000000 },
      { name: 'Công ty JKL', projects: 19, totalSpent: 198000000 },
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const GrowthIcon = ({ growth }: { growth: number }) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  // Mock chart component (in real app, use recharts or similar)
  const SimpleBarChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm w-12">{item.month || item.category}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(item.value || item.count || item.percentage) / Math.max(...data.map(d => d.value || d.count || d.percentage)) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-20 text-right">
              {item.value ? formatCurrency(item.value) : item.count ? formatNumber(item.count) : `${item.percentage}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
          <p className="text-gray-600 mt-1">Thống kê hiệu suất và dữ liệu kinh doanh</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">3 tháng qua</SelectItem>
              <SelectItem value="1year">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overviewStats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <GrowthIcon growth={overviewStats.revenueGrowth} />
              <span className={`text-sm ml-1 ${getGrowthColor(overviewStats.revenueGrowth)}`}>
                {overviewStats.revenueGrowth > 0 ? '+' : ''}{overviewStats.revenueGrowth}%
              </span>
              <span className="text-sm text-gray-600 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(overviewStats.totalUsers)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <GrowthIcon growth={overviewStats.userGrowth} />
              <span className={`text-sm ml-1 ${getGrowthColor(overviewStats.userGrowth)}`}>
                {overviewStats.userGrowth > 0 ? '+' : ''}{overviewStats.userGrowth}%
              </span>
              <span className="text-sm text-gray-600 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng dự án</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(overviewStats.totalProjects)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <GrowthIcon growth={overviewStats.projectGrowth} />
              <span className={`text-sm ml-1 ${getGrowthColor(overviewStats.projectGrowth)}`}>
                {overviewStats.projectGrowth > 0 ? '+' : ''}{overviewStats.projectGrowth}%
              </span>
              <span className="text-sm text-gray-600 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Freelancer hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(overviewStats.activeFreelancers)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <GrowthIcon growth={overviewStats.freelancerGrowth} />
              <span className={`text-sm ml-1 ${getGrowthColor(overviewStats.freelancerGrowth)}`}>
                {overviewStats.freelancerGrowth > 0 ? '+' : ''}{overviewStats.freelancerGrowth}%
              </span>
              <span className="text-sm text-gray-600 ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="projects">Dự án</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={chartData.revenue} title="Doanh thu (VNĐ)" />
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Freelancers</h4>
                    <div className="space-y-2">
                      {chartData.users.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm w-12">{item.month}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.freelancers / 3500 * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">{formatNumber(item.freelancers)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Clients</h4>
                    <div className="space-y-2">
                      {chartData.users.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm w-12">{item.month}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${item.clients / 1800 * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">{formatNumber(item.clients)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố dự án theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData.projects} title="Số lượng dự án" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Hoa hồng từ dự án</span>
                    <span className="font-medium">{formatCurrency(220000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Phí subscription</span>
                    <span className="font-medium">{formatCurrency(45000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Phí quảng cáo</span>
                    <span className="font-medium">{formatCurrency(15000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded bg-gray-50">
                    <span className="font-medium">Tổng cộng</span>
                    <span className="font-bold text-lg">{formatCurrency(280000000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>So sánh doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tháng này</span>
                      <span className="text-green-600 font-medium">280,000,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tháng trước</span>
                      <span>245,000,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cùng kỳ năm trước</span>
                      <span>195,000,000 VNĐ</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>Tăng trưởng MoM</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +14.3%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Tăng trưởng YoY</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +43.6%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Freelancers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.freelancers.map((freelancer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{freelancer.name}</p>
                          <p className="text-sm text-gray-600">{freelancer.projects} dự án • ⭐ {freelancer.rating}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(freelancer.revenue)}</p>
                        <p className="text-sm text-gray-600">Doanh thu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.clients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.projects} dự án</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(client.totalSpent)}</p>
                        <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái dự án</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Đang thực hiện</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">2,340</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hoàn thành</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">5,234</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đã hủy</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">456</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đang đấu thầu</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">204</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phạm vi ngân sách</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>&lt; 5 triệu</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>5-20 triệu</span>
                    <span className="font-medium">2,876</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>20-50 triệu</span>
                    <span className="font-medium">1,987</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>50-100 triệu</span>
                    <span className="font-medium">845</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>&gt; 100 triệu</span>
                    <span className="font-medium">292</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Đúng hạn</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chậm 1-7 ngày</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chậm &gt; 7 ngày</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">7%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Metrics hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Thời gian phản hồi TB</span>
                    <span className="font-medium text-green-600">0.45s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Uptime</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Tỷ lệ lỗi</span>
                    <span className="font-medium text-green-600">0.1%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Số phiên đồng thời</span>
                    <span className="font-medium">2,456</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ chuyển đổi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Đăng ký → Đăng dự án</span>
                    <span className="font-medium">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Dự án → Thuê freelancer</span>
                    <span className="font-medium">67.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Thanh toán thành công</span>
                    <span className="font-medium">98.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Đánh giá tích cực</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}