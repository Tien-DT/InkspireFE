import { Calendar, Clock, Eye, Heart, Users } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import type { Job } from '~/types/job.type'

interface JobCardProps {
  job: Job
  onApplyClick: (jobId: string) => void
  onViewDetail?: (jobId: string) => void
  skillColors?: readonly string[]
}

const DEFAULT_SKILL_COLORS = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

export function JobCard({ job, onApplyClick, onViewDetail, skillColors = DEFAULT_SKILL_COLORS }: JobCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow border border-gray-200'>
      <CardContent className='p-4 sm:p-5 md:p-6'>
        {/* container: dọc trên mobile, 2 cột trên md+ */}
        <div className='flex flex-col md:flex-row md:items-stretch md:justify-between gap-5 md:gap-8'>
          {/* Left */}
          <div className='md:w-3/4 space-y-4 sm:space-y-5'>
            {/* Title + badge + heart (heart sang cuối dòng trên mobile) */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-start gap-3'>
                <h3 className='text-lg sm:text-xl md:text-xl font-semibold text-gray-900 flex-1 hover:text-blue-600 cursor-pointer'>
                  {job.title}
                </h3>
                {job.status === 1 && (
                  <Badge className='bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold'>
                    Nổi bật
                  </Badge>
                )}
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0'>
                    {job.user.firstName.charAt(0)}
                  </div>
                  <span className='text-xs sm:text-sm text-gray-700 font-medium'>
                    {job.user.firstName} {job.user.lastName}
                  </span>
                </div>
                <button type='button' aria-label='Yêu thích công việc' className='p-1 rounded hover:bg-gray-100'>
                  <Heart className='h-5 w-5 text-gray-400 hover:text-red-500 transition-colors' />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className='text-gray-600 text-sm sm:text-[15px] line-clamp-3 sm:line-clamp-2'>{job.description}</p>

            {/* Categories */}
            {job.categories?.length > 0 && (
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-[11px] sm:text-xs font-semibold text-gray-500 uppercase'>Danh mục:</span>
                {job.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant='secondary'
                    className='bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] sm:text-xs font-medium px-2 py-0.5'
                  >
                    📁 {category.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Skills */}
            <div className='flex items-start gap-2 flex-wrap'>
              <span className='text-[11px] sm:text-xs font-semibold text-gray-500 uppercase'>Kỹ năng:</span>
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
                    <Badge key={skill.id} variant={color} className='text-[11px] sm:text-xs font-medium'>
                      {skill.name}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Footer info: wrap trên mobile, chia đều trên md */}
            <div className='flex flex-wrap md:flex-nowrap items-center justify-start md:justify-between gap-3 md:gap-6 text-[12px] sm:text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4 shrink-0' />
                <span>Hạn: {new Date(job.endTime).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-4 w-4 shrink-0' />
                <span>{job.teamSize} đề xuất</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4 shrink-0' />
                <span>Đăng {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Right: budget + actions (nằm dưới cùng trên mobile) */}
          <div className='md:w-1/4 min-w-[200px] flex flex-col justify-between gap-3 md:gap-4'>
            {/* Budget: trái trên mobile, phải trên md */}
            <div className='text-left md:text-right'>
              <div className='text-xl sm:text-2xl font-bold text-green-600 mb-0.5'>
                {(job.budget / 1_000_000).toFixed(1)}M VND
              </div>
              <div className='text-xs sm:text-sm text-gray-500'>Giá cố định</div>
            </div>

            {/* Actions: full width mobile; layout giữ khi lên md */}
            <div className='flex flex-col sm:flex-row md:flex-col gap-2 w-full'>
              <Button className='w-full btn-submit' onClick={() => onApplyClick(job.id)}>
                Ứng tuyển ngay
              </Button>
              <Button className='w-full btn-cancel' onClick={() => onViewDetail?.(job.id)}>
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
