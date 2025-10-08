import axiosClient from '~/lib/axios'

export const URL_WALLETS = '/api/wallets'

export interface Wallet {
  id: string
  userId: string
  balance: number
  balanceFreeze: number
  currency: string
  updatedAt: string
  status: number
}

export interface WalletResponse {
  success: boolean
  message: string
  data: Wallet
}

export const walletApi = {
  getWalletByUserId: async (userId: string): Promise<WalletResponse> => {
    const response = await axiosClient.get<WalletResponse>(`${URL_WALLETS}/user/${userId}`)
    return response.data
  }
}
