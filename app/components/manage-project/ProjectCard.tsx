import {
  ArrowUpRight,
  Calendar,
  Clock3,
  FolderKanban,
  Loader2,
  MessageSquare,
  UploadCloud,
  Wallet2
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'
import type { Project } from '~/apis/project.api'
import { useChat } from '~/contexts/ChatContext'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils'

interface ProjectCardProps {
  project: Project
}

const STATUS_STYLES: Record<
  number,
  {
    label: string
    badgeClass: string
    dotClass: string
  }
> = {
  0: {
    label: 'Bản nháp',
    badgeClass: 'border-zinc-400/40 bg-zinc-100 text-zinc-700',
    dotClass: 'bg-zinc-500'
  },
  1: {
    label: 'Chờ ứng tuyển',
    badgeClass: 'border-amber-500/30 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-400'
  },
  2: {
    label: 'Đang hoạt động',
    badgeClass: 'border-sky-500/30 bg-sky-50 text-sky-700',
    dotClass: 'bg-sky-500'
  },
  3: {
    label: 'Đã hoàn thành',
    badgeClass: 'border-emerald-500/30 bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500'
  }
}

const getStatusInfo = (status: number) => STATUS_STYLES[status] ?? STATUS_STYLES[0]

const formatCurrency = (amount?: number) => {
  if (!amount) return 'Chưa xác định'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateString
  }
}

const getTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
  } catch {
    return ''
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const { createNewConversation } = useChat()
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  const statusInfo = getStatusInfo(project.status)
  const budget =
    project.budgetMin && project.budgetMax
      ? `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax)}`
      : formatCurrency(project.budgetMin || project.budgetMax)

  const handleChatWithFreelancer = async () => {
    if (!project.freelancerId) {
      toast.error('Không tìm thấy freelancer', {
        description: 'Dự án chưa có freelancer được chấp nhận.'
      })
      return
    }

    try {
      setIsCreatingChat(true)
      await createNewConversation(project.freelancerId)
      toast.success('Tạo cuộc trò chuyện thành công')
      navigate('/chat')
    } catch (error) {
      console.error('Failed to create conversation:', error)
      toast.error('Không thể tạo cuộc trò chuyện', {
        description: 'Vui lòng thử lại sau.'
      })
    } finally {
      setIsCreatingChat(false)
    }
  }

  return (
    <Card className='group relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-border/30 hover:shadow-md md:p-8'>
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-white/10 via-transparent to-transparent' />
      <div className='relative flex flex-col gap-6 lg:flex-row lg:items-start'>
        <div className='flex-1 space-y-5'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='flex-1 space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground'>
                <FolderKanban className='h-3.5 w-3.5 shrink-0 text-primary' />
                <span className='truncate'>{project.category || 'Danh mục chưa cập nhật'}</span>
              </div>
              <div className='max-w-xl space-y-2'>
                <h3 className='line-clamp-2 text-xl font-semibold text-foreground break-words'>{project.title}</h3>
                <p className='mt-2 truncate overflow-hidden text-sm leading-relaxed text-muted-foreground break-words'>
                  {project.description || 'Chưa có mô tả chi tiết cho dự án này.'}
                </p>
              </div>
            </div>

            <Badge
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap',
                statusInfo.badgeClass
              )}
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', statusInfo.dotClass)} />
              {statusInfo.label}
            </Badge>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm text-muted-foreground'>
              <Clock3 className='h-4 w-4 shrink-0 text-primary' />
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Khởi tạo</p>
                <p className='truncate font-medium text-foreground'>{formatDate(project.createdAt)}</p>
                {getTimeAgo(project.createdAt) && (
                  <p className='truncate text-xs text-muted-foreground'>Cập nhật {getTimeAgo(project.createdAt)}</p>
                )}
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4 shrink-0 text-primary' />
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Hạn chót</p>
                <p className='truncate font-medium text-foreground'>
                  {project.deadline ? formatDate(project.deadline) : 'Chưa cập nhật'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm text-muted-foreground'>
              <Wallet2 className='h-4 w-4 shrink-0 text-primary' />
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Ngân sách</p>
                <p className='truncate font-medium text-foreground' title={budget}>
                  {budget}
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
            {project.clientName && (
              <span className='inline-flex max-w-full items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium text-foreground'>
                <span className='truncate'>Khách hàng: {project.clientName}</span>
              </span>
            )}
            {project.freelancerName && (
              <span className='inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                <span className='truncate'>Freelancer: {project.freelancerName}</span>
              </span>
            )}
          </div>
        </div>

        <div className='flex w-full flex-col gap-3 rounded-2xl border border-border/40 bg-background/85 p-4 sm:max-w-sm lg:w-[260px]'>
          <Button
            asChild
            className='w-full rounded-xl bg-primary/90 text-primary-foreground shadow-sm transition-all hover:bg-primary'
          >
            <Link to={`/project-detail/${project.id}`} className='flex items-center justify-center gap-2'>
              <span>Xem chi tiết</span>
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </Button>

          <Button
            variant='secondary'
            className='w-full rounded-xl border border-border/40 bg-secondary/70 text-secondary-foreground transition-all hover:bg-secondary'
            onClick={handleChatWithFreelancer}
            disabled={!project.freelancerId || isCreatingChat}
          >
            {isCreatingChat ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang kết nối...
              </>
            ) : (
              <>
                <MessageSquare className='mr-2 h-4 w-4' />
                Nhắn tin với ứng viên
              </>
            )}
          </Button>

          <Button
            variant='outline'
            className='w-full rounded-xl border border-dashed border-border/50 bg-background/80 text-muted-foreground transition-colors hover:border-border/40 hover:bg-background'
          >
            <UploadCloud className='mr-2 h-4 w-4' />
            Gửi file cập nhật
          </Button>
        </div>
      </div>
    </Card>
  )
}
