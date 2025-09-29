import { useState } from 'react'
import { Star, MapPin, Clock, DollarSign, MessageSquare, Heart, HeartOff, Briefcase, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

interface FreelancerData {
  id: string
  name: string
  title: string
  avatar?: string
  rating: number
  reviewCount: number
  location: string
  hourlyRate: number
  currency: string
  description: string
  skills: string[]
  completedProjects: number
  responseTime: string
  availability: 'available' | 'busy' | 'unavailable'
  badges: ('top_rated' | 'verified' | 'fast_response' | 'new_freelancer')[]
  lastActive: string
  portfolioCount: number
  languages: string[]
  successRate: number
}

interface FreelancerCardProps {
  freelancer: FreelancerData
  isFavorited?: boolean
  onView?: (freelancerId: string) => void
  onContact?: (freelancerId: string) => void
  onFavorite?: (freelancerId: string, isFavorited: boolean) => void
  onInvite?: (freelancerId: string) => void
  isCompact?: boolean
}

export function FreelancerCard({ 
  freelancer, 
  isFavorited = false,
  onView, 
  onContact, 
  onFavorite, 
  onInvite,
  isCompact = false 
}: FreelancerCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorited)

  const handleFavoriteClick = () => {
    const newState = !isLiked
    setIsLiked(newState)
    onFavorite?.(freelancer.id, newState)
  }

  const getAvailabilityColor = (availability: FreelancerData['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'unavailable': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityLabel = (availability: FreelancerData['availability']) => {
    switch (availability) {
      case 'available': return 'Sẵn sàng'
      case 'busy': return 'Đang bận'
      case 'unavailable': return 'Không rảnh'
      default: return availability
    }
  }

  const getBadgeInfo = (badge: FreelancerData['badges'][0]) => {
    switch (badge) {
      case 'top_rated':
        return { label: 'Top Rated', color: 'bg-purple-100 text-purple-800' }
      case 'verified':
        return { label: 'Đã xác minh', color: 'bg-blue-100 text-blue-800' }
      case 'fast_response':
        return { label: 'Phản hồi nhanh', color: 'bg-green-100 text-green-800' }
      case 'new_freelancer':
        return { label: 'Thành viên mới', color: 'bg-orange-100 text-orange-800' }
      default:
        return { label: badge, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa truy cập'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className={isCompact ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={freelancer.avatar} />
                <AvatarFallback>
                  {freelancer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                freelancer.availability === 'available' ? 'bg-green-500' :
                freelancer.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                  onClick={() => onView?.(freelancer.id)}
                >
                  {freelancer.name}
                </h3>
                {freelancer.badges.map((badge, index) => {
                  const badgeInfo = getBadgeInfo(badge)
                  return (
                    <Badge key={index} className={`text-xs ${badgeInfo.color}`}>
                      {badgeInfo.label}
                    </Badge>
                  )
                })}
              </div>
              
              <p className="text-sm text-gray-600 mt-1 truncate">
                {freelancer.title}
              </p>
              
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {freelancer.rating.toFixed(1)}
                  </span>
                  <span>({freelancer.reviewCount})</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{freelancer.location}</span>
                </div>
                
                <Badge className={getAvailabilityColor(freelancer.availability)}>
                  {getAvailabilityLabel(freelancer.availability)}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="p-1 hover:bg-red-50"
          >
            {isLiked ? (
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            ) : (
              <HeartOff className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCompact && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {freelancer.description}
          </p>
        )}
        
        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {freelancer.skills.slice(0, isCompact ? 3 : 5).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {freelancer.skills.length > (isCompact ? 3 : 5) && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.skills.length - (isCompact ? 3 : 5)}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {formatCurrency(freelancer.hourlyRate, freelancer.currency)}/h
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{freelancer.completedProjects} dự án</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{freelancer.responseTime}</span>
          </div>
          
          <div className="text-gray-600">
            <span className="text-green-600 font-medium">
              {freelancer.successRate}%
            </span>
            <span className="text-xs ml-1">thành công</span>
          </div>
        </div>
        
        {/* Languages */}
        {!isCompact && freelancer.languages.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Ngôn ngữ:</p>
            <div className="flex flex-wrap gap-1">
              {freelancer.languages.map((language, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Last Active */}
        <div className="text-xs text-gray-500">
          Hoạt động lần cuối: {formatLastActive(freelancer.lastActive)}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView?.(freelancer.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem hồ sơ
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onContact?.(freelancer.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Liên hệ
            </Button>
          </div>
          
          <Button 
            size="sm" 
            onClick={() => onInvite?.(freelancer.id)}
            disabled={freelancer.availability === 'unavailable'}
          >
            Mời tham gia
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}