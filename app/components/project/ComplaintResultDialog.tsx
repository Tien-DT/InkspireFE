import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { Check, X, AlertCircle, Clock } from 'lucide-react'

interface MilestoneComplaint {
  id: string
  projectMilestoneId: string
  clientId: string
  freelancerId: string
  fileUrl?: string
  fileName?: string
  contentType?: string
  requirementText?: string
  processingStatus: number
  meetsRequirements?: boolean
  evaluationScore?: number
  contentQualityScore?: number
  technicalAccuracyScore?: number
  styleComplianceScore?: number
  completenessScore?: number
  evaluationAnalysis?: string
  suggestions?: string
  strengths?: string
  weaknesses?: string
  missingElements?: string
  aiModel?: string
  evaluationDurationMs?: number
  errorMessage?: string
  previousMilestoneStatus?: number
  resultingMilestoneStatus?: number
  createdAt: string
  updatedAt?: string
  processedAt?: string
}

interface ComplaintResultDialogProps {
  isOpen: boolean
  onClose: () => void
  complaint: MilestoneComplaint | null
}

const parseJsonArray = (jsonStr?: string): string[] => {
  if (!jsonStr) return []
  try {
    return JSON.parse(jsonStr)
  } catch {
    return []
  }
}

const getProcessingStatusInfo = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Đang chờ xử lý', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    case 1:
      return { label: 'Đang xử lý', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' }
    case 2:
      return { label: 'Đã hoàn thành', icon: Check, color: 'text-green-600', bgColor: 'bg-green-100' }
    case 3:
      return { label: 'Thất bại', icon: X, color: 'text-red-600', bgColor: 'bg-red-100' }
    default:
      return { label: 'Không xác định', icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }
}

