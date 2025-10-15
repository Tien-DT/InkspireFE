import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { useState, useEffect } from 'react'

interface ComplainDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contentType: string) => void
  fileUrl: string
}

const getExtensionFromUrl = (url: string) => {
  return url.split('.').pop()?.toLowerCase() || ''
}

export function ComplainDialog({ isOpen, onClose, onSubmit, fileUrl }: ComplainDialogProps) {
  const [contentType, setContentType] = useState('')

  useEffect(() => {
    if (fileUrl) {
      setContentType(getExtensionFromUrl(fileUrl))
    }
  }, [fileUrl])

  const handleSubmit = () => {
    onSubmit(contentType)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Khiếu nại sản phẩm của freelancer</DialogTitle>
          <DialogDescription className='space-y-3 pt-4'>
            <p className='text-base text-gray-700'>
              <strong>Chú Ý:</strong> Khiếu nại sẽ được Model A.I xử lý, nếu sản phẩm của freelancer phù hợp với yêu cầu của bạn thì hệ thống sẽ tự động hoàn thành giai đoạn này.
            </p>
            <p className='text-base text-gray-700'>
              Nếu sản phẩm của freelancer có sai sót, không đáp ứng yêu cầu của dự án, chúng tôi sẽ thông báo cho bên đối tác để họ nộp lại sản phẩm của mình.
            </p>
            <p className='text-base font-semibold text-gray-900 pt-2'>
              Bạn vui lòng xác nhận
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className='bg-red-600 hover:bg-red-700'>
            Xác nhận khiếu nại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
