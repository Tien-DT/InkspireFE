import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { userCVApi } from '~/apis/userCV.api'
import type { UserCVsResponse } from '~/types/userCV.type'
import { signalRNotificationService } from '~/lib/signalr-notification'

export const useUserApplications = (userId: string | undefined, page: number = 1, pageSize: number = 100) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!userId) return

    const handleCVSubmitted = (cv: any) => {
      console.log('[useUserApplications] CVSubmitted event:', cv)
      if (cv.userId === userId) {
        queryClient.invalidateQueries({ queryKey: ['user-applications', userId] })
      }
    }

    const handleCVStatusChanged = (cvId: string, status: number) => {
      console.log('[useUserApplications] CVStatusChanged event:', cvId, status)
      queryClient.invalidateQueries({ queryKey: ['user-applications', userId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onCVSubmitted: handleCVSubmitted,
      onCVStatusChanged: handleCVStatusChanged
    })

    return () => {
      // Cleanup handled by service
    }
  }, [userId, queryClient])

  return useQuery<UserCVsResponse>({
    queryKey: ['user-applications', userId, page, pageSize],
    queryFn: () => userCVApi.getUserApplications(userId!, { page, pageSize }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useRecruitmentPostApplications = (
  recruitmentPostId: string | undefined,
  page: number = 1,
  pageSize: number = 10
) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!recruitmentPostId) return

    const handleCVSubmitted = (cv: any) => {
      console.log('[useRecruitmentPostApplications] CVSubmitted event:', cv)
      if (cv.recruitmentPostId === recruitmentPostId) {
        queryClient.invalidateQueries({ queryKey: ['recruitment-post-applications', recruitmentPostId] })
      }
    }

    const handleCVStatusChanged = (cvId: string, status: number) => {
      console.log('[useRecruitmentPostApplications] CVStatusChanged event:', cvId, status)
      queryClient.invalidateQueries({ queryKey: ['recruitment-post-applications', recruitmentPostId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onCVSubmitted: handleCVSubmitted,
      onCVStatusChanged: handleCVStatusChanged
    })

    return () => {
      // Cleanup handled by service
    }
  }, [recruitmentPostId, queryClient])

  return useQuery<UserCVsResponse>({
    queryKey: ['recruitment-post-applications', recruitmentPostId, page, pageSize],
    queryFn: () => userCVApi.getRecruitmentPostApplications(recruitmentPostId!, { page, pageSize }),
    enabled: !!recruitmentPostId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}
