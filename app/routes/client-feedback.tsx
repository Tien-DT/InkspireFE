import { useState } from 'react'
import { Star, ArrowLeft, Send, FileText, User, Calendar, DollarSign } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Link } from 'react-router'

export default function ClientFeedback() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Mock project data
  const project = {
    id: 1,
    title: "Thiết kế website bán hàng online",
    freelancer: {
      name: "Nguyễn Văn An",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8,
      completedProjects: 127
    },
    completedDate: "2024-02-15",
    budget: 15000000,
    duration: "30 ngày",
    deliverables: [
      "Thiết kế UI/UX hoàn chỉnh",
      "Code frontend responsive",
      "Tích hợp thanh toán",
      "Admin panel quản lý"
    ]
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600 fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Cảm ơn bạn đã đánh giá!
            </h1>
            <p className="text-gray-600">
              Đánh giá của bạn đã được gửi thành công và sẽ giúp cộng đồng freelancer phát triển tốt hơn.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="font-medium text-gray-900">{rating} sao cho {project.freelancer.name}</p>
            {feedback && (
              <div className="mt-4 text-left">
                <p className="text-sm text-gray-600 mb-1">Nhận xét của bạn:</p>
                <p className="text-gray-800">{feedback}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/manage-project">
                Quay về quản lý dự án
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/post-new-project">
                Đăng dự án mới
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/manage-project">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá freelancer</h1>
          <p className="text-gray-600">Chia sẻ trải nghiệm làm việc của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin dự án</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{project.title}</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Đã hoàn thành
                </Badge>
              </div>

              <Separator />

              {/* Freelancer Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Freelancer</h4>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={project.freelancer.avatar} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{project.freelancer.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{project.freelancer.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{project.freelancer.completedProjects} dự án</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium">{project.completedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Ngân sách:</span>
                  <span className="font-medium">{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">{project.duration}</span>
                </div>
              </div>

              <Separator />

              {/* Deliverables */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sản phẩm đã bàn giao</h4>
                <ul className="space-y-1">
                  {project.deliverables.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá freelancer</CardTitle>
              <p className="text-sm text-gray-600">
                Đánh giá của bạn sẽ giúp freelancer cải thiện chất lượng dịch vụ và hỗ trợ cộng đồng đưa ra quyết định tốt hơn.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Đánh giá tổng thể *
                </label>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 rounded transition-colors hover:bg-gray-50"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {rating === 0 && 'Chọn số sao để đánh giá'}
                  {rating === 1 && 'Rất không hài lòng'}
                  {rating === 2 && 'Không hài lòng'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 4 && 'Hài lòng'}
                  {rating === 5 && 'Rất hài lòng'}
                </p>
              </div>

              {/* Feedback Text */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-900 mb-2">
                  Nhận xét chi tiết (không bắt buộc)
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm làm việc với freelancer này: chất lượng công việc, thái độ làm việc, khả năng giao tiếp, tuân thủ deadline..."
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.length}/1000 ký tự
                </p>
              </div>

              {/* Quick Feedback Options */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Đánh giá nhanh
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Chất lượng công việc xuất sắc',
                    'Giao tiếp tốt và chuyên nghiệp',
                    'Hoàn thành đúng thời hạn',
                    'Sáng tạo và đưa ra nhiều ý tưởng',
                    'Hỗ trợ tận tình sau bàn giao',
                    'Giá cả hợp lý'
                  ].map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (feedback.includes(option)) {
                          setFeedback(feedback.replace(option + '. ', ''))
                        } else {
                          setFeedback(feedback ? feedback + '. ' + option : option)
                        }
                      }}
                      className={`p-3 text-sm text-left rounded-lg border transition-colors ${
                        feedback.includes(option)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi đánh giá
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Đánh giá sẽ được hiển thị công khai trên profile của freelancer
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}