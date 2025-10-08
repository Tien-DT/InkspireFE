import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

interface ApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (cvFile: File, coverLetter: string) => Promise<void>
  isSubmitting?: boolean
}

export function ApplicationDialog({ open, onOpenChange, onSubmit, isSubmitting = false }: ApplicationDialogProps) {
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [errors, setErrors] = useState<{ cvFile?: string; coverLetter?: string }>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cvFile: 'Kích thước file không được vượt quá 5MB' }))
      return
    }

    // Validate file type
    const allowedTypes = ['.pdf']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      setErrors((prev) => ({ ...prev, cvFile: 'Chỉ hỗ trợ file .pdf' }))
      return
    }

    setCvFile(file)
    setErrors((prev) => ({ ...prev, cvFile: undefined }))
  }

  const handleCoverLetterChange = (value: string) => {
    setCoverLetter(value)
    if (value.trim().length >= 50) {
      setErrors((prev) => ({ ...prev, coverLetter: undefined }))
    }
  }

  const handleSubmit = async () => {
    const newErrors: { cvFile?: string; coverLetter?: string } = {}

    if (!cvFile) {
      newErrors.cvFile = 'Vui lòng chọn CV của bạn'
    }

    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Vui lòng viết thư giới thiệu'
    } else if (coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Thư giới thiệu phải có ít nhất 50 ký tự'
    } else if (coverLetter.trim().length > 2000) {
      newErrors.coverLetter = 'Thư giới thiệu không được quá 2000 ký tự'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await onSubmit(cvFile!, coverLetter.trim())

    // Reset form on success
    setCvFile(null)
    setCoverLetter('')
    setErrors({})
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      setCvFile(null)
      setCoverLetter('')
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] bg-white'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Nộp hồ sơ ứng tuyển</DialogTitle>
          <DialogDescription>Vui lòng tải lên CV và viết thư giới thiệu của bạn</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* CV Upload */}
          <div className='space-y-3'>
            <label className='flex items-center text-md font-semibold text-gray-700'>
              <Upload className='h-4 w-4 mr-2' />
              Tải lên CV từ máy tính
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <p className='text-sm text-gray-500'>Hỗ trợ định dạng .pdf có kích thước dưới 5MB</p>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer ${
                errors.cvFile ? 'border-red-500' : 'border-gray-300'
              }`}
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
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
                    <Upload className='h-6 w-6 text-gray-400' />
                  </div>
                  {cvFile ? (
                    <div className='flex items-center gap-2 text-sm'>
                      <FileText className='h-4 w-4 text-green-600' />
                      <span className='font-medium text-green-600'>{cvFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className='text-sm font-semibold text-gray-700 mb-1'>Click để chọn file hoặc kéo thả</p>
                      <p className='text-xs text-gray-500'>PDF (dưới 5MB)</p>
                    </>
                  )}
                </div>
              </label>
              {cvFile && (
                <Button
                  className='btn-cancel mt-3'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    setCvFile(null)
                  }}
                  disabled={isSubmitting}
                >
                  Chọn file khác
                </Button>
              )}
            </div>
            {errors.cvFile && <p className='text-sm text-red-600 mt-1'>{errors.cvFile}</p>}
          </div>

          {/* Cover Letter */}
          <div className='space-y-3'>
            <label className='flex items-center text-md font-semibold text-gray-700'>
              <FileText className='h-4 w-4 mr-2' />
              Thư giới thiệu
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <p className='text-sm text-gray-500'>
              Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển
              dụng.
            </p>
            <Textarea
              placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, kinh nghiệm) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này. (Tối thiểu 50 ký tự)'
              rows={6}
              className={`w-full resize-none border-2 focus:border-blue-500 ${errors.coverLetter ? 'border-red-500' : ''}`}
              value={coverLetter}
              onChange={(e) => handleCoverLetterChange(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={!!errors.coverLetter}
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>{coverLetter.length}/2000 ký tự</span>
              {coverLetter.length > 0 && coverLetter.length < 50 && (
                <span className='text-yellow-600'>Còn thiếu {50 - coverLetter.length} ký tự</span>
              )}
            </div>
            {errors.coverLetter && <p className='text-sm text-red-600 mt-1'>{errors.coverLetter}</p>}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className='flex gap-3 pt-4 border-t'>
          <Button className='flex-1 btn-cancel' onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button className='flex-1 btn-submit' onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Nộp hồ sơ ứng tuyển'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
