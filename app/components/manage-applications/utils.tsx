import { Badge } from '~/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    accepted: { label: 'Được chấp nhận', className: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Bị từ chối', className: 'bg-red-100 text-red-800', icon: XCircle },
    withdrawn: { label: 'Đã rút', className: 'bg-gray-100 text-gray-800', icon: XCircle }
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  const Icon = config.icon

  return (
    <Badge className={`${config.className} hover:${config.className} flex items-center gap-1`}>
      <Icon className='h-3 w-3' />
      {config.label}
    </Badge>
  )
}
