/**
 * VietQR Payment Types
 * Định nghĩa các interface cho VietQR payment API
 */

/**
 * Request model để tạo VietQR payment
 */
export interface VietQRPaymentRequest {
  /** User ID thực hiện thanh toán */
  userId: string
  /** Số tiền thanh toán (VND) */
  amount: number
  /** Thông tin đơn hàng (optional) */
  orderInfo?: string
  /** Mô tả thêm hiển thị trên QR (optional) */
  description?: string
  /** Template type cho QR code: compact, compact2, qr_only, print (default: compact2) */
  template?: 'compact' | 'compact2' | 'qr_only' | 'print'
  /** IP address của khách hàng */
  ipAddress?: string
  /** Thời gian hết hạn tính bằng phút (default: 15) */
  expiryMinutes?: number
}

/**
 * Response model khi tạo VietQR payment thành công
 */
export interface VietQRPaymentResponse {
  /** Trạng thái thành công */
  success: boolean
  /** Transaction ID trong hệ thống */
  transactionId: string
  /** Mã tham chiếu giao dịch - dùng làm nội dung chuyển khoản */
  transactionRef: string
  /** URL ảnh QR code */
  qrCodeUrl: string
  /** Số tài khoản ngân hàng */
  accountNumber: string
  /** Tên chủ tài khoản */
  accountName: string
  /** Tên ngân hàng */
  bankName: string
  /** Mã ngân hàng/BIN */
  bankCode: string
  /** Nội dung chuyển khoản */
  transferContent: string
  /** Số tiền thanh toán */
  amount: number
  /** Thời gian hết hạn */
  expiresAt: string
  /** Trạng thái giao dịch */
  status: string
  /** Thông báo lỗi nếu có */
  errorMessage?: string
}

/**
 * Response model cho trạng thái thanh toán VietQR
 */
export interface VietQRPaymentStatusResponse {
  /** Transaction ID */
  transactionId: string
  /** Mã tham chiếu giao dịch */
  transactionRef: string
  /** Trạng thái: PENDING, COMPLETED, CANCELLED, EXPIRED */
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  /** Số tiền thanh toán */
  amount: number
  /** Thông tin đơn hàng */
  orderInfo?: string
  /** Thời gian tạo */
  createdAt: string
  /** Thời gian xác nhận */
  confirmedAt?: string
  /** Thời gian hết hạn */
  expiresAt: string
  /** Đã hết hạn hay chưa */
  isExpired: boolean
  /** Ghi chú xác nhận */
  confirmationNote?: string
}

/**
 * Request model để xác nhận thanh toán VietQR (manual confirmation - admin only)
 */
export interface VietQRConfirmPaymentRequest {
  /** Mã tham chiếu giao dịch ngân hàng */
  confirmationCode?: string
  /** Ghi chú của admin */
  note?: string
  /** User ID người xác nhận (admin/staff) */
  confirmedBy?: string
}

/**
 * Thông tin ngân hàng VietQR
 */
export interface VietQRBankInfo {
  /** Mã BIN của ngân hàng */
  bankCode: string
  /** Tên ngân hàng */
  bankName: string
  /** Số tài khoản */
  accountNumber: string
  /** Tên chủ tài khoản */
  accountName: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  /** Dữ liệu trả về */
  data: T
  /** Thông báo */
  message?: string
  /** Trạng thái thành công */
  success?: boolean
  /** Mã lỗi */
  errorCode?: string
}
