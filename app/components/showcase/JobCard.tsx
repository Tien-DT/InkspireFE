import { Clock, Eye, Heart, Star, Users } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

interface JobCardProps {
  id: string
  title: string
  description: string
  budget: {
    min: number
    max: number
    display?: string
  }
  duration: string
  proposalsCount: number
  skills: string[]
  clientInfo: {
    name: string
    rating: number
    reviewsCount: number
    completedProjects: number
  }
  postedTime: string
  isUrgent?: boolean
  isFavorited?: boolean
  experienceLevel?: string
  onFavorite?: (id: string) => void
  onViewDetails?: (id: string) => void
  onApply?: (id: string) => void
}

export function JobCard({
  id,
  title,
  description,
  budget,
  duration,
  proposalsCount,
  skills,
  clientInfo,
  postedTime,
  isUrgent = false,
  isFavorited = false,
  experienceLevel,
  onFavorite,
  onViewDetails,
  onApply
}: JobCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {title}
                </h3>
                {isUrgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite?.(id)}
              className="ml-2 flex-shrink-0"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
          </div>

          {/* Budget and Duration */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-green-600 font-medium">
              {budget.display || `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {proposalsCount} proposals
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 5} more
              </Badge>
            )}
          </div>

          {/* Client Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {clientInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{clientInfo.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {clientInfo.rating} ({clientInfo.reviewsCount} reviews)
                  <span className="mx-1">•</span>
                  {clientInfo.completedProjects} projects completed
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{postedTime}</p>
              <Button
                size="sm"
                onClick={() => onViewDetails?.(id)}
                className="mt-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}