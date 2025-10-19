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
  
  if (!hasCompletedComplaint) return null
  
  return (
    <Button
      size='sm'
      variant='outline'
      onClick={() => onViewComplaint(milestoneId, complaints)}
      className={className}
    >
      <FileText className='h-4 w-4 mr-1.5' />
      Xem kết quả khiếu nại
    </Button>
  )
}
