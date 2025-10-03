/**
 * VietQR Payment Component
 * Hiển thị QR code và thông tin thanh toán VietQR
 * Tự động poll payment status và countdown timer
 */

import { useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, Copy, AlertCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { useVietQRPayment } from '~/hooks/useVietQRPayment'
import type { VietQRPaymentRequest } from '~/types/payment.type'

interface VietQRPaymentProps {
  /** Chi tiết request để tạo payment */
  paymentRequest: VietQRPaymentRequest
  /** Callback khi payment thành công */
  onSuccess?: () => void
  /** Callback khi payment thất bại hoặc hủy */
  onFailure?: (error: string) => void
  /** Callback khi hủy payment */
  onCancel?: () => void
}

export default function VietQRPayment({
  paymentRequest,
  onSuccess,
  onFailure,
  onCancel
}: VietQRPaymentProps) {
  const {
    paymentData,
    paymentStatus,
    isLoading,
    error,
    countdown,
    isPolling,
    createPayment,
    cancelPayment,
    reset
  } = useVietQRPayment({
    autoPolling: true,
    pollingInterval: 5000, // Poll every 5 seconds
    onSuccess: () => {
      onSuccess?.()
    },
    onFailure: (error) => {
      onFailure?.(error)
    },
    onExpired: () => {
      onFailure?.('Payment expired')
    }
  })

  /**
   * Tạo payment khi component mount
   */
  useEffect(() => {
    createPayment(paymentRequest)

    // Cleanup khi unmount
    return () => {
      reset()
    }
  }, []) // Empty deps - chỉ chạy một lần khi mount

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Show toast notification
      console.log('Copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  /**
   * Format countdown timer (mm:ss)
   */
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * Format currency (VND)
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  /**
   * Get status badge
   */
  const getStatusBadge = () => {
    if (!paymentStatus) return null

    switch (paymentStatus.status) {
      case 'COMPLETED':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>
            <CheckCircle2 className='w-4 h-4 mr-1' />
            Đã thanh toán
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className='bg-yellow-500 hover:bg-yellow-600'>
            <Clock className='w-4 h-4 mr-1' />
            Chờ thanh toán
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge className='bg-gray-500 hover:bg-gray-600'>
            <XCircle className='w-4 h-4 mr-1' />
            Đã hủy
          </Badge>
        )
      case 'EXPIRED':
        return (
          <Badge className='bg-red-500 hover:bg-red-600'>
            <AlertCircle className='w-4 h-4 mr-1' />
            Hết hạn
          </Badge>
        )
      default:
        return null
    }
  }

  /**
   * Handle cancel payment
   */
  const handleCancelPayment = async () => {
    await cancelPayment('User cancelled')
    onCancel?.()
  }

  // Loading state
  if (isLoading && !paymentData) {
    return (
      <Card className='w-full max-w-2xl mx-auto'>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            <p className='text-gray-600'>Đang tạo mã thanh toán...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error && !paymentData) {
    return (
      <Card className='w-full max-w-2xl mx-auto'>
        <CardContent className='p-8'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className='mt-4 flex justify-center'>
            <Button onClick={() => createPayment(paymentRequest)} variant='outline'>
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Payment data exists
  if (!paymentData) return null

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl'>Thanh toán VietQR</CardTitle>
            <CardDescription>
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Payment Status - Completed */}
        {paymentStatus?.status === 'COMPLETED' && (
          <Alert className='border-green-500 bg-green-50'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Status - Expired/Cancelled */}
        {(paymentStatus?.status === 'EXPIRED' || paymentStatus?.status === 'CANCELLED') && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {paymentStatus.status === 'EXPIRED'
                ? 'Giao dịch đã hết hạn. Vui lòng tạo thanh toán mới.'
                : 'Giao dịch đã bị hủy.'}
            </AlertDescription>
          </Alert>
        )}

        {/* QR Code Section */}
        {paymentStatus?.status === 'PENDING' && (
          <div className='flex flex-col items-center space-y-4'>
            {/* QR Code Image */}
            <div className='relative'>
              <img
                src={paymentData.qrCodeUrl}
                alt='VietQR Payment'
                className='w-80 h-80 border-4 border-gray-200 rounded-lg shadow-lg'
              />
              {/* Countdown Timer Overlay */}
              {countdown > 0 && (
                <div className='absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  <Clock className='w-4 h-4 inline mr-1' />
                  {formatCountdown(countdown)}
                </div>
              )}
            </div>

            {/* Polling Indicator */}
            {isPolling && (
              <div className='flex items-center space-x-2 text-sm text-gray-500'>
                <div className='animate-pulse h-2 w-2 bg-blue-500 rounded-full'></div>
                <span>Đang kiểm tra trạng thái thanh toán...</span>
              </div>
            )}
          </div>
        )}

        {/* Payment Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Amount */}
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Số tiền</p>
            <p className='text-lg font-semibold text-gray-900'>
              {formatCurrency(paymentData.amount)}
            </p>
          </div>

          {/* Transaction Ref */}
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Mã giao dịch</p>
            <div className='flex items-center space-x-2'>
              <p className='text-lg font-mono font-semibold text-gray-900'>
                {paymentData.transactionRef}
              </p>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(paymentData.transactionRef)}
              >
                <Copy className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Bank Name */}
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Ngân hàng</p>
            <p className='text-lg font-semibold text-gray-900'>{paymentData.bankName}</p>
          </div>

          {/* Account Number */}
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Số tài khoản</p>
            <div className='flex items-center space-x-2'>
              <p className='text-lg font-mono font-semibold text-gray-900'>
                {paymentData.accountNumber}
              </p>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(paymentData.accountNumber)}
              >
                <Copy className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Account Name */}
          <div className='space-y-1 md:col-span-2'>
            <p className='text-sm text-gray-500'>Chủ tài khoản</p>
            <p className='text-lg font-semibold text-gray-900'>{paymentData.accountName}</p>
          </div>

          {/* Transfer Content */}
          <div className='space-y-1 md:col-span-2'>
            <p className='text-sm text-gray-500'>Nội dung chuyển khoản</p>
            <div className='flex items-center space-x-2'>
              <p className='text-lg font-mono font-semibold text-blue-600'>
                {paymentData.transferContent}
              </p>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(paymentData.transferContent)}
              >
                <Copy className='w-4 h-4' />
              </Button>
            </div>
            <p className='text-xs text-red-500'>
              * Vui lòng nhập chính xác nội dung chuyển khoản để hệ thống tự động xác nhận
            </p>
          </div>
        </div>

        {/* Instructions */}
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <strong>Hướng dẫn thanh toán:</strong>
            <ol className='list-decimal list-inside mt-2 space-y-1 text-sm'>
              <li>Mở ứng dụng Banking trên điện thoại</li>
              <li>Chọn chức năng quét mã QR</li>
              <li>Quét mã QR code ở trên</li>
              <li>Kiểm tra thông tin và xác nhận thanh toán</li>
              <li>Giao dịch sẽ được tự động xác nhận sau khi chuyển khoản thành công</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        {paymentStatus?.status === 'PENDING' && countdown > 0 && (
          <div className='flex justify-center space-x-4'>
            <Button variant='outline' onClick={handleCancelPayment} disabled={isLoading}>
              Hủy thanh toán
            </Button>
          </div>
        )}

        {/* Retry Button for Expired/Cancelled */}
        {(paymentStatus?.status === 'EXPIRED' || paymentStatus?.status === 'CANCELLED') && (
          <div className='flex justify-center'>
            <Button onClick={() => createPayment(paymentRequest)}>Tạo thanh toán mới</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
