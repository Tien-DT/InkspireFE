import { useState } from 'react'
import { CreditCard, Download, Wallet, QrCode } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { SepayPayment } from '~/components/payment/sepay-payment'
import { useAuth } from '~/contexts/AuthContext'
import type { SepayPaymentRequest } from '~/types/payment.type'

export default function payment() {
  const [paymentMethod, setPaymentMethod] = useState<'inkpay' | 'sepay'>('sepay')
  const [showSepayPayment, setShowSepayPayment] = useState(false)

  // Get user from auth context
  const { profile } = useAuth()
  const userId = profile?.id || '00000000-0000-0000-0000-000000000001'

  // Thông tin đơn hàng
  const orderAmount = 249000
  const orderInfo = 'Sản xuất nội dung truyền thông - Giai đoạn 1'
  const orderDescription = 'Viết bài social và kịch bản video đầu tiên truyền tải thông điệp "Cùng Cocoon sống xanh"'

  // Tạo payment request cho Sepay
  const sepayPaymentRequest: SepayPaymentRequest = {
    UserId: userId,
    Amount: orderAmount,
    OrderInfo: orderInfo,
    Description: orderDescription,
    ExpiryMinutes: 15
  }

  // Handle payment success
  const handlePaymentSuccess = () => {
    console.log('Payment successful!')
    // TODO: Navigate to success page or update UI
    alert('Thanh toán thành công!')
  }

  // Handle payment failure
  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error)
    alert('Thanh toán thất bại: ' + error)
  }

  // Handle payment cancelled
  const handlePaymentCancel = () => {
    console.log('Payment cancelled')
    setShowSepayPayment(false)
  }

  // Handle payment expired
  const handlePaymentExpired = () => {
    console.log('Payment expired')
    alert('Thanh toán đã hết hạn. Vui lòng thử lại.')
  }

  // Handle "Thanh toán ngay" button
  const handlePayNow = () => {
    if (paymentMethod === 'sepay') {
      setShowSepayPayment(true)
    } else {
      // TODO: Handle InkPay payment
      alert('Chức năng InkPay đang được phát triển')
    }
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen flex mt-20 justify-center'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Section - Current Order */}
        <div className='lg:col-span-2'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Đơn hàng hiện tại</h2>
              <p className='text-gray-600 mb-6'>Quản lý thành toán và xem lịch sử giao dịch của bạn</p>

              {/* Order Item */}
              <div className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'>
                <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center'>
                  <div className='w-8 h-8 bg-gray-400 rounded'></div>
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900 mb-1'>{orderInfo}</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    Mô tả: {orderDescription}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>{orderAmount.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className='mt-6'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Phương thức thanh toán</h3>

              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'inkpay' | 'sepay')}
                className='space-y-4'
              >
                <div className='flex items-center space-x-3 p-4 border rounded-lg'>
                  <RadioGroupItem value='inkpay' id='inkpay' />
                  <Wallet className='h-5 w-5 text-blue-600' />
                  <Label htmlFor='inkpay' className='flex-1 cursor-pointer'>
                    Ví InkPay ( Số dư 1.000.000đ )
                  </Label>
                </div>

                <div className='flex items-center space-x-3 p-4 border rounded-lg'>
                  <RadioGroupItem value='sepay' id='sepay' />
                  <QrCode className='h-5 w-5 text-green-600' />
                  <Label htmlFor='sepay' className='flex-1 cursor-pointer'>
                    Chuyển khoản ngân hàng qua Sepay (TPBank)
                  </Label>
                </div>
              </RadioGroup>

              {/* Show Sepay Payment Component */}
              {showSepayPayment && paymentMethod === 'sepay' && (
                <div className='mt-6'>
                  <SepayPayment
                    paymentRequest={sepayPaymentRequest}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    onCancel={handlePaymentCancel}
                    onExpired={handlePaymentExpired}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Invoice Details */}
        <div className='lg:col-span-1'>
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Chi tiết hóa đơn</h3>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tạm tính</span>
                  <span className='text-gray-900'>299.000đ</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Giảm giá</span>
                  <span className='text-green-600'>-50.000đ</span>
                </div>
                <div className='border-t pt-3'>
                  <div className='flex justify-between font-semibold text-lg'>
                    <span className='text-gray-900'>Tổng cộng</span>
                    <span className='text-gray-900'>249.000đ</span>
                  </div>
                </div>
              </div>

              <Button 
                className='w-full bg-gray-900 hover:bg-gray-800 text-white mb-3'
                onClick={handlePayNow}
                disabled={showSepayPayment}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                Thanh toán ngay
              </Button>

              <Button variant='ghost' className='w-full text-gray-600'>
                <Download className='h-4 w-4 mr-2' />
                Tải xuống hóa đơn
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
