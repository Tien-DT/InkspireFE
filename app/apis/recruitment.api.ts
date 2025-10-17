import axiosClient from '~/lib/axios'
import type {
  RecruitmentResponse,
  CreateRecruitmentRequest,
  CreateRecruitmentResponse,
  CategoriesResponse,
  SkillsResponse,
  ApplicationsResponse
} from '~/types/recruitment.type'

interface Skill {
  id: string
  name: string
  [key: string]: unknown
}

export const URL_RECRUITMENT_POSTS = '/api/recruitment-posts'
export const URL_RECRUITMENT_POSTS_PAGINATED = `${URL_RECRUITMENT_POSTS}/paginated`
export const URL_RECRUITMENT_POSTS_BY_USER = `${URL_RECRUITMENT_POSTS}/user`
export const URL_RECRUITMENT_CATEGORIES = '/api/recruitment-categories'
export const URL_SKILLS = '/api/skills'
export const URL_APPLICATIONS = '/api/applications'
export const URL_UPLOAD_CV = '/api/files/upload-cv'
export const URL_APPLY_JOB = '/api/user-cvs/apply'
export const URL_RECRUITMENT_APPLICATIONS = '/api/user-cvs/recruitment-post'

export const recruitmentApi = {
  getRecruitments: async ({ 
    page = 1, 
    pageSize = 10, 
    keyword, 
    category, 
    minBudget, 
    maxBudget 
  }: { 
    page: number
    pageSize: number
    keyword?: string
    category?: string
    minBudget?: number
    maxBudget?: number
  }) => {
    const params: Record<string, unknown> = { page, pageSize }
    
    if (keyword) params.keyword = keyword
    if (category && category !== 'all') params.category = category
    if (minBudget !== undefined) params.minBudget = minBudget
    if (maxBudget !== undefined) params.maxBudget = maxBudget

    const response = await axiosClient.get<RecruitmentResponse>(URL_RECRUITMENT_POSTS_PAGINATED, {
      params
    })
    return response.data
  },

  getRecruitmentById: async (id: string) => {
    const response = await axiosClient.get<{
      success: boolean
      message: string
      data: {
        id: string
        title: string
        description: string
        projectName: string
        duration: string
        budget: number
        teamSize: string
        postExpired: string
        startTime: string
        endTime: string
        createdAt: string
        updatedAt: string
        status: number
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
        }
        project: {
          id: string
          title: string
          description: string
        }
        skills: Array<{
          id: string
          name: string
        }>
        categories: Array<{
          id: string
          title: string
          description: string
        }>
      }
    }>(`${URL_RECRUITMENT_POSTS}/${id}`)
    return response.data
  },

  getUserRecruitments: async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }) => {
    const response = await axiosClient.get<RecruitmentResponse>(`${URL_RECRUITMENT_POSTS}/user`, {
      params: { page, pageSize }
    })
    return response.data
  },

  getUserRecruitmentsByUserId: async (userId: string) => {
    const response = await axiosClient.get<{
      success: boolean
      message: string
      data: Array<{
        id: string
        title: string
        description: string
        projectName: string
        budget: number
        teamSize: string
        createdAt: string
        status: number
        skills: Array<{
          id: string
          name: string
        }>
      }>
    }>(`${URL_RECRUITMENT_POSTS_BY_USER}/${userId}`)
    console.log('recruitment: ', response.data)
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
  },

  // Step 1: Upload CV file to Supabase
  uploadCV: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosClient.post<{
      success: boolean
      message: string
      data: {
        fileUrl: string
        fileName: string
        originalFileName: string
        fileSize: number
        contentType: string
        uploadedAt: string
      }
    }>(URL_UPLOAD_CV, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Step 2: Submit application with CV URL
  submitApplication: async (data: {
    userId: string
    recruitmentPostId: string
    cvFileUrl: string
    coverLetter: string
  }) => {
    const response = await axiosClient.post<{
      success: boolean
      message: string
      data: {
        id: string
        userId: string
        recruitmentPostId: string
        cvFileUrl: string
        coverLetter: string
        createdAt: string
        updatedAt: string
        status: number
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
        }
        recruitmentPost: {
          id: string
          title: string
          description: string
          projectName: string
          budget: number
          teamSize: string
          createdAt: string
          status: number
          skills: Skill[]
          userName: string
        }
      }
    }>(URL_APPLY_JOB, data)
    return response.data
  },

  // Get applications for a recruitment post
  getRecruitmentApplications: async (
    recruitmentPostId: string,
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}
  ) => {
    const response = await axiosClient.get<ApplicationsResponse>(
      `${URL_RECRUITMENT_APPLICATIONS}/${recruitmentPostId}`,
      {
        params: { page, pageSize }
      }
    )
    return response.data
  }
}
