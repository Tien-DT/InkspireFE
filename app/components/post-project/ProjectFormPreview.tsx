import { format } from 'date-fns'
import { Card, CardContent } from '~/components/ui/card'
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
  return (
    <Card>
      <CardContent className='p-6'>
        <h3 className='font-semibold mb-4'>Xem trước dự án</h3>

        <div className='space-y-3'>
          <div>
            <span className='text-sm text-gray-600'>Tiêu đề</span>
            <p className='text-sm font-medium'>{formData.title || 'Chưa nhập'}</p>
          </div>

          <div>
            <span className='text-sm text-gray-600'>Danh mục</span>
            <p className='text-sm font-medium'>
              {categories.find((c) => c.id === formData.category)?.title || 'Chưa chọn'}
            </p>
          </div>

          <div>
            <span className='text-sm text-gray-600'>Ngân sách</span>
            <p className='text-sm font-medium'>
              {formData.budget ? `${formData.budget.toLocaleString()} VNĐ` : 'Chưa nhập'}
            </p>
          </div>

          <div>
            <span className='text-sm text-gray-600'>Thời gian</span>
            <p className='text-sm font-medium'>
              {startDate && endDate
                ? `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
                : 'Chưa chọn'}
            </p>
          </div>

          <div>
            <span className='text-sm text-gray-600'>Kỹ năng</span>
            <div className='flex flex-wrap gap-1 mt-1'>
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skillId) => {
                  const skill = skills.find((s) => s.id === skillId)
                  return skill ? (
                    <Badge key={skillId} variant='outline' className='text-xs'>
                      {skill.name}
                    </Badge>
                  ) : null
                })
              ) : (
                <p className='text-sm font-medium'>Chưa chọn</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
