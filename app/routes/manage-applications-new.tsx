import { useState, useMemo } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
// import { Briefcase, XCircle } from 'lucide-react'
import {
  // StatsCard,
  // FilterTabs,
  ApplicationCard,
  EmptyApplicationsState
} from '~/components/manage-applications'
import type { JobApplication, FilterStatus } from '~/components/manage-applications'
import { Card, CardContent } from '~/components/ui/card'
import { AuthErrorBoundary } from '~/components/errors'
import { useAuth } from '~/contexts/AuthContext'
import { useUserApplications } from '~/hooks/useUserCVs'
import { userCVApi } from '~/apis/userCV.api'
import type { UserCVDto } from '~/types/userCV.type'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const mapApplicationStatus = (status: number | null): 'pending' | 'accepted' | 'rejected' | 'withdrawn' => {
  switch (status) {
    case 0:
      return 'pending'
    case 1:
      return 'accepted'
    case 2:
      return 'rejected'
    case 3:
      return 'withdrawn'
    default:
      return 'pending'
  }
}

const transformUserCVToApplication = (userCV: UserCVDto): JobApplication => {
  const recruitmentPost = userCV.recruitmentPost

  return {
    id: userCV.id,
    jobId: userCV.recruitmentPostId,
    jobTitle: recruitmentPost?.title || 'Không có tiêu đề',
    companyName: recruitmentPost?.userName || 'N/A',
    location: 'Việt Nam',
    budget: {
      min: 0,
      max: recruitmentPost?.budget || 0,
      currency: 'VND'
    },
    appliedDate: userCV.createdAt || '',
    status: mapApplicationStatus(userCV.status),
    jobDescription: recruitmentPost?.description || 'Không có mô tả',
    requiredSkills: recruitmentPost?.skills?.map((skill) => skill.name) || ['Không có kỹ năng yêu cầu'],
    projectDuration: recruitmentPost?.duration || 'Chưa xác định',
    teamSize: parseInt(recruitmentPost?.teamSize || '1'),
    postedDate: recruitmentPost?.createdAt || '',
    deadline: recruitmentPost?.postExpired || '',
    categories: ['Không có danh mục'], // UserCV doesn't have categories in response
    coverLetter: userCV.coverLetter || 'Không có thư xin việc',
    proposedRate: 0, // UserCV doesn't have proposed rate
    estimatedTime: 'Chưa xác định' // UserCV doesn't have estimated time
  }
}

function ManageApplicationsPage() {
  const { profile } = useAuth()
  const [filterStatus] = useState<FilterStatus>('all')
  const queryClient = useQueryClient()

  // Fetch user applications (UserCV) from API
  const { data: userCVsData, isLoading, error } = useUserApplications(profile?.id)

  // Transform API data to applications
  const applications = useMemo(() => {
    if (!userCVsData?.data?.items) return []
    return userCVsData.data.items.map(transformUserCVToApplication)
  }, [userCVsData])

  // Mutation to delete application
  const withdrawMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      if (!profile?.id) throw new Error('User not authenticated')
      return await userCVApi.deleteCV(applicationId, profile.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications', profile?.id] })
      toast.success('Đã hủy nộp CV thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể hủy nộp CV: ${error.message}`)
    }
  })

  const handleWithdrawApplication = (applicationId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy nộp CV này?')) {
      withdrawMutation.mutate(applicationId)
    }
  }

  // Show all applications (no filtering)
  const filteredApplications = applications

  // const filteredApplications = applications.filter((app) => {
  //   if (filterStatus === 'all') return true
  //   return app.status === filterStatus
  // })

  // const stats = {
  //   total: applications.length,
  //   pending: applications.filter((app) => app.status === 'pending').length,
  //   accepted: applications.filter((app) => app.status === 'accepted').length,
  //   rejected: applications.filter((app) => app.status === 'rejected').length
  // }

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-gradient mb-2'>Quản lý ứng tuyển</h1>
            <p className='text-gray-600'>Theo dõi và quản lý các công việc bạn đã ứng tuyển</p>
          </div>
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
            <span className='ml-3 text-lg text-gray-600'>Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-gradient mb-2'>Quản lý ứng tuyển</h1>
            <p className='text-gray-600'>Theo dõi và quản lý các công việc bạn đã ứng tuyển</p>
          </div>
          <Card>
            <CardContent className='py-16 text-center'>
              <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Không thể tải dữ liệu</h3>
              <p className='text-gray-600'>Đã xảy ra lỗi khi tải danh sách ứng tuyển. Vui lòng thử lại sau.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <StatsCard
            label='Tổng ứng tuyển'
            value={stats.total}
            icon={Briefcase}
            iconColor='text-blue-500'
            valueColor='text-gray-900'
            onClick={() => setFilterStatus('all')}
          />
          <StatsCard
            label='Đang chờ'
            value={stats.pending}
            icon={AlertCircle}
            iconColor='text-yellow-500'
            valueColor='text-yellow-600'
            onClick={() => setFilterStatus('pending')}
          />
          <StatsCard
            label='Bị từ chối'
            value={stats.rejected}
            icon={XCircle}
            iconColor='text-red-500'
            valueColor='text-red-600'
            onClick={() => setFilterStatus('rejected')}
          />
        </div> */}

        {/* Filter Tabs */}
        {/* <FilterTabs activeFilter={filterStatus} onFilterChange={setFilterStatus} /> */}

        {/* Applications List */}
        <div className='space-y-4'>
          {filteredApplications.length === 0 ? (
            <EmptyApplicationsState filterStatus={filterStatus} />
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onWithdraw={() => handleWithdrawApplication(application.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function ManageApplications() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <ManageApplicationsPage />
    </AuthErrorBoundary>
  )
}
