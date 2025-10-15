import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

// Define the type for the evaluation data based on the user's example
interface EvaluationData {
  id: string
  similarityScore: number
  evaluationScore: number
  contentQualityScore: number
  technicalAccuracyScore: number
  styleComplianceScore: number
  completenessScore: number
  averageScore: number
  evaluationAnalysis: string
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  missingElements: string[]
  meetsRequirements: boolean
}

interface EvaluationResultDialogProps {
  isOpen: boolean
  onClose: () => void
  evaluationData: EvaluationData | null
}

export function EvaluationResultDialog({ isOpen, onClose, evaluationData }: EvaluationResultDialogProps) {
  if (!evaluationData) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Kết quả đánh giá</DialogTitle>
          <DialogDescription>Dưới đây là kết quả đánh giá chi tiết từ AI.</DialogDescription>
        </DialogHeader>
        <div className='py-4 max-h-[70vh] overflow-y-auto'>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold'>Tổng quan</h3>
              <div className='flex items-center gap-4'>
                <p>Điểm trung bình: {evaluationData.averageScore}</p>
                <p>
                  Có đạt yêu cầu không:{' '}
                  {evaluationData.meetsRequirements ? (
                    <Badge className='bg-green-500'>Đạt</Badge>
                  ) : (
                    <Badge variant='destructive'>Không đạt</Badge>
                  )}
                </p>
              </div>
            </div>
            <div>
              <h3 className='font-semibold'>Phân tích</h3>
              <p>{evaluationData.evaluationAnalysis}</p>
            </div>
            <div>
              <h3 className='font-semibold'>Điểm mạnh</h3>
              <ul className='list-disc list-inside'>
                {evaluationData.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-semibold'>Điểm yếu</h3>
              <ul className='list-disc list-inside'>
                {evaluationData.weaknesses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-semibold'>Đề xuất</h3>
              <ul className='list-disc list-inside'>
                {evaluationData.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-semibold'>Các phần còn thiếu</h3>
              <ul className='list-disc list-inside'>
                {evaluationData.missingElements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
