import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Info } from 'lucide-react'
import { userPaymentApi, type UserPayment } from '~/apis/userPayment.api'
import { withdrawApi, type CreateWithdrawRequestDto } from '~/apis/withdraw.api'
import { getProfileFromLS } from '~/utils/auth'
import { UserRole } from '~/types/user.type'

interface WithdrawRequestFormProps {
  userId: string
  walletBalance: number
  currency: string
  onSuccess?: () => void
}

export function WithdrawRequestForm({ userId, walletBalance, currency, onSuccess }: WithdrawRequestFormProps) {
  const profile = getProfileFromLS()
  const isClient = profile?.role === UserRole.CLIENT
  
  const [useDefaultPayment, setUseDefaultPayment] = useState(true)
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: ''
  })

  // Fetch default payment method
  const { data: defaultPayment } = useQuery({
    queryKey: ['default-payment', userId],
    queryFn: () => userPaymentApi.getDefaultPayment(userId),
    enabled: !!userId,
    retry: false
  })

  // Create withdraw request mutation
  const createWithdrawMutation = useMutation({
    mutationFn: (data: CreateWithdrawRequestDto) => withdrawApi.createWithdrawRequest(data),
    onSuccess: () => {
      toast.success('Yêu cầu rút tiền đã được tạo thành công')
      setFormData({
        amount: '',
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: ''
      })
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error: any) => {
      toast.error('Không thể tạo yêu cầu: ' + (error.response?.data || error.message))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ')
      return
    }
    
    if (amount > walletBalance) {
      toast.error('Số tiền yêu cầu vượt quá số dư ví')
      return
    }
    
    if (!useDefaultPayment && (!formData.bankName || !formData.bankAccountNumber || !formData.bankAccountName)) {
      toast.error('Vui lòng nhập đầy đủ thông tin ngân hàng')
      return
    }
    
    if (useDefaultPayment && !defaultPayment) {
      toast.error('Không tìm thấy phương thức thanh toán mặc định. Vui lòng thêm thông tin ngân hàng.')
      return
    }
    
    createWithdrawMutation.mutate({
      userId,
      amount,
      useDefaultPayment,
      bankName: useDefaultPayment ? undefined : formData.bankName,
      bankAccountNumber: useDefaultPayment ? undefined : formData.bankAccountNumber,
      bankAccountName: useDefaultPayment ? undefined : formData.bankAccountName
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND'
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo yêu cầu rút tiền</CardTitle>
        <CardDescription>
          Số dư ví hiện tại: {formatCurrency(walletBalance)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Số tiền cần rút *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Nhập số tiền"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-gray-700">
                  💰 <strong>Tổng rút:</strong> {formatCurrency(parseFloat(formData.amount))}
                </p>
                {isClient ? (
                  <p className="text-green-600">
                    ✅ <strong>Bạn nhận được:</strong> {formatCurrency(parseFloat(formData.amount))}
                  </p>
                ) : (
                  <>
                    <p className="text-green-600">
                      ✅ <strong>Bạn nhận được (80%):</strong> {formatCurrency(parseFloat(formData.amount) * 0.8)}
                    </p>
                    <p className="text-orange-600">
                      📊 <strong>Hoa hồng platform (20%):</strong> {formatCurrency(parseFloat(formData.amount) * 0.2)}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between border rounded-lg p-3">
            <Label htmlFor="useDefault" className="cursor-pointer">
              Sử dụng phương thức thanh toán mặc định
            </Label>
            <Switch
              id="useDefault"
              checked={useDefaultPayment}
              onCheckedChange={(checked) => {
                setUseDefaultPayment(checked)
                if (checked && defaultPayment) {
                  setFormData({
                    ...formData,
                    bankName: defaultPayment.bankName,
                    bankAccountNumber: defaultPayment.bankAccountNumber,
                    bankAccountName: defaultPayment.bankAccountName
                  })
                } else if (!checked) {
                  setFormData({
                    ...formData,
                    bankName: '',
                    bankAccountNumber: '',
                    bankAccountName: ''
                  })
                }
              }}
            />
          </div>
          
          {useDefaultPayment && defaultPayment && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <div className="font-medium mb-1">Phương thức thanh toán mặc định:</div>
                <div className="text-gray-600">
                  {defaultPayment.bankName} - {defaultPayment.bankAccountNumber}
                  <br />
                  {defaultPayment.bankAccountName}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {!useDefaultPayment && (
            <>
              <div>
                <Label htmlFor="bankName">Tên ngân hàng *</Label>
                <Input
                  id="bankName"
                  placeholder="VD: Vietcombank, ACB, Techcombank..."
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required={!useDefaultPayment}
                />
              </div>
              
              <div>
                <Label htmlFor="bankAccountNumber">Số tài khoản *</Label>
                <Input
                  id="bankAccountNumber"
                  placeholder="Nhập số tài khoản ngân hàng"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  required={!useDefaultPayment}
                />
              </div>
              
              <div>
                <Label htmlFor="bankAccountName">Tên chủ tài khoản *</Label>
                <Input
                  id="bankAccountName"
                  placeholder="Nhập tên chủ tài khoản"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  required={!useDefaultPayment}
                />
              </div>
            </>
          )}
          
          {useDefaultPayment && !defaultPayment && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm">
                Bạn chưa có phương thức thanh toán mặc định. 
                Vui lòng thêm thông tin ngân hàng trong phần "Phương thức thanh toán" hoặc 
                tắt tùy chọn này để nhập thủ công.
              </AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={createWithdrawMutation.isPending}>
            {createWithdrawMutation.isPending ? 'Đang xử lý...' : 'Tạo yêu cầu rút tiền'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
