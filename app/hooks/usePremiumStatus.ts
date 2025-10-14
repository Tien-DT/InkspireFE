import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '~/apis/subscription.api'

export const usePremiumStatus = (userId: string | undefined, isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ['premium-status', userId],
    queryFn: async () => {
      if (!userId) return false
      
      try {
        const subscriptions = await subscriptionApi.getActiveSubscriptions(userId)
        // User has premium if they have any active subscription
        return subscriptions && subscriptions.length > 0
      } catch (error) {
        console.error('Failed to fetch premium status:', error)
        return false
      }
    },
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes (formerly cacheTime)
  })
}
