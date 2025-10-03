import axiosClient from '~/lib/axios'
import type {
  RecruitmentResponse,
  CreateRecruitmentRequest,
  CreateRecruitmentResponse,
  CategoriesResponse,
  SkillsResponse
} from '~/types/recruitment.type'

export const URL_RECRUITMENT_POSTS = '/recruitment-posts'
export const URL_RECRUITMENT_CATEGORIES = '/recruitment-categories'
export const URL_SKILLS = '/skills'

export const recruitmentApi = {
  getRecruitments: async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }) => {
    const response = await axiosClient.get<RecruitmentResponse>(URL_RECRUITMENT_POSTS, {
      params: { page, pageSize }
    })
    console.log(response)
    return response.data
  },

  createRecruitment: async (data: CreateRecruitmentRequest) => {
    const response = await axiosClient.post<CreateRecruitmentResponse>(URL_RECRUITMENT_POSTS, data)
    return response.data
  },

  getCategories: async () => {
    const response = await axiosClient.get<CategoriesResponse>(URL_RECRUITMENT_CATEGORIES)
    return response.data
  },

  getSkills: async () => {
    const response = await axiosClient.get<SkillsResponse>(URL_SKILLS)
    return response.data
  }
}
