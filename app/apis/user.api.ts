import axiosClient from '~/lib/axios'
import type { UserApiResponse } from '~/types/user.type'

// API endpoints
const URL_GET_USER_BY_ID = '/api/users'

// Response types
export interface UserProfileResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    phoneNumber: string
    role: number
    status: number
    createdAt: string
  }
}

// API methods
export const userApi = {
  /**
   * Get user profile by userId
   * @param userId - User ID
   * @returns User profile data
   */
  getUserById: async (userId: string): Promise<UserProfileResponse> => {
    const response = await axiosClient.get<UserProfileResponse>(`${URL_GET_USER_BY_ID}/${userId}`)
    return response.data
  },

  /**
   * Get a list of all users
   */
  getAllUsers: async (): Promise<UserApiResponse[]> => {
    const response = await axiosClient.get<UserApiResponse[] | { value?: UserApiResponse[] }>(URL_GET_USER_BY_ID)
    const payload = response.data

    if (Array.isArray(payload)) {
      return payload
    }

    if (payload.value && Array.isArray(payload.value)) {
      return payload.value
    }

    return []
  }
}
