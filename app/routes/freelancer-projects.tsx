import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Star, 
  Users 
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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

export default function FreelancerProjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: "Thiết kế website bán hàng online",
      client: "Công ty ABC",
      clientRating: 4.8,
      status: "in-progress",
      priority: "high",
      progress: 75,
      startDate: "2024-01-15",
      deadline: "2024-02-15",
      budget: 15000000,
      description: "Thiết kế và phát triển website bán hàng trực tuyến với tích hợp thanh toán và quản lý kho hàng",
      skills: ["UI/UX Design", "Frontend", "Backend"],
      messages: 12,
      lastMessage: "2 giờ trước"
    },
    {
      id: 2,
      title: "Viết content cho campaign marketing",
      client: "Shop XYZ",
      clientRating: 4.5,
      status: "review",
      priority: "medium",
      progress: 100,
      startDate: "2024-01-20",
      deadline: "2024-02-10",
      budget: 8000000,
      description: "Tạo nội dung marketing cho campaign quảng bá sản phẩm mới",
      skills: ["Content Writing", "SEO", "Marketing"],
      messages: 8,
      lastMessage: "1 ngày trước"
    },
    {
      id: 3,
      title: "Phát triển ứng dụng mobile",
      client: "Startup DEF",
      clientRating: 5.0,
      status: "completed",
      priority: "high",
      progress: 100,
      startDate: "2023-12-01",
      deadline: "2024-01-30",
      budget: 25000000,
      description: "Phát triển ứng dụng mobile iOS và Android cho quản lý tài chính cá nhân",
      skills: ["React Native", "Mobile Development", "API Integration"],
      messages: 25,
      lastMessage: "3 ngày trước"
    },
    {
      id: 4,
      title: "Tối ưu SEO website",
      client: "Agency GHI",
      clientRating: 4.2,
      status: "proposal",
      priority: "low",
      progress: 0,
      startDate: "",
      deadline: "2024-03-01",
      budget: 12000000,
      description: "Tối ưu hóa SEO và tăng thứ hạng từ khóa cho website doanh nghiệp",
      skills: ["SEO", "Google Analytics", "Content Strategy"],
      messages: 3,
      lastMessage: "5 giờ trước"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'proposal': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Đang thực hiện'
      case 'review': return 'Chờ duyệt'
      case 'completed': return 'Hoàn thành'
      case 'proposal': return 'Đề xuất'
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const projectsByStatus = {
    all: projects.length,
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    review: projects.filter(p => p.status === 'review').length,
    completed: projects.filter(p => p.status === 'completed').length,
    proposal: projects.filter(p => p.status === 'proposal').length
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý dự án</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả dự án freelancer của bạn</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Dự án mới
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm dự án, khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({projectsByStatus.all})</SelectItem>
                  <SelectItem value="proposal">Đề xuất ({projectsByStatus.proposal})</SelectItem>
                  <SelectItem value="in-progress">Đang thực hiện ({projectsByStatus['in-progress']})</SelectItem>
                  <SelectItem value="review">Chờ duyệt ({projectsByStatus.review})</SelectItem>
                  <SelectItem value="completed">Hoàn thành ({projectsByStatus.completed})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Tab View */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Dạng lưới</TabsTrigger>
          <TabsTrigger value="list">Dạng danh sách</TabsTrigger>
        </TabsList>

        {/* Grid View */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getStatusColor(project.status)}>
                          {getStatusText(project.status)}
                        </Badge>
                        <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority === 'high' ? 'Cao' : project.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
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
                        <DropdownMenuItem>Tạo báo cáo</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Client Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.client}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{project.clientRating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.skills.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Progress */}
                  {project.status !== 'proposal' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{project.deadline}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(project.budget)}</span>
                  </div>

                  {/* Messages */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{project.messages} tin nhắn</span>
                    <span>Cập nhật: {project.lastMessage}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                              <Badge variant="secondary" className={getStatusColor(project.status)}>
                                {getStatusText(project.status)}
                              </Badge>
                              <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                                {project.priority === 'high' ? 'Cao' : project.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{project.client}</span>
                                <div className="flex items-center ml-2">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="ml-1">{project.clientRating}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Deadline: {project.deadline}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatCurrency(project.budget)}</span>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Progress */}
                          {project.status !== 'proposal' && (
                            <div className="w-32">
                              <div className="text-right mb-1">
                                <span className="text-sm font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}
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
                          <DropdownMenuItem>Tạo báo cáo</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}