import {
  Plus,
  Share2,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  MessageCircle,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react'
import React, { Suspense, useState } from 'react'
import { HydrateFallback } from '~/components/ui'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProjectStatus } from '~/types/recruitment.type'
import { Link } from 'react-router'
import { PATH } from '~/constants/path'
import type { RecruitmentPost } from '~/types/recruitment.type'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

// Mock data cho ứng viên
interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  location: string
  appliedDate: string
  status: 'pending' | 'accepted' | 'rejected'
  coverLetter: string
  cvUrl: string
  avatar?: string
  experience: string
  skills: string[]
}

const mockApplicants: Record<string, Applicant[]> = {
  '1': [
    {
      id: 'a1',
      name: 'Nguyễn Thị Mai',
      email: 'maint@example.com',
      phone: '0901234567',
      location: 'Hà Nội',
      appliedDate: '2025-01-05T10:30:00',
      status: 'pending',
      coverLetter:
        'Tôi có 3 năm kinh nghiệm trong lĩnh vực content creation và social media marketing. Tôi đã làm việc với nhiều thương hiệu lớn và có khả năng sáng tạo nội dung viral.',
      cvUrl: '/cv/nguyen-thi-mai.pdf',
      experience: '3 năm',
      skills: ['Content Writing', 'Social Media', 'SEO', 'Copywriting']
    },
    {
      id: 'a2',
      name: 'Trần Văn Nam',
      email: 'namtv@example.com',
      phone: '0912345678',
      location: 'TP. Hồ Chí Minh',
      appliedDate: '2025-01-06T14:20:00',
      status: 'pending',
      coverLetter:
        'Với kinh nghiệm 5 năm trong ngành marketing, tôi tự tin có thể đóng góp nhiều ý tưởng sáng tạo cho chiến dịch của quý công ty.',
      cvUrl: '/cv/tran-van-nam.pdf',
      experience: '5 năm',
      skills: ['Digital Marketing', 'Content Strategy', 'Analytics']
    },
    {
      id: 'a3',
      name: 'Lê Hoàng Anh',
      email: 'anhlh@example.com',
      phone: '0923456789',
      location: 'Đà Nẵng',
      appliedDate: '2025-01-07T09:15:00',
      status: 'accepted',
      coverLetter:
        'Tôi là một video editor chuyên nghiệp với nhiều dự án thành công. Tôi có thể tạo ra những video marketing chất lượng cao.',
      cvUrl: '/cv/le-hoang-anh.pdf',
      experience: '4 năm',
      skills: ['Video Editing', 'Motion Graphics', 'Adobe Premiere']
    }
  ],
  '2': [
    {
      id: 'a4',
      name: 'Phạm Thu Hà',
      email: 'hapt@example.com',
      phone: '0934567890',
      location: 'Hà Nội',
      appliedDate: '2025-01-20T11:00:00',
      status: 'pending',
      coverLetter:
        'Tôi có kinh nghiệm thiết kế UI/UX cho các ứng dụng mobile banking và fintech. Portfolio của tôi có nhiều dự án thành công.',
      cvUrl: '/cv/pham-thu-ha.pdf',
      experience: '6 năm',
      skills: ['UI Design', 'UX Research', 'Figma', 'Sketch']
    }
  ]
}

