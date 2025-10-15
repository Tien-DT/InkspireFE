import { Briefcase, Calendar, DollarSign, Edit, Eye, MessageCircle, Share2, Trash2, Users } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import { getRecruitmentStatusStyle } from './status-theme'

interface Skill {
  id: string
  name: string
}

interface ProjectCardProps {
  post: {
    id: string
    title: string
    description: string
    projectName: string
    budget: number
    teamSize: string
    createdAt: string
    status: number
    skills: Skill[]
  }
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onViewApplicants?: () => void
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

export function ProjectCard({ post, onView, onEdit, onDelete, onShare, onViewApplicants }: ProjectCardProps) {
  const statusStyle = getRecruitmentStatusStyle(post.status)

  return (
    <Card className='group relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8'>
      <span className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      <CardHeader className='space-y-5 p-0 pb-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
          <div className='flex-1 space-y-3'>
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur whitespace-nowrap',
                statusStyle.badgeClass
              )}
            >
              <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', statusStyle.dotClass)} />
              {statusStyle.label}
            </span>
            <div className='min-w-0'>
              <h2 className='line-clamp-2 text-2xl font-semibold text-foreground break-words'>{post.title}</h2>
              <p className='mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground break-words sm:line-clamp-2'>
                {post.description}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2 md:justify-end'>
            <Button
              size='sm'
              onClick={onView}
              className='h-9 rounded-full px-4 text-sm font-semibold whitespace-nowrap'
            >
              <Eye className='mr-2 h-4 w-4' />
              Xem
            </Button>
            {onEdit && (
              <Button
                variant='outline'
                size='sm'
                onClick={onEdit}
                className='h-9 rounded-full border-primary/30 px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 whitespace-nowrap'
              >
                <Edit className='mr-2 h-4 w-4' />
                Sửa
              </Button>
            )}
            {onDelete && (
              <Button
                variant='outline'
                size='icon'
                onClick={onDelete}
                className='h-9 w-9 shrink-0 rounded-full border-destructive/40 text-destructive transition-colors hover:border-destructive/50 hover:bg-destructive/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6 p-0'>
        <div className='grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3'>
          <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3'>
            <DollarSign className='h-4 w-4 shrink-0 text-primary' />
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Ngân sách</p>
              <p className='truncate font-medium text-foreground' title={formatCurrency(post.budget)}>
                {formatCurrency(post.budget)}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3'>
            <Users className='h-4 w-4 shrink-0 text-primary' />
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Quy mô</p>
              <p className='truncate font-medium text-foreground'>{post.teamSize} người</p>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3'>
            <Calendar className='h-4 w-4 shrink-0 text-primary' />
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/70'>Ngày đăng</p>
              <p className='truncate font-medium text-foreground'>{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </div>

        {post.skills && post.skills.length > 0 && (
          <div>
            <p className='text-xs uppercase tracking-wide text-muted-foreground'>Kỹ năng yêu cầu</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {post.skills.map((skill, index) => (
                <Badge
                  key={skill.id}
                  className={cn(
                    'rounded-full border border-border/40 px-3 py-1 text-xs font-medium transition-colors hover:border-primary/40',
                    skillColors[index % skillColors.length]
                  )}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className='flex flex-col gap-4 rounded-2xl border border-border/40 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex min-w-0 flex-1 items-center gap-3 text-sm text-muted-foreground'>
            <span className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-white/80 text-primary'>
              <Briefcase className='h-4 w-4' />
            </span>
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/80'>Dự án</p>
              <p className='truncate text-sm font-semibold text-foreground' title={post.projectName}>
                {post.projectName}
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            {onViewApplicants && (
              <Button
                variant='secondary'
                size='sm'
                onClick={onViewApplicants}
                className='h-9 rounded-full px-4 text-sm font-semibold whitespace-nowrap'
              >
                <MessageCircle className='mr-2 h-4 w-4' />
                Ứng viên
              </Button>
            )}
            {onShare && (
              <Button
                variant='outline'
                size='sm'
                onClick={onShare}
                className='h-9 rounded-full border-border/60 px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary whitespace-nowrap'
              >
                <Share2 className='mr-2 h-4 w-4' />
                Chia sẻ
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
