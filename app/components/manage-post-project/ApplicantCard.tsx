import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Calendar, CheckCircle, FileText, Loader2, Mail, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { Application as RecruitmentApplication } from '~/types/recruitment.type'

interface ApplicantCardProps {
  application: RecruitmentApplication
  onAccept?: () => void
  onReject?: () => void
  isProcessing?: boolean
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function ApplicantCard({ application, onAccept, onReject, isProcessing }: ApplicantCardProps) {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 2:
        return <Badge className='bg-green-100 text-green-800'>Đã chấp nhận</Badge>
      case 3:
        return <Badge className='bg-red-100 text-red-800'>Đã từ chối</Badge>
      default:
        return <Badge className='bg-yellow-100 text-yellow-800'>Chờ xét duyệt</Badge>
    }
  }

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage src={undefined} alt={`${application.user.firstName} ${application.user.lastName}`} />
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg'>
              {application.user.firstName?.charAt(0) || application.user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1'>
            <div className='flex items-start justify-between mb-3'>
              <div>
                <h4 className='text-lg font-bold text-gray-900'>
                  {application.user.firstName} {application.user.lastName}
                </h4>
                <p className='text-sm text-gray-500'>{application.user.email}</p>
              </div>
              {getStatusBadge(application.status)}
            </div>

            <div className='space-y-2 mb-4'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Mail className='h-4 w-4' />
                <span>{application.user.email}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Calendar className='h-4 w-4' />
                <span>Nộp hồ sơ: {formatDate(application.createdAt)}</span>
              </div>
            </div>

            <div className='mb-4'>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Thư giới thiệu:</p>
              <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>{application.coverLetter}</p>
            </div>

            <div className='flex items-center justify-between'>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={() => window.open(application.cvFileUrl, '_blank')}
              >
                <FileText className='h-4 w-4' />
                Xem CV
              </Button>

              {application.status === 1 && (
                <div className='flex gap-2'>
                  {onAccept && (
                    <Button
                      size='sm'
                      className='bg-green-600 hover:bg-green-700 gap-2'
                      onClick={onAccept}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <CheckCircle className='h-4 w-4' />
                      )}
                      {isProcessing ? 'Đang xử lý...' : 'Chấp nhận'}
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      size='sm'
                      variant='outline'
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 gap-2'
                      onClick={onReject}
                    >
                      <XCircle className='h-4 w-4' />
                      Từ chối
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
