import { Briefcase, Calendar, Clock, DollarSign, Users } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Spinner } from '~/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'
import type { Application as RecruitmentApplication } from '~/types/recruitment.type'
import { ProjectStatus } from '~/types/recruitment.type'
import { ApplicantCard } from './ApplicantCard'
import { getRecruitmentStatusStyle } from './status-theme'

interface Skill {
  id: string
  name: string
}

interface ProjectDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: {
    id: string
    title: string
    description: string
    projectName: string
    budget: number
    teamSize: string
    createdAt: string
    status: number
    skills: Skill[]
  } | null
  applications: RecruitmentApplication[]
  applicationsLoading: boolean
  applicationsError: Error | null
  onAcceptApplicant?: (application: RecruitmentApplication) => void
  onRejectApplicant?: (application: RecruitmentApplication) => void
  onSendMessage?: (application: RecruitmentApplication) => void
  acceptingApplicantId?: string | null
  rejectingApplicantId?: string | null
  sendingMessageToId?: string | null
}

const skillColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700'
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
  applications,
  applicationsLoading,
  applicationsError,
  onAcceptApplicant,
  onRejectApplicant,
  onSendMessage,
  acceptingApplicantId,
  rejectingApplicantId,
  sendingMessageToId
}: ProjectDetailsDialogProps) {
  if (!project) return null

  // Disable applicants tab when status is CLOSED (2) - accepted an applicant
  const isProjectClosed = project.status === ProjectStatus.CLOSED
  const statusStyle = getRecruitmentStatusStyle(project.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[92vh] max-h-[92vh] w-[70vw] max-w-[70vw] sm:max-w-[70vw] md:max-w-[70vw] lg:max-w-[1400px] flex-col overflow-hidden rounded-[32px] border border-border/30 bg-card/95 p-0 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.4)] backdrop-blur'>
        <DialogHeader className='shrink-0 border-b border-border/40 px-6 pt-6 pb-4'>
          <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
            <div>
              <DialogTitle className='text-2xl font-semibold text-foreground'>{project.title}</DialogTitle>
              <DialogDescription className='mt-1 text-sm text-muted-foreground'>
                Chi tiết bài tuyển dụng và phản hồi từ ứng viên
              </DialogDescription>
            </div>
            <Badge
              className={cn(
                'inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur',
                statusStyle.badgeClass
              )}
            >
              <span className={cn('h-2.5 w-2.5 rounded-full', statusStyle.dotClass)} />
              {statusStyle.label}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue='details' className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <div className='shrink-0 px-6 pt-4'>
            <TabsList className='grid w-full grid-cols-2 rounded-full border border-border/30 bg-card/70 p-1 shadow-inner shadow-black/5 backdrop-blur'>
              <TabsTrigger
                value='details'
                className='rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card/95 data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border/60'
              >
                Thông tin chi tiết
              </TabsTrigger>
              <TabsTrigger
                value='applicants'
                disabled={isProjectClosed}
                className='rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card/95 data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border/60 disabled:opacity-70'
              >
                Ứng viên ({applicationsLoading ? '...' : applications.length}){isProjectClosed && ' · Đã đóng'}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Thông tin chi tiết dự án */}
          <TabsContent
            value='details'
            className='mt-4 flex-1 space-y-6 overflow-y-auto px-6 pb-6 scrollbar-hide'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className='space-y-6'>
              <div className='rounded-3xl border border-border/40 bg-muted/15 p-5 shadow-sm'>
                <h3 className='text-lg font-semibold text-foreground'>Mô tả dự án</h3>
                <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{project.description}</p>
              </div>

              <Separator />

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Ngân sách</p>
                    <div className='mt-3 flex items-center gap-3 text-sm text-muted-foreground'>
                      <DollarSign className='h-4 w-4 text-primary' />
                      <p className='text-lg font-semibold text-foreground'>{formatCurrency(project.budget)}</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Quy mô nhóm</p>
                    <div className='mt-3 flex items-center gap-3 text-sm text-muted-foreground'>
                      <Users className='h-4 w-4 text-primary' />
                      <p className='text-lg font-semibold text-foreground'>{project.teamSize} người</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Trạng thái</p>
                    <Badge
                      className={cn(
                        'mt-3 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur',
                        statusStyle.badgeClass
                      )}
                    >
                      <span className={cn('h-2.5 w-2.5 rounded-full', statusStyle.dotClass)} />
                      {statusStyle.label}
                    </Badge>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Ngày đăng</p>
                    <div className='mt-3 flex items-center gap-3 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4 text-primary' />
                      <p className='text-lg font-semibold text-foreground'>{formatDate(project.createdAt)}</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Tên dự án</p>
                    <div className='mt-3 flex items-center gap-3 text-sm text-muted-foreground'>
                      <Briefcase className='h-4 w-4 text-primary' />
                      <p className='text-lg font-semibold text-foreground'>{project.projectName}</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-border/30 bg-card/95 p-5 shadow-sm shadow-black/5 transition-shadow hover:shadow-lg'>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Cập nhật gần nhất</p>
                    <div className='mt-3 flex items-center gap-3 text-sm text-muted-foreground'>
                      <Clock className='h-4 w-4 text-primary' />
                      <p className='text-lg font-semibold text-foreground'>{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {project.skills && project.skills.length > 0 && (
                <div className='rounded-3xl border border-border/40 bg-muted/15 p-5 shadow-sm'>
                  <h3 className='text-lg font-semibold text-foreground'>Kỹ năng yêu cầu</h3>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {project.skills.map((skill, index) => (
                      <Badge
                        key={skill.id}
                        className={cn(
                          'rounded-full border border-border/40 px-3 py-1 text-xs font-medium',
                          skillColors[index % skillColors.length]
                        )}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Danh sách ứng viên */}
          <TabsContent
            value='applicants'
            className='mt-4 flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {applicationsLoading ? (
              <div className='flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-border/40 bg-muted/15 p-12 text-center text-muted-foreground'>
                <Spinner size='lg' variant='blast' />
                <p className='text-sm'>Đang tải danh sách ứng viên...</p>
              </div>
            ) : applicationsError ? (
              <div className='flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/10 p-12 text-center'>
                <h3 className='text-lg font-semibold text-destructive'>Có lỗi xảy ra</h3>
                <p className='text-sm text-destructive/80'>Không thể tải danh sách ứng viên</p>
              </div>
            ) : applications.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-border/40 bg-muted/15 p-12 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                  <Users className='h-8 w-8' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-foreground'>Chưa có ứng viên nào</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>Chưa có ai nộp hồ sơ ứng tuyển cho vị trí này.</p>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                {applications.map((application) => (
                  <ApplicantCard
                    key={application.id}
                    application={application}
                    onAccept={() => onAcceptApplicant?.(application)}
                    onReject={() => onRejectApplicant?.(application)}
                    onSendMessage={() => onSendMessage?.(application)}
                    isProcessing={acceptingApplicantId === application.id}
                    isRejecting={rejectingApplicantId === application.id}
                    isSendingMessage={sendingMessageToId === application.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
