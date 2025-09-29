import { useState } from 'react'
import { Plus, Calendar, MessageSquare, TrendingUp, Briefcase, Star, Clock, DollarSign } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { FreelancerStatCard, createFreelancerStats } from './FreelancerStatCard'
import { ProjectCard } from './ProjectCard'

interface FreelancerDashboardProps {
  stats: {
    monthlyEarnings: number
    earningsChange: number
    activeProjects: number
    projectsChange: number
    rating: number
    totalReviews: number
    hoursWorked: number
    hoursChange: number
  }
  recentProjects: any[]
  notifications: {
    id: string
    type: 'message' | 'project' | 'payment' | 'review'
    title: string
    description: string
    time: string
    read: boolean
  }[]
  onCreateProject?: () => void
  onViewProject?: (projectId: string) => void
  onChatClient?: (projectId: string) => void
  onViewAllProjects?: () => void
  onViewProfile?: () => void
}

export function FreelancerDashboard({
  stats,
  recentProjects,
  notifications,
  onCreateProject,
  onViewProject,
  onChatClient,
  onViewAllProjects,
  onViewProfile
}: FreelancerDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth')

  const dashboardStats = [
    createFreelancerStats.earnings(stats.monthlyEarnings, stats.earningsChange),
    createFreelancerStats.activeProjects(stats.activeProjects, stats.projectsChange),
    createFreelancerStats.rating(stats.rating, stats.totalReviews),
    createFreelancerStats.hoursWorked(stats.hoursWorked, stats.hoursChange)
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4" />
      case 'project': return <Briefcase className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'review': return <Star className="h-4 w-4" />
      default: return null
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'bg-blue-100 text-blue-600'
      case 'project': return 'bg-green-100 text-green-600'
      case 'payment': return 'bg-yellow-100 text-yellow-600'
      case 'review': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại! Đây là tổng quan công việc của bạn.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onViewProfile}>
            Xem hồ sơ
          </Button>
          <Button onClick={onCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo proposal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <FreelancerStatCard 
            key={index} 
            stat={stat} 
            onClick={() => {
              if (index === 1) onViewAllProjects?.()
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Dự án gần đây</span>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onViewAllProjects}>
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isCompact
                    onView={onViewProject}
                    onChat={onChatClient}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có dự án nào</p>
                  <Button variant="outline" className="mt-2" onClick={onCreateProject}>
                    Tạo proposal đầu tiên
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onCreateProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo proposal mới
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onViewAllProjects}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Quản lý dự án
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onViewProfile}
              >
                <Star className="h-4 w-4 mr-2" />
                Cập nhật hồ sơ
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Xem thống kê
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Thông báo</span>
                </CardTitle>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Không có thông báo mới</p>
                </div>
              )}
              {notifications.length > 5 && (
                <Button variant="ghost" className="w-full text-sm">
                  Xem tất cả thông báo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Hiệu suất</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phản hồi tích cực</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thời gian phản hồi</span>
                  <span className="font-medium">&lt; 2h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}