import { useState } from 'react'
import { Calendar, Clock, Eye, Heart } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { Job } from '~/types/job.type'

interface JobCardProps {
  job: Job
  onApplyClick: (jobId: string) => void
  onViewDetail?: (jobId: string) => void
  skillColors?: readonly string[]
}

const DEFAULT_SKILL_COLORS = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

export function JobCard({ job, onApplyClick, onViewDetail, skillColors = DEFAULT_SKILL_COLORS }: JobCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
    // TODO: Connect to API to save favorite state
  }

  return (
    <Card className='hover:shadow-lg transition-all duration-300 group'>
      <CardContent className='p-4 sm:p-5 md:p-6'>
        <div className='flex flex-col md:flex-row md:items-stretch md:justify-between gap-5 md:gap-8'>
          {/* Left Content */}
          <div className='md:w-3/4 space-y-4 sm:space-y-5 min-w-0'>
            {/* Title + Badge + Heart */}
            <div className='flex flex-col gap-3'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex items-start gap-2 flex-1 min-w-0'>
                  <h3
                    onClick={() => onViewDetail?.(job.id)}
                    className='text-lg sm:text-xl md:text-xl font-bold text-foreground hover:text-primary cursor-pointer transition-colors line-clamp-2 break-words min-w-0'
                  >
                    {job.title}
                  </h3>
                  {job.status === 1 && (
                    <Badge variant='featured' className='shrink-0 mt-1'>
                      Nổi bật
                    </Badge>
                  )}
                </div>
                <button
                  type='button'
                  onClick={handleFavoriteClick}
                  aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                  className='p-1.5 rounded-full hover:bg-muted transition-colors'
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                    )}
                  />
                </button>
              </div>

              {/* User Info */}
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0'>
                  {job.user.firstName.charAt(0)}
                </div>
                <span className='text-xs sm:text-sm text-muted-foreground font-medium'>
                  {job.user.firstName} {job.user.lastName}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className='text-muted-foreground text-sm sm:text-base line-clamp-2 leading-relaxed break-words'>
              {job.description}
            </p>

            {/* Categories */}
            {job.categories?.length > 0 && (
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-xs font-semibold text-muted-foreground uppercase'>Danh mục:</span>
                {job.categories.map((category) => (
                  <Badge key={category.id} variant='outline' className='text-xs font-medium'>
                    📁 {category.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Skills */}
            <div className='flex items-start gap-2 flex-wrap'>
              <span className='text-xs font-semibold text-muted-foreground uppercase'>Kỹ năng:</span>
              <div className='flex gap-1.5 flex-wrap'>
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
                    <Badge key={skill.id} variant={color} className='text-xs font-medium'>
                      {skill.name}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className='flex flex-wrap md:flex-nowrap items-center gap-4 text-xs sm:text-sm text-muted-foreground'>
              <div className='flex items-center gap-1.5'>
                <Clock className='h-4 w-4 shrink-0' />
                <span>Hạn: {new Date(job.endTime).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <Calendar className='h-4 w-4 shrink-0' />
                <span>Đăng {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Right: Budget + Actions */}
          <div className='md:w-1/4 min-w-[200px] flex flex-col justify-between gap-4'>
            {/* Budget */}
            <div className='text-left md:text-right'>
              <div className='text-2xl sm:text-3xl font-bold text-green-600 mb-1'>
                {(job.budget / 1_000_000).toFixed(1)}M VNĐ
              </div>
              <div className='text-xs sm:text-sm text-muted-foreground'>Giá cố định</div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row md:flex-col gap-2 w-full'>
              <Button className='w-full' size='lg' onClick={() => onApplyClick(job.id)}>
                Ứng tuyển ngay
              </Button>
              <Button variant='outline' size='lg' className='w-full' onClick={() => onViewDetail?.(job.id)}>
                <Eye className='h-4 w-4 mr-2' />
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
