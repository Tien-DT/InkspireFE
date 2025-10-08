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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog'
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
  const { data, isLoading, error } = useUserRecruitmentsByUserId(profile?.id)

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
      setConfirmState({ isOpen: false, application: null })
      void refetchApplications()
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

        <AlertDialog open={confirmState.isOpen} onOpenChange={handleConfirmDialogOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận chấp nhận ứng viên</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmState.application
                  ? `Bạn có chắc là chấp nhận ứng viên ${getApplicantDisplayName(confirmState.application)} không?`
                  : 'Bạn có chắc là chấp nhận ứng viên này không?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={acceptApplicantMutation.isPending}>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAccept} disabled={acceptApplicantMutation.isPending}>
                {acceptApplicantMutation.isPending ? 'Đang xử lý...' : 'Có'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
