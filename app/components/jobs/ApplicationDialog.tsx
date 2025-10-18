import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, FileText, Loader2, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { jobApplicationSchema, type JobApplicationFormValues } from '~/lib/validations/job-application.schema'

interface ApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (cvFile: File, coverLetter: string) => Promise<void>
  isSubmitting?: boolean
}

export function ApplicationDialog({ open, onOpenChange, onSubmit, isSubmitting = false }: ApplicationDialogProps) {
  const [isDragging, setIsDragging] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      coverLetter: ''
    }
  })

  const cvFile = watch('cvFile')
  const coverLetter = watch('coverLetter') || ''

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('cvFile', file, { shouldValidate: true })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setValue('cvFile', file, { shouldValidate: true })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const onSubmitForm = async (data: JobApplicationFormValues) => {
    await onSubmit(data.cvFile, data.coverLetter)
    reset()
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Nộp hồ sơ ứng tuyển</DialogTitle>
          <DialogDescription>Vui lòng tải lên CV và viết thư giới thiệu của bạn</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6 py-4 w-full overflow-y-auto max-h-[70vh]'>
          {/* CV Upload */}
          <div className='space-y-3'>
            <Label htmlFor='cv-upload' className='flex items-center text-base font-semibold'>
              <Upload className='h-4 w-4 mr-2' />
              Tải lên CV từ máy tính
              <span className='text-destructive ml-1'>*</span>
            </Label>
            <p className='text-sm text-muted-foreground'>Hỗ trợ định dạng .pdf có kích thước dưới 5MB</p>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer',
                isDragging && 'border-primary bg-primary/5',
                errors.cvFile && 'border-destructive',
                !errors.cvFile && !isDragging && 'border-border hover:border-primary'
              )}
            >
              <input
                type='file'
                id='cv-upload'
                accept='.pdf'
                onChange={handleFileChange}
                className='hidden'
                disabled={isSubmitting}
              />
              <label htmlFor='cv-upload' className='cursor-pointer'>
                <div className='flex flex-col items-center'>
                  <div className='w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3'>
                    <Upload className='h-6 w-6 text-muted-foreground' />
                  </div>
                  {cvFile ? (
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-green-600' />
                      <span className='font-medium text-green-600 text-sm'>{cvFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className='text-sm font-semibold mb-1'>Click để chọn file hoặc kéo thả</p>
                      <p className='text-xs text-muted-foreground'>PDF (dưới 5MB)</p>
                    </>
                  )}
                </div>
              </label>
              {cvFile && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='mt-3'
                  onClick={(e) => {
                    e.preventDefault()
                    setValue('cvFile', undefined as unknown as File, { shouldValidate: false })
                  }}
                  disabled={isSubmitting}
                >
                  <X className='h-4 w-4 mr-1' />
                  Xóa file
                </Button>
              )}
            </div>
            {errors.cvFile && <p className='text-sm text-destructive'>{errors.cvFile.message}</p>}
          </div>

          {/* Cover Letter */}
          <div className='space-y-3'>
            <Label htmlFor='coverLetter' className='flex items-center text-base font-semibold'>
              <FileText className='h-4 w-4 mr-2' />
              Thư giới thiệu
              <span className='text-destructive ml-1'>*</span>
            </Label>
            <p className='text-sm text-muted-foreground'>
              Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển
              dụng.
            </p>
            <Textarea
              id='coverLetter'
              placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, kinh nghiệm) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này. (Tối thiểu 50 ký tự)'
              rows={6}
              className={cn('w-full', errors.coverLetter && 'border-destructive')}
              {...register('coverLetter')}
              disabled={isSubmitting}
              aria-invalid={!!errors.coverLetter}
            />
            <div className='flex flex-wrap justify-between gap-2 text-xs text-muted-foreground'>
              {coverLetter.length > 0 && coverLetter.length < 10 && (
                <span className='text-amber-600 flex-shrink-0'>Còn thiếu {10 - coverLetter.length} ký tự</span>
              )}
            </div>
            {errors.coverLetter && <p className='text-sm text-destructive'>{errors.coverLetter.message}</p>}
          </div>

          {/* Footer Buttons */}
          <div className='flex gap-3 pt-4 border-t'>
            <Button type='button' variant='outline' className='flex-1' onClick={handleClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type='submit' className='flex-1' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang gửi...
                </>
              ) : (
                'Nộp hồ sơ ứng tuyển'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
