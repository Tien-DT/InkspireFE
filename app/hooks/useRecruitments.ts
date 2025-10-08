import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { RecruitmentResponse, ApplicationsResponse } from '~/types/recruitment.type'

export const useRecruitments = (page: number, pageSize: number) => {
  return useQuery<RecruitmentResponse>({
    queryKey: ['recruitments', page, pageSize],
    queryFn: () => recruitmentApi.getRecruitments({ page, pageSize }),
    placeholderData: keepPreviousData
  })
}

export const useUserRecruitments = (page: number, pageSize: number) => {
  return useQuery<RecruitmentResponse>({
    queryKey: ['user-recruitments', page, pageSize],
    queryFn: () => recruitmentApi.getUserRecruitments({ page, pageSize }),
    placeholderData: keepPreviousData
  })
}

export const useUserRecruitmentsByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-recruitments-by-id', userId],
    queryFn: () => recruitmentApi.getUserRecruitmentsByUserId(userId!),
    enabled: !!userId
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
