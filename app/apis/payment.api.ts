/**
 * VietQR Payment API
 * Các function để tương tác với VietQR payment endpoints
 */

import axiosClient from '~/lib/axios'
import type {
  VietQRPaymentRequest,
  VietQRPaymentResponse,
  VietQRPaymentStatusResponse,
  VietQRConfirmPaymentRequest,
  VietQRBankInfo,
  ApiResponse
} from '~/types/payment.type'

const VIETQR_BASE_URL = '/api/vietqr'

/**
 * Tạo một giao dịch thanh toán VietQR mới và generate QR code
 * @param request - Chi tiết yêu cầu thanh toán
 * @returns Promise với thông tin thanh toán và QR code URL
 */
export const createVietQRPayment = async (
  request: VietQRPaymentRequest
): Promise<ApiResponse<VietQRPaymentResponse>> => {
  const response = await axiosClient.post<ApiResponse<VietQRPaymentResponse>>(
    `${VIETQR_BASE_URL}/payments`,
    request
  )
  return response.data
}

/**
 * Lấy trạng thái thanh toán theo transaction ID
 * @param transactionId - ID của giao dịch
 * @returns Promise với thông tin trạng thái thanh toán
 */
export const getVietQRPaymentStatus = async (
  transactionId: string
): Promise<ApiResponse<VietQRPaymentStatusResponse>> => {
  const response = await axiosClient.get<ApiResponse<VietQRPaymentStatusResponse>>(
    `${VIETQR_BASE_URL}/payments/${transactionId}`
  )
  return response.data
}

/**
 * Lấy trạng thái thanh toán theo transaction reference
 * @param transactionRef - Mã tham chiếu giao dịch
 * @returns Promise với thông tin trạng thái thanh toán
 */
export const getVietQRPaymentStatusByRef = async (
  transactionRef: string
): Promise<ApiResponse<VietQRPaymentStatusResponse>> => {
  const response = await axiosClient.get<ApiResponse<VietQRPaymentStatusResponse>>(
    `${VIETQR_BASE_URL}/payments/ref/${transactionRef}`
  )
  return response.data
}

/**
 * Xác nhận thanh toán thủ công (Admin only)
 * @param transactionId - ID của giao dịch
 * @param request - Chi tiết xác nhận
 * @returns Promise với kết quả xác nhận
 */
export const confirmVietQRPayment = async (
  transactionId: string,
  request: VietQRConfirmPaymentRequest
): Promise<ApiResponse<{ transactionId: string }>> => {
  const response = await axiosClient.put<ApiResponse<{ transactionId: string }>>(
    `${VIETQR_BASE_URL}/payments/${transactionId}/confirm`,
    request
  )
  return response.data
}

/**
 * Hủy giao dịch thanh toán
 * @param transactionId - ID của giao dịch
 * @param reason - Lý do hủy (optional)
 * @returns Promise với kết quả hủy
 */
export const cancelVietQRPayment = async (
  transactionId: string,
  reason?: string
): Promise<ApiResponse<{ transactionId: string }>> => {
  const response = await axiosClient.put<ApiResponse<{ transactionId: string }>>(
    `${VIETQR_BASE_URL}/payments/${transactionId}/cancel`,
    reason
  )
  return response.data
}

/**
 * Lấy thông tin tài khoản ngân hàng nhận thanh toán
 * @returns Promise với thông tin ngân hàng
 */
export const getVietQRBankInfo = async (): Promise<ApiResponse<VietQRBankInfo>> => {
  const response = await axiosClient.get<ApiResponse<VietQRBankInfo>>(
    `${VIETQR_BASE_URL}/bank-info`
  )
  return response.data
}

/**
 * Lấy danh sách giao dịch VietQR của user (có phân trang)
 * @param userId - ID của user
 * @param page - Số trang (default: 1)
 * @param pageSize - Số lượng items mỗi trang (default: 10)
 * @returns Promise với danh sách giao dịch
 */
export const getVietQRTransactions = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<{
  transactions: VietQRPaymentStatusResponse[]
  totalCount: number
  page: number
  pageSize: number
}>> => {
  const response = await axiosClient.get<ApiResponse<{
    transactions: VietQRPaymentStatusResponse[]
    totalCount: number
    page: number
    pageSize: number
  }>>(
    `${VIETQR_BASE_URL}/transactions`,
    {
      params: { userId, page, pageSize }
    }
  )
  return response.data
}

export default {
  createVietQRPayment,
  getVietQRPaymentStatus,
  getVietQRPaymentStatusByRef,
  confirmVietQRPayment,
  cancelVietQRPayment,
  getVietQRBankInfo,
  getVietQRTransactions
}
