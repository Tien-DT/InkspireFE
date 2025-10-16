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
    <Card className='p-5 bg-white rounded-3xl shadow-none'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <h3 className='text-base font-semibold mb-1'>{title}</h3>
          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
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
          <Clock className={`h-4 w-4 ${statusColors[status]}`} />
          <span className={`text-xs font-medium ${statusColors[status]}`}>{statusLabel}</span>
        </div>
      </div>

      <div className='mb-3'>
        <div className='flex items-center justify-between mb-1'>
          <span className='text-xs text-muted-foreground'>Tiến độ dự án</span>
          <span className='text-xs font-semibold'>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className='h-1.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-teal-400 [&>div]:to-teal-500 rounded'
        />
      </div>

      <div className='flex items-center gap-1.5 mb-3 flex-wrap'>
        {phases.map((phase, index) => (
          <Badge
            key={index}
            variant={phase.completed ? 'default' : 'outline'}
            className={`text-xs py-0.5 px-2 rounded ${phase.completed ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'border border-border text-muted-foreground'}`}
          >
            {phase.completed && <span className='mr-1'>✓</span>}
            {phase.name}
          </Badge>
        ))}
      </div>

      <div className='flex items-center justify-between pt-3 border-t border-border'>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-muted-foreground flex items-center gap-1'>
            <Calendar className='h-3.5 w-3.5' />
            {daysRemaining}
          </span>
          <span className='text-xs font-semibold text-green-600 flex items-center gap-1'>
            <DollarSign className='h-3.5 w-3.5' />
            {budget}
          </span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Button variant='default' className='bg-black text-white hover:bg-black/90 rounded h-8 text-xs px-3'>
            <Eye className='h-3.5 w-3.5 mr-1.5' />
            Xem chi tiết
          </Button>
          <Button variant='outline' size='sm' className='rounded h-8 w-8 p-0'>
            <Bell className='h-3.5 w-3.5' />
          </Button>
          <Button variant='outline' size='sm' className='rounded h-8 w-8 p-0'>
            <Send className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
    </Card>
  )
}
