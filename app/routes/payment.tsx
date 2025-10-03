import { useState } from 'react'
import { CreditCard, Download, Wallet, QrCode } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import VietQRPayment from '~/components/payment/vietqr-payment'
import { useAuth } from '~/contexts/AuthContext'
import type { VietQRPaymentRequest } from '~/types/payment.type'

export default function Payment() {
  const { profile } = useAuth()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('inkpay')
  const [showVietQRPayment, setShowVietQRPayment] = useState(false)

  // Sample order data - Replace with actual order data
  const orderAmount = 249000 // 249,000 VND
  const subtotal = 299000
  const discount = 50000

  /**
   * Handle payment button click
   */
  const handlePayment = () => {
    if (selectedPaymentMethod === 'vietqr') {
      // Show VietQR payment component
      setShowVietQRPayment(true)
    } else if (selectedPaymentMethod === 'inkpay') {
      // Handle InkPay payment
      console.log('Processing InkPay payment...')
      // TODO: Implement InkPay payment logic
    }
  }

  /**
   * Handle payment success
   */
  const handlePaymentSuccess = () => {
    console.log('Payment successful!')
    // TODO: Navigate to success page or show success message
    // window.location.href = '/payment-success'
  }

  /**
   * Handle payment failure
   */
  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error)
    // TODO: Show error message to user
    alert(`Thanh toán thất bại: ${error}`)
  }

  /**
   * Handle cancel payment
   */
  const handleCancelPayment = () => {
    setShowVietQRPayment(false)
  }

  // If showing VietQR payment, render VietQR component
  if (showVietQRPayment && profile?.id) {
    const paymentRequest: VietQRPaymentRequest = {
      userId: profile.id,
      amount: orderAmount,
      orderInfo: 'Sản xuất nội dung truyền thông - Giai đoạn 1',
      description: 'Thanh toán dự án Inkspire',
      template: 'compact2',
      expiryMinutes: 15
    }

    return (
      <div className='container mx-auto px-4 py-6 min-h-screen mt-20'>
        <div className='mb-6'>
          <Button variant='outline' onClick={() => setShowVietQRPayment(false)}>
            ← Quay lại
          </Button>
        </div>
        <VietQRPayment
          paymentRequest={paymentRequest}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onCancel={handleCancelPayment}
        />
      </div>
    )
  }

  // Default payment page
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
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Sản xuất nội dung truyền thông - Giai đoạn 1
                  </h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    Mô tả: Viết bài social và kịch bản video đầu tiên truyền tải thông điệp "Cùng
                    Cocoon sống xanh".
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>299.000đ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className='mt-6'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Phương thức thanh toán
              </h3>

              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className='space-y-4'
              >
                {/* InkPay Wallet */}
                <div className='flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'>
                  <RadioGroupItem value='inkpay' id='inkpay' />
                  <Wallet className='h-5 w-5 text-blue-600' />
                  <Label htmlFor='inkpay' className='flex-1 cursor-pointer'>
                    Ví InkPay ( Số dư 1.000.000đ )
                  </Label>
                </div>

                {/* VietQR Payment */}
                <div className='flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'>
                  <RadioGroupItem value='vietqr' id='vietqr' />
                  <QrCode className='h-5 w-5 text-green-600' />
                  <Label htmlFor='vietqr' className='flex-1 cursor-pointer'>
                    Chuyển khoản VietQR (Quét mã QR)
                  </Label>
                </div>
              </RadioGroup>
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
                  <span className='text-gray-900'>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Giảm giá</span>
                  <span className='text-green-600'>-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='border-t pt-3'>
                  <div className='flex justify-between font-semibold text-lg'>
                    <span className='text-gray-900'>Tổng cộng</span>
                    <span className='text-gray-900'>{orderAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className='w-full bg-gray-900 hover:bg-gray-800 text-white mb-3'
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
