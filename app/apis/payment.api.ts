/**
 * Sepay Payment API
 * API functions to interact with Sepay payment endpoints
 */

import axiosClient from '~/lib/axios'
import type {
  SepayPaymentRequest,
  SepayPaymentResponse,
  SepayPaymentStatusResponse,
  SepayBankInfo,
  SepayApiResponse,
  SepayTransactionListRequest,
  SepayTransactionListResponse
} from '~/types/payment.type'

/**
 * API Endpoints
 */
export const URL_SEPAY_PAYMENTS = '/api/sepay/payments'
export const URL_SEPAY_BANK_INFO = '/api/sepay/bank-info'
export const URL_SEPAY_TRANSACTIONS = '/api/sepay/transactions'

/**
 * Sepay Payment API
 */
export const sepayApi = {
  /**
   * Create a new Sepay payment transaction
   * POST /api/sepay/payments
   * @param request Payment request details
   * @returns Payment response with QR code and payment details
   */
  createPayment: async (request: SepayPaymentRequest) => {
    const response = await axiosClient.post<SepayApiResponse<SepayPaymentResponse>>(URL_SEPAY_PAYMENTS, request)
    return response.data
  },

  /**
   * Get payment status by transaction ID
   * GET /api/sepay/payments/{id}
   * @param transactionId Transaction ID (GUID)
   * @returns Payment status details
   */
  getPaymentStatus: async (transactionId: string) => {
    // Add timestamp to prevent caching
    const response = await axiosClient.get<SepayApiResponse<SepayPaymentStatusResponse>>(
      `${URL_SEPAY_PAYMENTS}/${transactionId}`,
      {
        params: { _t: Date.now() }
      }
    )
    return response.data
  },

  /**
   * Get payment status by transaction reference code
   * GET /api/sepay/payments/ref/{transactionRef}
   * @param transactionRef Transaction reference code (e.g., INKSPIRE20251003...)
   * @returns Payment status details
   */
  getPaymentStatusByRef: async (transactionRef: string) => {
    const response = await axiosClient.get<SepayApiResponse<SepayPaymentStatusResponse>>(
      `${URL_SEPAY_PAYMENTS}/ref/${transactionRef}`
    )
    return response.data
  },

  /**
   * Cancel a pending payment
   * DELETE /api/sepay/payments/{id}
   * @param transactionId Transaction ID (GUID)
   * @returns Success response
   */
  cancelPayment: async (transactionId: string) => {
    const response = await axiosClient.delete<SepayApiResponse<void>>(`${URL_SEPAY_PAYMENTS}/${transactionId}`)
    return response.data
  },

  /**
   * Get bank information (account details)
   * GET /api/sepay/bank-info
   * @returns Bank account information
   */
  getBankInfo: async () => {
    const response = await axiosClient.get<SepayApiResponse<SepayBankInfo>>(URL_SEPAY_BANK_INFO)
    return response.data
  },

  /**
   * Get transaction list with pagination and filter
   * GET /api/sepay/transactions?status=PENDING&page=1&pageSize=10
   * @param params Query parameters
   * @returns Paginated transaction list
   */
  getTransactions: async (params?: SepayTransactionListRequest) => {
    const response = await axiosClient.get<SepayApiResponse<SepayTransactionListResponse>>(URL_SEPAY_TRANSACTIONS, {
      params
    })
    return response.data
  }
}

export default sepayApi
