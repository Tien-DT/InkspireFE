import { isAxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { HydrateFallback } from '~/components/ui'
import { Button } from '~/components/ui/button'
import { PATH } from '~/constants/path'
import { useUserRecruitmentsByUserId, useRecruitmentApplications } from '~/hooks/useRecruitments'
import { getProfileFromLS } from '~/utils/auth'
import { ProjectCard, ProjectDetailsDialog, EmptyProjectsState } from '~/components/manage-post-project'
import PaginationDemo from '~/components/Pagination'
import { AuthErrorBoundary } from '~/components/errors'
import { projectApi } from '~/apis/project.api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { ProjectStatus, type Application } from '~/types/recruitment.type'

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

function ManagePostProjectPage() {
  const profile = getProfileFromLS()
  const { data, isLoading, error, refetch: refetchPosts } = useUserRecruitmentsByUserId(profile?.id)

  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = 5
  const [selectedPost, setSelectedPost] = useState<UserRecruitmentPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [pendingApplicationId, setPendingApplicationId] = useState<string | null>(null)
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    application: Application | null
  }>({ isOpen: false, application: null })

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications
  } = useRecruitmentApplications(selectedPost?.id, { page: 1, pageSize: 100 })

  type AcceptApplicantVariables = {
    recruitmentPostId: string
    freelancerId: string
    status: ProjectStatus
    applicantName: string
  }

  const getApplicantDisplayName = (application: Application) => {
    const nameParts = [application.user?.firstName, application.user?.lastName].filter((part): part is string =>
      Boolean(part)
    )
    return nameParts.join(' ') || application.user?.email || 'ứng viên'
  }

  const acceptApplicantMutation = useMutation({
    mutationFn: ({ recruitmentPostId, freelancerId, status }: AcceptApplicantVariables) =>
      projectApi.updateProjectByRecruitment(recruitmentPostId, { recruitmentPostId, freelancerId, status }),
    onSuccess: (response, variables) => {
      console.log('Accept applicant response:', response)
      setConfirmState({ isOpen: false, application: null })
      void refetchApplications()
      void refetchPosts() // Refresh the posts list to update status
      const responseMessage = (response as { message?: string } | undefined)?.message
      toast.success('Chấp nhận ứng viên thành công', {
        description:
          responseMessage ??
          (variables.applicantName
            ? `Ứng viên ${variables.applicantName} đã được chấp nhận cho dự án của bạn.`
            : 'Ứng viên đã được chấp nhận cho dự án của bạn.')
      })
    },
    onError: (error: unknown) => {
      const axiosMessage = isAxiosError(error) ? error.response?.data?.message : undefined
      const message =
        axiosMessage ??
        (error instanceof Error ? error.message : 'Có lỗi xảy ra khi chấp nhận ứng viên. Vui lòng thử lại.')

      toast.error('Không thể chấp nhận ứng viên', {
        description: message
      })
    },
    onSettled: () => {
      setPendingApplicationId(null)
    }
  })

  const applications = applicationsData?.data?.items || []
  const recruitmentPosts = data?.data || []
  const totalPages = Math.ceil(recruitmentPosts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentPosts = recruitmentPosts.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() })
  }

  const handleViewPost = (post: UserRecruitmentPost) => {
    setSelectedPost(post)
    setIsViewDialogOpen(true)
  }

  const handleAcceptApplicant = (application: Application) => {
    if (!selectedPost) {
      toast.error('Không tìm thấy bài đăng tuyển dụng hiện tại. Vui lòng thử lại.')
      return
    }

    setConfirmState({ isOpen: true, application })
  }

  const handleRejectApplicant = (application: Application) => {
    // TODO: Call API to update application status
    console.log('Reject applicant:', application.id)
  }

  const handleConfirmDialogOpenChange = (open: boolean) => {
    setConfirmState((prev) => ({
      isOpen: open,
      application: open ? prev.application : null
    }))
  }

  const handleConfirmAccept = () => {
    if (!selectedPost) {
      toast.error('Không tìm thấy bài đăng tuyển dụng hiện tại. Vui lòng thử lại.')
      setConfirmState({ isOpen: false, application: null })
      return
    }

    if (acceptApplicantMutation.isPending) return

    const application = confirmState.application
    if (!application) return

    const freelancerId = application.user?.id ?? application.userId
    if (!freelancerId) {
      toast.error('Không tìm thấy thông tin freelancer cho ứng viên này.')
      return
    }

    const applicantDisplayName = getApplicantDisplayName(application)

    setPendingApplicationId(application.id)
    acceptApplicantMutation.mutate({
      recruitmentPostId: selectedPost.id,
      freelancerId,
      status: ProjectStatus.CLOSED,
      applicantName: applicantDisplayName
    })
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
          <EmptyProjectsState />
        ) : (
          <>
            <div className='grid gap-6'>
              {currentPosts.map((post) => (
                <ProjectCard
                  key={post.id}
                  post={post}
                  onView={() => handleViewPost(post)}
                  onEdit={() => console.log('Edit:', post.id)}
                  onDelete={() => console.log('Delete:', post.id)}
                  onShare={() => console.log('Share:', post.id)}
                  onViewApplicants={() => handleViewPost(post)}
                />
              ))}
            </div>

            <div className='mt-8'>
              <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </>
        )}

        <ProjectDetailsDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          project={selectedPost}
          applications={applications}
          applicationsLoading={applicationsLoading}
          applicationsError={applicationsError}
          onAcceptApplicant={handleAcceptApplicant}
          onRejectApplicant={handleRejectApplicant}
          acceptingApplicantId={pendingApplicationId}
        />

        <Dialog open={confirmState.isOpen} onOpenChange={handleConfirmDialogOpenChange}>
          <DialogContent className='sm:max-w-md bg-white'>
            <DialogHeader className='mb-5'>
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Xác nhận chấp nhận ứng viên</DialogTitle>
                <DialogDescription className='text-gray-600'>
                  {confirmState.application ? (
                    <>
                      Bạn có chắc chắn muốn chấp nhận ứng viên{' '}
                      <span className='font-semibold text-gray-900'>
                        {getApplicantDisplayName(confirmState.application)}
                      </span>{' '}
                      cho dự án này không?
                      <br />
                    </>
                  ) : (
                    'Bạn có chắc chắn muốn chấp nhận ứng viên này không?'
                  )}
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter className='flex-row gap-3 sm:justify-between'>
              <Button
                variant='outline'
                onClick={() => handleConfirmDialogOpenChange(false)}
                disabled={acceptApplicantMutation.isPending}
                className='flex-1'
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmAccept}
                disabled={acceptApplicantMutation.isPending}
                className='flex-1 bg-black hover:bg-black/90 text-white'
              >
                {acceptApplicantMutation.isPending ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Chấp nhận'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

export default function ManagePostProject() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <ManagePostProjectPage />
    </AuthErrorBoundary>
  )
}
