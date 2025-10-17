/**
 * SepayPayment Component
 * Display QR code and payment information for Sepay payment
 *
 * Features:
 * - QR code display
 * - Countdown timer
 * - Payment status badge
 * - Payment details (amount, transaction ref, bank account)
 * - Copy to clipboard functionality
 * - Cancel payment button
 * - Retry button when expired/cancelled
 * - Auto-polling indicator
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, Copy, QrCode, X, RefreshCw, Loader2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { useSepayPayment } from '~/hooks/useSepayPayment'
import type { SepayPaymentRequest } from '~/types/payment.type'
import { cn } from '~/lib/utils'

/**
 * Component props
 */
export interface SepayPaymentProps {
  /**
   * Payment request data
   */
  paymentRequest: SepayPaymentRequest

  /**
   * Callback when payment succeeds
   */
  onSuccess?: () => void

  /**
   * Callback when payment fails
   */
  onFailure?: (error: string) => void

  /**
   * Callback when payment is cancelled
   */
  onCancel?: () => void

  /**
   * Callback when payment expires
   */
  onExpired?: () => void
}

/**
 * Format number to VND currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

/**
 * Format countdown time
 */
const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Copy to clipboard
 */
const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

/**
 * SepayPayment Component
 */
export function SepayPayment({
  paymentRequest,
  onSuccess,
  onFailure,
  onCancel,
  onExpired
}: SepayPaymentProps) {
  const [copiedRef, setCopiedRef] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showExpiredDialog, setShowExpiredDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState<{ amount: number; transactionRef: string } | null>(null)
  const navigate = useNavigate()

  // Use Sepay payment hook
  const {
    paymentData,
    paymentStatus,
    isLoading,
    error,
    countdown,
    isPolling,
    createPayment,
    cancelPayment,
    reset,
    refreshStatus
  } = useSepayPayment({
    autoPolling: true,
    pollingInterval: 5000,
    onSuccess: (statusData) => {
      // Show success dialog
      setSuccessData({
        amount: statusData.amount,
        transactionRef: statusData.transactionRef
      })
      setShowSuccessDialog(true)
    },
    onFailure: (err) => {
      // Show error dialog
      setErrorMessage(err)
      setShowErrorDialog(true)
      onFailure?.(err)
    },
    onExpired: () => {
      // Show expired dialog
      setShowExpiredDialog(true)
      onExpired?.()
    },
    onCancelled: () => {
      onCancel?.()
    }
  })

  const [isManualChecking, setIsManualChecking] = useState(false)

  // Create payment on mount
  useEffect(() => {
    createPayment(paymentRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  /**
   * Handle manual check
   */
  const handleManualCheck = async () => {
    setIsManualChecking(true)
    try {
      await refreshStatus()
    } finally {
      // Keep spinner for 500ms for better UX
      setTimeout(() => setIsManualChecking(false), 500)
    }
  }

  /**
   * Handle retry
   */
  const handleRetry = () => {
    reset()
    createPayment(paymentRequest)
  }

  /**
   * Handle cancel
   */
  const handleCancel = async () => {
    await cancelPayment()
  }

  /**
   * Get status badge color
   */
  const getStatusBadge = () => {
    if (!paymentStatus) return null

    const statusConfig = {
      PENDING: { label: 'Đang chờ thanh toán', className: 'bg-yellow-500' },
      COMPLETED: { label: 'Đã thanh toán', className: 'bg-green-500' },
      CANCELLED: { label: 'Đã hủy', className: 'bg-gray-500' },
      EXPIRED: { label: 'Hết hạn', className: 'bg-red-500' }
    }

    const config = statusConfig[paymentStatus.status]
    return <Badge className={cn(config.className, 'text-white')}>{config.label}</Badge>
  }

  // Loading state
  if (isLoading && !paymentData) {
    return (
      <Card className='bg-transparent backdrop-blur-md rounded-3xl'>
        <CardContent className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
          <span className='ml-3 text-gray-600'>Đang tạo thanh toán...</span>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error && !paymentData) {
    return (
      <Card className='bg-transparent backdrop-blur-md rounded-3xl'>
        <CardContent className='py-8'>
          <div className='text-center'>
            <X className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lỗi tạo thanh toán</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <Button onClick={handleRetry}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No payment data
  if (!paymentData) {
    return null
  }

  const isPending = paymentStatus?.status === 'PENDING'
  const isCompleted = paymentStatus?.status === 'COMPLETED'
  const isCancelled = paymentStatus?.status === 'CANCELLED'
  const isExpired = paymentStatus?.status === 'EXPIRED'

  /**
   * Handle success dialog close
   */
  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
    onSuccess?.()
    navigate('/')
  }

  /**
   * Handle error dialog close
   */
  const handleErrorClose = () => {
    setShowErrorDialog(false)
  }

  /**
   * Handle expired dialog close
   */
  const handleExpiredClose = () => {
    setShowExpiredDialog(false)
  }

  return (
    <>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className='sm:max-w-md bg-white'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <CheckCircle2 className='h-10 w-10 text-gray-700' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Thanh toán thành công!</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Giao dịch của bạn đã được xác nhận và xử lý thành công
              </DialogDescription>
            </div>
          </DialogHeader>

          {successData && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Số tiền:</span>
                <span className='font-bold text-lg text-gray-900'>{formatCurrency(successData.amount)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Mã giao dịch:</span>
                <span className='font-mono text-sm text-gray-900'>{successData.transactionRef}</span>
              </div>
            </div>
          )}

          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={handleSuccessClose}
              className='w-full bg-gray-900 hover:bg-gray-800 text-white'
            >
              Hoàn tất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='h-10 w-10 text-gray-700' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Thanh toán thất bại</DialogTitle>
              <DialogDescription className='text-gray-600'>Đã xảy ra lỗi trong quá trình thanh toán</DialogDescription>
            </div>
          </DialogHeader>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
            <p className='text-sm text-gray-700 text-center'>{errorMessage || 'Vui lòng thử lại hoặc liên hệ hỗ trợ'}</p>
          </div>

          <DialogFooter className='sm:justify-center gap-2'>
            <Button variant='outline' onClick={handleErrorClose} className='flex-1'>
              Đóng
            </Button>
            <Button
              onClick={() => {
                handleErrorClose()
                handleRetry()
              }}
              className='flex-1 bg-gray-900 hover:bg-gray-800 text-white'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
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
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Clock className='h-10 w-10 text-gray-700' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Hết thời gian thanh toán</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Phiên thanh toán đã hết hạn. Vui lòng tạo giao dịch mới
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
            <p className='text-sm text-gray-700 text-center'>Mỗi giao dịch có thời hạn 15 phút để đảm bảo an toàn</p>
          </div>

          <DialogFooter className='sm:justify-center gap-2'>
            <Button variant='outline' onClick={handleExpiredClose} className='flex-1'>
              Đóng
            </Button>
            <Button
              onClick={() => {
                handleExpiredClose()
                handleRetry()
              }}
              className='flex-1 bg-gray-900 hover:bg-gray-800 text-white'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Tạo giao dịch mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Payment Card */}
      <Card className='bg-transparent backdrop-blur-md border border-gray-200 rounded-3xl'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center'>
              <QrCode className='h-5 w-5 mr-2' />
              <span>Thanh toán qua Sepay</span>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* QR Code */}
          {isPending && (
            <div className='flex flex-col items-center'>
              <div className='bg-white p-4 rounded-lg border border-gray-200'>
                <img src={paymentData.qrCodeUrl} alt='QR Code' className='w-64 h-64' />
              </div>
              <p className='text-sm text-gray-600 mt-3 text-center'>Quét mã QR bằng ứng dụng ngân hàng để thanh toán</p>
            </div>
          )}

          {/* Countdown Timer */}
          {isPending && (
            <div className='space-y-3'>
              <div className='flex items-center justify-center space-x-2 text-lg'>
                <Clock className='h-5 w-5 text-gray-700' />
                <span className='font-mono font-semibold text-gray-900'>{formatCountdown(countdown)}</span>
                <span className='text-gray-600'>còn lại</span>
                {isPolling && <Loader2 className='h-4 w-4 animate-spin text-gray-500 ml-2' />}
              </div>

              {/* Manual Check Button */}
              <div className='flex justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleManualCheck}
                  disabled={isManualChecking}
                  className='text-gray-700 border-gray-300 hover:bg-gray-50'
                >
                  {isManualChecking ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <RefreshCw className='h-4 w-4 mr-2' />
                      Kiểm tra thanh toán
                    </>
                  )}
                </Button>
              </div>

              <p className='text-xs text-center text-gray-500'>Hệ thống tự động kiểm tra mỗi 5 giây</p>
            </div>
          )}

          {/* Success Message */}
          {isCompleted && (
            <div className='text-center py-4'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                <Check className='h-8 w-8 text-gray-700' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thanh toán thành công!</h3>
              <p className='text-gray-600'>Giao dịch của bạn đã được xác nhận</p>
            </div>
          )}

          {/* Payment Details */}
          <div className='space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200'>
            <h4 className='font-semibold text-gray-900'>Thông tin thanh toán</h4>

            {/* Amount */}
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Số tiền:</span>
              <span className='font-semibold text-lg text-gray-900'>{formatCurrency(paymentData.amount)}</span>
            </div>

            {/* Transaction Ref */}
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Mã giao dịch:</span>
              <div className='flex items-center space-x-2'>
                <span className='font-mono text-sm text-gray-900'>{paymentData.transactionRef}</span>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => copyToClipboard(paymentData.transactionRef, setCopiedRef)}
                >
                  {copiedRef ? <Check className='h-4 w-4 text-gray-700' /> : <Copy className='h-4 w-4' />}
                </Button>
              </div>
            </div>

            {/* Bank Name */}
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Ngân hàng:</span>
              <span className='font-semibold text-gray-900'>{paymentData.bankName}</span>
            </div>

            {/* Account Number */}
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Số tài khoản:</span>
              <div className='flex items-center space-x-2'>
                <span className='font-mono text-gray-900'>{paymentData.accountNumber}</span>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => copyToClipboard(paymentData.accountNumber, setCopiedAccount)}
                >
                  {copiedAccount ? <Check className='h-4 w-4 text-gray-700' /> : <Copy className='h-4 w-4' />}
                </Button>
              </div>
            </div>

            {/* Account Name */}
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Chủ tài khoản:</span>
              <span className='font-semibold text-gray-900'>{paymentData.accountName}</span>
            </div>
          </div>

          {/* Important Note */}
          {isPending && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <p className='text-sm text-gray-900 font-semibold mb-1'>⚠️ Quan trọng: Nội dung chuyển khoản</p>
              <p className='text-sm text-gray-700'>
                Vui lòng nhập chính xác nội dung: <br />
                <span className='font-mono font-bold'>{paymentData.transferContent}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex space-x-3'>
            {isPending && (
              <Button variant='outline' className='flex-1' onClick={handleCancel} disabled={isLoading}>
                <X className='h-4 w-4 mr-2' />
                Hủy thanh toán
              </Button>
            )}

            {(isCancelled || isExpired) && (
              <Button className='flex-1 bg-gray-900 hover:bg-gray-800 text-white' onClick={handleRetry}>
                <RefreshCw className='h-4 w-4 mr-2' />
                Thử lại
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default SepayPayment
