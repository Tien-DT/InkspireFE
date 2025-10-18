import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Briefcase, CheckCircle2, Lock, Megaphone, PenSquare } from 'lucide-react'
import { Suspense, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { AuthErrorBoundary } from '~/components/errors'
import { EmptyProjectsState, ProjectCard, ProjectDetailsDialog } from '~/components/manage-post-project'
import PaginationDemo from '~/components/Pagination'
import { PageHeader, UnifiedStatsCards, FilterTabs } from '~/components/shared'
import type { StatsCardConfig as SharedStatsCardConfig, FilterOption } from '~/components/shared'
import { projectApi } from '~/apis/project.api'
import { recruitmentApi } from '~/apis/recruitment.api'
import { userCVApi } from '~/apis/userCV.api'
import { useChat } from '~/contexts/ChatContext'
import { useRecruitmentApplications, useUserRecruitmentsByUserId } from '~/hooks/useRecruitments'
import { PATH } from '~/constants/path'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { HydrateFallback } from '~/components/ui'
import { Button } from '~/components/ui/button'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { RecruitmentPostListSkeleton } from '~/components/skeletons'
import { ProjectStatus, type Application } from '~/types/recruitment.type'
import { getProfileFromLS } from '~/utils/auth'

type StatusFilter = 'all' | 'active' | 'draft' | 'closed' | 'completed'

const STATUS_VALUES: StatusFilter[] = ['all', 'active', 'draft', 'closed', 'completed']

const isStatusFilter = (value: string | null): value is StatusFilter => {
  return value ? (STATUS_VALUES as string[]).includes(value) : false
}

const STATUS_MAP: Record<Exclude<StatusFilter, 'all'>, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  draft: ProjectStatus.DRAFT,
  closed: ProjectStatus.CLOSED,
  completed: ProjectStatus.COMPLETED
}

const PAGE_SIZE = 5

