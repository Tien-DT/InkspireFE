import { Card, CardContent } from '~/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconColor: string
  valueColor: string
  onClick?: () => void
}

export function StatsCard({ label, value, icon: Icon, iconColor, valueColor, onClick }: StatsCardProps) {
  return (
    <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={onClick}>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-600'>{label}</p>
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          </div>
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  )
}
