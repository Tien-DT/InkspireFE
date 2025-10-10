import { useState } from 'react'
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
import { Badge } from '~/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'

type ProjectStatus = 'Đang thực hiện' | 'Chờ duyệt' | 'Hoàn thành' | 'Bị trì hoãn'

type ProjectRecord = {
  name: string
  description: string
  client: string
  freelancer: string
  budget: string
  status: ProjectStatus
  deadline: string
}

const projects: ProjectRecord[] = [
  {
    name: 'Thiết kế UI/UX trang web điện tử',
    description: 'Phát triển Web',
    client: 'Công ty TNHH TechCorp',
    freelancer: 'Nguyễn Văn An',
    budget: '120.000.000đ',
    status: 'Đang thực hiện',
    deadline: '15/04/2024'
  },
  {
    name: 'Thiết kế UI/UX ứng dụng di động',
    description: 'Ứng dụng di động',
    client: 'StartupXYZ',
    freelancer: 'Trần Thị Bình',
    budget: '80.000.000đ',
    status: 'Chờ duyệt',
    deadline: '20/03/2024'
  },
  {
    name: 'Viết nội dung cho blog công ty',
    description: 'Marketing Pro',
    client: 'Marketing Pro',
    freelancer: 'Lê Minh Cường',
    budget: '20.000.000đ',
    status: 'Hoàn thành',
    deadline: '28/02/2024'
  },
  {
    name: 'Phát triển website thương mại điện tử',
    description: 'Phát triển Web',
    client: 'Công ty TNHH TechCorp',
    freelancer: 'Nguyễn Văn An',
    budget: '150.000.000đ',
    status: 'Đang thực hiện',
    deadline: '15/04/2024'
  },
  {
    name: 'Thiết kế chiến dịch truyền thông',
    description: 'Marketing',
    client: 'BrandHouse',
    freelancer: 'Phạm Thu Hương',
    budget: '95.000.000đ',
    status: 'Chờ duyệt',
    deadline: '30/03/2024'
  },
  {
    name: 'Dự án tổng hợp sản phẩm',
    description: 'Khách hàng dự định',
    client: 'Global Group',
    freelancer: 'Phạm Thu Dung',
    budget: '250.000.000đ',
    status: 'Bị trì hoãn',
    deadline: '01/05/2024'
  }
]

const statusAppearance: Record<ProjectStatus, { label: string; className: string }> = {
  'Đang thực hiện': { label: 'Đang thực hiện', className: 'bg-emerald-100 text-emerald-700' },
  'Chờ duyệt': { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  'Hoàn thành': { label: 'Hoàn thành', className: 'bg-slate-100 text-slate-700' },
  'Bị trì hoãn': { label: 'Bị trì hoãn', className: 'bg-rose-100 text-rose-700' }
}

const totalPages = 10

export function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
      <CardHeader className='flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-lg font-semibold text-slate-900'>Danh mục dự án</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Select defaultValue='all-status'>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-status'>Tất cả trạng thái</SelectItem>
              <SelectItem value='in-progress'>Đang thực hiện</SelectItem>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
              <SelectItem value='completed'>Hoàn thành</SelectItem>
              <SelectItem value='delayed'>Bị trì hoãn</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue='all-category'>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Tất cả danh mục' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-category'>Tất cả danh mục</SelectItem>
              <SelectItem value='web-dev'>Phát triển Web</SelectItem>
              <SelectItem value='mobile'>Ứng dụng di động</SelectItem>
              <SelectItem value='marketing'>Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border/40 text-sm text-muted-foreground'>
                <TableHead>Dự án</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Ngân sách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hạn chót</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const status = statusAppearance[project.status]
                return (
                  <TableRow key={`${project.name}-${project.client}`} className='border-border/40 text-sm'>
                    <TableCell>
                      <div>
                        <p className='font-medium text-slate-900'>{project.name}</p>
                        <p className='text-xs text-muted-foreground'>{project.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className='text-slate-700'>{project.client}</TableCell>
                    <TableCell className='text-slate-700'>{project.freelancer}</TableCell>
                    <TableCell className='text-slate-900'>{project.budget}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className={`border-transparent px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-slate-700'>{project.deadline}</TableCell>
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
                      handlePageChange(currentPage - 1)
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
                      handlePageChange(page)
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
                    handlePageChange(totalPages)
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
                      handlePageChange(currentPage + 1)
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
