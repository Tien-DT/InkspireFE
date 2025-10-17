import { useEffect, useState } from 'react'
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
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { adminApi, type AdminUser } from '~/apis/admin.api'
import { UserDialog } from './user-dialog'
import { ConfirmDialog } from './confirm-dialog'

type UserStatus = 'pending' | 'suspended' | 'active'

type UserRecord = {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  joinDate: string
  projects: number
  rating: number | null
}

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

export function UserTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<UserRecord[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: undefined as number | undefined,
    status: undefined as number | undefined
  })
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [fullUsers, setFullUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    fetchUsers()
  }, [currentPage, filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getUsers({
        page: currentPage,
        pageSize: 10,
        role: filters.role,
        status: filters.status
      })

      if (response.data) {
        setFullUsers(response.data.items)
        const formattedUsers = response.data.items.map((user: AdminUser) => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'N/A',
          email: user.email || 'N/A',
          role: user.roleName,
          status: getStatusFromCode(user.status),
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A',
          projects: user.totalProjects,
          rating: null
        }))
        setUsers(formattedUsers)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setUsers([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = () => {
    setDialogMode('create')
    setSelectedUser(null)
    setUserDialogOpen(true)
  }

  const handleEditUser = (userId: string) => {
    const user = fullUsers.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setDialogMode('edit')
      setUserDialogOpen(true)
    }
  }

  const handleDeleteClick = (userId: string) => {
    const user = fullUsers.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setConfirmDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    try {
      setDeleteLoading(true)
      await adminApi.deleteUser(selectedUser.id)
      setConfirmDialogOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDialogSuccess = () => {
    fetchUsers()
  }

  const getStatusFromCode = (status?: number): UserStatus => {
    switch (status) {
      case 0:
        return 'pending'
      case 1:
        return 'active'
      case 2:
        return 'suspended'
      default:
        return 'pending'
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleRoleFilter = (value: string) => {
    if (value === 'all-roles') {
      setFilters((prev) => ({ ...prev, role: undefined }))
    } else if (value === 'freelancer') {
      setFilters((prev) => ({ ...prev, role: 3 }))
    } else if (value === 'customer') {
      setFilters((prev) => ({ ...prev, role: 2 }))
    }
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    if (value === 'all-status') {
      setFilters((prev) => ({ ...prev, status: undefined }))
    } else if (value === 'active') {
      setFilters((prev) => ({ ...prev, status: 1 }))
    } else if (value === 'pending') {
      setFilters((prev) => ({ ...prev, status: 0 }))
    } else if (value === 'suspended') {
      setFilters((prev) => ({ ...prev, status: 2 }))
    }
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
        <CardHeader className='pb-3'>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-96 animate-pulse bg-gray-200 rounded'></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
      <CardHeader className='flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <CardTitle className='text-lg sm:text-xl font-semibold text-foreground'>Danh sách người dùng</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button onClick={handleCreateUser} className='gap-2 w-full sm:w-auto'>
            <Plus className='h-4 w-4' />
            <span className='sm:inline'>Thêm người dùng</span>
          </Button>
          <Select defaultValue='all-roles' onValueChange={handleRoleFilter}>
            <SelectTrigger className='w-full sm:w-[160px]'>
              <SelectValue placeholder='Tất cả vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all-roles'>Tất cả vai trò</SelectItem>
              <SelectItem value='freelancer'>Freelancer</SelectItem>
              <SelectItem value='customer'>Khách hàng</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue='all-status' onValueChange={handleStatusFilter}>
            <SelectTrigger className='w-full sm:w-[160px]'>
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
      <CardContent className='p-3 sm:p-4'>
        <div className='overflow-x-auto'>
          <Table className='min-w-[900px] text-xs sm:text-sm'>
            <TableHeader>
              <TableRow className='border-border/40'>
                <TableHead className='text-muted-foreground w-[250px]'>Người dùng</TableHead>
                <TableHead className='text-muted-foreground w-[120px]'>Vai trò</TableHead>
                <TableHead className='text-muted-foreground w-[130px]'>Trạng thái</TableHead>
                <TableHead className='text-muted-foreground w-[120px]'>Ngày tham gia</TableHead>
                <TableHead className='text-muted-foreground w-[80px]'>Dự án</TableHead>
                <TableHead className='text-muted-foreground w-[100px]'>Đánh giá</TableHead>
                <TableHead className='text-muted-foreground w-[120px]'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                    Không có dữ liệu người dùng
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const status = statusConfig[user.status]
                  return (
                    <TableRow key={user.id} className='border-border/40'>
                      <TableCell className='max-w-[250px]'>
                        <div className='space-y-1'>
                          <p className='font-medium text-foreground truncate' title={user.name}>
                            {user.name}
                          </p>
                          <p className='text-sm text-muted-foreground truncate' title={user.email}>
                            {user.email}
                          </p>
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
                        <div className='flex gap-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-red-600 hover:text-red-700'
                            onClick={() => handleDeleteClick(user.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className='mt-3 flex justify-center'>
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
      <UserDialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        user={selectedUser}
        mode={dialogMode}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Xóa người dùng'
        description={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.firstName} ${selectedUser?.lastName}"? Hành động này không thể hoàn tác.`}
        loading={deleteLoading}
      />
    </Card>
  )
}
