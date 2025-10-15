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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { adminApi, type AdminProject } from '~/apis/admin.api'
import { ProjectDialog } from './project-dialog'
import { ConfirmDialog } from './confirm-dialog'
import { ProjectDetailDialog } from './project-detail-dialog'

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
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [fullProjects, setFullProjects] = useState<AdminProject[]>([])

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
        setFullProjects(response.data.items)
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

  const handleCreateProject = () => {
    setDialogMode('create')
    setSelectedProject(null)
    setProjectDialogOpen(true)
  }

  const handleViewDetail = (projectId: string) => {
    const project = fullProjects.find((p) => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setDetailDialogOpen(true)
    }
  }

  const handleEditProject = (projectId: string) => {
    const project = fullProjects.find((p) => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setDialogMode('edit')
      setProjectDialogOpen(true)
    }
  }

  const handleDeleteClick = (projectId: string) => {
    const project = fullProjects.find((p) => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setConfirmDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return

    try {
      setDeleteLoading(true)
      await adminApi.deleteProject(selectedProject.id)
      setConfirmDialogOpen(false)
      setSelectedProject(null)
      fetchProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDialogSuccess = () => {
    fetchProjects()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStatusFilter = (value: string) => {
    if (value === 'all-status') {
      setFilters((prev) => ({ ...prev, status: undefined }))
    } else {
      const statusMap: Record<string, number> = {
        pending: 0,
        'in-progress': 1,
        completed: 2,
        cancelled: 3,
        'on-hold': 4
      }
      setFilters((prev) => ({ ...prev, status: statusMap[value] }))
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
      <CardHeader className='flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-base sm:text-lg font-semibold text-slate-900'>Danh mục dự án</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button onClick={handleCreateProject} className='gap-2 w-full sm:w-auto'>
            <Plus className='h-4 w-4' />
            <span className='sm:inline'>Thêm dự án</span>
          </Button>
          <Select defaultValue='all-status' onValueChange={handleStatusFilter}>
            <SelectTrigger className='w-full sm:w-[180px]'>
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
          <Table className='min-w-[900px]'>
            <TableHeader>
              <TableRow className='border-border/40 text-sm text-muted-foreground'>
                <TableHead className='w-[250px]'>Dự án</TableHead>
                <TableHead className='w-[150px]'>Khách hàng</TableHead>
                <TableHead className='w-[120px]'>Ngân sách</TableHead>
                <TableHead className='w-[130px]'>Trạng thái</TableHead>
                <TableHead className='w-[100px]'>Hạn chót</TableHead>
                <TableHead className='w-[180px]'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const status = getStatusAppearance(project.statusName)
                return (
                  <TableRow key={project.id} className='border-border/40 text-sm'>
                    <TableCell className='max-w-[250px]'>
                      <div className='space-y-1'>
                        <p className='font-medium text-slate-900 truncate' title={project.name}>
                          {project.name}
                        </p>
                        <p className='text-xs text-muted-foreground line-clamp-2' title={project.description}>
                          {project.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='text-slate-700 max-w-[150px]'>
                      <div className='truncate' title={project.client}>
                        {project.client}
                      </div>
                    </TableCell>
                    <TableCell className='text-slate-900 whitespace-nowrap'>{project.budget}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={`border-transparent px-3 py-1 text-xs font-medium ${status.className} whitespace-nowrap`}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-slate-700 whitespace-nowrap'>{project.deadline}</TableCell>
                    <TableCell>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => handleViewDetail(project.id)}
                          title='Xem chi tiết'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => handleEditProject(project.id)}
                          title='Chỉnh sửa'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-red-600 hover:text-red-700'
                          onClick={() => handleDeleteClick(project.id)}
                          title='Xóa'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
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
      <ProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        project={selectedProject}
        mode={dialogMode}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Xóa dự án'
        description={`Bạn có chắc chắn muốn xóa dự án "${selectedProject?.name}"? Hành động này sẽ đặt trạng thái dự án thành "Đã hủy".`}
        loading={deleteLoading}
      />
      <ProjectDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        project={selectedProject}
      />
    </Card>
  )
}
