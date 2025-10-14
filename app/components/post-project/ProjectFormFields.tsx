import { CalendarIcon } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { Button } from '~/components/ui/button'
import { SkillsCombobox } from './SkillsCombobox'
import { cn } from '~/lib/utils'
import type { PostProjectStep1FormValues } from '~/lib/validations/post-project.schema'
import type { RecruitmentCategory, Skill } from '~/types/recruitment.type'

interface ProjectFormFieldsProps {
  form: UseFormReturn<PostProjectStep1FormValues>
  categories: RecruitmentCategory[]
  skills: Skill[]
  selectedSkills: string[]
  onToggleSkill: (skillId: string) => void
  startDate?: Date
  endDate?: Date
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
}

export function ProjectFormFields({
  form,
  categories,
  skills,
  selectedSkills,
  onToggleSkill,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: ProjectFormFieldsProps) {
  const {
    register,
    formState: { errors },
    setValue
  } = form

  return (
    <div className='space-y-6'>
      {/* Title */}
      <div className='space-y-2'>
        <Label htmlFor='title' className='text-base font-semibold'>
          Tiêu đề dự án <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='title'
          placeholder='Ví dụ: Thiết kế logo cho startup công nghệ'
          className='w-full'
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        {errors.title ? (
          <p className='text-sm text-destructive'>{errors.title.message}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án</p>
        )}
      </div>

      {/* Category */}
      <div className='space-y-2'>
        <Label htmlFor='category' className='text-base font-semibold'>
          Danh mục dự án <span className='text-destructive'>*</span>
        </Label>
        <Select
          value={form.watch('category') || ''}
          onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
        >
          <SelectTrigger id='category' className={cn(errors.category && 'border-destructive')}>
            <SelectValue placeholder='Chọn danh mục phù hợp nhất' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category ? (
          <p className='text-sm text-destructive'>{errors.category.message}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Chọn danh mục phù hợp để freelancer dễ tìm thấy</p>
        )}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-base font-semibold'>
          Mô tả dự án <span className='text-destructive'>*</span>
        </Label>
        <Textarea
          id='description'
          placeholder='Mô tả chi tiết về dự án, yêu cầu, mong đợi của bạn...'
          rows={6}
          className='w-full resize-none'
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description ? (
          <p className='text-sm text-destructive'>{errors.description.message}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Mô tả càng chi tiết, freelancer càng hiểu rõ yêu cầu</p>
        )}
      </div>

      {/* Budget */}
      <div className='space-y-2'>
        <Label htmlFor='budget' className='text-base font-semibold'>
          Ngân sách dự án (VNĐ) <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='budget'
          type='number'
          placeholder='5,000,000'
          className='w-full'
          {...register('budget', { valueAsNumber: true })}
          aria-invalid={!!errors.budget}
          min={100000}
        />
        {errors.budget ? (
          <p className='text-sm text-destructive'>{errors.budget.message}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Ngân sách tối thiểu: 100,000 VNĐ</p>
        )}
      </div>

      {/* Date Range */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='startDate' className='text-base font-semibold'>
            Ngày bắt đầu <span className='text-destructive'>*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='startDate'
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                  errors.startDate && 'border-destructive'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Chọn ngày bắt đầu</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={startDate}
                onSelect={(date) => {
                  onStartDateChange(date)
                  setValue('startDate', date?.toISOString() || '', { shouldValidate: true })
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate ? (
            <p className='text-sm text-destructive'>{errors.startDate.message}</p>
          ) : (
            <p className='text-sm text-muted-foreground'>Ngày mở form tuyển dụng</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='endDate' className='text-base font-semibold'>
            Ngày kết thúc <span className='text-destructive'>*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='endDate'
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                  errors.endDate && 'border-destructive'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Chọn ngày kết thúc</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={endDate}
                onSelect={(date) => {
                  onEndDateChange(date)
                  setValue('endDate', date?.toISOString() || '', { shouldValidate: true })
                }}
                disabled={(date) => date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate ? (
            <p className='text-sm text-destructive'>{errors.endDate.message}</p>
          ) : (
            <p className='text-sm text-muted-foreground'>Phải sau ngày bắt đầu</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className='space-y-2'>
        <Label htmlFor='skills' className='text-base font-semibold'>
          Kỹ năng yêu cầu <span className='text-destructive'>*</span>
        </Label>
        <SkillsCombobox
          skills={skills}
          selectedSkills={selectedSkills}
          onToggleSkill={(skillId) => {
            onToggleSkill(skillId)
            const newSkills = selectedSkills.includes(skillId)
              ? selectedSkills.filter((id) => id !== skillId)
              : [...selectedSkills, skillId]
            setValue('skills', newSkills, { shouldValidate: true })
          }}
          error={errors.skills?.message}
        />
        {errors.skills ? (
          <p className='text-sm text-destructive'>{errors.skills.message}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Tìm kiếm và chọn các kỹ năng cần thiết cho dự án</p>
        )}
      </div>
    </div>
  )
}
