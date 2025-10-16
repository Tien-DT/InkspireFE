// Auth Request Types
import type { AuthErrorCode } from '~/constants/auth.constants'
import type { User, UserRole, UserStatus } from '~/types/user.type'
export interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

export interface GoogleLoginRequest {
  idToken: string
  firstName?: string | null
  lastName?: string | null
  rememberMe?: boolean
  role?: UserRole
}
//
export interface RegisterRequest {
  email: string
  password: string
  phoneNumber?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  status?: UserStatus
}

// Auth Response Types
export interface LoginResponse {
  access_token: string
  refresh_token: string
  status: number
  email_verified: boolean
  user?: User
}

export interface GoogleLoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterResponse {
  message: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface AuthError extends ApiError {
  code: AuthErrorCode // Using enum instead of union type
  response?: {
    data?: {
      message?: string
      error?: string
    }
    status?: number
  }
}

// Auth State Types
export type TokenPayload = {
  sub: string
  email: string
  role: UserRole
  exp: number
}

export type AuthState = {
  isAuthenticated: boolean
  user: User | null
  role: UserRole | null
}
