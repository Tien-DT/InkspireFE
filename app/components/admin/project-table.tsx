import { useEffect, useState } from 'react'
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
import { adminApi, type AdminProject } from '~/apis/admin.api'

type ProjectRecord = {
  id: string
  name: string
  description: string
  client: string
  budget: string
  status: number
  statusName: string
  deadline: string
}

const getStatusAppearance = (statusName: string) => {
  switch (statusName) {
    case 'Active':
      return { label: 'Đang thực hiện', className: 'bg-emerald-100 text-emerald-700' }
    case 'Pending':
      return { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' }
    case 'Completed':
      return { label: 'Hoàn thành', className: 'bg-slate-100 text-slate-700' }
    case 'On Hold':
      return { label: 'Bị trì hoãn', className: 'bg-rose-100 text-rose-700' }
    case 'Cancelled':
      return { label: 'Đã hủy', className: 'bg-gray-100 text-gray-700' }
    default:
      return { label: statusName, className: 'bg-gray-100 text-gray-700' }
  }
}

export function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: undefined as number | undefined,
    search: undefined as string | undefined
  })

  useEffect(() => {
    fetchProjects()
  }, [currentPage, filters])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getProjects({
        page: currentPage,
        pageSize: 10,
        status: filters.status,
        search: filters.search
      })
      
      if (response.data) {
        const formattedProjects = response.data.items.map((project: AdminProject) => ({
          id: project.id,
          name: project.name || 'N/A',
          description: project.description || 'N/A',
          client: project.clientName,
          budget: `${project.budget.toLocaleString('vi-VN')}đ`,
          status: project.status,
          statusName: project.statusName,
          deadline: project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : 'N/A'
        }))
        setProjects(formattedProjects)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStatusFilter = (value: string) => {
    if (value === 'all-status') {
      setFilters(prev => ({ ...prev, status: undefined }))
    } else {
      const statusMap: Record<string, number> = {
        'pending': 0,
        'in-progress': 1,
        'completed': 2,
        'cancelled': 3,
        'on-hold': 4
      }
      setFilters(prev => ({ ...prev, status: statusMap[value] }))
    }
    setCurrentPage(1)
  }

  const handleUpdateStatus = async (projectId: string, newStatus: number) => {
    try {
      await adminApi.updateProjectStatus(projectId, newStatus)
      fetchProjects() // Refresh the list
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
  }

  if (loading) {
    return (
      <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-96 animate-pulse bg-gray-200 rounded'></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-white/90 shadow-sm backdrop-blur-sm'>
      <CardHeader className='flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-lg font-semibold text-slate-900'>Danh mục dự án</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Select defaultValue='all-status' onValueChange={handleStatusFilter}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-status'>Tất cả trạng thái</SelectItem>
              <SelectItem value='in-progress'>Đang thực hiện</SelectItem>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
              <SelectItem value='completed'>Hoàn thành</SelectItem>
              <SelectItem value='on-hold'>Bị trì hoãn</SelectItem>
              <SelectItem value='cancelled'>Đã hủy</SelectItem>
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
                <TableHead>Ngân sách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hạn chót</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const status = getStatusAppearance(project.statusName)
                return (
                  <TableRow key={project.id} className='border-border/40 text-sm'>
                    <TableCell>
                      <div>
                        <p className='font-medium text-slate-900'>{project.name}</p>
                        <p className='text-xs text-muted-foreground'>{project.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className='text-slate-700'>{project.client}</TableCell>
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
