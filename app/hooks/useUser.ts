import { useQuery } from '@tanstack/react-query'
import { userApi, type UserProfileResponse } from '~/apis/user.api'
import { walletApi, type WalletResponse } from '~/apis/wallet.api'

/**
 * Custom hook to fetch user profile by userId
 * @param userId - User ID to fetch profile for
 * @returns React Query result with user profile data
 */
export const useUserProfile = (userId: string | undefined) => {
  return useQuery<UserProfileResponse>({
    queryKey: ['user-profile', userId],
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId, // Only fetch when userId is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  })
}

/**
 * Custom hook to fetch user wallet by userId
 * @param userId - User ID to fetch wallet for
 * @returns React Query result with wallet data
 */
export const useWallet = (userId: string | undefined) => {
  return useQuery<WalletResponse>({
    queryKey: ['wallet', userId],
    queryFn: () => walletApi.getWalletByUserId(userId!),
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
    retry: 1
  })
}
