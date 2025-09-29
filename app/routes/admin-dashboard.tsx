import { useState } from 'react'
import { AdminDashboard } from '~/components/Admin/AdminDashboard'

export default function AdminDashboardRoute() {
  const [stats] = useState({
    totalUsers: 12847,
    freelancers: 8234,
    clients: 4613,
    activeProjects: 1234,
    inProgress: 856,
    pendingReview: 378,
    monthlyRevenue: 1320000000,
    commission: 750000000,
    premium: 350000000,
    advertising: 150000000,
    pendingApproval: 47,
    projects: 23,
    profiles: 24
  })

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'Freelancer mới đăng ký: Nguyễn Văn An',
      time: '2 phút trước',
      isNew: true
    },
    {
      id: 2,
      type: 'report',
      message: 'Dự án bị báo cáo: Thiết kế website bán hàng',
      time: '15 phút trước',
      isNew: true
    },
    {
      id: 3,
      type: 'payment',
      message: 'Tranh chấp thanh toán đã giải quyết: 60.000.000₫',
      time: '1 giờ trước',
      isNew: false
    },
    {
      id: 4,
      type: 'content',
      message: 'Nội dung đã bị xóa: Bình luận không phù hợp',
      time: '2 giờ trước',
      isNew: false
    },
    {
      id: 5,
      type: 'premium',
      message: 'Gói Premium được kích hoạt: Trần Thị Bình',
      time: '3 giờ trước',
      isNew: false
    }
  ]

  const quickActions = [
    {
      id: 1,
      title: 'Xem xét nội dung bị báo cáo',
      count: 12,
      action: 'Xem xét',
      onClick: () => console.log('Navigate to reported content')
    },
    {
      id: 2,
      title: 'Phê duyệt dự án chờ duyệt',
      count: 23,
      action: 'Xem xét',
      onClick: () => console.log('Navigate to pending projects')
    },
    {
      id: 3,
      title: 'Xử lý yêu cầu rút tiền',
      count: 8,
      action: 'Xem xét',
      onClick: () => console.log('Navigate to withdrawal requests')
    },
    {
      id: 4,
      title: 'Xác minh người dùng mới',
      count: 15,
      action: 'Xem xét',
      onClick: () => console.log('Navigate to user verification')
    }
  ]

  return (
    <AdminDashboard 
      stats={stats}
      activities={recentActivities}
      quickActions={quickActions}
    />
  )
}