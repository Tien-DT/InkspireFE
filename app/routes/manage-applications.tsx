import { useState } from 'react'
import {
  Calendar,
  DollarSign,
  Briefcase,
  Eye,
  FileText,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Mock data - Danh sách công việc mà freelancer đã ứng tuyển
interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  companyLogo?: string
  location: string
  budget: {
    min: number
    max: number
    currency: string
  }
  appliedDate: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  jobDescription: string
  requiredSkills: string[]
  projectDuration: string
  teamSize: number
  postedDate: string
  deadline: string
  categories: string[]
  coverLetter: string
  proposedRate: number
  estimatedTime: string
}

const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: 'job-001',
    jobTitle: 'Thiết kế Logo cho Startup công nghệ AI',
    companyName: 'TechVision AI',
    companyLogo: '',
    location: 'Hà Nội, Việt Nam',
    budget: {
      min: 5000000,
      max: 10000000,
      currency: 'VND'
    },
    appliedDate: '2024-10-01',
    status: 'pending',
    jobDescription:
      'Chúng tôi đang tìm kiếm một designer tài năng để thiết kế logo và bộ nhận diện thương hiệu cho startup AI. Logo cần thể hiện sự hiện đại, công nghệ và đáng tin cậy.',
    requiredSkills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma'],
    projectDuration: '2-3 tuần',
    teamSize: 1,
    postedDate: '2024-09-25',
    deadline: '2024-10-15',
    categories: ['Design', 'Branding'],
    coverLetter:
      'Tôi có hơn 5 năm kinh nghiệm trong thiết kế logo và brand identity, đặc biệt là cho các công ty công nghệ. Tôi đã thiết kế logo cho nhiều startup trong lĩnh vực AI và blockchain.',
    proposedRate: 8000000,
    estimatedTime: '2 tuần'
  },
  {
    id: '2',
    jobId: 'job-002',
    jobTitle: 'Phát triển Website thương mại điện tử',
    companyName: 'ShopMart Vietnam',
    companyLogo: '',
    location: 'TP. Hồ Chí Minh',
    budget: {
      min: 20000000,
      max: 35000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-28',
    status: 'accepted',
    jobDescription:
      'Cần phát triển website thương mại điện tử hoàn chỉnh với tính năng giỏ hàng, thanh toán online, quản lý đơn hàng. Yêu cầu responsive design và tối ưu SEO.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    projectDuration: '2-3 tháng',
    teamSize: 2,
    postedDate: '2024-09-20',
    deadline: '2024-10-20',
    categories: ['Web Development', 'E-commerce'],
    coverLetter:
      'Tôi đã phát triển nhiều website thương mại điện tử cho các doanh nghiệp vừa và nhỏ. Có kinh nghiệm tích hợp các cổng thanh toán như VNPay, MoMo.',
    proposedRate: 30000000,
    estimatedTime: '2.5 tháng'
  },
  {
    id: '3',
    jobId: 'job-003',
    jobTitle: 'Thiết kế UI/UX cho ứng dụng Mobile Banking',
    companyName: 'FinTech Solutions',
    companyLogo: '',
    location: 'Đà Nẵng',
    budget: {
      min: 15000000,
      max: 25000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-25',
    status: 'rejected',
    jobDescription:
      'Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng mobile banking. Cần đảm bảo tính bảo mật, dễ sử dụng và hiện đại.',
    requiredSkills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
    projectDuration: '1-2 tháng',
    teamSize: 1,
    postedDate: '2024-09-18',
    deadline: '2024-10-10',
    categories: ['UI/UX', 'Mobile'],
    coverLetter:
      'Với kinh nghiệm thiết kế UI/UX cho các ứng dụng fintech, tôi hiểu rõ các yêu cầu về bảo mật và trải nghiệm người dùng trong lĩnh vực tài chính.',
    proposedRate: 20000000,
    estimatedTime: '1.5 tháng'
  },
  {
    id: '4',
    jobId: 'job-004',
    jobTitle: 'Viết Content Marketing cho Website',
    companyName: 'Digital Marketing Pro',
    companyLogo: '',
    location: 'Remote',
    budget: {
      min: 3000000,
      max: 6000000,
      currency: 'VND'
    },
    appliedDate: '2024-10-02',
    status: 'pending',
    jobDescription:
      'Cần viết content cho website doanh nghiệp, blog posts, bài viết SEO. Yêu cầu có kiến thức về digital marketing và SEO.',
    requiredSkills: ['Content Writing', 'SEO', 'Digital Marketing', 'Copywriting'],
    projectDuration: '1 tháng',
    teamSize: 1,
    postedDate: '2024-09-29',
    deadline: '2024-10-12',
    categories: ['Content', 'Marketing'],
    coverLetter:
      'Tôi có 3 năm kinh nghiệm viết content marketing và SEO. Đã giúp nhiều website tăng traffic organic từ 50-200%.',
    proposedRate: 5000000,
    estimatedTime: '1 tháng'
  },
  {
    id: '5',
    jobId: 'job-005',
    jobTitle: 'Phát triển ứng dụng React Native',
    companyName: 'Mobile Apps Studio',
    companyLogo: '',
    location: 'Hà Nội',
    budget: {
      min: 25000000,
      max: 40000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-30',
    status: 'pending',
    jobDescription:
      'Phát triển ứng dụng mobile đa nền tảng bằng React Native. App quản lý công việc cá nhân với tính năng đồng bộ cloud.',
    requiredSkills: ['React Native', 'Firebase', 'Redux', 'Mobile Development'],
    projectDuration: '3-4 tháng',
    teamSize: 2,
    postedDate: '2024-09-26',
    deadline: '2024-10-18',
    categories: ['Mobile Development', 'React Native'],
    coverLetter:
      'Tôi có kinh nghiệm phát triển nhiều ứng dụng React Native với hơn 100k+ downloads trên cả iOS và Android.',
    proposedRate: 35000000,
    estimatedTime: '3 tháng'
  }
]

export default function ManageApplications() {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setIsViewDialogOpen(true)
  }

  const filteredApplications = mockApplications.filter((app) => {
    if (filterStatus === 'all') return true
    return app.status === filterStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      accepted: { label: 'Được chấp nhận', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Bị từ chối', className: 'bg-red-100 text-red-800', icon: XCircle },
      withdrawn: { label: 'Đã rút', className: 'bg-gray-100 text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.className} hover:${config.className} flex items-center gap-1`}>
        <Icon className='h-3 w-3' />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter((app) => app.status === 'pending').length,
    accepted: mockApplications.filter((app) => app.status === 'accepted').length,
    rejected: mockApplications.filter((app) => app.status === 'rejected').length
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gradient mb-2'>Quản lý ứng tuyển</h1>
          <p className='text-gray-600'>Theo dõi và quản lý các công việc bạn đã ứng tuyển</p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={() => setFilterStatus('all')}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Tổng ứng tuyển</p>
                  <p className='text-3xl font-bold text-gray-900'>{stats.total}</p>
                </div>
                <Briefcase className='h-12 w-12 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={() => setFilterStatus('pending')}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Đang chờ</p>
                  <p className='text-3xl font-bold text-yellow-600'>{stats.pending}</p>
                </div>
                <AlertCircle className='h-12 w-12 text-yellow-500' />
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer hover:shadow-lg transition-shadow'
            onClick={() => setFilterStatus('accepted')}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Được chấp nhận</p>
                  <p className='text-3xl font-bold text-green-600'>{stats.accepted}</p>
                </div>
                <CheckCircle className='h-12 w-12 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer hover:shadow-lg transition-shadow'
            onClick={() => setFilterStatus('rejected')}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Bị từ chối</p>
                  <p className='text-3xl font-bold text-red-600'>{stats.rejected}</p>
                </div>
                <XCircle className='h-12 w-12 text-red-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className='mb-6'>
          <CardContent className='p-4'>
            <div className='flex gap-2'>
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'pending', label: 'Đang chờ' },
                { value: 'accepted', label: 'Được chấp nhận' },
                { value: 'rejected', label: 'Bị từ chối' }
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterStatus === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(filter.value as any)}
                  className={filterStatus === filter.value ? 'btn-submit' : 'btn-cancel'}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className='space-y-4'>
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className='py-16 text-center'>
                <Briefcase className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có ứng tuyển nào</h3>
                <p className='text-gray-600'>
                  {filterStatus === 'all'
                    ? 'Bạn chưa ứng tuyển công việc nào'
                    : `Không có ứng tuyển nào ở trạng thái này`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='flex gap-4 flex-1'>
                      {/* Company Logo */}
                      <Avatar className='h-16 w-16 shrink-0'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold'>
                          {application.companyName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Job Info */}
                      <div className='flex-1'>
                        <div className='flex items-start justify-between mb-2'>
                          <div>
                            <h3 className='text-xl font-bold text-gray-900 mb-1'>{application.jobTitle}</h3>
                            <div className='flex items-center gap-2 text-gray-600 mb-2'>
                              <Building2 className='h-4 w-4' />
                              <span className='font-medium'>{application.companyName}</span>
                            </div>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <MapPin className='h-4 w-4' />
                            <span>{application.location}</span>
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <DollarSign className='h-4 w-4' />
                            <span>
                              {formatCurrency(application.budget.min)} - {formatCurrency(application.budget.max)}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Clock className='h-4 w-4' />
                            <span>{application.projectDuration}</span>
                          </div>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Calendar className='h-4 w-4' />
                            <span>
                              Ứng tuyển: {format(new Date(application.appliedDate), 'dd/MM/yyyy', { locale: vi })}
                            </span>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-2 mb-4'>
                          {application.requiredSkills.slice(0, 4).map((skill, index) => {
                            const colors = [
                              'bg-blue-100 text-blue-700',
                              'bg-purple-100 text-purple-700',
                              'bg-orange-100 text-orange-700',
                              'bg-pink-100 text-pink-700'
                            ]
                            return (
                              <Badge key={skill} className={`${colors[index % colors.length]} hover:opacity-80`}>
                                {skill}
                              </Badge>
                            )
                          })}
                          {application.requiredSkills.length > 4 && (
                            <Badge variant='outline'>+{application.requiredSkills.length - 4} kỹ năng khác</Badge>
                          )}
                        </div>

                        <div className='flex items-center gap-3'>
                          <Button onClick={() => handleViewApplication(application)} className='btn-submit'>
                            <Eye className='h-4 w-4 mr-2' />
                            Xem chi tiết
                          </Button>

                          {application.status === 'pending' && (
                            <Button className='btn-cancel text-red-600 hover:text-red-700 hover:bg-red-50'>
                              <XCircle className='h-4 w-4 mr-2' />
                              Rút ứng tuyển
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Application Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='!max-w-[85vw] !w-[85vw] h-[90vh] bg-white flex flex-col p-0 gap-0 overflow-hidden'>
            <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0 bg-white'>
              <DialogTitle className='text-2xl'>Chi tiết ứng tuyển</DialogTitle>
              <DialogDescription>Thông tin chi tiết về công việc và hồ sơ ứng tuyển của bạn</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue='job-info' className='flex-1 flex flex-col min-h-0 overflow-hidden'>
              <div className='px-6 pt-4 pb-2 shrink-0 bg-white border-b'>
                <TabsList className='grid w-full max-w-md grid-cols-2'>
                  <TabsTrigger value='job-info'>Thông tin công việc</TabsTrigger>
                  <TabsTrigger value='my-application'>Hồ sơ ứng tuyển</TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: Job Information */}
              <TabsContent value='job-info' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
                {selectedApplication && (
                  <div className='space-y-6'>
                    {/* Company & Job Title */}
                    <div className='flex items-start gap-4'>
                      <Avatar className='h-20 w-20 shrink-0'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-bold'>
                          {selectedApplication.companyName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>{selectedApplication.jobTitle}</h2>
                        <div className='flex items-center gap-2 text-gray-600 mb-2'>
                          <Building2 className='h-5 w-5' />
                          <span className='text-lg font-medium'>{selectedApplication.companyName}</span>
                        </div>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>

                    {/* Job Details Grid */}
                    <div className='grid md:grid-cols-2 gap-6'>
                      <Card>
                        <CardHeader>
                          <h3 className='font-semibold flex items-center gap-2'>
                            <DollarSign className='h-5 w-5 text-green-600' />
                            Ngân sách dự án
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className='text-2xl font-bold text-green-600'>
                            {formatCurrency(selectedApplication.budget.min)} -{' '}
                            {formatCurrency(selectedApplication.budget.max)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <h3 className='font-semibold flex items-center gap-2'>
                            <Clock className='h-5 w-5 text-blue-600' />
                            Thời gian dự án
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className='text-xl font-semibold text-gray-900'>{selectedApplication.projectDuration}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <h3 className='font-semibold flex items-center gap-2'>
                            <MapPin className='h-5 w-5 text-orange-600' />
                            Địa điểm
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className='text-xl font-semibold text-gray-900'>{selectedApplication.location}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <h3 className='font-semibold flex items-center gap-2'>
                            <Calendar className='h-5 w-5 text-purple-600' />
                            Hạn nộp hồ sơ
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className='text-xl font-semibold text-gray-900'>
                            {format(new Date(selectedApplication.deadline), 'dd/MM/yyyy', { locale: vi })}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Job Description */}
                    <Card>
                      <CardHeader>
                        <h3 className='font-semibold text-lg'>Mô tả công việc</h3>
                      </CardHeader>
                      <CardContent>
                        <p className='text-gray-700 leading-relaxed'>{selectedApplication.jobDescription}</p>
                      </CardContent>
                    </Card>

                    {/* Required Skills */}
                    <Card>
                      <CardHeader>
                        <h3 className='font-semibold text-lg'>Kỹ năng yêu cầu</h3>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {selectedApplication.requiredSkills.map((skill, index) => {
                            const colors = [
                              'bg-blue-100 text-blue-700',
                              'bg-purple-100 text-purple-700',
                              'bg-orange-100 text-orange-700',
                              'bg-pink-100 text-pink-700',
                              'bg-green-100 text-green-700',
                              'bg-yellow-100 text-yellow-700',
                              'bg-red-100 text-red-700',
                              'bg-indigo-100 text-indigo-700'
                            ]
                            return (
                              <Badge key={skill} className={`${colors[index % colors.length]} hover:opacity-80`}>
                                {skill}
                              </Badge>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card>
                      <CardHeader>
                        <h3 className='font-semibold text-lg'>Danh mục</h3>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {selectedApplication.categories.map((category) => (
                            <Badge key={category} variant='outline' className='text-sm'>
                              <Briefcase className='h-3 w-3 mr-1' />
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: My Application */}
              <TabsContent
                value='my-application'
                className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'
              >
                {selectedApplication && (
                  <div className='space-y-6'>
                    {/* Application Status */}
                    <Card className='border-2'>
                      <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Trạng thái ứng tuyển</h3>
                            <p className='text-gray-600 mb-3'>
                              Ngày ứng tuyển:{' '}
                              {format(new Date(selectedApplication.appliedDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                            </p>
                            {getStatusBadge(selectedApplication.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Proposed Rate */}
                    <Card>
                      <CardHeader>
                        <h3 className='font-semibold text-lg flex items-center gap-2'>
                          <DollarSign className='h-5 w-5 text-green-600' />
                          Mức giá đề xuất
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className='text-3xl font-bold text-green-600'>
                          {formatCurrency(selectedApplication.proposedRate)}
                        </p>
                        <p className='text-gray-600 mt-2'>Thời gian ước tính: {selectedApplication.estimatedTime}</p>
                      </CardContent>
                    </Card>

                    {/* Cover Letter */}
                    <Card>
                      <CardHeader>
                        <h3 className='font-semibold text-lg flex items-center gap-2'>
                          <FileText className='h-5 w-5 text-blue-600' />
                          Thư xin việc
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                          {selectedApplication.coverLetter}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    {selectedApplication.status === 'pending' && (
                      <div className='flex gap-3 pt-4 border-t'>
                        <Button className='btn-cancel text-red-600 hover:text-red-700 hover:bg-red-50'>
                          <XCircle className='h-4 w-4 mr-2' />
                          Rút ứng tuyển
                        </Button>
                        <Button className='btn-submit'>
                          <FileText className='h-4 w-4 mr-2' />
                          Chỉnh sửa hồ sơ
                        </Button>
                      </div>
                    )}

                    {selectedApplication.status === 'accepted' && (
                      <Card className='bg-green-50 border-green-200'>
                        <CardContent className='p-6'>
                          <div className='flex items-start gap-3'>
                            <CheckCircle className='h-6 w-6 text-green-600 shrink-0 mt-1' />
                            <div>
                              <h4 className='font-semibold text-green-900 mb-1'>Chúc mừng!</h4>
                              <p className='text-green-700'>
                                Hồ sơ của bạn đã được chấp nhận. Công ty sẽ liên hệ với bạn sớm để thảo luận chi tiết về
                                dự án.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedApplication.status === 'rejected' && (
                      <Card className='bg-red-50 border-red-200'>
                        <CardContent className='p-6'>
                          <div className='flex items-start gap-3'>
                            <XCircle className='h-6 w-6 text-red-600 shrink-0 mt-1' />
                            <div>
                              <h4 className='font-semibold text-red-900 mb-1'>Rất tiếc</h4>
                              <p className='text-red-700'>
                                Hồ sơ của bạn chưa phù hợp với yêu cầu của dự án này. Đừng nản chí, hãy tiếp tục tìm
                                kiếm các cơ hội khác!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
