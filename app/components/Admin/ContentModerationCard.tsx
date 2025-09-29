import { useState } from 'react'
import { MoreHorizontal, Eye, Ban, CheckCircle, AlertTriangle, Flag, MessageCircle, FileText } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Textarea } from '~/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

interface ContentItem {
  id: string
  type: 'project' | 'profile' | 'comment' | 'review' | 'message'
  title?: string
  content: string
  authorName: string
  authorAvatar?: string
  reportCount: number
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reportReasons: string[]
  createdDate: string
  reportedDate: string
  lastReviewedBy?: string
  lastReviewedDate?: string
}

interface ContentModerationCardProps {
  item: ContentItem
  onApprove?: (itemId: string, reason?: string) => void
  onReject?: (itemId: string, reason: string) => void
  onFlag?: (itemId: string, reason: string) => void
  onView?: (item: ContentItem) => void
}

export function ContentModerationCard({ 
  item, 
  onApprove, 
  onReject, 
  onFlag, 
  onView 
}: ContentModerationCardProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [flagReason, setFlagReason] = useState('')

  const getTypeLabel = (type: ContentItem['type']) => {
    switch (type) {
      case 'project': return 'Dự án'
      case 'profile': return 'Hồ sơ'
      case 'comment': return 'Bình luận'
      case 'review': return 'Đánh giá'
      case 'message': return 'Tin nhắn'
      default: return type
    }
  }

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'project': return <FileText className="h-4 w-4" />
      case 'profile': return <Eye className="h-4 w-4" />
      case 'comment': return <MessageCircle className="h-4 w-4" />
      case 'review': return <AlertTriangle className="h-4 w-4" />
      case 'message': return <MessageCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'flagged': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: ContentItem['status']) => {
    switch (status) {
      case 'pending': return 'Đang chờ'
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Bị từ chối'
      case 'flagged': return 'Bị gắn cờ'
      default: return status
    }
  }

  const getPriorityColor = (priority: ContentItem['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: ContentItem['priority']) => {
    switch (priority) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'urgent': return 'Khẩn cấp'
      default: return priority
    }
  }

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject?.(item.id, rejectReason)
      setRejectReason('')
      setIsRejectDialogOpen(false)
    }
  }

  const handleFlag = () => {
    if (flagReason.trim()) {
      onFlag?.(item.id, flagReason)
      setFlagReason('')
      setIsFlagDialogOpen(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getTypeIcon(item.type)}
              <Badge variant="outline">
                {getTypeLabel(item.type)}
              </Badge>
            </div>
            <Badge className={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Badge>
            <Badge className={getPriorityColor(item.priority)}>
              {getPriorityLabel(item.priority)}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(item)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.status === 'pending' && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onApprove?.(item.id)}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Duyệt
                  </DropdownMenuItem>
                  <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Từ chối
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </Dialog>
                  <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-orange-600"
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Gắn cờ
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </Dialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Content Header */}
        <div className="space-y-2">
          {item.title && (
            <h4 className="font-semibold text-gray-900 line-clamp-2">
              {item.title}
            </h4>
          )}
          <p className="text-sm text-gray-600 line-clamp-3">
            {item.content}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-3 pt-2 border-t">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.authorAvatar} />
            <AvatarFallback>
              {item.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {item.authorName}
            </p>
            <p className="text-xs text-gray-500">
              Đăng lúc: {formatDateTime(item.createdDate)}
            </p>
          </div>
        </div>

        {/* Report Info */}
        <div className="space-y-2 p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-800">
              Số báo cáo: {item.reportCount}
            </span>
            <span className="text-xs text-red-600">
              Báo cáo lúc: {formatDateTime(item.reportedDate)}
            </span>
          </div>
          {item.reportReasons.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-red-800">Lý do báo cáo:</p>
              <div className="flex flex-wrap gap-1">
                {item.reportReasons.map((reason, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review History */}
        {item.lastReviewedBy && (
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            Đã được xem xét bởi {item.lastReviewedBy} vào {formatDateTime(item.lastReviewedDate!)}
          </div>
        )}
      </CardContent>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối nội dung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do từ chối nội dung này:
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Từ chối
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gắn cờ nội dung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do gắn cờ nội dung này:
            </p>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Nhập lý do gắn cờ..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFlagDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleFlag}
                disabled={!flagReason.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Gắn cờ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}