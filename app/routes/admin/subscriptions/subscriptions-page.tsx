import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import subscriptionApi, { type Subscription } from '~/apis/subscription.api'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: 1
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        title: editingSubscription.title,
        description: editingSubscription.description || '',
        price: editingSubscription.price,
        type: editingSubscription.type || 1
      })
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        type: 1
      })
    }
  }, [editingSubscription])

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionApi.getSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Không thể tải danh sách gói đăng ký')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      // TODO: Implement create/update subscription API call
      toast.success(editingSubscription ? 'Cập nhật gói đăng ký thành công' : 'Tạo gói đăng ký thành công')
      setIsDialogOpen(false)
      setEditingSubscription(null)
      fetchSubscriptions()
    } catch (error) {
      toast.error('Không thể lưu gói đăng ký')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói đăng ký này?')) return

    try {
      // TODO: Implement delete subscription API call
      toast.success('Xóa gói đăng ký thành công')
      fetchSubscriptions()
    } catch (error) {
      toast.error('Không thể xóa gói đăng ký')
    }
  }

  const getTypeLabel = (type?: number) => {
    switch (type) {
      case 1:
        return 'Basic'
      case 2:
        return 'Professional'
      case 3:
        return 'Enterprise'
      default:
        return 'Unknown'
    }
  }

  const getTypeColor = (type?: number) => {
    switch (type) {
      case 1:
        return 'default'
      case 2:
        return 'secondary'
      case 3:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold tracking-tight'>Quản Lý Gói Đăng Ký</h2>
          <p className='text-xs sm:text-sm text-muted-foreground'>Quản lý các gói đăng ký cho khách hàng</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSubscription(null)}>
              <Plus className='h-4 w-4 mr-2' />
              Thêm Gói Mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubscription ? 'Cập Nhật Gói Đăng Ký' : 'Tạo Gói Đăng Ký Mới'}</DialogTitle>
              <DialogDescription>
                Điền thông tin để {editingSubscription ? 'cập nhật' : 'tạo'} gói đăng ký
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Tên gói</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='Ví dụ: Gói Professional'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Mô tả</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Mô tả chi tiết về gói đăng ký'
                  rows={3}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Giá (VNĐ/tháng)</Label>
                <Input
                  id='price'
                  type='number'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder='0'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Loại gói</Label>
                <Select
                  value={formData.type.toString()}
                  onValueChange={(value) => setFormData({ ...formData, type: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại gói' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Basic</SelectItem>
                    <SelectItem value='2'>Professional</SelectItem>
                    <SelectItem value='3'>Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex gap-3 pt-4'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingSubscription(null)
                  }}
                >
                  Hủy
                </Button>
                <Button className='flex-1' onClick={handleSubmit}>
                  {editingSubscription ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-2 md:grid-cols-3'>
        <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Tổng Gói Đăng Ký</CardTitle>
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>{subscriptions.length}</div>
            <p className='text-xs text-muted-foreground mt-0.5'>Các gói đăng ký đang hoạt động</p>
          </CardContent>
        </Card>
        <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Gói Phổ Biến</CardTitle>
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>Professional</div>
            <p className='text-xs text-muted-foreground mt-0.5'>Được chọn nhiều nhất</p>
          </CardContent>
        </Card>
        <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Doanh Thu Dự Kiến</CardTitle>
          </CardHeader>
          <CardContent className='p-3 sm:p-4'>
            <div className='text-xl sm:text-2xl font-bold'>
              {subscriptions.reduce((sum, s) => sum + s.price, 0).toLocaleString('vi-VN')} VNĐ
            </div>
            <p className='text-xs text-muted-foreground mt-0.5'>Mỗi tháng từ các gói</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Grid */}
      <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-3'>
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className='relative border-0 bg-white dark:bg-slate-950 shadow-none'>
            <CardHeader className='pb-2'>
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <CardTitle className='text-base sm:text-lg'>{subscription.title}</CardTitle>
                  <Badge variant={getTypeColor(subscription.type) as any} className='mt-1 text-xs'>
                    {getTypeLabel(subscription.type)}
                  </Badge>
                </div>
                <div className='flex gap-1 flex-shrink-0'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => {
                      setEditingSubscription(subscription)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit2 className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleDelete(subscription.id)}>
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              </div>
              <CardDescription className='mt-1 text-xs leading-snug'>{subscription.description}</CardDescription>
            </CardHeader>
            <CardContent className='p-3 sm:p-4'>
              <div className='flex items-baseline gap-1'>
                <span className='text-2xl sm:text-3xl font-bold'>{subscription.price.toLocaleString('vi-VN')}</span>
                <span className='text-xs sm:text-sm text-muted-foreground'>VNĐ/tháng</span>
              </div>
              <div className='mt-2 flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>
                  Status: {subscription.status === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <Card className='p-6 sm:p-8 border-0 bg-white dark:bg-slate-950 shadow-none'>
          <div className='text-center'>
            <h3 className='text-base sm:text-lg font-semibold'>Chưa có gói đăng ký nào</h3>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>Bắt đầu bằng cách tạo gói đăng ký đầu tiên</p>
            <Button
              className='mt-3'
              onClick={() => {
                setEditingSubscription(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className='h-4 w-4 mr-2' />
              Tạo Gói Đầu Tiên
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
