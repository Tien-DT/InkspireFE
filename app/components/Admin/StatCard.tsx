import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  changePercent?: number
  changeLabel?: string
  isPositive?: boolean
  subStats?: Array<{
    label: string
    value: number
  }>
  formatValue?: (value: number) => string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  changePercent,
  changeLabel,
  isPositive = true,
  subStats = [],
  formatValue = (val: number) => val.toString()
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
            {changePercent && (
              <div className="flex items-center mt-1">
                <TrendingUp 
                  className={`h-3 w-3 mr-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{changePercent}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        {subStats.length > 0 && (
          <div className="mt-4 space-y-2">
            {subStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-medium">{formatValue(stat.value)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}