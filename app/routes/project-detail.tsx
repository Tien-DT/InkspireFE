import { Check, Clock, Download, FileText, ImageIcon, MessageCircle, Plus, Share2, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'
import { HydrateFallback } from '~/components/ui'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  useProjectById,
  useCreateMilestone,
  useMilestones,
  useUpdateMilestone,
  useUpdateProject,
  useUploadMilestoneDocument,
  useEvaluateMilestoneFile,
  useEvaluateMilestoneFileByUrl
} from '~/hooks/useProjects'
import type { Milestone } from '~/apis/project.api'
import { useWallet } from '~/hooks/useUser'
import { useAuth } from '~/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { EvaluationDialog } from '~/components/project/EvaluationDialog'
import { ComplainDialog } from '~/components/project/ComplainDialog'
import { EvaluationResultDialog } from '~/components/project/EvaluationResultDialog'

interface TimelineItem {
  id: string
  title: string
  description: string
  status: 'pending-payment' | 'paid' | 'completed' | 'pending-confirmation'
  createdDate: string
  budget: number
  isPaid: boolean
  fileUrl?: string
}

const getStatusInfo = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Bản nháp', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    case 1:
      return { label: 'Chờ ứng tuyển', color: 'text-[oklch(0.75_0.15_85)]', bgColor: 'bg-yellow-100' }
    case 2:
      return { label: 'Đang hoạt động', color: 'text-[oklch(0.55_0.15_240)]', bgColor: 'bg-blue-100' }
    case 3:
      return { label: 'Đã hoàn thành', color: 'text-[oklch(0.65_0.18_145)]', bgColor: 'bg-green-100' }
    case 4:
      return { label: 'Chờ xác nhận', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    default:
      return { label: 'Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateString
  }
}

// Map Milestone API response to TimelineItem
const mapMilestoneToTimeline = (milestone: Milestone): TimelineItem => {
  let status: TimelineItem['status'] = 'pending-payment'
  if (milestone.status === 1)
    status = 'pending-payment' // Chờ thanh toán
  else if (milestone.status === 2)
    status = 'paid' // Đã thanh toán
  else if (milestone.status === 3) status = 'completed' // Đã hoàn thành
  else if (milestone.status === 4) status = 'pending-confirmation' // Chờ xác nhận

  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    status,
    createdDate: milestone.createdAt,
    budget: milestone.budget,
    isPaid: milestone.status === 2 || milestone.status === 3 || milestone.status === 4,
    fileUrl: milestone.fileUrl
  }
}

