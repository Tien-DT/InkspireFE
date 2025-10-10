import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { MoreHorizontal, Star } from 'lucide-react'

type UserStatus = 'pending' | 'suspended' | 'active'

type UserRecord = {
  name: string
  email: string
  role: 'Freelancer' | 'Khách hàng'
  status: UserStatus
  joinDate: string
  projects: number
  rating: number | null
}

const users: UserRecord[] = [
  {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    role: 'Freelancer',
    status: 'pending',
    joinDate: '15/01/2024',
    projects: 0,
    rating: null
  },
  {
    name: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    role: 'Khách hàng',
    status: 'pending',
    joinDate: '20/02/2024',
    projects: 0,
    rating: null
  },
  {
    name: 'Lê Minh Cường',
    email: 'leminhcuong@example.com',
    role: 'Freelancer',
    status: 'suspended',
    joinDate: '10/10/2023',
    projects: 8,
    rating: 3.8
  },
  {
    name: 'Phạm Thị Dung',
    email: 'phamthidung@example.com',
    role: 'Freelancer',
    status: 'suspended',
    joinDate: '18/10/2023',
    projects: 8,
    rating: 1.8
  },
  {
    name: 'Nguyễn Văn Tuấn',
    email: 'nguyenvantuanx@example.com',
    role: 'Freelancer',
    status: 'active',
    joinDate: '15/01/2024',
    projects: 12,
    rating: 4.8
  },
  {
    name: 'Trần Thị Nhung',
    email: 'tranthinhung@example.com',
    role: 'Khách hàng',
    status: 'active',
    joinDate: '20/02/2024',
    projects: 5,
    rating: 4.9
  },
  {
    name: 'Lê Minh Tú',
    email: 'leminhtu@example.com',
    role: 'Freelancer',
    status: 'suspended',
    joinDate: '10/11/2023',
    projects: 8,
    rating: 3.2
  },
  {
    name: 'Phạm Thu Hương',
    email: 'phamthuhuong@example.com',
    role: 'Khách hàng',
    status: 'active',
    joinDate: '01/03/2024',
    projects: 5,
    rating: 4.8
  }
]

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  pending: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-500 text-white hover:bg-yellow-600'
  },
  suspended: {
    label: 'Tạm khóa',
    className: 'bg-red-500 text-white hover:bg-red-600'
  },
  active: {
    label: 'Hoạt động',
    className: 'bg-green-500 text-white hover:bg-green-600'
  }
}

const totalPages = 15

export function UserTable() {
  const [currentPage, setCurrentPage] = useState(1)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card className='border-border/40 bg-card shadow-sm'>
      <CardHeader className='flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-xl font-semibold text-foreground'>Danh sách người dùng</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Select defaultValue='all-roles'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-roles'>Tất cả vai trò</SelectItem>
              <SelectItem value='freelancer'>Freelancer</SelectItem>
              <SelectItem value='customer'>Khách hàng</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue='all-status'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-status'>Tất cả trạng thái</SelectItem>
              <SelectItem value='active'>Hoạt động</SelectItem>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
              <SelectItem value='suspended'>Tạm khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border/40'>
                <TableHead className='text-muted-foreground'>Người dùng</TableHead>
                <TableHead className='text-muted-foreground'>Vai trò</TableHead>
                <TableHead className='text-muted-foreground'>Trạng thái</TableHead>
                <TableHead className='text-muted-foreground'>Ngày tham gia</TableHead>
                <TableHead className='text-muted-foreground'>Dự án</TableHead>
                <TableHead className='text-muted-foreground'>Đánh giá</TableHead>
                <TableHead className='text-muted-foreground'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const status = statusConfig[user.status]
                return (
                  <TableRow key={user.email} className='border-border/40'>
                    <TableCell>
                      <div className='space-y-1'>
                        <p className='font-medium text-foreground'>{user.name}</p>
                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className='text-foreground'>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className={`border-transparent ${status.className}`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-foreground'>{user.joinDate}</TableCell>
                    <TableCell className='text-foreground'>{user.projects}</TableCell>
                    <TableCell>
                      {user.rating ? (
                        <div className='flex items-center gap-1 text-foreground'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span>{user.rating}</span>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className='mt-6 flex justify-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage > 1) {
                      goToPage(currentPage - 1)
                    }
                  }}
                />
              </PaginationItem>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href='#'
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault()
                      goToPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href='#'
                  isActive={currentPage === totalPages}
                  onClick={(event) => {
                    event.preventDefault()
                    goToPage(totalPages)
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage < totalPages) {
                      goToPage(currentPage + 1)
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
