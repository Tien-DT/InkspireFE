import { useSearchParams } from 'react-router'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { AuthErrorBoundary } from '~/components/errors'
import { JobCard } from '~/components/jobs/JobCard'
import { JobFilters } from '~/components/jobs/JobFilters'
import { ApplicationDialog } from '~/components/jobs/ApplicationDialog'
import { JobListLoading, JobListEmpty, JobListError } from '~/components/jobs/JobListStates'
import PaginationDemo from '~/components/Pagination'
import { useRecruitments } from '~/hooks/useRecruitments'
import { recruitmentApi } from '~/apis/recruitment.api'
import { getProfileFromLS } from '~/utils/auth'
import type { Job } from '~/types/job.type'

function JobsFreelancerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const pageSize = 10
  const { data: recruitmentData, isLoading, error, refetch } = useRecruitments(page, pageSize)

  const skillColors = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

  // Application Dialog State
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const jobs = useMemo(() => recruitmentData?.data || [], [recruitmentData?.data])
  const totalCount = useMemo(() => recruitmentData?.pagination?.totalCount || 0, [recruitmentData?.pagination])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() })
  }

  const handleApplyClick = (jobId: string) => {
    const profile = getProfileFromLS()
    if (!profile?.id) {
      toast.error('Vui lòng đăng nhập để ứng tuyển')
      return
    }
    setSelectedJobId(jobId)
    setIsApplyDialogOpen(true)
  }

  const handleViewDetail = (jobId: string) => {
    console.log('View detail:', jobId)
    // TODO: Navigate to job detail page
  }

  const handleApplyFilters = () => {
    console.log('Apply filters')
    // TODO: Implement filter logic
  }

  const handleClearFilters = () => {
    console.log('Clear filters')
    // TODO: Reset filters
  }

  const handleSubmitApplication = async (cvFile: File, coverLetter: string) => {
    if (!selectedJobId) return

    const profile = getProfileFromLS()
    if (!profile?.id) {
      toast.error('Vui lòng đăng nhập để ứng tuyển')
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: Upload CV to Supabase
      toast.info('Đang tải CV lên...')
      const uploadResult = await recruitmentApi.uploadCV(cvFile)

      if (!uploadResult.success || !uploadResult.data?.fileUrl) {
        throw new Error('Upload CV failed')
      }

      // Step 2: Submit application with CV URL
      toast.info('Đang gửi hồ sơ ứng tuyển...')
      await recruitmentApi.submitApplication({
        userId: profile.id,
        recruitmentPostId: selectedJobId,
        cvFileUrl: uploadResult.data.fileUrl,
        coverLetter: coverLetter.trim()
      })

      toast.success('Nộp hồ sơ ứng tuyển thành công!')

      // Close dialog and reset state
      setIsApplyDialogOpen(false)
      setSelectedJobId(null)
    } catch (error) {
      console.error('Application error:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as Error)?.message

      if (errorMessage?.includes('upload') || errorMessage?.includes('CV')) {
        toast.error('Lỗi khi tải CV lên. Vui lòng thử lại!')
      } else {
        toast.error('Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại!')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open && !isSubmitting) {
      setIsApplyDialogOpen(false)
      setSelectedJobId(null)
    }
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Left Sidebar - Filters */}
        <div className='lg:col-span-1'>
          <JobFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
        </div>

        {/* Main Content - Job Listings */}
        <div className='lg:col-span-3'>
          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-gray-900'>
              {isLoading ? 'Đang tải dữ liệu...' : error ? 'Có lỗi xảy ra' : `Tìm thấy ${totalCount} công việc phù hợp`}
            </h1>
          </div>

          {/* Loading State */}
          {isLoading && <JobListLoading />}

          {/* Error State */}
          {error && <JobListError error={error as Error} onRetry={() => refetch()} />}

          {/* Empty State */}
          {!isLoading && !error && jobs.length === 0 && <JobListEmpty />}

          {/* Job Cards */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className='space-y-8'>
              {jobs.map((job: Job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={handleApplyClick}
                  onViewDetail={handleViewDetail}
                  skillColors={skillColors}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className='mt-8'>
              <PaginationDemo
                currentPage={page}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      <ApplicationDialog
        open={isApplyDialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleSubmitApplication}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default function JobsFreelancer() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <JobsFreelancerPage />
    </AuthErrorBoundary>
  )
}
