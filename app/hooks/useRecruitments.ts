import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { RecruitmentResponse, ApplicationsResponse } from '~/types/recruitment.type'

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
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}

export const useUserRecruitments = (page: number, pageSize: number) => {
  return useQuery<RecruitmentResponse>({
    queryKey: ['user-recruitments', page, pageSize],
    queryFn: () => recruitmentApi.getUserRecruitments({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}

export const useUserRecruitmentsByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-recruitments-by-id', userId],
    queryFn: () => recruitmentApi.getUserRecruitmentsByUserId(userId!),
    enabled: !!userId,
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
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
