import { useState } from 'react'
import { MoreHorizontal, Eye, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

interface Ticket {
  id: string
  subject: string
  customerName: string
  customerEmail: string
  customerType: 'client' | 'freelancer'
  category: 'technical' | 'billing' | 'account' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo: string | null
  createdDate: string
  lastUpdate: string
  rating: number | null
}

interface TicketTableProps {
  tickets: Ticket[]
  onView?: (ticket: Ticket) => void
  onAssign?: (ticketId: string, assignee: string) => void
  onStatusChange?: (ticketId: string, status: Ticket['status']) => void
  onReply?: (ticketId: string) => void
}

export function TicketTable({ tickets, onView, onAssign, onStatusChange, onReply }: TicketTableProps) {
  const getCategoryLabel = (category: Ticket['category']) => {
    switch (category) {
      case 'technical': return 'Kỹ thuật'
      case 'billing': return 'Thanh toán'
      case 'account': return 'Tài khoản'
      case 'general': return 'Tổng quát'
      default: return category
    }
  }

  const getPriorityLabel = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'urgent': return 'Khẩn cấp'
      default: return priority
    }
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-yellow-100 text-yellow-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'Mở'
      case 'in-progress': return 'Đang xử lý'
      case 'resolved': return 'Đã giải quyết'
      case 'closed': return 'Đã đóng'
      default: return status
    }
  }

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return <Clock className="h-3 w-3" />
      case 'in-progress': return <MessageSquare className="h-3 w-3" />
      case 'resolved': return <CheckCircle className="h-3 w-3" />
      case 'closed': return <XCircle className="h-3 w-3" />
      default: return null
    }
  }

  const formatRating = (rating: number | null) => {
    if (rating === null) return 'Chưa đánh giá'
    return `${rating}/5 ⭐`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Ưu tiên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Người xử lý</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{ticket.subject}</p>
                  <p className="text-xs text-gray-600">
                    {ticket.customerType === 'client' ? 'Khách hàng' : 'Freelancer'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {ticket.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{ticket.customerName}</p>
                    <p className="text-xs text-gray-600">{ticket.customerEmail}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getCategoryLabel(ticket.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {getPriorityLabel(ticket.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(ticket.status)}
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {ticket.assignedTo ? (
                  <span className="text-sm">{ticket.assignedTo}</span>
                ) : (
                  <span className="text-sm text-gray-400">Chưa gán</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatRating(ticket.rating)}</span>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {ticket.createdDate}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(ticket)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReply?.(ticket.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Trả lời
                    </DropdownMenuItem>
                    {ticket.status === 'open' && (
                      <DropdownMenuItem onClick={() => onStatusChange?.(ticket.id, 'in-progress')}>
                        <Clock className="mr-2 h-4 w-4" />
                        Bắt đầu xử lý
                      </DropdownMenuItem>
                    )}
                    {ticket.status === 'in-progress' && (
                      <DropdownMenuItem onClick={() => onStatusChange?.(ticket.id, 'resolved')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Đánh dấu đã giải quyết
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}