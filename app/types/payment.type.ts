/**
 * Sepay Payment Types
 * Based on InkspireBE Sepay API implementation
 */

/**
 * Transaction status enum
 */
export enum SepayTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

/**
 * Request model for creating a Sepay payment
 * Note: Using PascalCase to match BE model (BE doesn't use camelCase)
 */
export interface SepayPaymentRequest {
  /**
   * User ID initiating the payment
   */
  UserId: string

  /**
   * Payment amount in VND
   */
  Amount: number

  /**
   * Order information/description
   */
  OrderInfo: string

  /**
   * Additional description (optional)
   */
  Description?: string

  /**
   * Payment expiry time in minutes (default: 15 minutes)
   */
  ExpiryMinutes?: number
}

/**
 * Response model for Sepay payment creation
 */
export interface SepayPaymentResponse {
  /**
   * Success status
   */
  success: boolean

  /**
   * Transaction ID in our system
   */
  transactionId: string

  /**
   * Transaction reference code - used as transfer content
   * Format: INKSPIRE{YYYYMMDDHHMMSS}{RANDOM}
   */
  transactionRef: string

  /**
   * QR code image URL from VietQR
   */
  qrCodeUrl: string

  /**
   * Bank account number (TPBank via Sepay)
   */
  accountNumber: string

  /**
   * Account holder name
   */
  accountName: string

  /**
   * Bank name (TPBank)
   */
  bankName: string

  /**
   * Transfer content (same as TransactionRef)
   * Must use this as transfer description
   */
  transferContent: string

  /**
   * Payment amount
   */
  amount: number

  /**
   * Expiry time (ISO 8601 format)
   */
  expiresAt: string

  /**
   * Transaction status
   */
  status: SepayTransactionStatus

  /**
   * Error message if failed
   */
  errorMessage?: string
}

/**
 * Payment status response
 */
export interface SepayPaymentStatusResponse {
  /**
   * Transaction ID
   */
  transactionId: string

  /**
   * Transaction reference code
   */
  transactionRef: string

  /**
   * Current status
   */
  status: SepayTransactionStatus

  /**
   * Payment amount
   */
  amount: number

  /**
   * Order information
   */
  orderInfo: string

  /**
   * Created timestamp
   */
  createdAt: string

  /**
   * Confirmed timestamp (if completed)
   */
  confirmedAt?: string

  /**
   * Expiry timestamp
   */
  expiresAt: string

  /**
   * Bank transaction reference from Sepay
   */
  bankTransactionRef?: string

  /**
   * Confirmation note
   */
  confirmationNote?: string
}

/**
 * Bank information response
 */
export interface SepayBankInfo {
  /**
   * Bank code (TPBank: 970423)
   */
  bankCode: string

  /**
   * Bank name
   */
  bankName: string

  /**
   * Account number
   */
  accountNumber: string

  /**
   * Account holder name
   */
  accountName: string
}

/**
 * API Response wrapper
 */
export interface SepayApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errorMessage?: string
}

/**
 * Transaction list request
 */
export interface SepayTransactionListRequest {
  status?: SepayTransactionStatus
  page?: number
  pageSize?: number
}

/**
 * Transaction list response
 */
export interface SepayTransactionListResponse {
  items: SepayPaymentStatusResponse[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
