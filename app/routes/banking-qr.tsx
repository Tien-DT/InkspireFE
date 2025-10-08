import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { SepayPayment } from '~/components/payment/sepay-payment'
import { useAuth } from '~/contexts/AuthContext'
import type { SepayPaymentRequest } from '~/types/payment.type'

export default function BankingQR() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [showExpiredDialog, setShowExpiredDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Get payment info from URL params
  const amount = Number(searchParams.get('amount')) || 0
  const orderInfo = searchParams.get('orderInfo') || 'Nạp tiền vào ví InkPay'
  const description = searchParams.get('description') || orderInfo
  const userId = profile?.id || '00000000-0000-0000-0000-000000000001'

  // Tạo payment request cho Sepay
  const sepayPaymentRequest: SepayPaymentRequest = {
    UserId: userId,
    Amount: amount,
    OrderInfo: orderInfo,
    Description: description,
    ExpiryMinutes: 15
  }

  // Handle payment success
  const handlePaymentSuccess = () => {
    console.log('Payment successful!')
    setShowSuccessDialog(true)
  }

  // Handle payment failure
  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error)
    setErrorMessage(error)
    setShowFailureDialog(true)
  }

  // Handle payment cancelled
  const handlePaymentCancel = () => {
    console.log('Payment cancelled')
    navigate('/payment')
  }

  // Handle payment expired
  const handlePaymentExpired = () => {
    console.log('Payment expired')
    setShowExpiredDialog(true)
  }

  // Close success dialog and navigate
  const handleCloseSuccess = () => {
    setShowSuccessDialog(false)
    navigate('/payment')
  }

  // Close expired dialog and navigate
  const handleCloseExpired = () => {
    setShowExpiredDialog(false)
    navigate('/payment')
  }

  return (
    <>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Thanh toán thành công!</DialogTitle>
              <DialogDescription className='text-gray-600'>Số dư ví của bạn đã được cập nhật</DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={handleCloseSuccess}
              className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
            >
              Về trang ví
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Failure Dialog */}
      <Dialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <XCircle className='h-10 w-10 text-red-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Thanh toán thất bại</DialogTitle>
              <DialogDescription className='text-gray-600'>
                {errorMessage || 'Đã xảy ra lỗi trong quá trình thanh toán'}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={() => setShowFailureDialog(false)}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            >
              Thử lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expired Dialog */}
      <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                <Clock className='h-10 w-10 text-orange-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Thanh toán đã hết hạn</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Phiên thanh toán đã hết hạn. Vui lòng thực hiện lại giao dịch.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={handleCloseExpired}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            >
              Về trang ví
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen my-20'>
        <div className='max-w-5xl mx-auto'>
          {/* Back Button */}
          <Button variant='ghost' onClick={() => navigate('/payment')} className='mb-6 hover:bg-gray-100'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Quay lại
          </Button>

          <div className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200'>
            {/* Header with Icon */}
            <div className='flex items-center mb-6 pb-6 border-b border-gray-200'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-4 flex items-center justify-center shadow-md'>
                <div className='w-6 h-6 bg-white rounded-sm'></div>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Chuyển khoản ngân hàng</h1>
                <p className='text-sm text-gray-600 mt-1'>Quét mã QR hoặc chuyển khoản thủ công</p>
              </div>
            </div>

            {/* Alert */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
              <p className='text-blue-800 text-sm font-medium'>
                ⚠️ Chú ý: Nhập chính xác nội dung chuyển khoản bên dưới để hệ thống tự động xác nhận
              </p>
            </div>

            {/* Sepay Payment Component */}
            <SepayPayment
              paymentRequest={sepayPaymentRequest}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
              onExpired={handlePaymentExpired}
            />
          </div>
        </div>
      </div>
    </>
  )
}
