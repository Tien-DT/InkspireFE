import axiosClient from '~/lib/axios'
import type { ProjectStatus } from '~/types/recruitment.type'

export const URL_PROJECTS = '/api/projects'
export const URL_PROJECT_MILESTONES = '/api/project-milestones'
export const URL_FILE_EVALUATIONS = '/api/file-evaluations'

export interface CreateProjectPayload {
  clientId?: string | null
  title: string
  description: string
  category: string
  budgetMin?: number | null
  budgetMax?: number | null
  currency?: string | null
  deadline?: string | null
  status?: number | null
}

export interface UpdateProjectByRecruitmentPayload {
  recruitmentPostId: string
  freelancerId: string
  status?: ProjectStatus
}

export interface UpdateProjectPayload {
  status?: number
  title?: string
  description?: string
  category?: string
  budgetMin?: number
  budgetMax?: number
  deadline?: string
}

export interface Project {
  id: string
  title: string
  description: string
  category?: string
  budgetMin?: number
  budgetMax?: number
  deadline?: string
  createdAt: string
  updatedAt?: string
  status: number
  recruitmentPostId?: string
  freelancerId?: string
  clientName?: string
  freelancerName?: string
  client?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  freelancer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface ProjectResponse {
  success: boolean
  message: string
  data: Project
}

export interface ProjectsResponse {
  success: boolean
  message: string
  data: Project[]
}

export interface GetMilestonesResponse {
  success: boolean
  message: string
  data: Milestone[]
}

export interface CreateMilestonePayload {
  projectId: string
  title: string
  description: string
  milestoneNumber: number
  budget: number
  deadline: string
  paymentStatus?: string
  status?: number
}

export interface UpdateMilestonePayload {
  budget?: number
  status?: number
  title?: string
  description?: string
  deadline?: string
  paymentStatus?: string
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  description: string
  milestoneNumber: number
  budget: number
  deadline: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  status: number
  fileUrl?: string
  escrows: unknown[]
}

export interface MilestoneResponse {
  success: boolean
  message: string
  data: Milestone
}

export const projectApi = {
  createProject: async (body: CreateProjectPayload) => {
    const response = await axiosClient.post(URL_PROJECTS, body)
    return response.data
  },

  updateProjectByRecruitment: async (recruitmentPostId: string, body: UpdateProjectByRecruitmentPayload) => {
    const response = await axiosClient.patch(`${URL_PROJECTS}/by-recruitment/${recruitmentPostId}`, body)
    return response.data
  },

  updateProject: async (projectId: string, payload: UpdateProjectPayload): Promise<ProjectResponse> => {
    const response = await axiosClient.patch<ProjectResponse>(`${URL_PROJECTS}/${projectId}`, payload)
    return response.data
  },

  getProjectsByClientId: async (clientId: string): Promise<ProjectsResponse> => {
    const response = await axiosClient.get(`${URL_PROJECTS}/clients/${clientId}`)
    return response.data
  },

  getProjectsByFreelancerId: async (freelancerId: string): Promise<ProjectsResponse> => {
    const response = await axiosClient.get(`${URL_PROJECTS}/freelancers/${freelancerId}`)
    return response.data
  },

  getProjectById: async (projectId: string): Promise<ProjectResponse> => {
    const response = await axiosClient.get(`${URL_PROJECTS}/${projectId}`)
    return response.data
  },

  createMilestone: async (payload: CreateMilestonePayload): Promise<MilestoneResponse> => {
    const response = await axiosClient.post<MilestoneResponse>(URL_PROJECT_MILESTONES, payload)
    return response.data
  },

  updateMilestone: async (milestoneId: string, payload: UpdateMilestonePayload): Promise<MilestoneResponse> => {
    const response = await axiosClient.patch<MilestoneResponse>(`${URL_PROJECT_MILESTONES}/${milestoneId}`, payload)
    return response.data
  },

  getMilestonesByProject: async (projectId: string): Promise<GetMilestonesResponse> => {
    const response = await axiosClient.get<GetMilestonesResponse>(`${URL_PROJECT_MILESTONES}/projects/${projectId}`)
    return response.data
  },

  uploadMilestoneDocument: async ({ milestoneId, file }: { milestoneId: string; file: File }): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosClient.post(`${URL_PROJECT_MILESTONES}/${milestoneId}/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  evaluateMilestoneFile: async ({ requirementText, file }: { requirementText: string; file: File }): Promise<any> => {
    const formData = new FormData()
    formData.append('requirementText', requirementText)
    formData.append('file', file)

    const response = await axiosClient.post(`${URL_FILE_EVALUATIONS}/evaluate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  evaluateMilestoneFileByUrl: async (body: {
    requirementText: string
    fileUrl: string
    fileName: string
    contentType: string
  }): Promise<any> => {
    const response = await axiosClient.post(`${URL_FILE_EVALUATIONS}/evaluate-url`, body)
    return response.data
  },

  submitComplaint: async (milestoneId: string, body: { requirementText: string; contentType?: string }): Promise<any> => {
    const response = await axiosClient.post(`${URL_PROJECT_MILESTONES}/${milestoneId}/complaints`, body)
    return response.data
  },

  getComplaint: async (complaintId: string): Promise<any> => {
    const response = await axiosClient.get(`${URL_PROJECT_MILESTONES}/complaints/${complaintId}`)
    return response.data
  },

  getMilestoneComplaints: async (milestoneId: string): Promise<any> => {
    const response = await axiosClient.get(`${URL_PROJECT_MILESTONES}/${milestoneId}/complaints`)
    return response.data
  },

  retryComplaint: async (complaintId: string): Promise<any> => {
    const response = await axiosClient.post(`${URL_PROJECT_MILESTONES}/complaints/${complaintId}/retry`)
    return response.data
  },

  checkPostLimit: async (
    userId: string
  ): Promise<{
    success: boolean
    message: string
    data: {
      canPost: boolean
      isPremium: boolean
      projectsThisMonth: number
      limit: number | null
      remaining: number | null
    }
  }> => {
    const response = await axiosClient.get(`${URL_PROJECTS}/check-limit/${userId}`)
    return response.data
  },

  getProjectCountThisMonth: async (
    userId: string
  ): Promise<{
    success: boolean
    message: string
    data: number
  }> => {
    const response = await axiosClient.get(`${URL_PROJECTS}/count/user/${userId}/current-month`)
    return response.data
  }
}
