import type { LucideIcon } from 'lucide-react'
import { Card } from '~/components/ui/card'

interface StatusCardProps {
  title: string
  count: number
  icon: LucideIcon
  color: 'blue' | 'yellow' | 'red' | 'green'
}

const colorClasses = {
  blue: 'bg-[#4A9FD8] text-white',
  yellow: 'bg-[#F5C842] text-white',
  red: 'bg-[#E74C3C] text-white',
  green: 'bg-[#52C41A] text-white'
}

export function StatusCard({ title, count, icon: Icon, color }: StatusCardProps) {
  return (
    <Card className='p-6 bg-card'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground mb-2'>{title}</p>
          <p className='text-3xl font-bold'>{count}</p>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className='h-6 w-6' />
        </div>
      </div>
    </Card>
  )
}