const mockRecruitmentPosts: RecruitmentPost[] = [
  {
    id: '1',
    title: 'Tuyển Content Creator cho chiến dịch Digital Marketing',
    description:
      'Chúng tôi đang tìm kiếm một Content Creator sáng tạo và nhiệt huyết để tham gia vào chiến dịch Digital Marketing của thương hiệu. Bạn sẽ chịu trách nhiệm sản xuất nội dung cho các kênh social media, viết bài blog, và tạo video marketing.',
    projectName: 'Chiến dịch Digital Marketing Q1',
    budget: 15000000,
    teamSize: '3-5',
    startTime: '2025-01-15T00:00:00',
    endTime: '2025-03-31T00:00:00',
    createdAt: '2024-12-20T10:30:00',
    status: ProjectStatus.ACTIVE,
    skills: [
      { id: 's1', name: 'Content Writing', userSkills: [], recruitmentPostSkills: [] },
      { id: 's2', name: 'Social Media', userSkills: [], recruitmentPostSkills: [] },
      { id: 's3', name: 'Video Editing', userSkills: [], recruitmentPostSkills: [] },
      { id: 's4', name: 'Photoshop', userSkills: [], recruitmentPostSkills: [] }
    ],
    user: {
      id: 'u1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com'
    },
    project: {
      id: 'p1',
      projectName: 'Chiến dịch Digital Marketing Q1',
      description: 'Chiến dịch marketing số cho quý 1/2025'
    },
    categories: [
      { id: 'c1', title: 'Marketing & Truyền thông', description: 'Các dự án liên quan đến marketing' },
      { id: 'c2', title: 'Sáng tạo nội dung', description: 'Sáng tạo và sản xuất nội dung' }
    ]
  },
  {
    id: '2',
    title: 'Tìm Designer UI/UX cho ứng dụng Mobile',
    description:
      'Cần một UI/UX Designer có kinh nghiệm để thiết kế giao diện cho ứng dụng mobile banking. Yêu cầu có portfolio về thiết kế ứng dụng tài chính, hiểu biết về UX research và user flow.',
    projectName: 'Mobile Banking App Redesign',
    budget: 25000000,
    teamSize: '2',
    startTime: '2025-02-01T00:00:00',
    endTime: '2025-04-30T00:00:00',
    createdAt: '2025-01-10T14:20:00',
    status: ProjectStatus.ACTIVE,
    skills: [
      { id: 's5', name: 'UI Design', userSkills: [], recruitmentPostSkills: [] },
      { id: 's6', name: 'UX Design', userSkills: [], recruitmentPostSkills: [] },
      { id: 's7', name: 'Figma', userSkills: [], recruitmentPostSkills: [] },
      { id: 's8', name: 'Prototyping', userSkills: [], recruitmentPostSkills: [] },
      { id: 's9', name: 'User Research', userSkills: [], recruitmentPostSkills: [] }
    ],
    user: {
      id: 'u1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com'
    },
    project: {
      id: 'p2',
      projectName: 'Mobile Banking App Redesign',
      description: 'Thiết kế lại giao diện ứng dụng ngân hàng'
    },
    categories: [{ id: 'c3', title: 'Thiết kế & Sáng tạo', description: 'Các dự án về thiết kế' }]
  },
  {
    id: '3',
    title: 'Tuyển Fullstack Developer - React & Node.js',
    description:
      'Tìm kiếm Fullstack Developer có kinh nghiệm với React và Node.js để phát triển nền tảng e-commerce. Dự án bao gồm xây dựng hệ thống quản lý sản phẩm, giỏ hàng, thanh toán và quản lý đơn hàng.',
    projectName: 'E-commerce Platform Development',
    budget: 45000000,
    teamSize: '5-7',
    startTime: '2025-01-20T00:00:00',
    endTime: '2025-06-30T00:00:00',
    createdAt: '2024-12-28T09:15:00',
    status: ProjectStatus.DRAFT,
    skills: [
      { id: 's10', name: 'React', userSkills: [], recruitmentPostSkills: [] },
      { id: 's11', name: 'Node.js', userSkills: [], recruitmentPostSkills: [] },
      { id: 's12', name: 'TypeScript', userSkills: [], recruitmentPostSkills: [] },
      { id: 's13', name: 'MongoDB', userSkills: [], recruitmentPostSkills: [] },
      { id: 's14', name: 'REST API', userSkills: [], recruitmentPostSkills: [] }
    ],
    user: {
      id: 'u1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com'
    },
    project: {
      id: 'p3',
      projectName: 'E-commerce Platform Development',
      description: 'Phát triển nền tảng thương mại điện tử'
    },
    categories: [
      { id: 'c4', title: 'Lập trình & Phát triển', description: 'Các dự án về lập trình' },
      { id: 'c5', title: 'Web Development', description: 'Phát triển website' }
    ]
  },
  {
    id: '4',
    title: 'Cần Video Editor cho YouTube Channel',
    description:
      'Tuyển Video Editor chuyên nghiệp để edit video cho kênh YouTube về review công nghệ. Cần có kinh nghiệm với Adobe Premiere, After Effects, và hiểu về storytelling.',
    projectName: 'Tech Review YouTube Channel',
    budget: 8000000,
    teamSize: '1-2',
    startTime: '2025-02-10T00:00:00',
    endTime: '2025-05-10T00:00:00',
    createdAt: '2025-01-05T16:45:00',
    status: ProjectStatus.COMPLETED,
    skills: [
      { id: 's15', name: 'Video Editing', userSkills: [], recruitmentPostSkills: [] },
      { id: 's16', name: 'Adobe Premiere', userSkills: [], recruitmentPostSkills: [] },
      { id: 's17', name: 'After Effects', userSkills: [], recruitmentPostSkills: [] },
      { id: 's18', name: 'Color Grading', userSkills: [], recruitmentPostSkills: [] }
    ],
    user: {
      id: 'u1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com'
    },
    project: {
      id: 'p4',
      projectName: 'Tech Review YouTube Channel',
      description: 'Kênh YouTube review sản phẩm công nghệ'
    },
    categories: [
      { id: 'c6', title: 'Video & Animation', description: 'Sản xuất video và hoạt hình' },
      { id: 'c7', title: 'Multimedia', description: 'Đa phương tiện' }
    ]
  },
  {
    id: '5',
    title: 'Tuyển Data Analyst cho dự án Business Intelligence',
    description:
      'Cần một Data Analyst có kinh nghiệm để phân tích dữ liệu khách hàng và xây dựng dashboard báo cáo. Yêu cầu thành thạo SQL, Python, và các công cụ visualization như Power BI hoặc Tableau.',
    projectName: 'Business Intelligence Dashboard',
    budget: 35000000,
    teamSize: '3',
    startTime: '2025-03-01T00:00:00',
    endTime: '2025-07-31T00:00:00',
    createdAt: '2025-01-12T11:00:00',
    status: ProjectStatus.CLOSED,
    skills: [
      { id: 's19', name: 'SQL', userSkills: [], recruitmentPostSkills: [] },
      { id: 's20', name: 'Python', userSkills: [], recruitmentPostSkills: [] },
      { id: 's21', name: 'Power BI', userSkills: [], recruitmentPostSkills: [] },
      { id: 's22', name: 'Data Analysis', userSkills: [], recruitmentPostSkills: [] },
      { id: 's23', name: 'Statistics', userSkills: [], recruitmentPostSkills: [] }
    ],
    user: {
      id: 'u1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyenvana@example.com'
    },
    project: {
      id: 'p5',
      projectName: 'Business Intelligence Dashboard',
      description: 'Dashboard phân tích kinh doanh'
    },
    categories: [
      { id: 'c8', title: 'Data & Analytics', description: 'Phân tích dữ liệu' },
      { id: 'c9', title: 'Business Intelligence', description: 'Trí tuệ kinh doanh' }
    ]
  }
]

