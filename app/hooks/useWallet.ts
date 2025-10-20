import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { walletApi, type Wallet } from '~/apis/wallet.api'
import { signalRNotificationService } from '~/lib/signalr-notification'

export const useWallet = (userId: string | undefined, enabled = true) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time wallet updates
  useEffect(() => {
    if (!userId) return

    const handleWalletBalanceChanged = (newBalance: number, walletId: string) => {
      console.log('[useWallet] WalletBalanceChanged event:', newBalance, walletId)
      // Update query cache with new balance (optimistic update)
      queryClient.setQueryData(['wallet', userId], (old: Wallet | null | undefined) => {
        if (!old) return old
        return { ...old, balance: newBalance }
      })
      // Note: useNotificationRefetch hook will handle refetch when notification arrives
    }

    const handleTransactionCreated = (transaction: any) => {
      console.log('[useWallet] TransactionCreated event:', transaction)
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onWalletBalanceChanged: handleWalletBalanceChanged,
      onTransactionCreated: handleTransactionCreated
    })

    return () => {
      // No need to unregister - service handles multiple handlers
    }
  }, [userId, queryClient])

  return useQuery<Wallet | null>({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await walletApi.getWalletByUserId(userId)
      return response.data
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING - SignalR handles wallet updates!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}
