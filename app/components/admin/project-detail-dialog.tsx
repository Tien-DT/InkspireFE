import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { type AdminProject } from '~/apis/admin.api'
import { Calendar, User, DollarSign, Target, FileText, TrendingUp } from 'lucide-react'

interface ProjectDetailDialogProps {
  open: boolean
  onClose: () => void
  project: AdminProject | null
}

const getStatusAppearance = (statusName: string) => {
  switch (statusName) {
    case 'Active':
      return { label: 'Đang thực hiện', className: 'bg-emerald-100 text-emerald-700' }
    case 'Pending':
      return { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' }
    case 'Completed':
      return { label: 'Hoàn thành', className: 'bg-slate-100 text-slate-700' }
    case 'On Hold':
      return { label: 'Bị trì hoãn', className: 'bg-rose-100 text-rose-700' }
    case 'Cancelled':
      return { label: 'Đã hủy', className: 'bg-gray-100 text-gray-700' }
    default:
      return { label: statusName, className: 'bg-gray-100 text-gray-700' }
  }
}

export function ProjectDetailDialog({ open, onClose, project }: ProjectDetailDialogProps) {
  if (!project) return null

  const status = getStatusAppearance(project.statusName)
  const progress = project.totalMilestones > 0 
    ? Math.round((project.completedMilestones / project.totalMilestones) * 100) 
    : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Chi tiết dự án</DialogTitle>
        </DialogHeader>
        
        <div className='space-y-6'>
          {/* Project Name & Status */}
          <div className='space-y-2'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-slate-900'>{project.name}</h3>
                <p className='text-sm text-slate-500 mt-1'>ID: {project.id}</p>
              </div>
              <Badge variant='outline' className={`border-transparent ${status.className}`}>
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <FileText className='h-4 w-4' />
                <span>Mô tả</span>
              </div>
              <p className='text-sm text-slate-600 pl-6 whitespace-pre-wrap'>{project.description}</p>
            </div>
          )}

          {/* Client Info */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <User className='h-4 w-4' />
                <span>Khách hàng</span>
              </div>
              <p className='text-sm text-slate-900 pl-6'>{project.clientName}</p>
              <p className='text-xs text-slate-500 pl-6'>ID: {project.clientId}</p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <DollarSign className='h-4 w-4' />
                <span>Ngân sách</span>
              </div>
              <p className='text-sm text-slate-900 pl-6 font-semibold'>
                {project.budget.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <Calendar className='h-4 w-4' />
                <span>Ngày bắt đầu</span>
              </div>
              <p className='text-sm text-slate-900 pl-6'>
                {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <Target className='h-4 w-4' />
                <span>Hạn chót</span>
              </div>
              <p className='text-sm text-slate-900 pl-6'>
                {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <TrendingUp className='h-4 w-4' />
              <span>Tiến độ dự án</span>
            </div>
            <div className='pl-6 space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-600'>Milestone hoàn thành</span>
                <span className='font-medium text-slate-900'>
                  {project.completedMilestones} / {project.totalMilestones}
                </span>
              </div>
              <div className='w-full bg-slate-200 rounded-full h-2'>
                <div 
                  className='bg-blue-600 h-2 rounded-full transition-all'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className='text-xs text-slate-500'>{progress}% hoàn thành</p>
            </div>
          </div>

          {/* Proposals */}
          <div className='space-y-2 border-t pt-4'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-slate-600'>Tổng số đề xuất</span>
              <span className='font-medium text-slate-900'>{project.totalProposals}</span>
            </div>
            {project.recruitmentPostId && (
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-600'>ID Bài tuyển dụng</span>
                <span className='font-mono text-xs text-slate-500'>{project.recruitmentPostId}</span>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className='border-t pt-4'>
            <p className='text-xs text-slate-500'>
              Được tạo vào {project.createdAt ? new Date(project.createdAt).toLocaleString('vi-VN') : 'N/A'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