interface StatusCounts {
  all: number
  active: number
  draft: number
  closed: number
  completed: number
}

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
  const navigate = useNavigate()
  const { createNewConversation } = useChat()
  const { data, isLoading, error, refetch: refetchPosts } = useUserRecruitmentsByUserId(profile?.id)

  const [searchParams, setSearchParams] = useSearchParams()
  const parsedPage = Number(searchParams.get('page') ?? '1')
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1
  const currentStatus = searchParams.get('status')
  const activeStatus: StatusFilter = isStatusFilter(currentStatus) ? currentStatus : 'all'
  const [selectedPost, setSelectedPost] = useState<UserRecruitmentPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [pendingApplicationId, setPendingApplicationId] = useState<string | null>(null)
  const [rejectingApplicationId, setRejectingApplicationId] = useState<string | null>(null)
  const [sendingMessageToId, setSendingMessageToId] = useState<string | null>(null)
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    application: Application | null
  }>({ isOpen: false, application: null })
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean
    postId: string | null
    postTitle: string | null
  }>({ isOpen: false, postId: null, postTitle: null })
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

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

  const rejectApplicantMutation = useMutation({
    mutationFn: (applicationId: string) => userCVApi.updateApplicationStatus(applicationId, 3), // 3 = REJECTED
    onSuccess: () => {
      void refetchApplications()
      toast.success('Đã từ chối ứng viên', {
        description: 'Ứng viên đã được thông báo về quyết định của bạn.'
      })
    },
    onError: (error: unknown) => {
      const axiosMessage = isAxiosError(error) ? error.response?.data?.message : undefined
      const message =
        axiosMessage ??
        (error instanceof Error ? error.message : 'Có lỗi xảy ra khi từ chối ứng viên. Vui lòng thử lại.')

      toast.error('Không thể từ chối ứng viên', {
        description: message
      })
    },
    onSettled: () => {
      setRejectingApplicationId(null)
    }
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => recruitmentApi.deleteRecruitmentPost(postId),
    onSuccess: () => {
      void refetchPosts()
      setDeleteConfirmState({ isOpen: false, postId: null, postTitle: null })
      toast.success('Xóa bài đăng thành công', {
        description: 'Bài đăng tuyển dụng đã được xóa khỏi hệ thống.'
      })
    },
    onError: (error: unknown) => {
      const axiosMessage = isAxiosError(error) ? error.response?.data?.message : undefined
      const message =
        axiosMessage ??
        (error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa bài đăng. Vui lòng thử lại.')

      toast.error('Không thể xóa bài đăng', {
        description: message
      })
    },
    onSettled: () => {
      setDeletingPostId(null)
    }
  })

  const applications = applicationsData?.data?.items ?? []
  const recruitmentPosts = useMemo(() => data?.data ?? [], [data])

  const sortedPosts = useMemo(() => {
    return [...recruitmentPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [recruitmentPosts])

  const statusCounts = useMemo<StatusCounts>(
    () =>
      sortedPosts.reduce<StatusCounts>(
        (acc, post) => {
          acc.all += 1
          if (post.status === ProjectStatus.DRAFT) acc.draft += 1
          if (post.status === ProjectStatus.ACTIVE) acc.active += 1
          if (post.status === ProjectStatus.CLOSED) acc.closed += 1
          if (post.status === ProjectStatus.COMPLETED) acc.completed += 1
          return acc
        },
        { all: 0, active: 0, draft: 0, closed: 0, completed: 0 }
      ),
    [sortedPosts]
  )

  const filteredPosts = useMemo(() => {
    if (activeStatus === 'all') return sortedPosts
    const targetStatus = STATUS_MAP[activeStatus]
    return sortedPosts.filter((post) => post.status === targetStatus)
  }, [sortedPosts, activeStatus])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const currentPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE)

  const statsCards = useMemo<SharedStatsCardConfig[]>(
    () => [
      {
        key: 'all',
        label: 'Tổng bài đăng',
        description: 'Tất cả tin tuyển dụng của bạn',
        value: statusCounts.all,
        icon: Briefcase,
        accent: 'from-primary/20 via-primary/5 to-transparent'
      },
      {
        key: 'active',
        label: 'Đang tuyển',
        description: 'Đang hiển thị và nhận hồ sơ',
        value: statusCounts.active,
        icon: Megaphone,
        accent: 'from-emerald-200/40 via-transparent to-transparent'
      },
      {
        key: 'draft',
        label: 'Bản nháp',
        description: 'Đang chỉnh sửa trước khi đăng',
        value: statusCounts.draft,
        icon: PenSquare,
        accent: 'from-slate-200/40 via-transparent to-transparent'
      },
      {
        key: 'closed',
        label: 'Đã đóng',
        description: 'Tạm dừng tuyển ứng viên',
        value: statusCounts.closed,
        icon: Lock,
        accent: 'from-amber-200/40 via-transparent to-transparent'
      },
      {
        key: 'completed',
        label: 'Hoàn thành',
        description: 'Đã tuyển đủ nhân sự',
        value: statusCounts.completed,
        icon: CheckCircle2,
        accent: 'from-blue-200/40 via-transparent to-transparent'
      }
    ],
    [statusCounts]
  )

  const filterOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: 'Tất cả', count: statusCounts.all },
      { value: 'active', label: 'Đang tuyển', count: statusCounts.active },
      { value: 'draft', label: 'Bản nháp', count: statusCounts.draft },
      { value: 'closed', label: 'Đã đóng', count: statusCounts.closed },
      { value: 'completed', label: 'Hoàn thành', count: statusCounts.completed }
    ],
    [statusCounts]
  )

  const handleStatusChange = (status: string) => {
    if (!isStatusFilter(status)) return
    const params = new URLSearchParams(searchParams)
    params.set('status', status)
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', Math.max(1, newPage).toString())
    params.set('status', activeStatus)
    setSearchParams(params)
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
    if (rejectApplicantMutation.isPending) return
    setRejectingApplicationId(application.id)
    rejectApplicantMutation.mutate(application.id)
  }

  const handleSendMessage = async (application: Application) => {
    const freelancerId = application.user?.id || application.userId
    if (!freelancerId) {
      toast.error('Không tìm thấy thông tin freelancer')
      return
    }

    console.log('[handleSendMessage] Creating conversation with freelancerId:', freelancerId)

    try {
      setSendingMessageToId(application.id)

      // Use ChatContext to create conversation (handles caching, state management)
      const conversation = await createNewConversation(freelancerId)
      console.log('[handleSendMessage] Conversation created:', conversation)

      toast.success('Tạo cuộc trò chuyện thành công')
      navigate('/chat')
    } catch (error) {
      console.error('[handleSendMessage] Failed to create conversation:', error)
      toast.error('Không thể tạo cuộc trò chuyện', {
        description: 'Vui lòng thử lại sau.'
      })
    } finally {
      setSendingMessageToId(null)
    }
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

  const handleEditPost = (post: UserRecruitmentPost) => {
    navigate(`/edit-recruitment-post/${post.id}`)
  }

  const handleDeletePost = (post: UserRecruitmentPost) => {
    setDeleteConfirmState({
      isOpen: true,
      postId: post.id,
      postTitle: post.title
    })
  }

  const handleConfirmDelete = () => {
    const postId = deleteConfirmState.postId
    if (!postId || deletePostMutation.isPending) return

    setDeletingPostId(postId)
    deletePostMutation.mutate(postId)
  }

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!deletePostMutation.isPending) {
      setDeleteConfirmState((prev) => ({
        isOpen: open,
        postId: open ? prev.postId : null,
        postTitle: open ? prev.postTitle : null
      }))
    }
  }

  const hasError = Boolean(error)
  const applicationsErrorEntity = applicationsError instanceof Error ? applicationsError : null

  return (
    <Suspense fallback={<HydrateFallback variant='details' showHeader />}>
      <main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-10'>
        <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 md:px-6 lg:px-10'>
          <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md backdrop-blur-sm md:p-10'>
            <PageHeader
              badge='Quản lý tuyển dụng'
              title='Quản lý bài đăng tuyển dụng'
              description='Theo dõi tiến độ, xem ứng viên và cập nhật tin tuyển dụng trong một nơi.'
              actionLabel='Đăng tin mới'
              actionHref={PATH.postProject}
            />

            <div className='mt-8 space-y-6'>
              <UnifiedStatsCards cards={statsCards} isLoading={isLoading} />
              <FilterTabs options={filterOptions} activeValue={activeStatus} onChange={handleStatusChange} />
            </div>
          </section>

          <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md backdrop-blur-sm md:p-8'>
            {hasError ? (
              <div className='rounded-3xl border border-destructive/30 bg-destructive/10 p-10 text-center text-destructive'>
                <h3 className='text-lg font-semibold'>Có lỗi xảy ra</h3>
                <p className='mt-2 text-sm text-destructive/80'>
                  Không thể tải dữ liệu bài đăng. Vui lòng thử lại sau.
                </p>
              </div>
            ) : isLoading ? (
              <RecruitmentPostListSkeleton />
            ) : currentPosts.length === 0 ? (
              <EmptyProjectsState />
            ) : (
              <div className='grid gap-6'>
                {currentPosts.map((post) => (
                  <ProjectCard
                    key={post.id}
                    post={post}
                    onView={() => handleViewPost(post)}
                    onEdit={() => handleEditPost(post)}
                    onDelete={() => handleDeletePost(post)}
                    onShare={() => console.log('Share:', post.id)}
                    onViewApplicants={() => handleViewPost(post)}
                  />
                ))}
              </div>
            )}

            {!isLoading && !hasError && filteredPosts.length > 0 && totalPages > 1 && (
              <PaginationDemo currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </section>
        </div>

        <ProjectDetailsDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          project={selectedPost}
          applications={applications}
          applicationsLoading={applicationsLoading}
          applicationsError={applicationsErrorEntity}
          onAcceptApplicant={handleAcceptApplicant}
          onRejectApplicant={handleRejectApplicant}
          onSendMessage={handleSendMessage}
          acceptingApplicantId={pendingApplicationId}
          rejectingApplicantId={rejectingApplicationId}
          sendingMessageToId={sendingMessageToId}
        />

        <Dialog open={confirmState.isOpen} onOpenChange={handleConfirmDialogOpenChange}>
          <DialogContent className='sm:max-w-md rounded-3xl border border-border/40 bg-card/95 p-8 text-center shadow-xl'>
            <DialogHeader className='mb-4 space-y-3 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <CheckCircle2 className='h-8 w-8' />
              </div>
              <DialogTitle className='text-2xl font-semibold text-foreground'>Xác nhận chấp nhận ứng viên</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {confirmState.application ? (
                  <>
                    Bạn có chắc chắn muốn chấp nhận ứng viên{' '}
                    <span className='font-semibold text-foreground'>
                      {getApplicantDisplayName(confirmState.application)}
                    </span>{' '}
                    cho dự án này không?
                  </>
                ) : (
                  'Bạn có chắc chắn muốn chấp nhận ứng viên này không?'
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex-row justify-between gap-3'>
              <Button
                variant='ghost'
                onClick={() => handleConfirmDialogOpenChange(false)}
                disabled={acceptApplicantMutation.isPending}
                className='flex-1 rounded-full border border-border/40 px-4 text-sm font-medium text-muted-foreground hover:border-border'
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmAccept}
                disabled={acceptApplicantMutation.isPending}
                className='flex-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
              >
                {acceptApplicantMutation.isPending ? (
                  <span className='flex items-center justify-center gap-2'>
                    <ButtonSpinner className='text-white' />
                    Đang xử lý...
                  </span>
                ) : (
                  'Chấp nhận'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteConfirmState.isOpen} onOpenChange={handleDeleteDialogOpenChange}>
          <DialogContent className='sm:max-w-md rounded-3xl border border-destructive/40 bg-card/95 p-8 text-center shadow-xl'>
            <DialogHeader className='mb-4 space-y-3 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M3 6h18' />
                  <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                  <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                  <line x1='10' x2='10' y1='11' y2='17' />
                  <line x1='14' x2='14' y1='11' y2='17' />
                </svg>
              </div>
              <DialogTitle className='text-2xl font-semibold text-foreground'>Xác nhận xóa bài đăng</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {deleteConfirmState.postTitle ? (
                  <>
                    Bạn có chắc chắn muốn xóa bài đăng{' '}
                    <span className='font-semibold text-foreground'>&quot;{deleteConfirmState.postTitle}&quot;</span>{' '}
                    không? Hành động này không thể hoàn tác.
                  </>
                ) : (
                  'Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.'
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex-row justify-between gap-3'>
              <Button
                variant='ghost'
                onClick={() => handleDeleteDialogOpenChange(false)}
                disabled={deletePostMutation.isPending}
                className='flex-1 rounded-full border border-border/40 px-4 text-sm font-medium text-muted-foreground hover:border-border'
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deletePostMutation.isPending}
                className='flex-1 rounded-full bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90'
              >
                {deletePostMutation.isPending ? (
                  <span className='flex items-center justify-center gap-2'>
                    <ButtonSpinner className='text-white' />
                    Đang xử lý...
                  </span>
                ) : (
                  'Xóa bài đăng'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
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
