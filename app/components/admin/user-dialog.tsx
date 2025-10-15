import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { adminApi, type AdminUser } from '~/apis/admin.api'

interface UserDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user?: AdminUser | null
  mode: 'create' | 'edit'
}

export function UserDialog({ open, onClose, onSuccess, user, mode }: UserDialogProps) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 2,
    status: user?.status || 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'create') {
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc')
          return
        }
        await adminApi.createUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber || undefined,
          role: formData.role,
          status: formData.status
        })
      } else if (user) {
        await adminApi.updateUser(user.id, {
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          role: formData.role,
          status: formData.status
        })
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Điền thông tin để tạo người dùng mới' : 'Cập nhật thông tin người dùng'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {mode === 'create' && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Mật khẩu *</Label>
                <Input
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </>
          )}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>Họ *</Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Tên *</Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>Số điện thoại</Label>
            <Input
              id='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='role'>Vai trò</Label>
              <Select
                value={formData.role.toString()}
                onValueChange={(val) => setFormData({ ...formData, role: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>Admin</SelectItem>
                  <SelectItem value='2'>Khách hàng</SelectItem>
                  <SelectItem value='3'>Freelancer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='status'>Trạng thái</Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(val) => setFormData({ ...formData, status: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>Chờ duyệt</SelectItem>
                  <SelectItem value='1'>Hoạt động</SelectItem>
                  <SelectItem value='2'>Tạm khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className='text-sm text-red-500'>{error}</p>}
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
