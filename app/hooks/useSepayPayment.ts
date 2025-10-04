/**
 * useSepayPayment Hook
 * Custom React hook for managing Sepay payment workflow
 * 
 * Features:
 * - Auto create payment when mounted
 * - Auto-polling payment status every 5 seconds
 * - Countdown timer for payment expiry
 * - Handle payment success/failure/expired
 * - Cancel payment functionality
 * - Clean up intervals on unmount
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { sepayApi } from '~/apis/payment.api'
import type {
  SepayPaymentRequest,
  SepayPaymentResponse,
  SepayPaymentStatusResponse,
  SepayTransactionStatus
} from '~/types/payment.type'

/**
 * Hook options
 */
export interface UseSepayPaymentOptions {
  /**
   * Polling interval in milliseconds (default: 5000ms = 5 seconds)
   */
  pollingInterval?: number

  /**
   * Enable auto-polling (default: true)
   */
  autoPolling?: boolean

  /**
   * Callback when payment is successful
   */
  onSuccess?: (status: SepayPaymentStatusResponse) => void

  /**
   * Callback when payment fails
   */
  onFailure?: (error: string) => void

  /**
   * Callback when payment expires
   */
  onExpired?: () => void

  /**
   * Callback when payment is cancelled
   */
  onCancelled?: () => void
}

/**
 * Hook return type
 */
export interface UseSepayPaymentReturn {
  /**
   * Payment data (QR code, bank info, etc.)
   */
  paymentData: SepayPaymentResponse | null

  /**
   * Current payment status
   */
  paymentStatus: SepayPaymentStatusResponse | null

  /**
   * Loading state
   */
  isLoading: boolean

  /**
   * Error message
   */
  error: string | null

  /**
   * Countdown in seconds until payment expires
   */
  countdown: number

  /**
   * Is currently polling for status
   */
  isPolling: boolean

  /**
   * Create a new payment
   */
  createPayment: (request: SepayPaymentRequest) => Promise<void>

  /**
   * Cancel the current payment
   */
  cancelPayment: () => Promise<void>

  /**
   * Reset the hook state
   */
  reset: () => void

  /**
   * Manually refresh payment status
   */
  refreshStatus: () => Promise<void>
}

/**
 * Custom hook for Sepay payment
 */
