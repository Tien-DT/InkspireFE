import { useEffect, useState, type ComponentType, type SVGProps } from 'react'
import { TrendingDown, TrendingUp, Users, Briefcase, Wallet, ShieldCheck } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { adminApi, type AdminDashboardStats } from '~/apis/admin.api'

type StatDetail = {
  label: string
  value: string
}

type StatItem = {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: ComponentType<SVGProps<SVGSVGElement>>
  details: StatDetail[]
}

export function StatsCards() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const data = await adminApi.getDashboardStats()
      const formattedStats = formatStatsData(data)
      setStats(formattedStats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      // Use default data if API fails
      setStats(getDefaultStats())
    } finally {
      setLoading(false)
    }
  }

  const formatStatsData = (data: AdminDashboardStats): StatItem[] => {
    return [
      {
        title: 'Tổng người dùng',
        value: data.userStats.totalUsers.toLocaleString('vi-VN'),
        change: `${data.userStats.userGrowthPercentage > 0 ? '+' : ''}${data.userStats.userGrowthPercentage.toFixed(1)}%`,
        trend: data.userStats.userGrowthPercentage > 0 ? 'up' : 'down',
        icon: Users,
        details: [
          { label: 'Freelancer', value: data.userStats.totalFreelancers.toLocaleString('vi-VN') },
          { label: 'Khách hàng', value: data.userStats.totalClients.toLocaleString('vi-VN') }
        ]
      },
      {
        title: 'Dự án đang hoạt động',
        value: data.projectStats.totalProjects.toLocaleString('vi-VN'),
        change: `${data.projectStats.projectGrowthPercentage > 0 ? '+' : ''}${data.projectStats.projectGrowthPercentage.toFixed(1)}%`,
        trend: data.projectStats.projectGrowthPercentage > 0 ? 'up' : 'down',
        icon: Briefcase,
        details: [
          { label: 'Đang triển khai', value: data.projectStats.activeProjects.toLocaleString('vi-VN') },
          { label: 'Chờ duyệt', value: data.projectStats.pendingProjects.toLocaleString('vi-VN') }
        ]
      },
      {
        title: 'Doanh thu tháng',
        value: `${data.transactionStats.monthlyRevenue.toLocaleString('vi-VN')}đ`,
        change: `${data.transactionStats.revenueGrowthPercentage > 0 ? '+' : ''}${data.transactionStats.revenueGrowthPercentage.toFixed(1)}%`,
        trend: data.transactionStats.revenueGrowthPercentage > 0 ? 'up' : 'down',
        icon: Wallet,
        details: [
          { label: 'Hoa hồng', value: `${data.transactionStats.commissionEarned.toLocaleString('vi-VN')}đ` },
          { label: 'Phí dịch vụ', value: `${data.transactionStats.serviceFees.toLocaleString('vi-VN')}đ` },
          { label: 'Tổng giao dịch', value: data.transactionStats.totalTransactions.toLocaleString('vi-VN') }
        ]
      },
      {
        title: 'Bài đăng tuyển dụng',
        value: data.recruitmentStats.totalRecruitmentPosts.toLocaleString('vi-VN'),
        change: `${data.recruitmentStats.recruitmentGrowthPercentage > 0 ? '+' : ''}${data.recruitmentStats.recruitmentGrowthPercentage.toFixed(1)}%`,
        trend: data.recruitmentStats.recruitmentGrowthPercentage > 0 ? 'up' : 'down',
        icon: ShieldCheck,
        details: [
          { label: 'Đang hoạt động', value: data.recruitmentStats.activeRecruitmentPosts.toLocaleString('vi-VN') },
          { label: 'Chờ duyệt', value: data.recruitmentStats.pendingApproval.toLocaleString('vi-VN') }
        ]
      }
    ]
  }

  const getDefaultStats = (): StatItem[] => [
    {
      title: 'Tổng người dùng',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      details: [
        { label: 'Freelancer', value: '0' },
        { label: 'Khách hàng', value: '0' }
      ]
    },
    {
      title: 'Dự án đang hoạt động',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Briefcase,
      details: [
        { label: 'Đang triển khai', value: '0' },
        { label: 'Chờ duyệt', value: '0' }
      ]
    },
    {
      title: 'Doanh thu tháng',
      value: '0đ',
      change: '+0%',
      trend: 'up',
      icon: Wallet,
      details: [
        { label: 'Hoa hồng', value: '0đ' },
        { label: 'Phí dịch vụ', value: '0đ' },
        { label: 'Tổng giao dịch', value: '0' }
      ]
    },
    {
      title: 'Bài đăng tuyển dụng',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: ShieldCheck,
      details: [
        { label: 'Đang hoạt động', value: '0' },
        { label: 'Chờ duyệt', value: '0' }
      ]
    }
  ]

  if (loading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='p-5 shadow-sm'>
            <div className='h-32 animate-pulse bg-gray-200 rounded'></div>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon
        const isTrendingUp = stat.trend === 'up'
        const trendClasses = isTrendingUp
          ? 'bg-emerald-100 text-emerald-600'
          : 'bg-rose-100 text-rose-600'
        const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title} className='p-5 shadow-sm'>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Icon className='h-4 w-4 text-slate-400' />
                  <span>{stat.title}</span>
                </div>
                <p className='text-2xl font-semibold tracking-tight text-slate-900'>{stat.value}</p>
                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trendClasses}`}>
                  <TrendIcon className='h-3 w-3' />
                  <span>{stat.change}</span>
                </div>
                <div className='space-y-1 pt-1'>
                  {stat.details.map((detail) => (
                    <div key={detail.label} className='flex justify-between text-xs text-muted-foreground'>
                      <span>{detail.label}</span>
                      <span className='font-medium text-slate-900'>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
