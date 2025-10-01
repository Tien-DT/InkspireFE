// Auth Request Types
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
  user?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone_number?: string
    role?: number
    status?: number
    email_verified: boolean
    created_at?: string
    updated_at?: string
  }
}

export interface GoogleLoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone_number?: string
    role: number
    status: number
    email_verified: boolean
    created_at: string
    updated_at: string
  }
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
