import { useQuery } from '@tanstack/react-query'
import { Briefcase, Clock, FileText, Megaphone, TrendingUp, Users, Wallet, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { AuthErrorBoundary } from '~/components/errors'
import { projectApi } from '~/apis/project.api'
import { recruitmentApi } from '~/apis/recruitment.api'
import { walletApi } from '~/apis/wallet.api'
import { statisticsApi } from '~/apis/statistics.api'
import { getProfileFromLS } from '~/utils/auth'
import { PATH } from '~/constants/path'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProjectStatus } from '~/types/recruitment.type'

function ClientDashboardPage() {
  const navigate = useNavigate()
  const profile = getProfileFromLS()

  // Fetch client's recruitment posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['client-recruitment-posts', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await recruitmentApi.getUserRecruitmentsByUserId(profile.id)
    },
    enabled: !!profile?.id
  })

  // Fetch client's projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['client-projects', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await projectApi.getProjectsByClientId(profile.id)
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

  // Fetch client spending statistics
  const { data: spendingData, isLoading: spendingLoading } = useQuery({
    queryKey: ['client-spending', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await statisticsApi.getClientSpending(profile.id)
    },
    enabled: !!profile?.id
  })

  const posts = postsData?.data || []
  const projects = projectsData?.data || []
  const wallet = walletData?.data
  const spendingStats = spendingData?.data

  // Debug: Log spending stats
  if (spendingStats) {
    console.log('Client Spending Stats:', spendingStats)
    if (spendingStats.debug) {
      console.log('Debug Info:', spendingStats.debug)
    }
  }

  const activePosts = posts.filter((p) => p.status === ProjectStatus.ACTIVE)
  const activeProjects = projects.filter((p) => p.status === 1 || p.status === 2)

  const isLoading = postsLoading || projectsLoading || walletLoading

  const getPostStatusBadge = (status: number) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return <Badge variant='outline' className='bg-green-500/10 text-green-600 border-green-500/20'>Đang tuyển</Badge>
      case ProjectStatus.DRAFT:
        return <Badge variant='outline' className='bg-gray-500/10 text-gray-600 border-gray-500/20'>Bản nháp</Badge>
      case ProjectStatus.CLOSED:
        return <Badge variant='outline' className='bg-orange-500/10 text-orange-600 border-orange-500/20'>Đã đóng</Badge>
      case ProjectStatus.COMPLETED:
        return <Badge variant='outline' className='bg-blue-500/10 text-blue-600 border-blue-500/20'>Hoàn thành</Badge>
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
          Bạn có {activePosts.length} bài đăng đang tuyển và {activeProjects.length} dự án đang thực hiện.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Active Posts */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Bài đăng đang tuyển</CardTitle>
            <Megaphone className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <div className='text-3xl font-bold'>{activePosts.length}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {posts.length} tổng số bài đăng
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Applicants - placeholder */}
        <Card className='border-border/40 hover:shadow-lg transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Ứng viên mới</CardTitle>
            <Users className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <div className='text-3xl font-bold'>0</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Đang chờ xử lý
                </p>
              </>
            )}
          </CardContent>
        </Card>

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
                  Sẵn sàng thanh toán
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spending Stats Card */}
      <Card className='border-border/40 hover:shadow-lg transition-shadow'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-base font-medium'>Tổng chi phí dự án</CardTitle>
          <DollarSign className='h-6 w-6 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          {spendingLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
          ) : (
            <div className='space-y-2'>
              <div className='text-4xl font-bold text-red-600'>
                {spendingStats ? `${spendingStats.totalSpent.toLocaleString('vi-VN')} ₫` : '0 ₫'}
              </div>
              <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                <span>Đã thanh toán: <span className='font-medium text-foreground'>{spendingStats ? `${spendingStats.totalPaid.toLocaleString('vi-VN')} ₫` : '0 ₫'}</span></span>
                <span>•</span>
                <span>{spendingStats ? spendingStats.completedProjects : 0} dự án hoàn thành</span>
                <span>•</span>
                <span>{spendingStats ? spendingStats.activeProjects : 0} dự án đang thực hiện</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Recruitment Posts */}
        <Card className='border-border/40'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <Megaphone className='h-5 w-5' />
                Bài đăng tuyển dụng
              </CardTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigate(PATH.postProject)}
              >
                Đăng tin mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Megaphone className='h-12 w-12 mx-auto mb-3 opacity-50' />
                <p className='mb-2'>Chưa có bài đăng tuyển dụng nào</p>
                <p className='text-sm'>Tạo bài đăng đầu tiên để tìm freelancer phù hợp</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-4'
                  onClick={() => navigate(PATH.postProject)}
                >
                  Đăng tin ngay
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className='p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-colors cursor-pointer'
                    onClick={() => navigate(`${PATH.managePostProject}?id=${post.id}`)}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-semibold line-clamp-1'>{post.title}</h4>
                      {getPostStatusBadge(post.status)}
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                      {post.description}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                      <span className='font-medium text-primary'>
                        {post.budget.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                ))}
                {posts.length > 5 && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() => navigate(PATH.managePostProject)}
                  >
                    Xem tất cả ({posts.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className='border-border/40'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='h-5 w-5' />
              Dự án đang thực hiện
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
                <p className='mb-2'>Chưa có dự án nào đang thực hiện</p>
                <p className='text-sm'>Các dự án của bạn sẽ hiển thị ở đây</p>
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
                      {project.freelancer && (
                        <div className='flex items-center gap-1'>
                          <Avatar className='h-5 w-5'>
                            <AvatarFallback className='text-[10px]'>
                              {project.freelancer.firstName?.charAt(0)}{project.freelancer.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{project.freelancer.firstName} {project.freelancer.lastName}</span>
                        </div>
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
                    onClick={() => navigate(PATH.manageProjects)}
                  >
                    Xem tất cả ({activeProjects.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='border-border/40'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Hành động nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Button
              variant='outline'
              className='h-auto flex-col gap-3 py-6'
              onClick={() => navigate(PATH.postProject)}
            >
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                <Megaphone className='h-6 w-6 text-primary' />
              </div>
              <span className='font-medium'>Đăng tin tuyển</span>
            </Button>

            <Button
              variant='outline'
              className='h-auto flex-col gap-3 py-6'
              onClick={() => navigate(PATH.searchFreelancer)}
            >
              <div className='h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
              <span className='font-medium'>Tìm freelancer</span>
            </Button>

            <Button
              variant='outline'
              className='h-auto flex-col gap-3 py-6'
              onClick={() => navigate(PATH.managePostProject)}
            >
              <div className='h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center'>
                <FileText className='h-6 w-6 text-green-600' />
              </div>
              <span className='font-medium'>Quản lý bài đăng</span>
            </Button>

            <Button
              variant='outline'
              className='h-auto flex-col gap-3 py-6'
              onClick={() => navigate(PATH.manageProjects)}
            >
              <div className='h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center'>
                <Briefcase className='h-6 w-6 text-purple-600' />
              </div>
              <span className='font-medium'>Quản lý dự án</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardClient() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <ClientDashboardPage />
    </AuthErrorBoundary>
  )
}
