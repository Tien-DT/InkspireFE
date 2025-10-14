import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useEvaluateMilestoneFile } from '~/hooks/useProjects'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TimelineItem } from '~/routes/project-detail'
import type { Project } from '~/apis/project.api'
import { EvaluationResult } from './EvaluationResult'
import type { EvaluationResultData } from './EvaluationResult'

interface EvaluationDialogProps {
  isOpen: boolean
  onClose: () => void
  milestone: TimelineItem | null
  project: Project | null
  timelines: TimelineItem[]
}

export function EvaluationDialog({ isOpen, onClose, milestone, project, timelines }: EvaluationDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResultData | null>(null)
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
    const currentMilestoneIndex = timelines.findIndex((t) => t.id === milestone.id)
    for (let i = 0; i <= currentMilestoneIndex; i++) {
      requirementText += `\nLần nộp thứ ${i + 1}: ${timelines[i].description}`
    }

    try {
      const result = await evaluateMutation.mutateAsync({ requirementText, file })
      setEvaluationResult(result.data as EvaluationResultData)
    } catch (error) {
      console.error('Failed to evaluate milestone file', error)
      toast.error('Đã có lỗi xảy ra khi chấm điểm')
    }
  }

  const handleClose = () => {
    setFile(null)
    setEvaluationResult(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-6xl overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Kiểm tra sản phẩm bằng AI</DialogTitle>
        </DialogHeader>
        {evaluationResult ? (
          <EvaluationResult result={evaluationResult} />
        ) : (
          <div>
            <Input type='file' accept='.pdf,.jpg,.jpeg,.png,.svg' onChange={handleFileChange} />
          </div>
        )}
        <DialogFooter>
          {evaluationResult ? (
            <Button onClick={handleClose}>Đóng</Button>
          ) : (
            <>
              <Button onClick={handleClose} variant='outline'>
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={!file || evaluateMutation.isPending}>
                {evaluateMutation.isPending ? 'Đang chấm điểm...' : 'Chấm điểm'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
