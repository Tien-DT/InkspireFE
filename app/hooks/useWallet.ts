import { useQuery } from '@tanstack/react-query'
import { walletApi, type Wallet } from '~/apis/wallet.api'

export const useWallet = (userId: string | undefined, enabled = true) => {
  return useQuery<Wallet | null>({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await walletApi.getWalletByUserId(userId)
      return response.data
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  })
}
