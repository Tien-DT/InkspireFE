import { useState } from 'react'
import { Star, Send, Upload, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'

interface FeedbackData {
  projectId: string
  freelancerId: string
  freelancerName: string
  freelancerAvatar?: string
  projectTitle: string
  rating: number
  comment: string
  categories: {
    communication: number
    quality: number
    timeliness: number
    professionalism: number
  }
  wouldRecommend: boolean
  isPublic: boolean
}

interface FeedbackFormProps {
  projectData: {
    id: string
    title: string
    freelancer: {
      id: string
      name: string
      avatar?: string
    }
  }
  initialFeedback?: Partial<FeedbackData>
  onSubmit?: (feedback: FeedbackData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function FeedbackForm({ 
  projectData, 
  initialFeedback, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    projectId: projectData.id,
    freelancerId: projectData.freelancer.id,
    freelancerName: projectData.freelancer.name,
    freelancerAvatar: projectData.freelancer.avatar,
    projectTitle: projectData.title,
    rating: 5,
    comment: '',
    categories: {
      communication: 5,
      quality: 5,
      timeliness: 5,
      professionalism: 5
    },
    wouldRecommend: true,
    isPublic: true,
    ...initialFeedback
  })

  const [attachments, setAttachments] = useState<File[]>([])

  const handleRatingChange = (category: keyof FeedbackData['categories'] | 'overall', rating: number) => {
    if (category === 'overall') {
      setFeedback(prev => ({ ...prev, rating }))
    } else {
      setFeedback(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: rating
        }
      }))
    }
  }

  const handleSubmit = () => {
    if (feedback.comment.trim()) {
      onSubmit?.(feedback)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files].slice(0, 5)) // Limit to 5 files
  }

  const renderStarRating = (rating: number, onChange: (rating: number) => void, label: string) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="hover:scale-110 transition-transform"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating === 5 ? 'Xuất sắc' :
             rating === 4 ? 'Tốt' :
             rating === 3 ? 'Trung bình' :
             rating === 2 ? 'Kém' : 'Rất kém'}
          </span>
        </div>
      </div>
    )
  }

  const averageRating = (
    feedback.categories.communication +
    feedback.categories.quality +
    feedback.categories.timeliness +
    feedback.categories.professionalism
  ) / 4

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Đánh giá và phản hồi</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project & Freelancer Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={feedback.freelancerAvatar} />
                <AvatarFallback>
                  {feedback.freelancerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {feedback.freelancerName}
                </h3>
                <p className="text-sm text-gray-600">
                  Dự án: {feedback.projectTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Đánh giá tổng thể
            </h4>
            {renderStarRating(
              feedback.rating,
              (rating) => handleRatingChange('overall', rating),
              'Cảm nhận chung về freelancer này'
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Đánh giá chi tiết
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStarRating(
                feedback.categories.communication,
                (rating) => handleRatingChange('communication', rating),
                'Giao tiếp'
              )}
              {renderStarRating(
                feedback.categories.quality,
                (rating) => handleRatingChange('quality', rating),
                'Chất lượng công việc'
              )}
              {renderStarRating(
                feedback.categories.timeliness,
                (rating) => handleRatingChange('timeliness', rating),
                'Đúng thời hạn'
              )}
              {renderStarRating(
                feedback.categories.professionalism,
                (rating) => handleRatingChange('professionalism', rating),
                'Chuyên nghiệp'
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Điểm trung bình:</strong> {averageRating.toFixed(1)}/5.0
              </p>
            </div>
          </div>

          {/* Written Feedback */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Nhận xét chi tiết
            </h4>
            <div className="space-y-2">
              <Label htmlFor="comment">Chia sẻ trải nghiệm làm việc với freelancer này</Label>
              <Textarea
                id="comment"
                value={feedback.comment}
                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Hãy chia sẻ chi tiết về chất lượng công việc, cách giao tiếp, và những điểm nổi bật của freelancer..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Tối thiểu 50 ký tự để cung cấp phản hồi hữu ích
              </p>
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Tài liệu kèm theo (tùy chọn)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  disabled={attachments.length >= 5}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Tải file ({attachments.length}/5)
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Khuyến nghị
            </h4>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={feedback.wouldRecommend}
                  onChange={() => setFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                  className="text-green-600"
                />
                <span className="text-sm">Có, tôi sẽ giới thiệu freelancer này</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={!feedback.wouldRecommend}
                  onChange={() => setFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                  className="text-red-600"
                />
                <span className="text-sm">Không, tôi không giới thiệu</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Cài đặt quyền riêng tư
            </h4>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feedback.isPublic}
                onChange={(e) => setFeedback(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">
                Hiển thị đánh giá này công khai trên hồ sơ của freelancer
              </span>
            </label>
            <p className="text-xs text-gray-500">
              Nếu bỏ chọn, chỉ freelancer và quản trị viên mới xem được đánh giá này
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-600">
              {feedback.comment.length < 50 && (
                <span className="text-orange-600">
                  Cần thêm {50 - feedback.comment.length} ký tự nữa
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={feedback.comment.length < 50 || isLoading}
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Gửi đánh giá...' : 'Gửi đánh giá'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}