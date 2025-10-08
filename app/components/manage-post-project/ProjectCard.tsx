import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Calendar, DollarSign, Edit, Eye, MessageCircle, Share2, Trash2, Users } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProjectStatus } from '~/types/recruitment.type'

interface Skill {
  id: string
  name: string
}

interface ProjectCardProps {
  post: {
    id: string
    title: string
    description: string
    projectName: string
    budget: number
    teamSize: string
    createdAt: string
    status: number
    skills: Skill[]
  }
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onViewApplicants?: () => void
}

const statusConfig = {
  [ProjectStatus.DRAFT]: {
    label: 'Bản nháp',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  },
  [ProjectStatus.ACTIVE]: {
    label: 'Đang tuyển',
    className: 'bg-green-100 text-green-800 hover:bg-green-100'
  },
  [ProjectStatus.CLOSED]: {
    label: 'Đã đóng',
    className: 'bg-red-100 text-red-800 hover:bg-red-100'
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Hoàn thành',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  }
}

const skillColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700'
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function ProjectCard({ post, onView, onEdit, onDelete, onShare, onViewApplicants }: ProjectCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <h2 className='text-xl font-bold text-gray-900'>{post.title}</h2>
              <Badge className={statusConfig[post.status as ProjectStatus]?.className || ''}>
                {statusConfig[post.status as ProjectStatus]?.label || 'Không xác định'}
              </Badge>
            </div>
            <p className='text-gray-600 line-clamp-2'>{post.description}</p>
          </div>
          <div className='flex gap-2 ml-4'>
            <Button variant='outline' size='sm' onClick={onView}>
              <Eye className='h-4 w-4 mr-2' />
              Xem
            </Button>
            {onEdit && (
              <Button variant='outline' size='sm' onClick={onEdit}>
                <Edit className='h-4 w-4 mr-2' />
                Sửa
              </Button>
            )}
            {onDelete && (
              <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700' onClick={onDelete}>
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
          <div className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5 text-gray-400' />
            <div>
              <p className='text-xs text-gray-500'>Ngân sách</p>
              <p className='font-semibold text-gray-900'>{formatCurrency(post.budget)}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-gray-400' />
            <div>
              <p className='text-xs text-gray-500'>Quy mô</p>
              <p className='font-semibold text-gray-900'>{post.teamSize} người</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-gray-400' />
            <div>
              <p className='text-xs text-gray-500'>Ngày đăng</p>
              <p className='font-semibold text-gray-900'>{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </div>

        {post.skills && post.skills.length > 0 && (
          <div>
            <p className='text-xs text-gray-500 mb-2'>Kỹ năng yêu cầu:</p>
            <div className='flex flex-wrap gap-2'>
              {post.skills.map((skill, index) => (
                <Badge key={skill.id} className={`${skillColors[index % skillColors.length]} hover:opacity-80`}>
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className='flex items-center justify-between mt-4 pt-4 border-t'>
          <div className='flex items-center gap-4 text-sm text-gray-500'>
            <span>Dự án: {post.projectName}</span>
          </div>
          <div className='flex gap-2'>
            {onViewApplicants && (
              <Button variant='outline' size='sm' onClick={onViewApplicants}>
                <MessageCircle className='h-4 w-4 mr-2' />
                Ứng viên
              </Button>
            )}
            {onShare && (
              <Button variant='outline' size='sm' onClick={onShare}>
                <Share2 className='h-4 w-4 mr-2' />
                Chia sẻ
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