export function useSepayPayment(options: UseSepayPaymentOptions = {}): UseSepayPaymentReturn {
  const {
    pollingInterval = 5000,
    autoPolling = true,
    onSuccess,
    onFailure,
    onExpired,
    onCancelled
  } = options

  // State
  const [paymentData, setPaymentData] = useState<SepayPaymentResponse | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<SepayPaymentStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [isPolling, setIsPolling] = useState(false)

  // Refs for intervals
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasStartedPollingRef = useRef(false) // Track if polling already started

  /**
   * Calculate countdown from expiry time
   */
  const calculateCountdown = useCallback((expiresAt: string): number => {
    const now = new Date().getTime()
    const expiry = new Date(expiresAt).getTime()
    const diff = Math.floor((expiry - now) / 1000)
    return Math.max(0, diff)
  }, [])

  /**
   * Start countdown timer
   */
  const startCountdown = useCallback((expiresAt: string) => {
    // Clear existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Set initial countdown
    setCountdown(calculateCountdown(expiresAt))

    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      const remaining = calculateCountdown(expiresAt)
      setCountdown(remaining)

      if (remaining <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
        onExpired?.()
      }
    }, 1000)
  }, [calculateCountdown, onExpired])

  /**
   * Stop countdown timer
   */
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  /**
   * Refresh payment status
   */
  const refreshStatus = useCallback(async () => {
    if (!paymentData?.transactionId) return

    try {
      console.log('[useSepayPayment] Fetching payment status for:', paymentData.transactionId)
      const response = await sepayApi.getPaymentStatus(paymentData.transactionId)
      
      console.log('[useSepayPayment] API response:', {
        success: response.success,
        status: response.data?.status,
        fullData: response.data
      })
      
      if (response.success && response.data) {
        setPaymentStatus(response.data)

        // Handle status changes
        const status = response.data.status
        console.log('[useSepayPayment] Current status:', status)

        if (status === 'COMPLETED') {
          console.log('[useSepayPayment] Payment COMPLETED - stopping polling')
          setIsPolling(false)
          stopCountdown()
          onSuccess?.(response.data)
        } else if (status === 'EXPIRED') {
          console.log('[useSepayPayment] Payment EXPIRED - stopping polling')
          setIsPolling(false)
          stopCountdown()
          onExpired?.()
        } else if (status === 'CANCELLED') {
          console.log('[useSepayPayment] Payment CANCELLED - stopping polling')
          setIsPolling(false)
          stopCountdown()
          onCancelled?.()
        } else {
          console.log('[useSepayPayment] Payment still pending:', status)
        }
      } else {
        console.warn('[useSepayPayment] API returned success=false or no data')
      }
    } catch (err) {
      console.error('[useSepayPayment] Error refreshing payment status:', err)
    }
  }, [paymentData?.transactionId, onSuccess, onExpired, onCancelled, stopCountdown])

  /**
   * Start polling payment status
   */
  const startPolling = useCallback(() => {
    if (!autoPolling) return
    
    // Prevent multiple polling intervals
    if (pollingIntervalRef.current) {
      console.log('[useSepayPayment] Polling already active, skipping')
      return
    }

    console.log('[useSepayPayment] Starting polling interval')
    setIsPolling(true)

    // Poll immediately
    refreshStatus()

    // Then poll at interval
    pollingIntervalRef.current = setInterval(() => {
      refreshStatus()
    }, pollingInterval)
  }, [autoPolling, pollingInterval, refreshStatus])

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    console.log('[useSepayPayment] Stopping polling')
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsPolling(false)
    hasStartedPollingRef.current = false
  }, [])

  /**
   * Create a new payment
   */
  const createPayment = useCallback(async (request: SepayPaymentRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sepayApi.createPayment(request)

      if (response.success && response.data) {
        setPaymentData(response.data)
        setPaymentStatus({
          transactionId: response.data.transactionId,
          transactionRef: response.data.transactionRef,
          status: response.data.status as SepayTransactionStatus,
          amount: response.data.amount,
          orderInfo: request.OrderInfo, // PascalCase property name
          createdAt: new Date().toISOString(),
          expiresAt: response.data.expiresAt
        })

        // Start countdown
        startCountdown(response.data.expiresAt)

        // Polling will auto-start via useEffect when paymentData is set
      } else {
        const errorMsg = response.errorMessage || 'Failed to create payment'
        setError(errorMsg)
        onFailure?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg)
      onFailure?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [startCountdown, onFailure])

  /**
   * Cancel the current payment
   */
  const cancelPayment = useCallback(async () => {
    if (!paymentData?.transactionId) return

    setIsLoading(true)

    try {
      const response = await sepayApi.cancelPayment(paymentData.transactionId)

      if (response.success) {
        setPaymentStatus(prev => prev ? { ...prev, status: 'CANCELLED' as SepayTransactionStatus } : null)
        stopPolling()
        stopCountdown()
        onCancelled?.()
      }
    } catch (err) {
      console.error('Error cancelling payment:', err)
    } finally {
      setIsLoading(false)
    }
  }, [paymentData?.transactionId, stopPolling, stopCountdown, onCancelled])

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    stopPolling()
    stopCountdown()
    setPaymentData(null)
    setPaymentStatus(null)
    setError(null)
    setCountdown(0)
    hasStartedPollingRef.current = false
  }, [stopPolling, stopCountdown])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopPolling()
      stopCountdown()
    }
  }, [stopPolling, stopCountdown])

  /**
   * Auto-start polling when payment is created
   */
  useEffect(() => {
    if (paymentData && paymentStatus?.status === 'PENDING' && !hasStartedPollingRef.current) {
      console.log('[useSepayPayment] Payment created, starting auto-polling')
      hasStartedPollingRef.current = true
      startPolling()
    }
  }, [paymentData, paymentStatus?.status]) // Remove startPolling from deps

  return {
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
  }
}

export default useSepayPayment
