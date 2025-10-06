import { CalendarIcon, X } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
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

const skillColors = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

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
      <div>
        <label className='block text-md font-semibold text-gray-700 mb-2'>
          Tiêu đề dự án <span className='text-red-500'>*</span>
        </label>
        <Input
          placeholder='Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án'
          className='w-full'
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className='text-sm text-red-600 mt-1'>{errors.title.message}</p>}
        <p className='text-sm text-gray-500 mt-1'>Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án</p>
      </div>

      {/* Category */}
      <div>
        <label className='block text-md font-semibold text-gray-700 mb-2'>
          Danh mục dự án <span className='text-red-500'>*</span>
        </label>
        <Select
          value={form.watch('category') || ''}
          onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
        >
          <SelectTrigger className={cn(errors.category && 'border-red-500')}>
            <SelectValue placeholder='Chọn danh mục' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className='text-sm text-red-600 mt-1'>{errors.category.message}</p>}
        <p className='text-sm text-gray-500 mt-1'>Chọn danh mục phù hợp để freelancer dễ tìm thấy</p>
      </div>

      {/* Description */}
      <div>
        <label className='block text-md font-semibold text-gray-700 mb-2'>
          Mô tả dự án <span className='text-red-500'>*</span>
        </label>
        <Textarea
          placeholder='Mô tả chi tiết về dự án, yêu cầu, mong đợi của bạn'
          rows={6}
          className='w-full'
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className='text-sm text-red-600 mt-1'>{errors.description.message}</p>}
        <p className='text-sm text-gray-500 mt-1'>Mô tả càng chi tiết, freelancer càng hiểu rõ yêu cầu</p>
      </div>

      {/* Budget */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-md font-semibold text-gray-700 mb-2'>
            Ngân sách (VNĐ) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='number'
            placeholder='Nhập ngân sách'
            className='w-full'
            {...register('budget', { valueAsNumber: true })}
            aria-invalid={!!errors.budget}
            min={0}
          />
          {errors.budget && <p className='text-sm text-red-600 mt-1'>{errors.budget.message}</p>}
          <p className='text-sm text-gray-500 mt-1'>Nhập số tiền ngân sách dự kiến</p>
        </div>
      </div>

      {/* Date Range */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='basis-1/2 w-full min-w-0'>
          <label className='block text-md font-semibold text-gray-700 mb-2'>
            Ngày bắt đầu <span className='text-red-500'>*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                  errors.startDate && 'border-red-500'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {startDate ? format(startDate, 'PPP') : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
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
          {errors.startDate && <p className='text-sm text-red-600 mt-1'>{errors.startDate.message}</p>}
          <p className='text-sm text-gray-500 mt-1'>Thời gian mở form đăng tuyển</p>
        </div>

        <div className='basis-1/2 w-full min-w-0'>
          <label className='block text-md font-semibold text-gray-700 mb-2'>
            Ngày kết thúc <span className='text-red-500'>*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                  errors.endDate && 'border-red-500'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {endDate ? format(endDate, 'PPP') : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
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
          {errors.endDate && <p className='text-sm text-red-600 mt-1'>{errors.endDate.message}</p>}
          <p className='text-sm text-gray-500 mt-1'>Ngày kết thúc không được nhỏ hơn ngày bắt đầu</p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className='block text-md font-semibold text-gray-700 mb-2'>
          Kỹ năng yêu cầu <span className='text-red-500'>*</span>
        </label>
        <div className='flex flex-wrap gap-2 mb-3'>
          {selectedSkills.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId)
            if (!skill) return null
            const colorIndex = skills.findIndex((s) => s.id === skillId) % skillColors.length
            return (
              <Badge key={skillId} variant={skillColors[colorIndex]} className='cursor-pointer gap-1'>
                {skill.name}
                <X className='h-3 w-3' onClick={() => onToggleSkill(skillId)} />
              </Badge>
            )
          })}
        </div>
        <Select
          value=''
          onValueChange={(value) => {
            onToggleSkill(value)
            setValue('skills', [...selectedSkills, value], { shouldValidate: true })
          }}
        >
          <SelectTrigger className={cn(errors.skills && 'border-red-500')}>
            <SelectValue placeholder='Chọn kỹ năng' />
          </SelectTrigger>
          <SelectContent>
            {skills
              .filter((skill) => !selectedSkills.includes(skill.id))
              .map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.skills && <p className='text-sm text-red-600 mt-1'>{errors.skills.message}</p>}
        <p className='text-sm text-gray-500 mt-1'>Chọn các kỹ năng cần thiết cho dự án</p>
      </div>
    </div>
  )
}
