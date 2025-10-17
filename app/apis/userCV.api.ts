import axiosClient from '~/lib/axios'
import type { UserCVsResponse, ApplyRequest } from '~/types/userCV.type'

export const URL_USER_CVS = '/api/user-cvs'
export const URL_USER_APPLICATIONS = (userId: string) => `${URL_USER_CVS}/user/${userId}`
export const URL_RECRUITMENT_APPLICATIONS = (recruitmentPostId: string) =>
  `${URL_USER_CVS}/recruitment-post/${recruitmentPostId}`

export const userCVApi = {
  // Get user's applications (đơn ứng tuyển của freelancer)
  getUserApplications: async (userId: string, { page = 1, pageSize = 100 }: { page?: number; pageSize?: number } = {}) => {
    const response = await axiosClient.get<UserCVsResponse>(URL_USER_APPLICATIONS(userId), {
      params: { page, pageSize }
    })
    return response.data
  },

  // Get applications for a recruitment post (đơn ứng tuyển cho một bài đăng)
  getRecruitmentPostApplications: async (
    recruitmentPostId: string,
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}
  ) => {
    const response = await axiosClient.get<UserCVsResponse>(URL_RECRUITMENT_APPLICATIONS(recruitmentPostId), {
      params: { page, pageSize }
    })
    return response.data
  },

  // Apply to a job
  apply: async (data: ApplyRequest) => {
    const response = await axiosClient.post<{ success: boolean; message: string; data: any }>(
      `${URL_USER_CVS}/apply`,
      data
    )
    return response.data
  },

  // Get CV by ID
  getCVById: async (id: string) => {
    const response = await axiosClient.get<{ success: boolean; message: string; data: any }>(`${URL_USER_CVS}/${id}`)
    return response.data
  },

  // Check if user has applied
  checkApplied: async (userId: string, recruitmentPostId: string) => {
    const response = await axiosClient.get<{ success: boolean; message: string; data: { hasApplied: boolean } }>(
      `${URL_USER_CVS}/check-applied`,
      {
        params: { userId, recruitmentPostId }
      }
    )
    return response.data
  },

  // Delete CV (withdraw application)
  deleteCV: async (userCVId: string, userId: string) => {
    const response = await axiosClient.delete<{ success: boolean; message: string }>(
      `${URL_USER_CVS}/${userCVId}`,
      {
        params: { userId }
      }
    )
    return response.data
  },

  // Update application status (accept/reject)
  updateApplicationStatus: async (userCVId: string, status: number) => {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: any }>(
      `${URL_USER_CVS}/${userCVId}`,
      { status }
    )
    return response.data
  }
}
