import axios from 'axios'
import type { Notification } from '~/types/notification'
import { getAccessTokenFromLS } from '~/utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors?: string[]
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = getAccessTokenFromLS()
  if (!token) {
    throw new Error('No authentication token found')
  }
  return {
    Authorization: `Bearer ${token}`
  }
}

export const notificationApi = {
  // Get current user's notifications
  async getMyNotifications(page: number = 1, pageSize: number = 20) {
    const response = await axios.get<ApiResponse<Notification[]>>(
      `${API_URL}/api/notifications/my-notifications`,
      {
        params: { page, pageSize },
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Get unread notifications
  async getUnreadNotifications() {
    const response = await axios.get<ApiResponse<Notification[]>>(
      `${API_URL}/api/notifications/unread`,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Get unread count
  async getUnreadCount() {
    const response = await axios.get<ApiResponse<number>>(
      `${API_URL}/api/notifications/unread-count`,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const response = await axios.put<ApiResponse<any>>(
      `${API_URL}/api/notifications/${notificationId}/mark-read`,
      {},
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await axios.put<ApiResponse<any>>(
      `${API_URL}/api/notifications/mark-all-read`,
      {},
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Register FCM token
  async registerFcmToken(fcmToken: string) {
    const response = await axios.post<ApiResponse<any>>(
      `${API_URL}/api/notifications/register-token`,
      { fcmToken },
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  },

  // Delete notification
  async deleteNotification(notificationId: string) {
    const response = await axios.delete<ApiResponse<any>>(
      `${API_URL}/api/notifications/${notificationId}`,
      {
        headers: getAuthHeaders()
      }
    )
    return response.data
  }
}
