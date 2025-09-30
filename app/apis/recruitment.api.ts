import axiosClient from '~/lib/axios'
import type { RecruitmentResponse } from '~/types/recruitment.type'

export const URL_RECRUITMENT_POSTS = '/recruitment-posts'

export const recruitmentApi = {
  getRecruitments: async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }) => {
    const response = await axiosClient.get<RecruitmentResponse>(URL_RECRUITMENT_POSTS, {
      params: { page, pageSize }
    })
    console.log(response)
    return response.data
  }
}
