import { useState } from 'react'
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock
} from 'lucide-react'
import { StatCard } from './StatCard'
import { RecentActivities } from './RecentActivities'
import { QuickActions } from './QuickActions'

interface DashboardStats {
  totalUsers: number
  freelancers: number
  clients: number
  activeProjects: number
  inProgress: number
  pendingReview: number
  monthlyRevenue: number
  commission: number
  premium: number
  advertising: number
  pendingApproval: number
  projects: number
  profiles: number
}

interface DashboardProps {
  stats: DashboardStats
  activities: Array<{
    id: number
    type: string
    message: string
    time: string
    isNew?: boolean
  }>
  quickActions: Array<{
    id: number
    title: string
    count: number
    action: string
    onClick?: () => void
  }>
}

export function AdminDashboard({ stats, activities, quickActions }: DashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan bảng điều khiển</h1>
        <p className="text-gray-600">Chào mừng trở lại!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          changePercent={12}
          isPositive={true}
          formatValue={formatNumber}
          subStats={[
            { label: "Freelancer", value: stats.freelancers },
            { label: "Khách hàng", value: stats.clients }
          ]}
        />

        <StatCard
          title="Dự án đang hoạt động"
          value={stats.activeProjects}
          icon={FileText}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          changePercent={8}
          isPositive={true}
          formatValue={formatNumber}
          subStats={[
            { label: "Đang thực hiện", value: stats.inProgress },
            { label: "Chờ duyệt", value: stats.pendingReview }
          ]}
        />

        <StatCard
          title="Doanh thu tháng"
          value={stats.monthlyRevenue}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          changePercent={15}
          isPositive={true}
          formatValue={formatCurrency}
          subStats={[
            { label: "Hoa hồng", value: stats.commission },
            { label: "Premium", value: stats.premium },
            { label: "Advertising", value: stats.advertising }
          ]}
        />

        <StatCard
          title="Chờ phê duyệt"
          value={stats.pendingApproval}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          changePercent={5}
          isPositive={false}
          formatValue={formatNumber}
          subStats={[
            { label: "Dự án", value: stats.projects },
            { label: "Hồ sơ", value: stats.profiles }
          ]}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={activities} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  )
}