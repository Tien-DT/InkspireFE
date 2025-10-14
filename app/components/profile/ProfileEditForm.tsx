import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { profileFormSchema, type ProfileFormValues } from '~/lib/validations/profile.schema'

interface ProfileEditFormProps {
  defaultValues: ProfileFormValues
  onSubmit: (data: ProfileFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProfileEditForm({ defaultValues, onSubmit, onCancel, isSubmitting }: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-6'>
        <div className='space-y-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
          <h3 className='text-lg font-semibold text-foreground'>Thông tin cơ bản</h3>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='name' className='text-sm font-medium text-muted-foreground'>
                Họ và tên <span className='text-destructive'>*</span>
              </Label>
              <Input id='name' {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className='text-sm text-red-600 mt-1'>{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor='title' className='text-sm font-medium text-muted-foreground'>
                Chức danh <span className='text-destructive'>*</span>
              </Label>
              <Input id='title' {...register('title')} aria-invalid={!!errors.title} />
              {errors.title && <p className='text-sm text-red-600 mt-1'>{errors.title.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor='bio' className='text-sm font-medium text-muted-foreground'>
              Giới thiệu bản thân <span className='text-destructive'>*</span>
            </Label>
            <Textarea id='bio' {...register('bio')} rows={5} aria-invalid={!!errors.bio} className='min-h-[140px]' />
            {errors.bio && <p className='text-sm text-red-600 mt-1'>{errors.bio.message}</p>}
          </div>
        </div>

        <div className='space-y-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
          <h3 className='text-lg font-semibold text-foreground'>Thông tin liên hệ</h3>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='email' className='text-sm font-medium text-muted-foreground'>
                Email <span className='text-destructive'>*</span>
              </Label>
              <Input id='email' type='email' {...register('email')} aria-invalid={!!errors.email} />
              {errors.email && <p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor='phone' className='text-sm font-medium text-muted-foreground'>
                Số điện thoại
              </Label>
              <Input id='phone' type='tel' {...register('phone')} aria-invalid={!!errors.phone} />
              {errors.phone && <p className='text-sm text-red-600 mt-1'>{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor='location' className='text-sm font-medium text-muted-foreground'>
              Địa điểm
            </Label>
            <Input id='location' {...register('location')} aria-invalid={!!errors.location} />
            {errors.location && <p className='text-sm text-red-600 mt-1'>{errors.location.message}</p>}
          </div>
        </div>

        <div className='space-y-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
          <h3 className='text-lg font-semibold text-foreground'>Mức giá & Trạng thái</h3>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='priceRange' className='text-sm font-medium text-muted-foreground'>
                Mức giá theo giờ
              </Label>
              <Input id='priceRange' {...register('priceRange')} placeholder='VD: 500.000 - 800.000 VND' />
              {errors.priceRange && <p className='text-sm text-red-600 mt-1'>{errors.priceRange.message}</p>}
            </div>
            <div>
              <Label htmlFor='status' className='text-sm font-medium text-muted-foreground'>
                Tình trạng công việc
              </Label>
              <Input id='status' {...register('status')} placeholder='VD: Sẵn sàng nhận việc' />
              {errors.status && <p className='text-sm text-red-600 mt-1'>{errors.status.message}</p>}
            </div>
          </div>
        </div>

        <div className='space-y-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
          <h3 className='text-lg font-semibold text-foreground'>Kỹ năng</h3>
          <div>
            <Label htmlFor='skills' className='text-sm font-medium text-muted-foreground'>
              Danh sách kỹ năng (phân cách bằng dấu phẩy)
            </Label>
            <Textarea
              id='skills'
              {...register('skills')}
              rows={3}
              placeholder='VD: React, TypeScript, Node.js, UI/UX Design'
            />
            {errors.skills && <p className='text-sm text-red-600 mt-1'>{errors.skills.message}</p>}
          </div>
        </div>
      </div>

      <div className='sticky -mx-6 bottom-0 flex justify-end gap-3 border-t border-border/60 bg-card/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type='submit' variant='shine' disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  )
}
