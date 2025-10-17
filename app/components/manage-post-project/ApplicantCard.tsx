import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar, CheckCircle2, Clock, FileText, Loader2, Mail, MessageSquare, UserX, XCircle } from 'lucide-react'
import { Link } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { Application as RecruitmentApplication } from '~/types/recruitment.type'

interface ApplicantCardProps {
  application: RecruitmentApplication
  onAccept?: () => void
  onReject?: () => void
  onSendMessage?: () => void
  isProcessing?: boolean
  isRejecting?: boolean
  isSendingMessage?: boolean
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function ApplicantCard({
  application,
  onAccept,
  onReject,
  onSendMessage,
  isProcessing,
  isRejecting,
  isSendingMessage
}: ApplicantCardProps) {
  const getStatusBadge = (status: number) => {
    const baseClasses =
      'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm'

    switch (status) {
      case 2:
        return (
          <Badge className={cn(baseClasses, 'border-emerald-200 bg-emerald-50 text-emerald-700')}>
            <CheckCircle2 className='h-3.5 w-3.5' />
            Đã chấp nhận
          </Badge>
        )
      case 3:
        return (
          <Badge className={cn(baseClasses, 'border-rose-200 bg-rose-50 text-rose-700')}>
            <UserX className='h-3.5 w-3.5' />
            Đã từ chối
          </Badge>
        )
      default:
        return (
          <Badge className={cn(baseClasses, 'border-amber-200 bg-amber-50 text-amber-700')}>
            <Clock className='h-3.5 w-3.5' />
            Chờ xét duyệt
          </Badge>
        )
    }
  }

  const freelancerId = application.user?.id || application.userId



  return (
    <Card className='group relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
      <CardContent className='p-6 sm:p-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-start md:gap-8'>
          <Link to={`/user-profile/${freelancerId}`} className='flex-shrink-0'>
            <Avatar className='h-16 w-16 cursor-pointer rounded-2xl border border-border/40 bg-card/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
              <AvatarImage src={undefined} alt={`${application.user.firstName} ${application.user.lastName}`} />
              <AvatarFallback className='rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-lg font-semibold text-white'>
                {application.user.firstName?.charAt(0) || application.user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className='flex-1 space-y-5'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <Link to={`/user-profile/${freelancerId}`} className='group/name inline-flex flex-col'>
                  <span className='text-xl font-semibold text-foreground transition-colors group-hover/name:text-primary'>
                    {application.user.firstName} {application.user.lastName}
                  </span>
                  <span className='text-sm text-muted-foreground'>{application.user.email}</span>
                </Link>
              </div>
              {getStatusBadge(application.status)}
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4 text-muted-foreground/70' />
                <span>{application.user.email}</span>
              </div>
              <div className='flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4 text-muted-foreground/70' />
                <span>Nộp hồ sơ: {formatDate(application.createdAt)}</span>
              </div>
            </div>

            <div className='rounded-3xl border border-border/40 bg-muted/15 p-5 shadow-inner'>
              <p className='text-sm font-semibold text-foreground'>Thư giới thiệu</p>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{application.coverLetter}</p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-9 rounded-full px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10'
                  onClick={() => window.open(application.cvFileUrl, '_blank')}
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Xem CV
                </Button>
                {onSendMessage && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-9 rounded-full px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10'
                    onClick={onSendMessage}
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <MessageSquare className='mr-2 h-4 w-4' />
                    )}
                    {isSendingMessage ? 'Đang tạo...' : 'Gửi tin nhắn'}
                  </Button>
                )}
              </div>

              {application.status === 0 && (
                <div className='flex flex-wrap gap-2'>
                  {onReject && (
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-9 rounded-full border border-border/40 px-4 text-sm font-medium text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/10'
                      onClick={onReject}
                      disabled={isRejecting}
                    >
                      {isRejecting ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <XCircle className='mr-2 h-4 w-4' />
                      )}
                      {isRejecting ? 'Đang xử lý...' : 'Từ chối'}
                    </Button>
                  )}
                  {onAccept && (
                    <Button
                      size='sm'
                      className='h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                      onClick={onAccept}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <CheckCircle2 className='mr-2 h-4 w-4' />
                      )}
                      {isProcessing ? 'Đang xử lý...' : 'Chấp nhận'}
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
