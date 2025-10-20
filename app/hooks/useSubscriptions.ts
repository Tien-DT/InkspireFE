import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import subscriptionApi from '~/apis/subscription.api'
import { useProfile } from './useProfile'
import { signalRNotificationService } from '~/lib/signalr-notification'

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionApi.getSubscriptions,
    staleTime: 1000 * 60 * 10, // 10 minutes - plans rarely change
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: false, // ❌ NO POLLING - plans are static
    refetchOnWindowFocus: false // Plans don't change often
  })
}

export function useUserSubscriptions() {
  const { data: profile } = useProfile()
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!profile?.id) return

    const handleSubscriptionChanged = (subscription: any) => {
      console.log('[useSubscriptions] SubscriptionChanged event:', subscription)
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions', profile.id] })
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions', profile.id] })
    }

    const handleSubscriptionExpired = (subscriptionId: string) => {
      console.log('[useSubscriptions] SubscriptionExpired event:', subscriptionId)
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions', profile.id] })
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions', profile.id] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onSubscriptionChanged: handleSubscriptionChanged,
      onSubscriptionExpired: handleSubscriptionExpired
    })

    return () => {
      // Cleanup handled by service
    }
  }, [profile?.id, queryClient])

  return useQuery({
    queryKey: ['userSubscriptions', profile?.id],
    queryFn: () => subscriptionApi.getUserSubscriptions(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export function useActiveSubscriptions() {
  const { data: profile } = useProfile()
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!profile?.id) return

    const handleSubscriptionChanged = (subscription: any) => {
      console.log('[useActiveSubscriptions] SubscriptionChanged event:', subscription)
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions', profile.id] })
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions', profile.id] })
    }

    const handleSubscriptionExpired = (subscriptionId: string) => {
      console.log('[useActiveSubscriptions] SubscriptionExpired event:', subscriptionId)
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptions', profile.id] })
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions', profile.id] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onSubscriptionChanged: handleSubscriptionChanged,
      onSubscriptionExpired: handleSubscriptionExpired
    })

    return () => {
      // Cleanup handled by service
    }
  }, [profile?.id, queryClient])

  return useQuery({
    queryKey: ['activeSubscriptions', profile?.id],
    queryFn: () => subscriptionApi.getActiveSubscriptions(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
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
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Không thể mua gói đăng ký'
      toast.error(message)
    }
  })
}
