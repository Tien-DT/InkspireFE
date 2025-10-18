import axiosClient from '~/lib/axios'

export const URL_USER_PAYMENTS = '/api/UserPayments'

export interface UserPayment {
  id: string
  userId: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  bankBranch?: string
  swiftCode?: string
  isDefault: boolean
  status: number
  createdAt: string
  updatedAt?: string
}

export interface CreateUserPaymentDto {
  userId?: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  bankBranch?: string
  swiftCode?: string
  isDefault: boolean
}

export interface UpdateUserPaymentDto {
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  bankBranch?: string
  swiftCode?: string
  isDefault: boolean
}

export interface UserPaymentsResponse {
  success: boolean
  message: string
  data: UserPayment[]
}

export interface UserPaymentResponse {
  success: boolean
  message: string
  data: UserPayment
}

export const userPaymentApi = {
  // Get all payment methods for current user
  getUserPayments: async (userId: string): Promise<UserPayment[]> => {
    const response = await axiosClient.get<UserPayment[]>(URL_USER_PAYMENTS, {
      headers: {
        'UserId': userId
      }
    })
    return response.data
  },

  // Get payment method by ID
  getPaymentById: async (id: string, userId: string): Promise<UserPayment> => {
    const response = await axiosClient.get<UserPayment>(`${URL_USER_PAYMENTS}/${id}`, {
      headers: {
        'UserId': userId
      }
    })
    return response.data
  },

  // Get default payment method
  getDefaultPayment: async (userId: string): Promise<UserPayment> => {
    const response = await axiosClient.get<UserPayment>(`${URL_USER_PAYMENTS}/default`, {
      headers: {
        'UserId': userId
      }
    })
    return response.data
  },

  // Create new payment method
  createPayment: async (data: CreateUserPaymentDto, userId: string): Promise<UserPayment> => {
    const response = await axiosClient.post<UserPayment>(URL_USER_PAYMENTS, {
      ...data,
      userId
    }, {
      headers: {
        'UserId': userId
      }
    })
    return response.data
  },

  // Update payment method
  updatePayment: async (id: string, data: UpdateUserPaymentDto, userId: string): Promise<void> => {
    await axiosClient.put(`${URL_USER_PAYMENTS}/${id}`, data, {
      headers: {
        'UserId': userId
      }
    })
  },

  // Delete payment method
  deletePayment: async (id: string, userId: string): Promise<void> => {
    await axiosClient.delete(`${URL_USER_PAYMENTS}/${id}`, {
      headers: {
        'UserId': userId
      }
    })
  },

  // Set payment method as default
  setDefaultPayment: async (id: string, userId: string): Promise<void> => {
    await axiosClient.put(`${URL_USER_PAYMENTS}/${id}/set-default`, {}, {
      headers: {
        'UserId': userId
      }
    })
  }
}
