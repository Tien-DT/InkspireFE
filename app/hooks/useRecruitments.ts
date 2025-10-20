import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useEffect } from 'react'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { RecruitmentResponse, ApplicationsResponse } from '~/types/recruitment.type'
import { signalRNotificationService } from '~/lib/signalr-notification'

interface RecruitmentFilters {
  page: number
  pageSize: number
  keyword?: string
  category?: string
  minBudget?: number
  maxBudget?: number
}

export const useRecruitments = (filters: RecruitmentFilters) => {
  const { page, pageSize, keyword, category, minBudget, maxBudget } = filters
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    const handleRecruitmentCreated = (recruitment: any) => {
      console.log('[useRecruitments] RecruitmentCreated event:', recruitment)
      queryClient.invalidateQueries({ queryKey: ['recruitments'] })
    }

    const handleRecruitmentUpdated = (recruitment: any) => {
      console.log('[useRecruitments] RecruitmentUpdated event:', recruitment)
      queryClient.invalidateQueries({ queryKey: ['recruitments'] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onRecruitmentCreated: handleRecruitmentCreated,
      onRecruitmentUpdated: handleRecruitmentUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [queryClient])

  return useQuery<RecruitmentResponse>({
    queryKey: ['recruitments', page, pageSize, keyword, category, minBudget, maxBudget],
    queryFn: () =>
      recruitmentApi.getRecruitments({
        page,
        pageSize,
        ...(keyword && { keyword }),
        ...(category && category !== 'all' && { category }),
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget })
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useUserRecruitments = (page: number, pageSize: number) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    const handleRecruitmentCreated = (recruitment: any) => {
      console.log('[useUserRecruitments] RecruitmentCreated event:', recruitment)
      queryClient.invalidateQueries({ queryKey: ['user-recruitments'] })
    }

    const handleRecruitmentUpdated = (recruitment: any) => {
      console.log('[useUserRecruitments] RecruitmentUpdated event:', recruitment)
      queryClient.invalidateQueries({ queryKey: ['user-recruitments'] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onRecruitmentCreated: handleRecruitmentCreated,
      onRecruitmentUpdated: handleRecruitmentUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [queryClient])

  return useQuery<RecruitmentResponse>({
    queryKey: ['user-recruitments', page, pageSize],
    queryFn: () => recruitmentApi.getUserRecruitments({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useUserRecruitmentsByUserId = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!userId) return

    const handleRecruitmentCreated = (recruitment: any) => {
      console.log('[useUserRecruitmentsByUserId] RecruitmentCreated event:', recruitment)
      if (recruitment.userId === userId) {
        queryClient.invalidateQueries({ queryKey: ['user-recruitments-by-id', userId] })
      }
    }

    const handleRecruitmentUpdated = (recruitment: any) => {
      console.log('[useUserRecruitmentsByUserId] RecruitmentUpdated event:', recruitment)
      queryClient.invalidateQueries({ queryKey: ['user-recruitments-by-id', userId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onRecruitmentCreated: handleRecruitmentCreated,
      onRecruitmentUpdated: handleRecruitmentUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [userId, queryClient])

  return useQuery({
    queryKey: ['user-recruitments-by-id', userId],
    queryFn: () => recruitmentApi.getUserRecruitmentsByUserId(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useRecruitmentApplications = (
  recruitmentPostId: string | undefined,
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}
) => {
  const query = useQuery<ApplicationsResponse>({
    queryKey: ['recruitment-applications', recruitmentPostId, page, pageSize],
    queryFn: () => recruitmentApi.getRecruitmentApplications(recruitmentPostId!, { page, pageSize }),
    enabled: !!recruitmentPostId,
    placeholderData: keepPreviousData
  })

  // Debug: Log applications data
  if (query.data?.data?.items) {
    console.log(
      'Applications data:',
      query.data.data.items.map((app) => ({
        id: app.id,
        userName: `${app.user.firstName} ${app.user.lastName}`,
        status: app.status
      }))
    )
  }

  return query
}
