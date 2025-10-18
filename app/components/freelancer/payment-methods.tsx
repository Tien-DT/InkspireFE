import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { userPaymentApi, type UserPayment, type CreateUserPaymentDto, type UpdateUserPaymentDto } from '~/apis/userPayment.api'
import { getProfileFromLS } from '~/utils/auth'

export function PaymentMethods() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<UserPayment | null>(null)
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    bankBranch: '',
    swiftCode: '',
    isDefault: false
  })

  const queryClient = useQueryClient()
  const profile = getProfileFromLS()
  const userId = profile?.id || ''

  // Fetch payment methods with React Query
  const { data: paymentMethods = [], isLoading: loading } = useQuery({
    queryKey: ['user-payments', userId],
    queryFn: () => userPaymentApi.getUserPayments(userId),
    enabled: !!userId
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserPaymentDto) => userPaymentApi.createPayment(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-payments'] })
      toast.success('Đã thêm phương thức thanh toán')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error('Không thể thêm phương thức: ' + (error.response?.data || error.message))
    }
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPaymentDto }) => 
      userPaymentApi.updatePayment(id, data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-payments'] })
      toast.success('Đã cập nhật phương thức thanh toán')
      handleCloseDialog()
    },
    onError: (error: any) => {
      toast.error('Không thể cập nhật: ' + (error.response?.data || error.message))
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userPaymentApi.deletePayment(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-payments'] })
      toast.success('Đã xóa phương thức thanh toán')
    },
    onError: (error: any) => {
      toast.error('Không thể xóa: ' + (error.response?.data || error.message))
    }
  })

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => userPaymentApi.setDefaultPayment(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-payments'] })
      toast.success('Đã đặt làm mặc định')
    },
    onError: (error: any) => {
      toast.error('Không thể đặt làm mặc định: ' + (error.response?.data || error.message))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.bankName || !formData.bankAccountNumber || !formData.bankAccountName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    
    if (editingMethod) {
      updateMutation.mutate({
        id: editingMethod.id,
        data: {
          bankName: formData.bankName,
          bankAccountNumber: formData.bankAccountNumber,
          bankAccountName: formData.bankAccountName,
          bankBranch: formData.bankBranch,
          swiftCode: formData.swiftCode,
          isDefault: formData.isDefault
        }
      })
    } else {
      createMutation.mutate({
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankAccountName: formData.bankAccountName,
        bankBranch: formData.bankBranch,
        swiftCode: formData.swiftCode,
        isDefault: formData.isDefault
      })
    }
  }

  const handleEdit = (method: UserPayment) => {
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

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) {
      return
    }
    deleteMutation.mutate(id)
  }

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id)
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
