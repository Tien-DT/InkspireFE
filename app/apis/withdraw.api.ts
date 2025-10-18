import axiosClient from '~/lib/axios'

export const URL_WITHDRAW_REQUESTS = '/api/WithdrawRequests'

export interface WithdrawRequest {
  id: string
  userId: string
  walletId: string
  amount: number
  netAmount: number
  platformFeeAmount: number
  platformFeePercentage: number
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  requestType: number // 1 = Manual, 2 = Automatic
  status: number // 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Completed
  createdAt: string
  approvedAt?: string
  approvedBy?: string
  completedAt?: string
  adminNotes?: string
  updatedAt?: string
}

export interface CreateWithdrawRequestDto {
  userId?: string
  amount: number
  useDefaultPayment: boolean
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
}

export interface WithdrawRequestsResponse {
  success: boolean
  message: string
  data: WithdrawRequest[]
}

export interface WithdrawRequestResponse {
  success: boolean
  message: string
  data: WithdrawRequest
}

export const withdrawApi = {
  // Get all withdraw requests for user
  getWithdrawRequests: async (userId: string): Promise<WithdrawRequest[]> => {
    const response = await axiosClient.get<WithdrawRequest[]>(
      `${URL_WITHDRAW_REQUESTS}?$filter=userId eq '${userId}'&$orderby=createdAt desc`
    )
    // Handle both array and OData response format
    if (Array.isArray(response.data)) {
      return response.data
    }
    return (response.data as any).value || []
  },

  // Get withdraw request by ID
  getWithdrawRequestById: async (id: string): Promise<WithdrawRequest> => {
    const response = await axiosClient.get<WithdrawRequest>(`${URL_WITHDRAW_REQUESTS}/${id}`)
    return response.data
  },

  // Create new withdraw request
  createWithdrawRequest: async (data: CreateWithdrawRequestDto): Promise<WithdrawRequest> => {
    const response = await axiosClient.post<WithdrawRequest>(URL_WITHDRAW_REQUESTS, data)
    return response.data
  }
}
