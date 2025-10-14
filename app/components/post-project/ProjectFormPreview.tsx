import { format } from 'date-fns'
import { Calendar, DollarSign, FolderOpen, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { PostProjectStep1FormValues } from '~/lib/validations/post-project.schema'
import type { RecruitmentCategory, Skill } from '~/types/recruitment.type'

interface ProjectFormPreviewProps {
  formData: Partial<PostProjectStep1FormValues>
  categories: RecruitmentCategory[]
  skills: Skill[]
  startDate?: Date
  endDate?: Date
}

export function ProjectFormPreview({ formData, categories, skills, startDate, endDate }: ProjectFormPreviewProps) {
  const selectedCategory = categories.find((c) => c.id === formData.category)
  const selectedSkills = formData.skills
    ?.map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Xem trước dự án</CardTitle>
      </CardHeader>
      <CardContent data-slot='card-content' className='space-y-5'>
        {/* Title */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <FolderOpen className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Tiêu đề</span>
          </div>
          <p className='text-sm font-semibold'>
            {formData.title || <span className='text-muted-foreground italic'>Chưa nhập tiêu đề</span>}
          </p>
        </div>

        {/* Category */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <FolderOpen className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Danh mục</span>
          </div>
          <p className='text-sm font-semibold'>
            {selectedCategory ? (
              selectedCategory.title
            ) : (
              <span className='text-muted-foreground italic'>Chưa chọn danh mục</span>
            )}
          </p>
        </div>

        {/* Budget */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Ngân sách</span>
          </div>
          <p className='text-2xl font-bold text-primary'>
            {formData.budget ? (
              <>{formData.budget.toLocaleString('vi-VN')} VNĐ</>
            ) : (
              <span className='text-base font-semibold text-muted-foreground italic'>Chưa nhập ngân sách</span>
            )}
          </p>
        </div>

        {/* Timeline */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Thời gian</span>
          </div>
          <p className='text-sm font-semibold'>
            {startDate && endDate ? (
              <>
                {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
              </>
            ) : (
              <span className='text-muted-foreground italic'>Chưa chọn thời gian</span>
            )}
          </p>
        </div>

        {/* Skills */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Wrench className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>Kỹ năng yêu cầu</span>
          </div>
          {selectedSkills && selectedSkills.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {selectedSkills.map((skill) => (
                <Badge key={skill.id} variant='secondary' className='text-xs'>
                  {skill.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className='text-sm font-semibold text-muted-foreground italic'>Chưa chọn kỹ năng</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
