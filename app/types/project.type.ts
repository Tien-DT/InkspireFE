export interface TimelineItem {
  id: string
  title: string
  description: string
  status: 'pending-payment' | 'paid' | 'completed' | 'pending-confirmation'
  createdDate: string
  budget: number
  isPaid: boolean
  fileUrl?: string
}
