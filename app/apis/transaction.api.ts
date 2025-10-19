import axiosClient from '~/lib/axios'

export const URL_TRANSACTIONS = '/api/transaction-records'

export interface TransactionRecord {
  id: string
  userId: string
  amount: number
  currency: string
  direction: string // "in" or "out"
  type: string
  relatedReceiptId?: string
  createdAt: string
  status: number
}

export interface TransactionsResponse {
  success: boolean
  message: string
  data: TransactionRecord[]
}

export interface PaginatedTransactionsResponse {
  success: boolean
  message: string
  data: TransactionRecord[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export const transactionApi = {
  getUserTransactions: async (userId: string): Promise<TransactionsResponse> => {
    const response = await axiosClient.get<TransactionsResponse>(`${URL_TRANSACTIONS}/user/${userId}`)
    return response.data
  },

  getUserTransactionsPaginated: async (
    userId: string,
    params: {
      page?: number
      pageSize?: number
      direction?: 'in' | 'out'
    } = {}
  ): Promise<PaginatedTransactionsResponse> => {
    const response = await axiosClient.get<PaginatedTransactionsResponse>(
      `${URL_TRANSACTIONS}/user/${userId}/paginated`,
      { params }
    )
    return response.data
  }
}
