import { Clock, Calendar, DollarSign, Eye, MessageSquare, Upload, Loader2 } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import type { Project } from '~/apis/project.api'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { useChat } from '~/contexts/ChatContext'
import { toast } from 'sonner'

interface ProjectCardProps {
  project: Project
}

const getStatusInfo = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Bản nháp', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    case 1:
      return { label: 'Chờ ứng tuyển', color: 'text-[oklch(0.75_0.15_85)]', bgColor: 'bg-yellow-100' }
    case 2:
      return { label: 'Đang hoạt động', color: 'text-[oklch(0.55_0.15_240)]', bgColor: 'bg-blue-100' }
    case 3:
      return { label: 'Đã hoàn thành', color: 'text-[oklch(0.65_0.18_145)]', bgColor: 'bg-green-100' }
    default:
      return { label: 'Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }
}

const formatCurrency = (amount?: number) => {
  if (!amount) return 'Chưa xác định'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateString
  }
}

const getTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
  } catch {
    return ''
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const { createNewConversation } = useChat()
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  const statusInfo = getStatusInfo(project.status)
  const budget =
    project.budgetMin && project.budgetMax
      ? `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax)}`
      : formatCurrency(project.budgetMin || project.budgetMax)

  const handleChatWithFreelancer = async () => {
    if (!project.freelancerId) {
      toast.error('Không tìm thấy freelancer', {
        description: 'Dự án chưa có freelancer được chấp nhận.'
      })
      return
    }

    try {
      setIsCreatingChat(true)

      // Use ChatContext to create conversation (handles caching, state management)
      await createNewConversation(project.freelancerId)

      toast.success('Tạo cuộc trò chuyện thành công')
      navigate('/chat')
    } catch (error) {
      console.error('Failed to create conversation:', error)
      toast.error('Không thể tạo cuộc trò chuyện', {
        description: 'Vui lòng thử lại sau.'
      })
    } finally {
      setIsCreatingChat(false)
    }
  }

  return (
    <Card className='p-6'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Section */}
        <div className='flex-1'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>{project.title}</h3>
              <div className='flex items-center gap-4 text-sm text-muted-foreground flex-wrap'>
                {project.clientName && <span>{project.clientName}</span>}
                {project.freelancerName && (
                  <span className='flex items-center gap-1'>Freelancer: {project.freelancerName}</span>
                )}
                <span className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(project.createdAt)}
                </span>
                {getTimeAgo(project.createdAt) && (
                  <span className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    {getTimeAgo(project.createdAt)}
                  </span>
                )}
              </div>
            </div>
            <Badge className={`${statusInfo.bgColor} ${statusInfo.color} hover:${statusInfo.bgColor}`}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Description */}
          <div className='mb-4'>
            <p className='text-sm text-gray-700 line-clamp-2'>{project.description}</p>
          </div>

          {/* Category & Budget Info */}
          <div className='flex items-center gap-6 text-sm flex-wrap'>
            {project.category && (
              <div className='flex items-center gap-2 text-gray-600'>
                <span>Danh mục: {project.category}</span>
              </div>
            )}
            {project.deadline && (
              <div className='flex items-center gap-2 text-[oklch(0.75_0.15_85)]'>
                <Calendar className='h-4 w-4' />
                <span>Hạn: {formatDate(project.deadline)}</span>
              </div>
            )}
            {(project.budgetMin || project.budgetMax) && (
              <div className='flex items-center gap-2 text-[oklch(0.65_0.18_145)] font-semibold'>
                <DollarSign className='h-4 w-4' />
                <span>{budget}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className='flex flex-col gap-2 lg:w-[200px]'>
          <Button asChild className='w-full bg-black hover:bg-black/90 text-white'>
            <Link to={`/project-detail/${project.id}`}>
              <Eye className='h-4 w-4 mr-2' />
              Xem chi tiết
            </Link>
          </Button>
          <Button
            variant='outline'
            className='w-full bg-transparent'
            onClick={handleChatWithFreelancer}
            disabled={!project.freelancerId || isCreatingChat}
          >
            {isCreatingChat ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Đang tạo...
              </>
            ) : (
              <>
                <MessageSquare className='h-4 w-4 mr-2' />
                Nhắn tin với ứng viên
              </>
            )}
          </Button>
          <Button variant='outline' className='w-full bg-transparent'>
            <Upload className='h-4 w-4 mr-2' />
            Gửi file
          </Button>
        </div>
      </div>
    </Card>
  )
}
