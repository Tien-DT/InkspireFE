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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useUserRecruitmentsByUserId, useRecruitmentApplications } from '~/hooks/useRecruitments'
import { getProfileFromLS } from '~/utils/auth'

interface UserRecruitmentPost {
  id: string
  title: string
  description: string
  projectName: string
  budget: number
  teamSize: string
  createdAt: string
  status: number
  skills: Array<{
    id: string
    name: string
  }>
}

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
  const profile = getProfileFromLS()
  console.log('ManagePostProject - Profile from LS:', profile)

  const { data, isLoading, error } = useUserRecruitmentsByUserId(profile?.id)
  console.log('ManagePostProject - API Response:', { data, isLoading, error })

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [selectedPost, setSelectedPost] = useState<UserRecruitmentPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Fetch applications khi có selectedPost
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError
  } = useRecruitmentApplications(selectedPost?.id, { page: 1, pageSize: 100 })

  const applications = applicationsData?.data?.items || []

  const recruitmentPosts = data?.data || []
  const totalPages = Math.ceil(recruitmentPosts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentPosts = recruitmentPosts.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  }

  const handleViewPost = (post: UserRecruitmentPost) => {
    setSelectedPost(post)
    setIsViewDialogOpen(true)
  }

  const handleAcceptApplicant = (applicantId: string) => {
    // TODO: Call API to update application status
    console.log('Accept applicant:', applicantId)
  }

  const handleRejectApplicant = (applicantId: string) => {
    // TODO: Call API to update application status
    console.log('Reject applicant:', applicantId)
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 min-h-screen bg-background'>
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 min-h-screen bg-background'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <h3 className='text-lg font-semibold text-red-900 mb-2'>Có lỗi xảy ra</h3>
          <p className='text-red-600'>Không thể tải dữ liệu bài đăng. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<HydrateFallback variant='details' showHeader />}>
      <div className='container mx-auto px-4 py-8 min-h-screen bg-background'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản lý bài đăng tuyển dụng</h1>
            <p className='text-gray-600 mt-2'>Quản lý và theo dõi các bài đăng tuyển dụng của bạn</p>
          </div>
          <Button asChild className='btn-submit'>
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
            <Button asChild className='btn-submit'>
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
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
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
                          <p className='text-xs text-gray-500'>Ngày đăng</p>
                          <p className='font-semibold text-gray-900'>{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                    </div>

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
                        <span>Dự án: {post.projectName}</span>
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
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'btn-submit' : 'btn-cancel'}
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
                  <TabsTrigger value='applicants'>
                    Ứng viên ({applicationsLoading ? '...' : applications.length})
                  </TabsTrigger>
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
                        <p className='text-sm text-gray-500 mb-1'>Ngày đăng</p>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-5 w-5 text-purple-600' />
                          <p className='text-lg font-semibold text-gray-900'>
                            {selectedPost && formatDate(selectedPost.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Tên dự án</p>
                        <div className='flex items-center gap-2'>
                          <Briefcase className='h-5 w-5 text-orange-600' />
                          <p className='text-lg font-semibold text-gray-900'>{selectedPost?.projectName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

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
                </div>
              </TabsContent>

              {/* Tab 2: Danh sách ứng viên */}
              <TabsContent
                value='applicants'
                className='flex-1 overflow-y-auto px-6 pb-6 mt-4 scrollbar-hide min-h-0'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {applicationsLoading ? (
                  <div className='text-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Đang tải danh sách ứng viên...</p>
                  </div>
                ) : applicationsError ? (
                  <div className='text-center py-12'>
                    <h3 className='text-lg font-semibold text-red-900 mb-2'>Có lỗi xảy ra</h3>
                    <p className='text-red-600'>Không thể tải danh sách ứng viên</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className='text-center py-12'>
                    <Users className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có ứng viên nào</h3>
                    <p className='text-gray-600'>Chưa có ai nộp hồ sơ ứng tuyển cho vị trí này.</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {applications.map((application) => (
                      <Card key={application.id} className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                          <div className='flex items-start gap-4'>
                            <Avatar className='h-16 w-16'>
                              <AvatarImage
                                src={undefined}
                                alt={`${application.user.firstName} ${application.user.lastName}`}
                              />
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg'>
                                {application.user.firstName?.charAt(0) || application.user.email.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className='flex-1'>
                              <div className='flex items-start justify-between mb-3'>
                                <div>
                                  <h4 className='text-lg font-bold text-gray-900'>
                                    {application.user.firstName} {application.user.lastName}
                                  </h4>
                                  <p className='text-sm text-gray-500'>{application.user.email}</p>
                                </div>
                                <Badge
                                  className={
                                    application.status === 2
                                      ? 'bg-green-100 text-green-800'
                                      : application.status === 3
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {application.status === 2
                                    ? 'Đã chấp nhận'
                                    : application.status === 3
                                      ? 'Đã từ chối'
                                      : 'Chờ xét duyệt'}
                                </Badge>
                              </div>

                              <div className='space-y-2 mb-4'>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <Mail className='h-4 w-4' />
                                  <span>{application.user.email}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                  <Calendar className='h-4 w-4' />
                                  <span>Nộp hồ sơ: {formatDate(application.createdAt)}</span>
                                </div>
                              </div>

                              <div className='mb-4'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Thư giới thiệu:</p>
                                <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                                  {application.coverLetter}
                                </p>
                              </div>

                              <div className='flex items-center justify-between'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='gap-2'
                                  onClick={() => window.open(application.cvFileUrl, '_blank')}
                                >
                                  <FileText className='h-4 w-4' />
                                  Xem CV
                                </Button>

                                {application.status === 1 && (
                                  <div className='flex gap-2'>
                                    <Button
                                      size='sm'
                                      className='bg-green-600 hover:bg-green-700 gap-2'
                                      onClick={() => handleAcceptApplicant(application.id)}
                                    >
                                      <CheckCircle className='h-4 w-4' />
                                      Chấp nhận
                                    </Button>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='text-red-600 hover:text-red-700 hover:bg-red-50 gap-2'
                                      onClick={() => handleRejectApplicant(application.id)}
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
