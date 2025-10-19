import { useComplaintsByMilestone } from '~/hooks/useProjects'
import { Button } from '~/components/ui/button'
import { FileText } from 'lucide-react'

interface TimelineItemWithComplaintsProps {
  milestoneId: string
  onViewComplaint: (milestoneId: string, complaints: any[]) => void
  className?: string
}

export function TimelineItemWithComplaints({ 
  milestoneId, 
  onViewComplaint,
  className 
}: TimelineItemWithComplaintsProps) {
  const { data: complaintsData } = useComplaintsByMilestone(milestoneId)
  
  const complaints = complaintsData?.data || []
  const hasCompletedComplaint = complaints.some((c: any) => c.processingStatus === 2)
  const hasFailedComplaint = complaints.some((c: any) => c.processingStatus === 3)
  
  // Show button if there's either completed or failed complaint
  if (!hasCompletedComplaint && !hasFailedComplaint) return null
  
  return (
    <Button
      size='sm'
      variant={hasFailedComplaint ? 'destructive' : 'outline'}
      onClick={() => onViewComplaint(milestoneId, complaints)}
      className={className}
    >
      <FileText className='h-4 w-4 mr-1.5' />
      {hasFailedComplaint ? 'Xem lỗi & Thử lại' : 'Xem kết quả khiếu nại'}
    </Button>
  )
}
