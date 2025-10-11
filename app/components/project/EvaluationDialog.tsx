import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useEvaluateMilestoneFile } from '~/hooks/useProjects'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TimelineItem } from '~/routes/project-detail'
import type { Project } from '~/apis/project.api'

interface EvaluationDialogProps {
  isOpen: boolean
  onClose: () => void
  milestone: TimelineItem | null
  project: Project | null
  timelines: TimelineItem[]
  onEvaluationComplete: (data: any) => void
}

export function EvaluationDialog({ isOpen, onClose, milestone, project, timelines, onEvaluationComplete }: EvaluationDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const evaluateMutation = useEvaluateMilestoneFile()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file || !project || !milestone) {
      toast.error('Vui lòng chọn file và đảm bảo thông tin dự án đầy đủ')
      return
    }

    let requirementText = project.description
    const currentMilestoneIndex = timelines.findIndex(t => t.id === milestone.id)
    for (let i = 0; i <= currentMilestoneIndex; i++) {
      requirementText += `
Lần nộp thứ ${i + 1}: ${timelines[i].description}`
    }

    try {
      const result = await evaluateMutation.mutateAsync({ requirementText, file })
      onEvaluationComplete(result.data)
      onClose()
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi chấm điểm')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kiểm tra sản phẩm bằng AI</DialogTitle>
        </DialogHeader>
        <div>
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.svg" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Hủy</Button>
          <Button onClick={handleSubmit} disabled={!file || evaluateMutation.isPending}>
            {evaluateMutation.isPending ? 'Đang chấm điểm...' : 'Chấm điểm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}