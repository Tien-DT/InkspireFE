import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
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
  const [selectedContentType, setSelectedContentType] = useState('')

  useEffect(() => {
    if (fileUrl) {
      setSelectedContentType(getExtensionFromUrl(fileUrl))
    }
  }, [fileUrl])

  const handleSubmit = () => {
    onSubmit(selectedContentType)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Khiếu nại Milestone</DialogTitle>
          <DialogDescription>
            Vui lòng xác nhận loại file để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại file" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
