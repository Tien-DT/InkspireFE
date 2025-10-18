import { useQuery } from '@tanstack/react-query'
import { Briefcase, Clock, DollarSign, FileText, TrendingUp, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { AuthErrorBoundary } from '~/components/errors'
import { projectApi } from '~/apis/project.api'
import { userCVApi } from '~/apis/userCV.api'
import { recruitmentApi } from '~/apis/recruitment.api'
import { walletApi } from '~/apis/wallet.api'
import { getProfileFromLS } from '~/utils/auth'
import { PATH } from '~/constants/path'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

function FreelancerDashboardPage() {
  const navigate = useNavigate()
  const profile = getProfileFromLS()

  // Fetch freelancer projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['freelancer-projects', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await projectApi.getProjectsByFreelancerId(profile.id)
    },
    enabled: !!profile?.id
  })

  // Fetch user applications
  const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
    queryKey: ['user-applications', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await userCVApi.getUserApplications(profile.id, { page: 1, pageSize: 10 })
    },
    enabled: !!profile?.id
  })

  // Fetch wallet
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await walletApi.getWalletByUserId(profile.id)
    },
    enabled: !!profile?.id
  })

  // Fetch available jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['available-jobs'],
    queryFn: async () => {
      return await recruitmentApi.getRecruitments({
        page: 1,
        pageSize: 5
      })
    }
  })

  const projects = projectsData?.data || []
  const applications = applicationsData?.data?.items || []
  const wallet = walletData?.data
  const jobs = jobsData?.data?.items || []

  const activeProjects = projects.filter((p) => p.status === 1 || p.status === 2)
  const pendingApplications = applications.filter((a) => a.status === 1)

  const isLoading = projectsLoading || applicationsLoading || walletLoading

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant='outline' className='bg-yellow-500/10 text-yellow-600 border-yellow-500/20'>Đang chờ</Badge>
      case 2:
        return <Badge variant='outline' className='bg-green-500/10 text-green-600 border-green-500/20'>Chấp nhận</Badge>
      case 3:
        return <Badge variant='outline' className='bg-red-500/10 text-red-600 border-red-500/20'>Từ chối</Badge>
      default:
        return <Badge variant='outline'>Không xác định</Badge>
    }
  }

  const getProjectStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant='outline' className='bg-blue-500/10 text-blue-600 border-blue-500/20'>Đang hoạt động</Badge>
      case 2:
        return <Badge variant='outline' className='bg-purple-500/10 text-purple-600 border-purple-500/20'>Đang thực hiện</Badge>
      case 3:
        return <Badge variant='outline' className='bg-green-500/10 text-green-600 border-green-500/20'>Hoàn thành</Badge>
      case 4:
        return <Badge variant='outline' className='bg-gray-500/10 text-gray-600 border-gray-500/20'>Đã đóng</Badge>
      default:
        return <Badge variant='outline'>Không xác định</Badge>
    }
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-8'>
      {/* Welcome Banner */}
      <div className='bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-3xl p-8 text-white shadow-xl'>
        <div className='flex items-center gap-3 mb-3'>
          <h1 className='text-3xl font-bold'>
            Xin chào, {profile?.firstName} {profile?.lastName}! 👋
          </h1>
        </div>
        <p className='text-white/90 text-lg'>
          Bạn có {activeProjects.length} dự án đang hoạt động và {pendingApplications.length} đơn ứng tuyển đang chờ xử lý.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Active Projects */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Dự án đang làm</CardTitle>
            <Briefcase className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <div className='text-3xl font-bold'>{activeProjects.length}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {projects.length} tổng số dự án
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Đơn ứng tuyển</CardTitle>
            <FileText className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <div className='text-3xl font-bold'>{applications.length}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {pendingApplications.length} đang chờ xử lý
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Số dư ví</CardTitle>
            <Wallet className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {walletLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <>
                <div className='text-3xl font-bold'>
                  {wallet ? `${wallet.balance.toLocaleString('vi-VN')} ₫` : '0 ₫'}
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {wallet?.balanceFreeze ? `${wallet.balanceFreeze.toLocaleString('vi-VN')} ₫ đóng băng` : 'Không có đóng băng'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Hồ sơ</CardTitle>
            <TrendingUp className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {profile?.firstName && profile?.lastName ? '80%' : '20%'}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Hoàn thiện hồ sơ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Active Projects */}
        <Card className='border-border/40'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='h-5 w-5' />
              Dự án đang làm
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                  </div>
                ))}
              </div>
            ) : activeProjects.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Briefcase className='h-12 w-12 mx-auto mb-3 opacity-50' />
                <p>Chưa có dự án nào đang hoạt động</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-4'
                  onClick={() => navigate(PATH.jobsFreelancer)}
                >
                  Tìm công việc
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {activeProjects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className='p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-colors cursor-pointer'
                    onClick={() => navigate(`/project-detail/${project.id}`)}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-semibold line-clamp-1'>{project.title}</h4>
                      {getProjectStatusBadge(project.status)}
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                      {project.description}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      {project.client && (
                        <span>Client: {project.client.firstName} {project.client.lastName}</span>
                      )}
                      {project.deadline && (
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {formatDistanceToNow(new Date(project.deadline), { addSuffix: true, locale: vi })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {activeProjects.length > 5 && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() => navigate(PATH.manageJobs)}
                  >
                    Xem tất cả ({activeProjects.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className='border-border/40'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Đơn ứng tuyển gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <FileText className='h-12 w-12 mx-auto mb-3 opacity-50' />
                <p>Chưa có đơn ứng tuyển nào</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-4'
                  onClick={() => navigate(PATH.jobsFreelancer)}
                >
                  Tìm công việc
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {applications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className='p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-colors'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-semibold line-clamp-1'>
                        {application.recruitmentPost?.title || 'Không có tiêu đề'}
                      </h4>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                      {application.coverLetter || 'Không có thư xin việc'}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                      {application.recruitmentPost?.budget && (
                        <span className='flex items-center gap-1'>
                          <DollarSign className='h-3 w-3' />
                          {application.recruitmentPost.budget.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {applications.length > 5 && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() => navigate(PATH.manageApplications)}
                  >
                    Xem tất cả ({applications.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Jobs */}
      <Card className='border-border/40'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='h-5 w-5' />
              Công việc phù hợp với bạn
            </CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(PATH.jobsFreelancer)}
            >
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-5 w-3/4' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Briefcase className='h-12 w-12 mx-auto mb-3 opacity-50' />
              <p>Chưa có công việc nào</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {jobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className='p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-colors cursor-pointer'
                  onClick={() => navigate(`${PATH.jobsFreelancer}?id=${job.id}`)}
                >
                  <h4 className='font-semibold line-clamp-1 mb-2'>{job.title}</h4>
                  <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
                    {job.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1 text-sm font-medium text-primary'>
                      <DollarSign className='h-4 w-4' />
                      {job.budget.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className='flex gap-1'>
                      {job.skills?.slice(0, 2).map((skill) => (
                        <Badge key={skill.id} variant='secondary' className='text-xs'>
                          {skill.name}
                        </Badge>
                      ))}
                      {(job.skills?.length || 0) > 2 && (
                        <Badge variant='secondary' className='text-xs'>
                          +{(job.skills?.length || 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardFreelancer() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <FreelancerDashboardPage />
    </AuthErrorBoundary>
  )
}
