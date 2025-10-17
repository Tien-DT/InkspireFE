import { useEffect, useState, type ComponentType, type SVGProps } from 'react'
import { TrendingDown, TrendingUp, Users, Briefcase, Wallet, ShieldCheck } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { adminApi, type AdminDashboardStats } from '~/apis/admin.api'
import { cn } from '~/utils/cn'

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
  iconBgColor: string
  accentColor: string
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
        iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
        accentColor: 'text-blue-600 dark:text-blue-400',
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
        iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
        accentColor: 'text-purple-600 dark:text-purple-400',
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
        iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        accentColor: 'text-emerald-600 dark:text-emerald-400',
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
        iconBgColor: 'bg-amber-100 dark:bg-amber-900/30',
        accentColor: 'text-amber-600 dark:text-amber-400',
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
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      accentColor: 'text-blue-600 dark:text-blue-400',
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
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
      accentColor: 'text-purple-600 dark:text-purple-400',
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
      iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
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
      iconBgColor: 'bg-amber-100 dark:bg-amber-900/30',
      accentColor: 'text-amber-600 dark:text-amber-400',
      details: [
        { label: 'Đang hoạt động', value: '0' },
        { label: 'Chờ duyệt', value: '0' }
      ]
    }
  ]

  if (loading) {
    return (
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='h-40 animate-pulse bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800' />
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon
        const isTrendingUp = stat.trend === 'up'
        const trendBgClasses = isTrendingUp ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
        const trendTextClasses = isTrendingUp ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
        const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown

        return (
          <Card
            key={stat.title}
            className={cn(
              'relative overflow-hidden border-0 bg-white dark:bg-slate-950 backdrop-blur-sm',
              'transition-all duration-300'
            )}
            shadow='none'
          >
            <div className='pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-slate-200/10 to-transparent blur-2xl dark:from-slate-700/10' />
            <div className='pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-gradient-to-tr from-slate-200/10 to-transparent blur-2xl dark:from-slate-700/10' />

            <div className='relative space-y-2 p-3'>
              <div className='flex items-center justify-between'>
                <div className={cn('rounded-lg p-2', stat.iconBgColor)}>
                  <Icon className={cn('h-5 w-5', stat.accentColor)} />
                </div>
                <div className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', trendBgClasses, trendTextClasses)}>
                  <TrendIcon className='h-3 w-3' />
                  <span>{stat.change}</span>
                </div>
              </div>

              <div className='space-y-0'>
                <p className='text-xs font-medium text-muted-foreground leading-tight'>{stat.title}</p>
                <p className={cn('text-xl font-bold tracking-tight', stat.accentColor)}>{stat.value}</p>
              </div>

              <div className='border-t border-border/50 pt-1.5'>
                <div className='space-y-0.5'>
                  {stat.details.map((detail) => (
                    <div key={detail.label} className='flex items-center justify-between text-xs'>
                      <span className='text-muted-foreground'>{detail.label}</span>
                      <span className='font-semibold text-foreground'>{detail.value}</span>
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
