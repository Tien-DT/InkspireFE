import { useState } from 'react'
import { MoreHorizontal, Eye, Edit, Trash2, Shield, Ban } from 'lucide-react'
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

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'freelancer' | 'client'
  status: 'active' | 'pending' | 'suspended'
  joinDate: string
  projects: number
  rating: number | null
}

interface UserTableProps {
  users: User[]
  onEdit?: (user: User) => void
  onDelete?: (userId: number) => void
  onStatusChange?: (userId: number, status: User['status']) => void
}

export function UserTable({ users, onEdit, onDelete, onStatusChange }: UserTableProps) {
  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Admin'
      case 'client': return 'Khách hàng'
      case 'freelancer': return 'Freelancer'
      default: return role
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'client': return 'bg-green-100 text-green-800'
      case 'freelancer': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'pending': return 'Chờ duyệt'
      case 'suspended': return 'Tạm khóa'
      default: return status
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRating = (rating: number | null) => {
    if (rating === null) return 'Chưa có'
    return `${rating.toFixed(1)} ⭐`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tham gia</TableHead>
            <TableHead>Dự án</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder-avatar-${user.id}.jpg`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {user.joinDate}
              </TableCell>
              <TableCell className="text-gray-900 font-medium">
                {user.projects}
              </TableCell>
              <TableCell className="text-gray-600">
                {formatRating(user.rating)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => console.log('View user', user.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    {user.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onStatusChange?.(user.id, 'suspended')}>
                        <Ban className="mr-2 h-4 w-4" />
                        Tạm khóa
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onStatusChange?.(user.id, 'active')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Kích hoạt
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(user.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
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