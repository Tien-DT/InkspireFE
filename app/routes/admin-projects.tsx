import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar,
  MoreHorizontal, 
  Clock,
  DollarSign,
  TrendingUp,
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
import { Progress } from '~/components/ui/progress'

export default function AdminProjectManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [stats] = useState({
    totalProjects: 1234,
    activeProjects: 892,
    completedProjects: 342,
    totalRevenue: 1320000000
  })

  const projects = [
    {
      id: 1,
      title: 'Thiết kế UI/UX cho ứng dụng di động',
      client: 'Công ty ABC Tech',
      freelancer: 'Nguyễn Văn An',
      category: 'ui-ux',
      status: 'in-progress',
      budget: 15000000,
      startDate: '10/03/2024',
      deadline: '25/03/2024',
      progress: 75,
      proposalCount: 12
    },
    {
      id: 2,
      title: 'Phát triển website thương mại điện tử',
      client: 'Cửa hàng XYZ',
      freelancer: 'Trần Thị Bình',
      category: 'web-development',
      status: 'completed',
      budget: 45000000,
      startDate: '01/02/2024',
      deadline: '28/02/2024',
      progress: 100,
      proposalCount: 8
    },
    {
      id: 3,
      title: 'Viết nội dung marketing cho sản phẩm mới',
      client: 'Startup DEF',
      freelancer: null,
      category: 'writing',
      status: 'open',
      budget: 8000000,
      startDate: null,
      deadline: '30/03/2024',
      progress: 0,
      proposalCount: 23
    },
    {
      id: 4,
      title: 'Phát triển ứng dụng mobile iOS',
      client: 'Công ty GHI Solutions',
      freelancer: 'Lê Minh Cường',
      category: 'mobile-development',
      status: 'in-progress',
      budget: 80000000,
      startDate: '05/03/2024',
      deadline: '05/05/2024',
      progress: 35,
      proposalCount: 6
    },
    {
      id: 5,
      title: 'Thiết kế logo và nhận diện thương hiệu',
      client: 'Doanh nghiệp JKL',
      freelancer: 'Phạm Thu Hương',
      category: 'graphic-design',
      status: 'review',
      budget: 12000000,
      startDate: '15/03/2024',
      deadline: '22/03/2024',
      progress: 95,
      proposalCount: 15
    },
    {
      id: 6,
      title: 'Dịch thuật tài liệu kỹ thuật',
      client: 'Công ty MNO International',
      freelancer: 'Hoàng Văn Tuấn',
      category: 'translation',
      status: 'in-progress',
      budget: 6000000,
      startDate: '12/03/2024',
      deadline: '26/03/2024',
      progress: 60,
      proposalCount: 9
    },
    {
      id: 7,
      title: 'Phân tích dữ liệu và báo cáo',
      client: 'Tập đoàn PQR',
      freelancer: null,
      category: 'data-analysis',
      status: 'open',
      budget: 25000000,
      startDate: null,
      deadline: '15/04/2024',
      progress: 0,
      proposalCount: 18
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Đang tuyển'
      case 'in-progress': return 'Đang thực hiện'
      case 'review': return 'Đang xem xét'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'ui-ux': return 'UI/UX Design'
      case 'web-development': return 'Web Development'
      case 'mobile-development': return 'Mobile Development'
      case 'graphic-design': return 'Graphic Design'
      case 'writing': return 'Viết nội dung'
      case 'translation': return 'Dịch thuật'
      case 'data-analysis': return 'Phân tích dữ liệu'
      default: return 'Khác'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.freelancer && project.freelancer.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredProjects.length / 10)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * 10, currentPage * 10)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý dự án</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả dự án trên nền tảng</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalProjects)}</p>
                <p className="text-sm text-gray-600">Tổng dự án</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeProjects)}</p>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.completedProjects)}</p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(stats.totalRevenue / 1000000000).toFixed(1)}B</p>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách dự án</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="open">Đang tuyển</SelectItem>
                  <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                  <SelectItem value="review">Đang xem xét</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="mobile-development">Mobile Development</SelectItem>
                  <SelectItem value="graphic-design">Graphic Design</SelectItem>
                  <SelectItem value="writing">Viết nội dung</SelectItem>
                  <SelectItem value="translation">Dịch thuật</SelectItem>
                  <SelectItem value="data-analysis">Phân tích dữ liệu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dự án</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngân sách</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Proposals</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 line-clamp-2">{project.title}</p>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p>Khách hàng: {project.client}</p>
                          {project.freelancer && <p>Freelancer: {project.freelancer}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryText(project.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCurrency(project.budget)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {project.deadline}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={project.progress} className="h-2" />
                        <p className="text-xs text-gray-500">{project.progress}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {project.proposalCount}
                      </Badge>
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
                          <DropdownMenuItem>Xem proposals</DropdownMenuItem>
                          {project.status === 'open' && (
                            <DropdownMenuItem>Đóng tuyển dụng</DropdownMenuItem>
                          )}
                          {project.status === 'review' && (
                            <DropdownMenuItem>Phê duyệt</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            Hủy dự án
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