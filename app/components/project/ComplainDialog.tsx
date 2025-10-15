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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Khiếu nại Milestone</DialogTitle>
          <DialogDescription>
            Hệ thống đã phát hiện loại file là: <strong>{contentType}</strong>.
            <br />
            Nhấn "Xác nhận" để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
