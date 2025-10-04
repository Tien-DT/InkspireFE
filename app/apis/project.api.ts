import axiosClient from '~/lib/axios'

export const URL_PROJECTS = '/api/projects'

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

export const projectApi = {
  createProject: async (body: CreateProjectPayload) => {
    const response = await axiosClient.post(URL_PROJECTS, body)
    return response.data
  }
}
