import axiosClient from '~/lib/axios'
import type { UserApiResponse } from '~/types/user.type'

// ===== API URLs =====
const BASE_URL = '/api'

export const URL_USERS = `${BASE_URL}/users`

// ===== User API =====
export const userApi = {
  /**
   * Get all users
   */
  getAllUsers: async () => {
    const response = await axiosClient.get<UserApiResponse[]>(URL_USERS)
    return response.data
  }
}