function ProjectDetailContent() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data, isLoading, error } = useProjectById(projectId || '')
  const { data: milestonesData, isLoading: milestonesLoading } = useMilestones(projectId || '')
  const { data: walletData } = useWallet(profile?.id)
  const createMilestone = useCreateMilestone()
  const updateMilestone = useUpdateMilestone()
  const updateProject = useUpdateProject()
  const uploadMilestoneDocument = useUploadMilestoneDocument()
  const evaluateMilestoneFile = useEvaluateMilestoneFile()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAddingTimeline, setIsAddingTimeline] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showDepositSuccessDialog, setShowDepositSuccessDialog] = useState(false)
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [currentMilestone, setCurrentMilestone] = useState<TimelineItem | null>(null)
  const [newTimeline, setNewTimeline] = useState({
    title: '',
    description: '',
    createdDate: format(new Date(), 'yyyy-MM-dd'),
    budget: 0
  })
  const [isComplainDialogOpen, setIsComplainDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [currentTimelineForComplain, setCurrentTimelineForComplain] = useState<TimelineItem | null>(null)

  const evaluateMilestoneFileByUrl = useEvaluateMilestoneFileByUrl({
    onSuccess: data => {
      setEvaluationResult(data.data)
      setIsResultDialogOpen(true)
      if (data.data.meetsRequirements) {
        // Find the timeline that was complained about
        if (currentTimelineForComplain) {
          handleCompleteTimeline(currentTimelineForComplain)
          toast.success('Milestone tự động được hoàn thành do đạt yêu cầu.')
        }
      }
    },
    onError: () => {
      toast.error('Gửi khiếu nại thất bại.')
    }
  })

  const handleComplainClick = (timeline: TimelineItem) => {
    setCurrentTimelineForComplain(timeline)
    setIsComplainDialogOpen(true)
  }

  const handleComplainSubmit = async (contentType: string) => {
    if (!currentTimelineForComplain || !currentTimelineForComplain.fileUrl) {
      toast.error('Không tìm thấy file để khiếu nại.')
      return
    }

    const fileName = currentTimelineForComplain.fileUrl.split('/').pop() || 'unknown_file'

    try {
      await evaluateMilestoneFileByUrl.mutateAsync({
        requirementText: currentTimelineForComplain.description,
        fileUrl: currentTimelineForComplain.fileUrl,
        fileName,
        contentType
      })
      toast.success('Khiếu nại của bạn đã được gửi đi.')
    } catch (error) {
      // error is handled by onError in useMutation
    }
  }

  if (isLoading || milestonesLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải dữ liệu dự án...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <h3 className='text-lg font-semibold text-red-900 mb-2'>Có lỗi xảy ra</h3>
          <p className='text-red-600'>Không thể tải thông tin dự án. Vui lòng thử lại sau.</p>
        </div>
      </div>
    )
  }

  const project = data?.data

  if (!project) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Không tìm thấy dự án</h3>
          <p className='text-gray-600'>Dự án không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(project.status)
  const clientName = project.client
    ? `${project.client.firstName || ''} ${project.client.lastName || ''}`.trim() || project.client.email
    : project.clientName || 'N/A'

  const freelancerName = project.freelancer
    ? `${project.freelancer.firstName || ''} ${project.freelancer.lastName || ''}`.trim() || project.freelancer.email
    : project.freelancerName || 'Chưa có'

  // Map API data to timeline items
  const timelines: TimelineItem[] = milestonesData?.data?.map(mapMilestoneToTimeline) || []

  // Check if all milestones are completed
  const allMilestonesCompleted = timelines.length === 3 && timelines.every((t) => t.status === 'completed')

  // Max 3 milestones allowed
  const canAddMoreMilestones = timelines.length < 3

  // Check if user is client (role 1) - only clients can manage milestones
  const isClient = profile?.role === 1
  const isFreelancer = profile?.role === 2

  const handleAddTimeline = async () => {
    if (!newTimeline.title || !newTimeline.description || newTimeline.budget <= 0) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin')
      setShowErrorDialog(true)
      return
    }

    if (!projectId) {
      setErrorMessage('Không tìm thấy ID dự án')
      setShowErrorDialog(true)
      return
    }

    try {
      // Calculate milestone number (current count + 1)
      const milestoneNumber = timelines.length + 1

      // Create milestone via API
      await createMilestone.mutateAsync({
        projectId: projectId,
        title: newTimeline.title,
        description: newTimeline.description,
        milestoneNumber: milestoneNumber,
        budget: newTimeline.budget,
        deadline: new Date(newTimeline.createdDate).toISOString(),
        paymentStatus: 'pending',
        status: 1 // 1 = in-progress
      })

      // Query auto-invalidates, no manual state update needed
      setNewTimeline({
        title: '',
        description: '',
        createdDate: format(new Date(), 'yyyy-MM-dd'),
        budget: 0
      })
      setIsAddingTimeline(false)
      setShowSuccessDialog(true)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể tạo giai đoạn. Vui lòng thử lại.'
      setErrorMessage(errorMsg)
      setShowErrorDialog(true)
    }
  }

  const handleCompleteTimeline = async (timeline: TimelineItem) => {
    try {
      // Update milestone status to 3 (Đã hoàn thành) with budget
      await updateMilestone.mutateAsync({
        milestoneId: timeline.id,
        payload: {
          status: 3,
          budget: timeline.budget
        }
      })

      toast.success('Đã đánh dấu hoàn thành giai đoạn')
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: string | { message?: string } } })?.response?.data
      const errorMsg =
        typeof errorData === 'string'
          ? errorData
          : (errorData as { message?: string })?.message || 'Không thể hoàn thành giai đoạn. Vui lòng thử lại.'
      setErrorMessage(errorMsg)
      setShowErrorDialog(true)
    }
  }

  const handleDeposit = async (timeline: TimelineItem) => {
    try {
      // Get wallet balance
      const wallet = walletData?.data
      const availableBalance = wallet?.balance || 0

      // Check if user has enough funds
      if (availableBalance < timeline.budget) {
        setShowInsufficientFundsDialog(true)
        return
      }

      // Update milestone status to 2 (Đã thanh toán)
      await updateMilestone.mutateAsync({
        milestoneId: timeline.id,
        payload: {
          status: 2
        }
      })

      setShowDepositSuccessDialog(true)
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: string | { message?: string } } })?.response?.data
      const errorMsg =
        typeof errorData === 'string'
          ? errorData
          : (errorData as { message?: string })?.message || 'Đặt cọc thất bại. Vui lòng thử lại.'
      setErrorMessage(errorMsg)
      setShowErrorDialog(true)
    }
  }

  const handleCompleteProject = async () => {
    if (!projectId) return

    try {
      // Update project status to 3 (Đã hoàn thành)
      await updateProject.mutateAsync({
        projectId: projectId,
        payload: {
          status: 3
        }
      })

      toast.success('Dự án đã được đánh dấu hoàn thành!')
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: string | { message?: string } } })?.response?.data
      const errorMsg =
        typeof errorData === 'string'
          ? errorData
          : (errorData as { message?: string })?.message || 'Không thể hoàn thành dự án. Vui lòng thử lại.'
      setErrorMessage(errorMsg)
      setShowErrorDialog(true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmitFile = async (milestoneId: string) => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn một file')
      return
    }

    try {
      await uploadMilestoneDocument.mutateAsync({ milestoneId, file: selectedFile })
      await updateMilestone.mutateAsync({
        milestoneId,
        payload: {
          status: 4
        }
      })
      toast.success('Nộp file thành công')
      setSelectedFile(null)
    } catch (error) {
      toast.error('Nộp file thất bại')
    }
  }

  const canShowDeposit = (index: number) => {
    if (index === 0) return true // Timeline đầu tiên luôn hiện
    return timelines[index - 1]?.status === 'completed' // Timeline trước đã hoàn thành
  }

  const getTimelineStatusInfo = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return { icon: Check, color: 'bg-green-500', badge: 'bg-green-100 text-green-800', label: 'Đã hoàn thành' }
      case 'paid':
        return { icon: Check, color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800', label: 'Đã thanh toán' }
      case 'pending-payment':
        return { icon: Clock, color: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800', label: 'Chờ thanh toán' }
      case 'pending-confirmation':
        return { icon: Clock, color: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', label: 'Chờ xác nhận' }
      default:
        return { icon: Clock, color: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600', label: 'Chờ thanh toán' }
    }
  }

  return (
    <>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className='sm:max-w-md bg-white'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Tạo giai đoạn thành công!</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Giai đoạn mới đã được thêm vào dự án của bạn
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='h-10 w-10 text-red-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Không thể tạo giai đoạn</DialogTitle>
              <DialogDescription className='text-gray-600'>
                {errorMessage || 'Đã xảy ra lỗi. Vui lòng thử lại.'}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={() => setShowErrorDialog(false)}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Success Dialog */}
      <Dialog open={showDepositSuccessDialog} onOpenChange={setShowDepositSuccessDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Đặt cọc thành công!</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Số tiền đã được trừ khỏi ví của bạn. Giai đoạn đã chuyển sang trạng thái "Đã thanh toán".
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={() => setShowDepositSuccessDialog(false)}
              className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insufficient Funds Dialog */}
      <Dialog open={showInsufficientFundsDialog} onOpenChange={setShowInsufficientFundsDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='h-10 w-10 text-orange-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Số dư không đủ</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Số dư trong ví của bạn không đủ để thực hiện giao dịch này. Vui lòng nạp thêm tiền vào ví.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center gap-3'>
            <Button variant='outline' onClick={() => setShowInsufficientFundsDialog(false)} className='flex-1'>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setShowInsufficientFundsDialog(false)
                navigate('/payment')
              }}
              className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            >
              Nạp tiền ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EvaluationDialog
        isOpen={isEvaluating}
        onClose={() => setIsEvaluating(false)}
        milestone={currentMilestone}
        project={project}
        timelines={timelines}
      />

      <ComplainDialog
        isOpen={isComplainDialogOpen}
        onClose={() => setIsComplainDialogOpen(false)}
        onSubmit={handleComplainSubmit}
        fileUrl={currentTimelineForComplain?.fileUrl || ''}
      />

      <EvaluationResultDialog
        isOpen={isResultDialogOpen}
        onClose={() => setIsResultDialogOpen(false)}
        evaluationData={evaluationResult}
      />

      <div className='container mx-auto px-4 py-6 space-y-6 flex min-h-screen bg-background'>
        <div className='w-80 bg-white min-h-screen p-6 rounded-lg'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin dự án</h2>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Tên dự án</p>
                <p className='font-medium text-gray-900 break-words whitespace-normal'>{project.title}</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Mô tả</p>
                <p className='text-sm text-gray-900 break-words whitespace-normal'>{project.description}</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Khách hàng</p>
                <p className='text-gray-900'>{clientName}</p>
              </div>

              {project.freelancer && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Freelancer</p>
                  <p className='text-gray-900'>{freelancerName}</p>
                </div>
              )}

              <div>
                <p className='text-sm text-gray-600 mb-1'>Ngày tạo</p>
                <p className='text-gray-900'>{formatDate(project.createdAt)}</p>
              </div>

              {project.updatedAt && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Cập nhật lần cuối</p>
                  <p className='text-gray-900'>{formatDate(project.updatedAt)}</p>
                </div>
              )}

              {project.deadline && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Deadline</p>
                  <p className='text-gray-900'>{formatDate(project.deadline)}</p>
                </div>
              )}

              <div>
                <p className='text-sm text-gray-600 mb-1'>Trạng thái</p>
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} hover:${statusInfo.bgColor}`}>
                  ● {statusInfo.label}
                </Badge>
              </div>

              {project.category && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Danh mục</p>
                  <p className='text-gray-900'>{project.category}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tệp đính kèm</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                <div className='flex items-center'>
                  <FileText className='h-5 w-5 text-red-500 mr-3' />
                  <span className='text-sm text-gray-900'>Yêu cầu kỹ thuật.pdf</span>
                </div>
                <Download className='h-4 w-4 text-gray-400' />
              </div>

              <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                <div className='flex items-center'>
                  <ImageIcon className='h-5 w-5 text-green-500 mr-3' />
                  <span className='text-sm text-gray-900'>Mockup thiết kế.jpg</span>
                </div>
                <Download className='h-4 w-4 text-gray-400' />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 p-6'>
          {/* Tabs */}
          <div className='flex border-b border-gray-200 mb-6'>
            <button className='px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium'>Timeline dự án</button>
            <button className='px-4 py-2 text-gray-600 hover:text-gray-900'>Tất cả</button>
            <button className='px-4 py-2 text-gray-600 hover:text-gray-900'>Đang chờ</button>
          </div>

          {/* Project Timeline */}
          <div className='space-y-6 '>
            {/* Add Timeline Form */}
            {isAddingTimeline && isClient && (
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md'>
                  <Plus className='h-5 w-5 text-white' />
                </div>
                <div className='flex-1'>
                  <Card className='border-2 border-blue-300 shadow-lg bg-gradient-to-br from-blue-50 to-white'>
                    <CardContent className='p-8'>
                      <div className='flex items-center justify-between mb-6'>
                        <div>
                          <h3 className='text-xl font-bold text-gray-900'>Thêm giai đoạn mới</h3>
                          <p className='text-sm text-gray-500 mt-1'>
                            Giai đoạn sẽ tự động ở trạng thái "Đang thực hiện"
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setIsAddingTimeline(false)}
                          className='hover:bg-red-100'
                        >
                          <X className='h-5 w-5 text-gray-500' />
                        </Button>
                      </div>

                      <div className='space-y-5'>
                        <div>
                          <Label htmlFor='title' className='text-sm font-semibold text-gray-700'>
                            Tiêu đề giai đoạn <span className='text-red-500'>*</span>
                          </Label>
                          <Input
                            id='title'
                            value={newTimeline.title}
                            onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                            placeholder='VD: Phân tích yêu cầu, Thiết kế UI/UX...'
                            className='mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                          />
                        </div>

                        <div>
                          <Label htmlFor='description' className='text-sm font-semibold text-gray-700'>
                            Mô tả chi tiết <span className='text-red-500'>*</span>
                          </Label>
                          <Textarea
                            id='description'
                            value={newTimeline.description}
                            onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                            placeholder='Mô tả công việc cần thực hiện trong giai đoạn này...'
                            rows={4}
                            className='mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                          />
                        </div>

                        <div className='grid grid-cols-2 gap-5'>
                          <div>
                            <Label htmlFor='createdDate' className='text-sm font-semibold text-gray-700'>
                              Ngày bắt đầu
                            </Label>
                            <Input
                              id='createdDate'
                              type='date'
                              value={newTimeline.createdDate}
                              onChange={(e) => setNewTimeline({ ...newTimeline, createdDate: e.target.value })}
                              className='mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            />
                          </div>

                          <div>
                            <Label htmlFor='budget' className='text-sm font-semibold text-gray-700'>
                              Budget <span className='text-red-500'>*</span>
                            </Label>
                            <div className='relative mt-1.5'>
                              <Input
                                id='budget'
                                type='number'
                                value={newTimeline.budget || ''}
                                onChange={(e) => setNewTimeline({ ...newTimeline, budget: Number(e.target.value) })}
                                placeholder='0'
                                className='h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12'
                              />
                              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>
                                VNĐ
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
                          <Button variant='outline' onClick={() => setIsAddingTimeline(false)} className='px-6'>
                            Hủy bỏ
                          </Button>
                          <Button
                            onClick={handleAddTimeline}
                            disabled={createMilestone.isPending}
                            className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {createMilestone.isPending ? (
                              <>
                                <Clock className='h-4 w-4 mr-2 animate-spin' />
                                Đang tạo...
                              </>
                            ) : (
                              'Tạo giai đoạn'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Render Timeline Items */}
            {timelines.map((timeline, index) => {
              const statusInfo = getTimelineStatusInfo(timeline.status)
              const IconComponent = statusInfo.icon
              const showDeposit = canShowDeposit(index)
              const isCompleted = timeline.status === 'completed'

              return (
                <div key={timeline.id} className='flex items-start gap-4'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={`flex-shrink-0 w-10 h-10 ${statusInfo.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300`}
                    >
                      {IconComponent ? (
                        <IconComponent className='h-5 w-5 text-white' />
                      ) : (
                        <div className='w-3 h-3 bg-white rounded-full'></div>
                      )}
                    </div>
                    {index < timelines.length - 1 && (
                      <div className={`w-0.5 h-16 mt-2 ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`} />
                    )}
                  </div>

                  <div className='flex-1'>
                    <Card
                      className={`transition-all duration-300 hover:shadow-xl ${
                        isCompleted
                          ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                          : 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white'
                      }`}
                    >
                      <CardContent className='p-6'>
                        <div className='flex items-start justify-between mb-4'>
                          <div className='flex-1'>
                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>{timeline.title}</h3>
                            <div className='flex items-center gap-3 text-sm text-gray-500'>
                              <span className='flex items-center gap-1.5'>
                                <Clock className='h-4 w-4' />
                                {formatDate(timeline.createdDate)}
                              </span>
                              <span className='text-gray-300'>•</span>
                              <span className='font-bold text-base text-gray-900'>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                  timeline.budget
                                )}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={`${statusInfo.badge} hover:${statusInfo.badge} text-sm font-semibold px-4 py-1.5`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>

                        <p className='text-gray-700 text-base leading-relaxed mb-6 break-words whitespace-normal'>
                          {timeline.description}
                        </p>

                        <div className='flex items-center justify-between pt-5 border-t-2 border-gray-200'>
                          <div className='flex gap-3'>{/* Empty left side */}</div>

                          {/* Only show action buttons for clients */}
                          {isClient && (
                            <div>
                              {/* Show "Đặt cọc ngay" only when status is 'pending-payment' (status 1) */}
                              {showDeposit && timeline.status === 'pending-payment' && (
                                <Button
                                  onClick={() => handleDeposit(timeline)}
                                  disabled={updateMilestone.isPending}
                                  className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md disabled:opacity-50'
                                >
                                  {updateMilestone.isPending ? (
                                    <>
                                      <Clock className='h-4 w-4 mr-2 animate-spin' />
                                      Đang xử lý...
                                    </>
                                  ) : (
                                    <>
                                      <MessageCircle className='h-4 w-4 mr-2' />
                                      Đặt cọc ngay
                                    </>
                                  )}
                                </Button>
                              )}

                              {/* Show "Đánh dấu hoàn thành" only when status is 'paid' (status 2) */}
                              {timeline.status === 'paid' && (
                                <div className='flex items-center gap-2 text-blue-600 text-base font-semibold'>
                                  <Clock className='h-5 w-5' />
                                  Chờ freelancer nộp file
                                </div>
                              )}

                              {timeline.status === 'pending-confirmation' && (
                                <div className='flex items-center gap-2'>
                                  {timeline.fileUrl && (
                                    <a href={timeline.fileUrl} target='_blank' rel='noopener noreferrer'>
                                      <Button size='sm' variant='outline'>
                                        <Download className='h-4 w-4 mr-1.5' />
                                        Tải file
                                      </Button>
                                    </a>
                                  )}
                                  <Button
                                    size='sm'
                                    onClick={() => handleCompleteTimeline(timeline)}
                                    disabled={updateMilestone.isPending}
                                    className='bg-green-600 hover:bg-green-700 text-white shadow-md disabled:opacity-50'
                                  >
                                    {updateMilestone.isPending ? (
                                      <>
                                        <Clock className='h-4 w-4 mr-1.5 animate-spin' />
                                        Đang xử lý...
                                      </>
                                    ) : (
                                      <>
                                        <Check className='h-4 w-4 mr-1.5' />
                                        Đánh dấu hoàn thành
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size='sm'
                                    onClick={() => handleComplainClick(timeline)}
                                    disabled={evaluateMilestoneFileByUrl.isPending}
                                    className='bg-red-600 hover:bg-red-700 text-white shadow-md disabled:opacity-50'
                                  >
                                    {evaluateMilestoneFileByUrl.isPending ? (
                                      <>
                                        <Clock className='h-4 w-4 mr-1.5 animate-spin' />
                                        Đang gửi...
                                      </>
                                    ) : (
                                      'Khiếu nại'
                                    )}
                                  </Button>
                                </div>
                              )}

                              {/* Show completion badge when status is 'completed' (status 3) */}
                              {isCompleted && (
                                <div className='flex items-center gap-2 text-green-600 text-base font-semibold'>
                                  <Check className='h-5 w-5' />
                                  Đã hoàn thành
                                </div>
                              )}
                            </div>
                          )}

                          {/* Freelancer only sees status badge */}
                          {isFreelancer && timeline.status === 'paid' && (
                            <div className='flex items-center gap-2'>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  setCurrentMilestone(timeline)
                                  setIsEvaluating(true)
                                }}
                              >
                                Kiểm tra sản phẩm bằng AI
                              </Button>
                              <Input type='file' accept='.pdf,.jpg,.jpeg,.png,.svg' onChange={handleFileChange} />
                              <Button onClick={() => handleSubmitFile(timeline.id)} disabled={!selectedFile}>
                                Nộp file
                              </Button>
                            </div>
                          )}

                          {isFreelancer && timeline.status === 'pending-confirmation' && (
                            <div className='flex items-center gap-2 text-orange-600 text-base font-semibold'>
                              <Clock className='h-5 w-5' />
                              Chờ xác nhận
                            </div>
                          )}

                          {isFreelancer && isCompleted && (
                            <div className='flex items-center gap-2 text-green-600 text-base font-semibold'>
                              <Check className='h-5 w-5' />
                              Đã hoàn thành
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}

            {/* Empty State */}
            {timelines.length === 0 && !isAddingTimeline && isClient && (
              <div className='text-center py-16'>
                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full mb-4'>
                  <Clock className='h-10 w-10 text-blue-500' />
                </div>
                <h3 className='text-lg font-semibold text-gray-700 mb-2'>Chưa có giai đoạn nào</h3>
                <p className='text-gray-500 mb-6'>
                  Bắt đầu bằng cách thêm giai đoạn đầu tiên cho dự án của bạn (Tối đa 3 giai đoạn)
                </p>
                <Button
                  onClick={() => setIsAddingTimeline(true)}
                  disabled={project.status !== 2}
                  className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Thêm giai đoạn đầu tiên
                </Button>
              </div>
            )}

            {/* Empty State for Freelancer */}
            {timelines.length === 0 && isFreelancer && (
              <div className='text-center py-16'>
                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-4'>
                  <Clock className='h-10 w-10 text-gray-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-700 mb-2'>Chưa có giai đoạn nào</h3>
                <p className='text-gray-500'>Khách hàng chưa tạo giai đoạn cho dự án này</p>
              </div>
            )}
          </div>

          {/* Quick Actions - Only for clients */}
          {isClient && (
            <div className='sticky bottom-0 mt-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-2 border-gray-300 shadow-2xl'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>Hành động nhanh</h3>
              <div className='grid grid-cols-4 gap-6'>
                <button
                  onClick={() => setIsAddingTimeline(true)}
                  disabled={!canAddMoreMilestones || project.status !== 2}
                  className={`text-center border-2 rounded-xl py-7 transition-all duration-200 group ${
                    canAddMoreMilestones && project.status === 2
                      ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg cursor-pointer'
                      : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      canAddMoreMilestones ? 'group-hover:scale-110' : ''
                    } transition-transform duration-200`}
                  >
                    <Plus className='h-6 w-6 text-blue-600' />
                  </div>
                  <p
                    className={`text-sm font-medium ${canAddMoreMilestones ? 'text-gray-700 group-hover:text-blue-600' : 'text-gray-500'}`}
                  >
                    Thêm giai đoạn {!canAddMoreMilestones && '(Tối đa 3)'}
                  </p>
                </button>

                <button className='text-center border-2 border-gray-200 rounded-xl py-7 hover:border-green-500 hover:bg-green-50 transition-all duration-200 hover:shadow-lg group'>
                  <div className='w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200'>
                    <Download className='h-6 w-6 text-green-600' />
                  </div>
                  <p className='text-sm font-medium text-gray-700 group-hover:text-green-600'>Tải báo cáo</p>
                </button>

                <button className='text-center border-2 border-gray-200 rounded-xl py-7 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:shadow-lg group'>
                  <div className='w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200'>
                    <MessageCircle className='h-6 w-6 text-orange-600' />
                  </div>
                  <p className='text-sm font-medium text-gray-700 group-hover:text-orange-600'>Gửi phản hồi</p>
                </button>

                {allMilestonesCompleted ? (
                  <button
                    onClick={handleCompleteProject}
                    disabled={updateProject.isPending}
                    className='text-center border-2 border-green-500 bg-gradient-to-br from-green-50 to-white rounded-xl py-7 hover:border-green-600 hover:bg-green-100 transition-all duration-200 hover:shadow-xl group animate-pulse disabled:opacity-50'
                  >
                    <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg'>
                      <CheckCircle2 className='h-6 w-6 text-white' />
                    </div>
                    <p className='text-sm font-bold text-green-700 group-hover:text-green-800'>
                      {updateProject.isPending ? 'Đang xử lý...' : 'Hoàn thành dự án'}
                    </p>
                  </button>
                ) : (
                  <button className='text-center border-2 border-gray-200 rounded-xl py-7 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-lg group'>
                    <div className='w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200'>
                      <Share2 className='h-6 w-6 text-purple-600' />
                    </div>
                    <p className='text-sm font-medium text-gray-700 group-hover:text-purple-600'>Chia sẻ</p>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function ProjectDetail() {
  return (
    <Suspense fallback={<HydrateFallback variant='details' showHeader />}>
      <ProjectDetailContent />
    </Suspense>
  )
}