const statusConfig = {
  [ProjectStatus.DRAFT]: {
    label: 'Bản nháp',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  },
  [ProjectStatus.ACTIVE]: {
    label: 'Đang tuyển',
    className: 'bg-green-100 text-green-800 hover:bg-green-100'
  },
  [ProjectStatus.CLOSED]: {
    label: 'Đã đóng',
    className: 'bg-red-100 text-red-800 hover:bg-red-100'
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Hoàn thành',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  }
}

export default function ManagePostProject() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [selectedPost, setSelectedPost] = useState<RecruitmentPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [applicants, setApplicants] = useState<Applicant[]>([])

  const totalPages = Math.ceil(mockRecruitmentPosts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentPosts = mockRecruitmentPosts.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  }

  const handleViewPost = (post: RecruitmentPost) => {
    setSelectedPost(post)
    setApplicants(mockApplicants[post.id] || [])
    setIsViewDialogOpen(true)
  }

  const handleAcceptApplicant = (applicantId: string) => {
    setApplicants((prev) => prev.map((a) => (a.id === applicantId ? { ...a, status: 'accepted' as const } : a)))
  }

  const handleRejectApplicant = (applicantId: string) => {
    setApplicants((prev) => prev.map((a) => (a.id === applicantId ? { ...a, status: 'rejected' as const } : a)))
  }

  return (
    <Suspense fallback={<HydrateFallback variant='details' showHeader />}>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản lý bài đăng tuyển dụng</h1>
            <p className='text-gray-600 mt-2'>Quản lý và theo dõi các bài đăng tuyển dụng của bạn</p>
          </div>
          <Button asChild className='bg-blue-600 hover:bg-blue-700'>
            <Link to={PATH.postProject}>
              <Plus className='h-5 w-5 mr-2' />
              Đăng tin tuyển dụng mới
            </Link>
          </Button>
        </div>

        {currentPosts.length === 0 ? (
          <div className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
            <Briefcase className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có bài đăng nào</h3>
            <p className='text-gray-600 mb-6'>Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin ngay!</p>
            <Button asChild className='bg-blue-600 hover:bg-blue-700'>
              <Link to={PATH.postProject}>
                <Plus className='h-5 w-5 mr-2' />
                Đăng tin tuyển dụng
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='grid gap-6'>
              {currentPosts.map((post) => (
                <Card key={post.id} className='hover:shadow-lg transition-shadow'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <h2 className='text-xl font-bold text-gray-900'>{post.title}</h2>
                          <Badge className={statusConfig[post.status as ProjectStatus]?.className || ''}>
                            {statusConfig[post.status as ProjectStatus]?.label || 'Không xác định'}
                          </Badge>
                        </div>
                        <p className='text-gray-600 line-clamp-2'>{post.description}</p>
                      </div>
                      <div className='flex gap-2 ml-4'>
                        <Button variant='outline' size='sm' onClick={() => handleViewPost(post)}>
                          <Eye className='h-4 w-4 mr-2' />
                          Xem
                        </Button>
                        <Button variant='outline' size='sm'>
                          <Edit className='h-4 w-4 mr-2' />
                          Sửa
                        </Button>
                        <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Ngân sách</p>
                          <p className='font-semibold text-gray-900'>{formatCurrency(post.budget)}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Users className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Quy mô</p>
                          <p className='font-semibold text-gray-900'>{post.teamSize} người</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Bắt đầu</p>
                          <p className='font-semibold text-gray-900'>{formatDate(post.startTime)}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Kết thúc</p>
                          <p className='font-semibold text-gray-900'>{formatDate(post.endTime)}</p>
                        </div>
                      </div>
                    </div>

                    {post.categories && post.categories.length > 0 && (
                      <div className='mb-4'>
                        <p className='text-xs text-gray-500 mb-2'>Danh mục:</p>
                        <div className='flex flex-wrap gap-2'>
                          {post.categories.map((category) => (
                            <Badge key={category.id} variant='outline' className='text-indigo-600 border-indigo-300'>
                              📁 {category.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {post.skills && post.skills.length > 0 && (
                      <div>
                        <p className='text-xs text-gray-500 mb-2'>Kỹ năng yêu cầu:</p>
                        <div className='flex flex-wrap gap-2'>
                          {post.skills.map((skill, index) => {
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
                              <Badge key={skill.id} className={`${colors[index % colors.length]} hover:opacity-80`}>
                                {skill.name}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div className='flex items-center justify-between mt-4 pt-4 border-t'>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span>Đăng ngày: {formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>Dự án: {post.project.projectName}</span>
                      </div>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm'>
                          <MessageCircle className='h-4 w-4 mr-2' />
                          Ứng viên
                        </Button>
                        <Button variant='outline' size='sm'>
                          <Share2 className='h-4 w-4 mr-2' />
                          Chia sẻ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-8'>
                <Button
                  variant='outline'
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <div className='flex items-center gap-2'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outline'
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}

        {/* View Post Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='!max-w-[95vw] !w-[95vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-white'>
            <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0'>
              <DialogTitle className='text-2xl font-bold'>{selectedPost?.title}</DialogTitle>
              <DialogDescription>Chi tiết dự án và danh sách ứng viên</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue='details' className='flex-1 flex flex-col min-h-0 overflow-hidden'>
              <div className='px-6 pt-4 shrink-0'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='details'>Thông tin chi tiết</TabsTrigger>
                  <TabsTrigger value='applicants'>Ứng viên ({applicants.length})</TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: Thông tin chi tiết dự án */}
              <TabsContent
                value='details'
                className='flex-1 overflow-y-auto px-6 pb-6 mt-4 space-y-6 scrollbar-hide min-h-0'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Mô tả dự án</h3>
                    <p className='text-gray-700 leading-relaxed'>{selectedPost?.description}</p>
                  </div>

                  <Separator />

                  <div className='grid grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Ngân sách</p>
                        <div className='flex items-center gap-2'>
                          <DollarSign className='h-5 w-5 text-green-600' />
                          <p className='text-lg font-semibold text-gray-900'>
                            {selectedPost && formatCurrency(selectedPost.budget)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Quy mô nhóm</p>
                        <div className='flex items-center gap-2'>
                          <Users className='h-5 w-5 text-blue-600' />
                          <p className='text-lg font-semibold text-gray-900'>{selectedPost?.teamSize} người</p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Trạng thái</p>
                        {selectedPost && (
                          <Badge className={statusConfig[selectedPost.status as ProjectStatus]?.className || ''}>
                            {statusConfig[selectedPost.status as ProjectStatus]?.label || 'Không xác định'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Ngày bắt đầu</p>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-5 w-5 text-purple-600' />
                          <p className='text-lg font-semibold text-gray-900'>
                            {selectedPost && formatDate(selectedPost.startTime)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Ngày kết thúc</p>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-5 w-5 text-purple-600' />
                          <p className='text-lg font-semibold text-gray-900'>
                            {selectedPost && formatDate(selectedPost.endTime)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Ngày đăng</p>
                        <p className='text-lg font-semibold text-gray-900'>
                          {selectedPost && formatDate(selectedPost.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {selectedPost?.categories && selectedPost.categories.length > 0 && (
                    <div>
                      <h3 className='text-lg font-semibold mb-3'>Danh mục</h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedPost.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant='outline'
                            className='text-indigo-600 border-indigo-300 px-3 py-1'
                          >
                            📁 {category.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPost?.skills && selectedPost.skills.length > 0 && (
                    <div>
                      <h3 className='text-lg font-semibold mb-3'>Kỹ năng yêu cầu</h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedPost.skills.map((skill, index) => {
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
                            <Badge key={skill.id} className={`${colors[index % colors.length]} px-3 py-1`}>
                              {skill.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Thông tin dự án</h3>
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <p className='font-medium text-gray-900'>{selectedPost?.project.projectName}</p>
                      <p className='text-gray-600 text-sm mt-1'>{selectedPost?.project.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Danh sách ứng viên */}
              <TabsContent
                value='applicants'
                className='flex-1 overflow-y-auto px-6 pb-6 mt-4 scrollbar-hide min-h-0'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {applicants.length === 0 ? (
                  <div className='text-center py-12'>
                    <Users className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có ứng viên nào</h3>
                    <p className='text-gray-600'>Chưa có ai nộp hồ sơ ứng tuyển cho vị trí này.</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {applicants.map((applicant) => (
                      <Card key={applicant.id} className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                          <div className='flex items-start gap-4'>
                            <Avatar className='h-16 w-16'>
                              <AvatarImage src={applicant.avatar} alt={applicant.name} />
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg'>
                                {applicant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className='flex-1'>
                              <div className='flex items-start justify-between mb-3'>
                                <div>
                                  <h4 className='text-lg font-bold text-gray-900'>{applicant.name}</h4>
                                  <p className='text-sm text-gray-500'>Kinh nghiệm: {applicant.experience}</p>
                                </div>
                                <Badge
                                  className={
                                    applicant.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : applicant.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {applicant.status === 'accepted'
                                    ? 'Đã chấp nhận'
                                    : applicant.status === 'rejected'
                                      ? 'Đã từ chối'
                                      : 'Chờ xét duyệt'}
                                </Badge>
                              </div>

                              <div className='space-y-2 mb-4'>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <Mail className='h-4 w-4' />
                                  <span>{applicant.email}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <Phone className='h-4 w-4' />
                                  <span>{applicant.phone}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <MapPin className='h-4 w-4' />
                                  <span>{applicant.location}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <Calendar className='h-4 w-4' />
                                  <span>Nộp hồ sơ: {formatDate(applicant.appliedDate)}</span>
                                </div>
                              </div>

                              <div className='mb-4'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Kỹ năng:</p>
                                <div className='flex flex-wrap gap-2'>
                                  {applicant.skills.map((skill, idx) => (
                                    <Badge key={idx} variant='outline' className='text-xs'>
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className='mb-4'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Thư giới thiệu:</p>
                                <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                                  {applicant.coverLetter}
                                </p>
                              </div>

                              <div className='flex items-center justify-between'>
                                <Button variant='outline' size='sm' className='gap-2'>
                                  <FileText className='h-4 w-4' />
                                  Xem CV
                                </Button>

                                {applicant.status === 'pending' && (
                                  <div className='flex gap-2'>
                                    <Button
                                      size='sm'
                                      className='bg-green-600 hover:bg-green-700 gap-2'
                                      onClick={() => handleAcceptApplicant(applicant.id)}
                                    >
                                      <CheckCircle className='h-4 w-4' />
                                      Chấp nhận
                                    </Button>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='text-red-600 hover:text-red-700 hover:bg-red-50 gap-2'
                                      onClick={() => handleRejectApplicant(applicant.id)}
                                    >
                                      <XCircle className='h-4 w-4' />
                                      Từ chối
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}
