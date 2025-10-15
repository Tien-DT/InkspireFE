import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import subscriptionApi, {
  type Subscription,
  type UserSubscription,
  type PurchaseSubscriptionRequest
} from '~/apis/subscription.api'
import { useProfile } from './useProfile'

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionApi.getSubscriptions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export function useUserSubscriptions() {
  const { data: profile } = useProfile()

  return useQuery({
    queryKey: ['userSubscriptions', profile?.id],
    queryFn: () => subscriptionApi.getUserSubscriptions(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

export function useActiveSubscriptions() {
  const { data: profile } = useProfile()

  return useQuery({
    queryKey: ['activeSubscriptions', profile?.id],
    queryFn: () => subscriptionApi.getActiveSubscriptions(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

export function usePurchaseSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionApi.purchaseSubscription,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Đang chuyển hướng đến trang thanh toán...')
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] })
        queryClient.invalidateQueries({ queryKey: ['activeSubscriptions'] })

        // Redirect to payment URL
        if (response.data.paymentUrl) {
          // Handle relative URLs
          if (response.data.paymentUrl.startsWith('/')) {
            window.location.href = window.location.origin + response.data.paymentUrl
          } else {
            window.location.href = response.data.paymentUrl
          }
        }
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Không thể mua gói đăng ký'
      toast.error(message)
    }
  })
}
