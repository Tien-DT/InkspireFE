import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Building2, MapPin, DollarSign, Clock, Calendar, Eye, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getStatusBadge } from '~/components/manage-applications/utils'

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  companyLogo?: string
  location: string
  budget: {
    min: number
    max: number
    currency: string
  }
  appliedDate: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  jobDescription: string
  requiredSkills: string[]
  projectDuration: string
  teamSize: number
  postedDate: string
  deadline: string
  categories: string[]
  coverLetter: string
  proposedRate: number
  estimatedTime: string
}

interface ApplicationCardProps {
  application: JobApplication
  onView: () => void
  onWithdraw?: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const skillColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700'
]

export function ApplicationCard({ application, onView, onWithdraw }: ApplicationCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex gap-4 flex-1'>
            {/* Company Logo */}
            <Avatar className='h-16 w-16 shrink-0'>
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold'>
                {application.companyName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            {/* Job Info */}
            <div className='flex-1'>
              <div className='flex items-start justify-between mb-2'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-1'>{application.jobTitle}</h3>
                  <div className='flex items-center gap-2 text-gray-600 mb-2'>
                    <Building2 className='h-4 w-4' />
                    <span className='font-medium'>{application.companyName}</span>
                  </div>
                </div>
                {getStatusBadge(application.status)}
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <MapPin className='h-4 w-4' />
                  <span>{application.location}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <DollarSign className='h-4 w-4' />
                  <span>
                    {formatCurrency(application.budget.min)} - {formatCurrency(application.budget.max)}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Clock className='h-4 w-4' />
                  <span>{application.projectDuration}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Calendar className='h-4 w-4' />
                  <span>Ứng tuyển: {format(new Date(application.appliedDate), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 mb-4'>
                {application.requiredSkills.slice(0, 4).map((skill, index) => (
                  <Badge key={skill} className={`${skillColors[index % skillColors.length]} hover:opacity-80`}>
                    {skill}
                  </Badge>
                ))}
                {application.requiredSkills.length > 4 && (
                  <Badge variant='outline'>+{application.requiredSkills.length - 4} kỹ năng khác</Badge>
                )}
              </div>

              <div className='flex items-center gap-3'>
                <Button onClick={onView} className='btn-submit'>
                  <Eye className='h-4 w-4 mr-2' />
                  Xem chi tiết
                </Button>

                {application.status === 'pending' && onWithdraw && (
                  <Button className='btn-cancel text-red-600 hover:text-red-700 hover:bg-red-50' onClick={onWithdraw}>
                    <XCircle className='h-4 w-4 mr-2' />
                    Rút ứng tuyển
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
