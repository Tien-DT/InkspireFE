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
    // staleTime: 1000 * 60 * 5, // OLD: 5 minutes
    // refetchOnWindowFocus: true // OLD: refetch on window focus
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds (wallet balance needs frequent updates)
  })
}
