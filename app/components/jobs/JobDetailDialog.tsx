import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Calendar, Clock, DollarSign, Users, Briefcase, FileText } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import type { Job } from '~/types/job.type'

interface JobDetailDialogProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyClick?: (jobId: string) => void
  skillColors?: readonly string[]
}

const DEFAULT_SKILL_COLORS = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

export function JobDetailDialog({
  job,
  open,
  onOpenChange,
  onApplyClick,
  skillColors = DEFAULT_SKILL_COLORS
}: JobDetailDialogProps) {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold pr-8'>{job.title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* User Info */}
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg'>
              {job.user.firstName.charAt(0)}
            </div>
            <div>
              <p className='font-semibold text-base'>
                {job.user.firstName} {job.user.lastName}
              </p>
              <p className='text-sm text-muted-foreground'>{job.user.email}</p>
            </div>
          </div>

          <Separator />

          {/* Budget & Timeline */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
                <DollarSign className='h-5 w-5 text-green-600 dark:text-green-400' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Ngân sách</p>
                <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                  {job.budget.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800'>
              <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Quy mô nhóm</p>
                <p className='text-lg font-semibold text-blue-600 dark:text-blue-400'>{job.teamSize}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span className='text-muted-foreground'>Ngày đăng:</span>
              <span className='font-medium'>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='text-muted-foreground'>Hạn nộp:</span>
              <span className='font-medium'>{new Date(job.endTime).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              <h3 className='text-lg font-semibold'>Mô tả công việc</h3>
            </div>
            <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>{job.description}</p>
          </div>

          <Separator />

          {/* Categories */}
          {job.categories?.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Briefcase className='h-5 w-5 text-primary' />
                <h3 className='text-lg font-semibold'>Danh mục</h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {job.categories.map((category) => (
                  <Badge key={category.id} variant='outline' className='text-sm px-3 py-1.5'>
                    📁 {category.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Kỹ năng yêu cầu</h3>
              <div className='flex flex-wrap gap-2'>
                {job.skills.map((skill, i) => {
                  const color = skillColors[i % skillColors.length] as
                    | 'blue'
                    | 'purple'
                    | 'orange'
                    | 'pink'
                    | 'green'
                    | 'yellow'
                    | 'red'
                    | 'indigo'
                  return (
                    <Badge key={skill.id} variant={color} className='text-sm px-3 py-1.5'>
                      {skill.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Status Badge */}
          {job.isPremium && (
            <div className='flex justify-center'>
              <Badge variant='featured' className='px-4 py-2 text-base'>
                ⭐ Công việc nổi bật
              </Badge>
            </div>
          )}

          {/* Action Button */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            {onApplyClick && (
              <Button size='lg' onClick={() => onApplyClick(job.id)} className='min-w-[150px]'>
                Ứng tuyển ngay
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
