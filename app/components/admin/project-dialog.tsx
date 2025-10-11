import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { adminApi, type AdminProject } from '~/apis/admin.api'

interface ProjectDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  project?: AdminProject | null
  mode: 'create' | 'edit'
}

export function ProjectDialog({ open, onClose, onSuccess, project, mode }: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: project?.name || '',
    description: project?.description || '',
    budgetMin: project?.budget ? project.budget * 0.8 : 0,
    budgetMax: project?.budget || 0,
    clientId: project?.clientId || '',
    deadline: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    status: project?.status || 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'create') {
        if (!formData.title || !formData.clientId || !formData.budgetMax) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc')
          return
        }
        await adminApi.createProject({
          title: formData.title,
          description: formData.description || undefined,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          clientId: formData.clientId,
          deadline: formData.deadline || undefined,
          status: formData.status
        })
      } else if (project) {
        await adminApi.updateProject(project.id, {
          title: formData.title || undefined,
          description: formData.description || undefined,
          budgetMin: formData.budgetMin || undefined,
          budgetMax: formData.budgetMax || undefined,
          clientId: formData.clientId || undefined,
          deadline: formData.deadline || undefined,
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
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Điền thông tin để tạo dự án mới' : 'Cập nhật thông tin dự án'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Tên dự án *</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='budgetMin'>Ngân sách tối thiểu (VNĐ)</Label>
              <Input
                id='budgetMin'
                type='number'
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='budgetMax'>Ngân sách tối đa (VNĐ) *</Label>
              <Input
                id='budgetMax'
                type='number'
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='clientId'>ID Khách hàng *</Label>
              <Input
                id='clientId'
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='deadline'>Hạn chót</Label>
              <Input
                id='deadline'
                type='date'
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
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
                <SelectItem value='1'>Đang thực hiện</SelectItem>
                <SelectItem value='2'>Hoàn thành</SelectItem>
                <SelectItem value='3'>Đã hủy</SelectItem>
              </SelectContent>
            </Select>
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