export function ComplaintResultDialog({ isOpen, onClose, complaint }: ComplaintResultDialogProps) {
  if (!complaint) return null

  const processingStatusInfo = getProcessingStatusInfo(complaint.processingStatus)
  const StatusIcon = processingStatusInfo.icon

  const suggestions = parseJsonArray(complaint.suggestions)
  const strengths = parseJsonArray(complaint.strengths)
  const weaknesses = parseJsonArray(complaint.weaknesses)
  const missingElements = parseJsonArray(complaint.missingElements)

  const isCompleted = complaint.processingStatus === 2

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-3'>
            Kết quả khiếu nại
            <Badge className={`${processingStatusInfo.bgColor} ${processingStatusInfo.color}`}>
              <StatusIcon className='h-4 w-4 mr-1' />
              {processingStatusInfo.label}
            </Badge>
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Kết quả đánh giá từ AI về sản phẩm của freelancer
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 pt-4'>
          {/* Processing in progress */}
          {!isCompleted && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3'>
              <Clock className='h-5 w-5 text-blue-600 mt-0.5 animate-pulse' />
              <div>
                <p className='font-semibold text-blue-900'>Đang xử lý</p>
                <p className='text-sm text-blue-700'>
                  Hệ thống AI đang phân tích file. Vui lòng đợi trong giây lát...
                </p>
              </div>
            </div>
          )}

          {/* Processing failed */}
          {complaint.processingStatus === 3 && complaint.errorMessage && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
              <X className='h-5 w-5 text-red-600 mt-0.5' />
              <div>
                <p className='font-semibold text-red-900'>Xử lý thất bại</p>
                <p className='text-sm text-red-700'>{complaint.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Completed - Show results */}
          {isCompleted && (
            <>
              {/* Overall Result */}
              <div
                className={`border-2 rounded-lg p-6 ${
                  complaint.meetsRequirements
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className='flex items-center gap-3 mb-3'>
                  {complaint.meetsRequirements ? (
                    <Check className='h-8 w-8 text-green-600' />
                  ) : (
                    <X className='h-8 w-8 text-red-600' />
                  )}
                  <div>
                    <h3 className={`text-xl font-bold ${complaint.meetsRequirements ? 'text-green-900' : 'text-red-900'}`}>
                      {complaint.meetsRequirements
                        ? 'Sản phẩm đáp ứng yêu cầu'
                        : 'Sản phẩm chưa đáp ứng yêu cầu'}
                    </h3>
                    <p className={`text-sm ${complaint.meetsRequirements ? 'text-green-700' : 'text-red-700'}`}>
                      {complaint.meetsRequirements
                        ? 'Giai đoạn đã được đánh dấu hoàn thành tự động'
                        : 'Freelancer cần nộp lại sản phẩm'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className='bg-white border-2 border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Điểm đánh giá của AI</h3>
                <div className='grid grid-cols-1 gap-4'>
                  {complaint.evaluationScore !== undefined && (
                    <div className='flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300'>
                      <span className='text-base font-bold text-gray-900'>Điểm tổng thể:</span>
                      <span className='text-2xl font-bold text-blue-700'>{complaint.evaluationScore.toFixed(1)}/10</span>
                    </div>
                  )}
                  <div className='grid grid-cols-2 gap-4'>
                    {complaint.contentQualityScore !== undefined && (
                      <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                        <span className='text-sm font-medium text-gray-700'>Chất lượng nội dung:</span>
                        <span className='text-xl font-bold text-blue-600'>{complaint.contentQualityScore.toFixed(1)}/10</span>
                      </div>
                    )}
                    {complaint.technicalAccuracyScore !== undefined && (
                      <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                        <span className='text-sm font-medium text-gray-700'>Độ chính xác kỹ thuật:</span>
                        <span className='text-xl font-bold text-blue-600'>{complaint.technicalAccuracyScore.toFixed(1)}/10</span>
                      </div>
                    )}
                    {complaint.styleComplianceScore !== undefined && (
                      <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                        <span className='text-sm font-medium text-gray-700'>Tuân thủ phong cách:</span>
                        <span className='text-xl font-bold text-blue-600'>{complaint.styleComplianceScore.toFixed(1)}/10</span>
                      </div>
                    )}
                    {complaint.completenessScore !== undefined && (
                      <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                        <span className='text-sm font-medium text-gray-700'>Tính hoàn thiện:</span>
                        <span className='text-xl font-bold text-blue-600'>{complaint.completenessScore.toFixed(1)}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis */}
              {complaint.evaluationAnalysis && (
                <div className='bg-white border-2 border-gray-200 rounded-lg p-6'>
                  <h3 className='text-lg font-bold text-gray-900 mb-3'>Phân tích chi tiết</h3>
                  <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>{complaint.evaluationAnalysis}</p>
                </div>
              )}

              {/* Strengths */}
              {strengths.length > 0 && (
                <div className='bg-green-50 border-2 border-green-200 rounded-lg p-6'>
                  <h3 className='text-lg font-bold text-green-900 mb-3 flex items-center gap-2'>
                    <Check className='h-5 w-5' />
                    Điểm mạnh
                  </h3>
                  <ul className='space-y-2'>
                    {strengths.map((strength, index) => (
                      <li key={index} className='flex items-start gap-2 text-green-800'>
                        <span className='text-green-600 mt-1'>•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {weaknesses.length > 0 && (
                <div className='bg-orange-50 border-2 border-orange-200 rounded-lg p-6'>
                  <h3 className='text-lg font-bold text-orange-900 mb-3 flex items-center gap-2'>
                    <AlertCircle className='h-5 w-5' />
                    Điểm yếu
                  </h3>
                  <ul className='space-y-2'>
                    {weaknesses.map((weakness, index) => (
                      <li key={index} className='flex items-start gap-2 text-orange-800'>
                        <span className='text-orange-600 mt-1'>•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Elements */}
              {missingElements.length > 0 && (
                <div className='bg-red-50 border-2 border-red-200 rounded-lg p-6'>
                  <h3 className='text-lg font-bold text-red-900 mb-3 flex items-center gap-2'>
                    <X className='h-5 w-5' />
                    Thiếu sót
                  </h3>
                  <ul className='space-y-2'>
                    {missingElements.map((element, index) => (
                      <li key={index} className='flex items-start gap-2 text-red-800'>
                        <span className='text-red-600 mt-1'>•</span>
                        <span>{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-6'>
                  <h3 className='text-lg font-bold text-blue-900 mb-3'>Đề xuất cải thiện</h3>
                  <ul className='space-y-2'>
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className='flex items-start gap-2 text-blue-800'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className='bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1'>
                {complaint.aiModel && (
                  <p>
                    <span className='font-semibold'>Model AI:</span> {complaint.aiModel}
                  </p>
                )}
                {complaint.evaluationDurationMs && (
                  <p>
                    <span className='font-semibold'>Thời gian xử lý:</span> {(complaint.evaluationDurationMs / 1000).toFixed(2)}s
                  </p>
                )}
                {complaint.processedAt && (
                  <p>
                    <span className='font-semibold'>Thời điểm xử lý:</span>{' '}
                    {new Date(complaint.processedAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
