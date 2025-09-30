import { Clock, Calendar, DollarSign, Eye, Bell, Send } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'

interface Phase {
  name: string
  completed: boolean
}

interface ProjectCardProps {
  title: string
  company: string
  deadline: string
  timeRemaining: string
  progress: number
  phases: Phase[]
  budget: string
  daysRemaining: string
  status: 'pending' | 'editing' | 'active'
  statusLabel: string
}

const statusColors = {
  pending: 'text-[#F5C842]',
  editing: 'text-[#E74C3C]',
  active: 'text-[#4A9FD8]'
}

export function ProjectCard({
  title,
  company,
  deadline,
  timeRemaining,
  progress,
  phases,
  budget,
  daysRemaining,
  status,
  statusLabel
}: ProjectCardProps) {
  return (
    <Card className='p-6 bg-card'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold mb-2'>{title}</h3>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <span>{company}</span>
            <span className='flex items-center gap-1'>
              <span className='text-muted-foreground'>•</span>
              Bắt đầu: {deadline}
            </span>
            <span className='flex items-center gap-1'>
              <span className='text-muted-foreground'>•</span>
              Hoạt động: {timeRemaining}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className={`h-5 w-5 ${statusColors[status]}`} />
          <span className={`text-sm font-medium ${statusColors[status]}`}>{statusLabel}</span>
        </div>
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm text-muted-foreground'>Tiến độ dự án</span>
          <span className='text-sm font-semibold'>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className='h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-teal-400 [&>div]:to-teal-500'
        />
      </div>

      <div className='flex items-center gap-2 mb-4 flex-wrap'>
        {phases.map((phase, index) => (
          <Badge
            key={index}
            variant={phase.completed ? 'default' : 'outline'}
            className={phase.completed ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'border-muted-foreground/30'}
          >
            {phase.completed && <span className='mr-1'>✓</span>}
            {phase.name}
          </Badge>
        ))}
      </div>

      <div className='flex items-center justify-between pt-4 border-t border-border'>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-muted-foreground flex items-center gap-1'>
            <Calendar className='h-4 w-4' />
            {daysRemaining}
          </span>
          <span className='text-sm font-semibold text-green-600 flex items-center gap-1'>
            <DollarSign className='h-4 w-4' />
            {budget}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='default' className='bg-black text-white hover:bg-black/90'>
            <Eye className='h-4 w-4 mr-2' />
            Xem chi tiết
          </Button>
          <Button variant='outline' size='icon'>
            <Bell className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon'>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </Card>
  )
}
