/**
 * Custom Hook useVietQRPayment
 * Quản lý state và logic cho VietQR payment
 * Bao gồm: tạo payment, polling status, countdown timer
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  createVietQRPayment,
  getVietQRPaymentStatus,
  cancelVietQRPayment
} from '~/apis/payment.api'
import type {
  VietQRPaymentRequest,
  VietQRPaymentResponse,
  VietQRPaymentStatusResponse
} from '~/types/payment.type'

interface UseVietQRPaymentOptions {
  /** Interval time để poll status (ms), default: 5000 (5s) */
  pollingInterval?: number
  /** Có tự động poll status sau khi tạo payment không, default: true */
  autoPolling?: boolean
  /** Callback khi payment thành công */
  onSuccess?: (status: VietQRPaymentStatusResponse) => void
  /** Callback khi payment thất bại */
  onFailure?: (error: string) => void
  /** Callback khi payment hết hạn */
  onExpired?: () => void
}

interface UseVietQRPaymentReturn {
  /** Payment response data */
  paymentData: VietQRPaymentResponse | null
  /** Current payment status */
  paymentStatus: VietQRPaymentStatusResponse | null
  /** Loading state */
  isLoading: boolean
  /** Error message */
  error: string | null
  /** Countdown timer (seconds) */
  countdown: number
  /** Is polling active */
  isPolling: boolean
  /** Create payment function */
  createPayment: (request: VietQRPaymentRequest) => Promise<void>
  /** Start polling status */
  startPolling: () => void
  /** Stop polling status */
  stopPolling: () => void
  /** Cancel payment function */
  cancelPayment: (reason?: string) => Promise<void>
  /** Reset all states */
  reset: () => void
}

export const useVietQRPayment = (
  options: UseVietQRPaymentOptions = {}
): UseVietQRPaymentReturn => {
  const {
    pollingInterval = 5000,
    autoPolling = true,
    onSuccess,
    onFailure,
    onExpired
  } = options

  // States
  const [paymentData, setPaymentData] = useState<VietQRPaymentResponse | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<VietQRPaymentStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [isPolling, setIsPolling] = useState(false)

  // Refs for intervals
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Clear all intervals
   */
  const clearIntervals = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  /**
   * Calculate countdown from expiry time
   */
  const calculateCountdown = useCallback((expiresAt: string): number => {
    const expiryTime = new Date(expiresAt).getTime()
    const now = Date.now()
    const diff = Math.floor((expiryTime - now) / 1000)
    return Math.max(0, diff)
  }, [])

  /**
   * Start countdown timer
   */
  const startCountdown = useCallback(
    (expiresAt: string) => {
      // Clear existing countdown
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }

      // Set initial countdown
      setCountdown(calculateCountdown(expiresAt))

      // Start countdown interval
      countdownIntervalRef.current = setInterval(() => {
        const remaining = calculateCountdown(expiresAt)
        setCountdown(remaining)

        if (remaining <= 0) {
          clearInterval(countdownIntervalRef.current!)
          countdownIntervalRef.current = null
          onExpired?.()
        }
      }, 1000)
    },
    [calculateCountdown, onExpired]
  )

  /**
   * Poll payment status
   */
  const pollPaymentStatus = useCallback(
    async (transactionId: string) => {
      try {
        const response = await getVietQRPaymentStatus(transactionId)
        const status = response.data

        setPaymentStatus(status)

        // Check if payment is completed
        if (status.status === 'COMPLETED') {
          clearIntervals()
          setIsPolling(false)
          onSuccess?.(status)
        } else if (status.status === 'CANCELLED' || status.status === 'EXPIRED') {
          clearIntervals()
          setIsPolling(false)
          if (status.status === 'EXPIRED') {
            onExpired?.()
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err)
        // Continue polling on error, don't stop
      }
    },
    [clearIntervals, onSuccess, onExpired]
  )

  /**
   * Start polling payment status
   */
  const startPolling = useCallback(() => {
    if (!paymentData?.transactionId || isPolling) return

    setIsPolling(true)

    // Poll immediately
    pollPaymentStatus(paymentData.transactionId)

    // Then poll at intervals
    pollingIntervalRef.current = setInterval(() => {
      pollPaymentStatus(paymentData.transactionId)
    }, pollingInterval)
  }, [paymentData, isPolling, pollPaymentStatus, pollingInterval])

  /**
   * Stop polling payment status
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  /**
   * Create VietQR payment
   */
  const createPayment = useCallback(
    async (request: VietQRPaymentRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await createVietQRPayment(request)

        if (!response.data.success) {
          throw new Error(response.data.errorMessage || 'Failed to create payment')
        }

        setPaymentData(response.data)

        // Start countdown timer
        startCountdown(response.data.expiresAt)

        // Auto start polling if enabled
        if (autoPolling) {
          // Wait a bit before starting polling
          setTimeout(() => {
            setIsPolling(true)
            pollPaymentStatus(response.data.transactionId)

            pollingIntervalRef.current = setInterval(() => {
              pollPaymentStatus(response.data.transactionId)
            }, pollingInterval)
          }, 2000) // Wait 2 seconds before first poll
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment'
        setError(errorMessage)
        onFailure?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [autoPolling, pollingInterval, startCountdown, pollPaymentStatus, onFailure]
  )

  /**
   * Cancel VietQR payment
   */
  const cancelPayment = useCallback(
    async (reason?: string) => {
      if (!paymentData?.transactionId) return

      setIsLoading(true)
      setError(null)

      try {
        await cancelVietQRPayment(paymentData.transactionId, reason)

        // Stop polling and countdown
        clearIntervals()
        setIsPolling(false)

        // Update status
        if (paymentStatus) {
          setPaymentStatus({
            ...paymentStatus,
            status: 'CANCELLED'
          })
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel payment'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [paymentData, paymentStatus, clearIntervals]
  )

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    clearIntervals()
    setPaymentData(null)
    setPaymentStatus(null)
    setIsLoading(false)
    setError(null)
    setCountdown(0)
    setIsPolling(false)
  }, [clearIntervals])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearIntervals()
    }
  }, [clearIntervals])

  return {
    paymentData,
    paymentStatus,
    isLoading,
    error,
    countdown,
    isPolling,
    createPayment,
    startPolling,
    stopPolling,
    cancelPayment,
    reset
  }
}

export default useVietQRPayment
