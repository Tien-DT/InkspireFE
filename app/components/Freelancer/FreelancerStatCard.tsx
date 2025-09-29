import { TrendingUp, TrendingDown, DollarSign, Clock, Star, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

interface FreelancerStat {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  description?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

interface FreelancerStatCardProps {
  stat: FreelancerStat
  isLoading?: boolean
  onClick?: () => void
}

export function FreelancerStatCard({ stat, isLoading = false, onClick }: FreelancerStatCardProps) {
  const getColorClasses = (color: FreelancerStat['color'] = 'blue') => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          accent: 'border-green-200'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-100',
          icon: 'text-yellow-600',
          accent: 'border-yellow-200'
        }
      case 'purple':
        return {
          bg: 'bg-purple-100',
          icon: 'text-purple-600',
          accent: 'border-purple-200'
        }
      default:
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          accent: 'border-blue-200'
        }
    }
  }

  const getTrendIcon = (trend: FreelancerStat['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: FreelancerStat['trend']) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const colors = getColorClasses(stat.color)

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 ${colors.accent} border-l-4 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <div className={colors.icon}>
              {stat.icon}
            </div>
          </div>
          {stat.change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon(stat.trend)}
              <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString('vi-VN') : stat.value}
            </h3>
            {stat.trend && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getTrendColor(stat.trend)}`}
              >
                {stat.trend === 'up' ? 'Tăng' : stat.trend === 'down' ? 'Giảm' : 'Ổn định'}
              </Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-700">
            {stat.title}
          </p>
          
          {stat.description && (
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined stat types for common freelancer metrics
export const createFreelancerStats = {
  earnings: (value: number, change?: number): FreelancerStat => ({
    title: 'Thu nhập tháng này',
    value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    change,
    trend: change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') : undefined,
    icon: <DollarSign className="h-5 w-5" />,
    color: 'green' as const,
    description: 'So với tháng trước'
  }),
  
  activeProjects: (value: number, change?: number): FreelancerStat => ({
    title: 'Dự án đang thực hiện',
    value,
    change,
    trend: change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') : undefined,
    icon: <Briefcase className="h-5 w-5" />,
    color: 'blue' as const,
    description: 'Dự án đang được giao'
  }),
  
  rating: (value: number, totalReviews: number): FreelancerStat => ({
    title: 'Đánh giá trung bình',
    value: `${value.toFixed(1)}/5.0`,
    icon: <Star className="h-5 w-5" />,
    color: 'yellow' as const,
    description: `Từ ${totalReviews} đánh giá`
  }),
  
  hoursWorked: (value: number, change?: number): FreelancerStat => ({
    title: 'Giờ làm việc tháng này',
    value: `${value}h`,
    change,
    trend: change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') : undefined,
    icon: <Clock className="h-5 w-5" />,
    color: 'purple' as const,
    description: 'Thời gian làm việc'
  })
}