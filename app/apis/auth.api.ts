import axiosClient from '~/lib/axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GoogleLoginRequest,
  GoogleLoginResponse
} from '~/types/auth.type'
import type { User } from '~/types/user.type'

export const URL_LOGIN = '/api/auth/login'
export const URL_REGISTER = '/api/auth/register'
export const URL_LOGOUT = '/api/auth/logout'
export const URL_REFRESH_TOKEN = '/api/auth/refresh'
export const URL_GOOGLE_LOGIN = '/api/auth/google-login'
export const URL_PROFILE = '/api/auth/profile'
export const URL_UPDATE_PROFILE = '/api/auth/profile'

export const authApi = {
  register: async (body: RegisterRequest) => {
    const response = await axiosClient.post<RegisterResponse>(URL_REGISTER, body)
    return response.data
  },

  login: async (body: LoginRequest) => {
    const response = await axiosClient.post<LoginResponse>(URL_LOGIN, body)
    return response.data
  },

  googleLogin: async (body: GoogleLoginRequest) => {
    const response = await axiosClient.post<GoogleLoginResponse>(URL_GOOGLE_LOGIN, body)
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosClient.post<{ access_token: string; refresh_token?: string }>(URL_REFRESH_TOKEN, {
      refresh_token: refreshToken
    })
    return response.data
  },

  getProfile: async () => {
    const response = await axiosClient.get<User>(URL_PROFILE)
    return response.data
  },

  updateProfile: async (body: Partial<User>) => {
    const response = await axiosClient.put<User>(URL_UPDATE_PROFILE, body)
    return response.data
  },

  logout: async () => {
    const response = await axiosClient.post(URL_LOGOUT)
    return response.data
  }
}

export default authApi
