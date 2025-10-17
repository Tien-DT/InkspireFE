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
    <Card className='p-4 bg-white shadow-none'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wide'>{title}</p>
          <p className='text-2xl font-bold'>{count}</p>
        </div>
        <div className={`rounded-full p-2 ${colorClasses[color]}`}>
          <Icon className='h-5 w-5' />
        </div>
      </div>
    </Card>
  )
}
