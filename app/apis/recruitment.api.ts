import axiosClient from '~/lib/axios'
import type {
  RecruitmentResponse,
  CreateRecruitmentRequest,
  CreateRecruitmentResponse,
  CategoriesResponse,
  SkillsResponse
} from '~/types/recruitment.type'

export const URL_RECRUITMENT_POSTS = '/api/recruitment-posts'
export const URL_RECRUITMENT_POSTS_PAGINATED = `${URL_RECRUITMENT_POSTS}/paginated`
export const URL_RECRUITMENT_CATEGORIES = '/api/recruitment-categories'
export const URL_SKILLS = '/api/skills'
export const URL_APPLICATIONS = '/api/applications'

export const recruitmentApi = {
  getRecruitments: async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }) => {
    const response = await axiosClient.get<RecruitmentResponse>(URL_RECRUITMENT_POSTS_PAGINATED, {
      params: { page, pageSize }
    })
    return response.data
  },

  getUserRecruitments: async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }) => {
    const response = await axiosClient.get<RecruitmentResponse>(`${URL_RECRUITMENT_POSTS}/user`, {
      params: { page, pageSize }
    })
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
  },

  applyToJob: async (formData: FormData) => {
    const response = await axiosClient.post(URL_APPLICATIONS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
