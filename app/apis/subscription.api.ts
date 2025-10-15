import axiosClient from '~/lib/axios'

export interface Subscription {
  id: string
  title: string
  description?: string
  price: number
  type?: number
  status?: number
  createdAt?: string
  updatedAt?: string
}

export interface UserSubscription {
  id: string
  subscriptionId: string
  subscription?: Subscription
  userId: string
  startedDate?: string
  expiredDate?: string
  status?: number
  createdAt?: string
  updatedAt?: string
}

export interface PurchaseSubscriptionRequest {
  subscriptionId: string
  paymentMethod: string
  durationMonths?: number
}

export interface PurchaseSubscriptionWithWalletRequest {
  subscriptionId: string
  durationMonths?: number
}

export interface PurchaseSubscriptionResponse {
  userSubscriptionId: string
  paymentUrl: string
  transactionId: string
  paymentMethod: string
}

export interface PurchaseSubscriptionWithWalletResponse {
  message: string
  subscription: {
    id: string
    subscriptionId: string
    startDate: string
    endDate: string
    status: number
  }
  newWalletBalance: number
}

interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
  statusCode: number
}

const URL_SUBSCRIPTIONS = '/api/subscriptions'
const URL_USER_SUBSCRIPTIONS = '/api/user-subscriptions'

export const subscriptionApi = {
  // Get all available subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    const response = await axiosClient.get<Subscription[]>(URL_SUBSCRIPTIONS)
    return response.data
  },

  // Get subscription by ID
  getSubscriptionById: async (id: string): Promise<ApiResponse<Subscription>> => {
    const response = await axiosClient.get<ApiResponse<Subscription>>(`${URL_SUBSCRIPTIONS}/${id}`)
    return response.data
  },

  // Get user's subscriptions
  getUserSubscriptions: async (userId: string): Promise<UserSubscription[]> => {
    const response = await axiosClient.get<UserSubscription[]>(`${URL_USER_SUBSCRIPTIONS}/user/${userId}`)
    return response.data
  },

  // Get active subscriptions for a user
  getActiveSubscriptions: async (userId: string): Promise<UserSubscription[]> => {
    const response = await axiosClient.get<UserSubscription[]>(`${URL_USER_SUBSCRIPTIONS}/user/${userId}/active`)
    return response.data
  },

  // Purchase a subscription (only for clients)
  purchaseSubscription: async (
    request: PurchaseSubscriptionRequest
  ): Promise<ApiResponse<PurchaseSubscriptionResponse>> => {
    const response = await axiosClient.post<ApiResponse<PurchaseSubscriptionResponse>>(
      `${URL_SUBSCRIPTIONS}/purchase`,
      request
    )
    return response.data
  },

  // Purchase a subscription with wallet balance (only for clients)
  purchaseSubscriptionWithWallet: async (
    request: PurchaseSubscriptionWithWalletRequest
  ): Promise<ApiResponse<PurchaseSubscriptionWithWalletResponse>> => {
    const response = await axiosClient.post<ApiResponse<PurchaseSubscriptionWithWalletResponse>>(
      `${URL_SUBSCRIPTIONS}/purchase-with-wallet`,
      request
    )
    return response.data
  }
}

export default subscriptionApi
