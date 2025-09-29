import { useState } from 'react'
import { Calendar, DollarSign, Clock, User, MoreHorizontal, MessageSquare, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Progress } from '~/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

interface Project {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget: number
  currency: string
  deadline: string
  startDate: string
  progress: number
  clientName: string
  clientAvatar?: string
  category: string
  skills: string[]
  messagesCount: number
  filesCount: number
  lastActivity: string
  isOverdue?: boolean
}

interface ProjectCardProps {
  project: Project
  onView?: (projectId: string) => void
  onEdit?: (projectId: string) => void
  onChat?: (projectId: string) => void
  onSubmit?: (projectId: string) => void
  onCancel?: (projectId: string) => void
  isCompact?: boolean
}

export function ProjectCard({ 
  project, 
  onView, 
  onEdit, 
  onChat, 
  onSubmit, 
  onCancel,
  isCompact = false 
}: ProjectCardProps) {
  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'pending': return 'Chờ bắt đầu'
      case 'in_progress': return 'Đang thực hiện'
      case 'review': return 'Chờ duyệt'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'urgent': return 'Khẩn cấp'
      default: return priority
    }
  }

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return formatDate(dateString)
  }

  const isDeadlineSoon = () => {
    const deadline = new Date(project.deadline)
    const now = new Date()
    const diffInDays = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays <= 3 && diffInDays >= 0
  }

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${
      project.isOverdue ? 'border-red-200 bg-red-50' : 
      isDeadlineSoon() ? 'border-yellow-200 bg-yellow-50' : ''
    }`}>
      <CardHeader className={isCompact ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg hover:text-blue-600 cursor-pointer" onClick={() => onView?.(project.id)}>
                {project.title}
              </CardTitle>
              {project.isOverdue && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {getPriorityLabel(project.priority)}
              </Badge>
              <Badge variant="outline">
                {project.category}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(project.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChat?.(project.id)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Nhắn tin ({project.messagesCount})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {project.status === 'in_progress' && (
                <DropdownMenuItem onClick={() => onSubmit?.(project.id)}>
                  Nộp bài
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit?.(project.id)}>
                Chỉnh sửa
              </DropdownMenuItem>
              {project.status === 'pending' && (
                <DropdownMenuItem 
                  onClick={() => onCancel?.(project.id)}
                  className="text-red-600"
                >
                  Hủy dự án
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCompact && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}
        
        {/* Progress */}
        {project.status === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tiến độ</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        )}
        
        {/* Client Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.clientAvatar} />
            <AvatarFallback>
              {project.clientName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {project.clientName}
            </p>
            <p className="text-xs text-gray-500">
              Hoạt động: {formatRelativeTime(project.lastActivity)}
            </p>
          </div>
        </div>
        
        {/* Skills */}
        {!isCompact && project.skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Kỹ năng yêu cầu:</p>
            <div className="flex flex-wrap gap-1">
              {project.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {formatCurrency(project.budget, project.currency)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className={project.isOverdue ? 'text-red-600' : isDeadlineSoon() ? 'text-yellow-600' : ''}>
                {formatDate(project.deadline)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3" />
              <span>{project.messagesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{project.filesCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}