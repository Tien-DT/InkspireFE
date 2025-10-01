// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  phoneNumber?: string
  firstName?: string
  lastName?: string
  role?: number
  status?: number
}

// Auth Response Types
export interface LoginResponse {
  access_token: string
  refresh_token: string
  status: number
  email_verified: boolean
}

export interface RegisterResponse {
  message: string
}

export interface AuthErrorResponse {
  error?: string
  message: string
}

// Role mapping constants
export const ROLE_MAP = {
  client: 0,
  designer: 1,
  developer: 2,
  marketer: 3,
  'project-manager': 4
} as const

export type RoleType = keyof typeof ROLE_MAP
