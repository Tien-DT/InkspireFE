import { useQuery } from '@tanstack/react-query'
import { userCVApi } from '~/apis/userCV.api'
import type { UserCVsResponse } from '~/types/userCV.type'

export const useUserApplications = (userId: string | undefined, page: number = 1, pageSize: number = 100) => {
  return useQuery<UserCVsResponse>({
    queryKey: ['user-applications', userId, page, pageSize],
    queryFn: () => userCVApi.getUserApplications(userId!, { page, pageSize }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const useRecruitmentPostApplications = (
  recruitmentPostId: string | undefined,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery<UserCVsResponse>({
    queryKey: ['recruitment-post-applications', recruitmentPostId, page, pageSize],
    queryFn: () => userCVApi.getRecruitmentPostApplications(recruitmentPostId!, { page, pageSize }),
    enabled: !!recruitmentPostId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
