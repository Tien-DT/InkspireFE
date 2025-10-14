import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Switch } from '~/components/ui/switch'
import { CreditCard, Edit, Trash2, Plus, Check } from 'lucide-react'

interface PaymentMethod {
  id: string
  userId: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  bankBranch?: string
  swiftCode?: string
  isDefault: boolean
  status: number
  createdAt: string
  updatedAt?: string
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    bankBranch: '',
    swiftCode: '',
    isDefault: false
  })

  const userId = localStorage.getItem('userId') || ''

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UserPayments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'UserId': userId
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      toast.error('Không thể tải phương thức thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.bankName || !formData.bankAccountNumber || !formData.bankAccountName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const url = editingMethod 
        ? `${import.meta.env.VITE_API_URL}/api/UserPayments/${editingMethod.id}`
        : `${import.meta.env.VITE_API_URL}/api/UserPayments`
      
      const response = await fetch(url, {
        method: editingMethod ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'UserId': userId
        },
        body: JSON.stringify({
          ...formData,
          userId: editingMethod ? undefined : userId
        })
      })
      
      if (response.ok || response.status === 204) {
        toast.success(editingMethod ? 'Đã cập nhật phương thức thanh toán' : 'Đã thêm phương thức thanh toán')
        fetchPaymentMethods()
        handleCloseDialog()
      } else {
        const error = await response.text()
        toast.error(`Không thể ${editingMethod ? 'cập nhật' : 'thêm'} phương thức: ${error}`)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi')
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      bankName: method.bankName,
      bankAccountNumber: method.bankAccountNumber,
      bankAccountName: method.bankAccountName,
      bankBranch: method.bankBranch || '',
      swiftCode: method.swiftCode || '',
      isDefault: method.isDefault
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UserPayments/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'UserId': userId
          }
        }
      )
      
      if (response.ok || response.status === 204) {
        toast.success('Đã xóa phương thức thanh toán')
        fetchPaymentMethods()
      } else {
        toast.error('Không thể xóa phương thức thanh toán')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/UserPayments/${id}/set-default`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'UserId': userId
          }
        }
      )
      
      if (response.ok || response.status === 204) {
        toast.success('Đã đặt làm mặc định')
        fetchPaymentMethods()
      } else {
        toast.error('Không thể đặt làm mặc định')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi')
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingMethod(null)
    setFormData({
      bankName: '',
      bankAccountNumber: '',
      bankAccountName: '',
      bankBranch: '',
      swiftCode: '',
      isDefault: false
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>
                Quản lý thông tin ngân hàng để nhận tiền
              </CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">
                Chưa có phương thức thanh toán nào
              </p>
              <Button onClick={() => setDialogOpen(true)} className="mt-4" variant="outline">
                Thêm phương thức đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.bankName}</p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {method.bankAccountNumber} - {method.bankAccountName}
                      </p>
                      {method.bankBranch && (
                        <p className="text-xs text-gray-400">
                          Chi nhánh: {method.bankBranch}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetDefault(method.id)}
                        title="Đặt làm mặc định"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Cập nhật phương thức thanh toán' : 'Thêm phương thức thanh toán'}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin ngân hàng để nhận tiền từ hệ thống
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="bankName">Tên ngân hàng *</Label>
                <Input
                  id="bankName"
                  placeholder="VD: Vietcombank, ACB, Techcombank..."
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bankAccountNumber">Số tài khoản *</Label>
                <Input
                  id="bankAccountNumber"
                  placeholder="Nhập số tài khoản"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bankAccountName">Tên chủ tài khoản *</Label>
                <Input
                  id="bankAccountName"
                  placeholder="Nhập tên chủ tài khoản"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bankBranch">Chi nhánh (tùy chọn)</Label>
                <Input
                  id="bankBranch"
                  placeholder="VD: Chi nhánh Hà Nội"
                  value={formData.bankBranch}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="swiftCode">Mã SWIFT (tùy chọn)</Label>
                <Input
                  id="swiftCode"
                  placeholder="Mã SWIFT cho giao dịch quốc tế"
                  value={formData.swiftCode}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="isDefault">Đặt làm mặc định</Label>
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button type="submit">
                {editingMethod ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
