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
import { Check, Copy, QrCode, X, RefreshCw, Loader2, Clock } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
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

  /**
   * Additional CSS classes
   */
  className?: string
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
  onExpired,
  className
}: SepayPaymentProps) {
  const [copiedRef, setCopiedRef] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)

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
    reset
  } = useSepayPayment({
    autoPolling: true,
    pollingInterval: 5000,
    onSuccess: () => {
      onSuccess?.()
    },
    onFailure: (err) => {
      onFailure?.(err)
    },
    onExpired: () => {
      onExpired?.()
    },
    onCancelled: () => {
      onCancel?.()
    }
  })

  // Create payment on mount
  useEffect(() => {
    createPayment(paymentRequest)
  }, []) // Only run once on mount

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
    return (
      <Badge className={cn(config.className, 'text-white')}>
        {config.label}
      </Badge>
    )
  }

  // Loading state
  if (isLoading && !paymentData) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-600">Đang tạo thanh toán...</span>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error && !paymentData) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tạo thanh toán</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            <span>Thanh toán qua Sepay</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code */}
        {isPending && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <img
                src={paymentData.qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        {isPending && (
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="font-mono font-semibold text-orange-600">
              {formatCountdown(countdown)}
            </span>
            <span className="text-gray-600">còn lại</span>
            {isPolling && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500 ml-2" />
            )}
          </div>
        )}

        {/* Success Message */}
        {isCompleted && (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thanh toán thành công!
            </h3>
            <p className="text-gray-600">
              Giao dịch của bạn đã được xác nhận
            </p>
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-3 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">Thông tin thanh toán</h4>

          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-semibold text-lg text-gray-900">
              {formatCurrency(paymentData.amount)}
            </span>
          </div>

          {/* Transaction Ref */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mã giao dịch:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-gray-900">
                {paymentData.transactionRef}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(paymentData.transactionRef, setCopiedRef)}
              >
                {copiedRef ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Bank Name */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ngân hàng:</span>
            <span className="font-semibold text-gray-900">{paymentData.bankName}</span>
          </div>

          {/* Account Number */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số tài khoản:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-gray-900">
                {paymentData.accountNumber}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(paymentData.accountNumber, setCopiedAccount)}
              >
                {copiedAccount ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Account Name */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Chủ tài khoản:</span>
            <span className="font-semibold text-gray-900">{paymentData.accountName}</span>
          </div>
        </div>

        {/* Important Note */}
        {isPending && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-semibold mb-1">
              ⚠️ Quan trọng: Nội dung chuyển khoản
            </p>
            <p className="text-sm text-blue-800">
              Vui lòng nhập chính xác nội dung: <br />
              <span className="font-mono font-bold">
                {paymentData.transferContent}
              </span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isPending && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy thanh toán
            </Button>
          )}

          {(isCancelled || isExpired) && (
            <Button
              className="flex-1"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SepayPayment
