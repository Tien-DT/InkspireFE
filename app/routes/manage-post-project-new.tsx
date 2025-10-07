import { Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Link } from 'react-router'
import { HydrateFallback } from '~/components/ui'
import { Button } from '~/components/ui/button'
import { PATH } from '~/constants/path'
import { useUserRecruitmentsByUserId, useRecruitmentApplications } from '~/hooks/useRecruitments'
import { getProfileFromLS } from '~/utils/auth'
import { ProjectCard, ProjectDetailsDialog, EmptyProjectsState, Pagination } from '~/components/manage-post-project'
import { AuthErrorBoundary } from '~/components/errors'

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

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [selectedPost, setSelectedPost] = useState<UserRecruitmentPost | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

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

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
        />
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
