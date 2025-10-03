import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { RecruitmentResponse } from '~/types/recruitment.type'

export const useRecruitments = (page: number, pageSize: number) => {
  return useQuery<RecruitmentResponse>({
    queryKey: ['recruitments', page, pageSize],
    queryFn: () => recruitmentApi.getRecruitments({ page, pageSize }),
    placeholderData: keepPreviousData
  })
}
