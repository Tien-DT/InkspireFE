export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  SUSPENDED = 2
}

export enum UserRole {
  CLIENT = 0,
  DESIGNER = 1,
  DEVELOPER = 2,
  MARKETER = 3,
  PROJECT_MANAGER = 4
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  role?: UserRole
  status?: UserStatus
  email_verified: boolean
  created_at?: string
  updated_at?: string
}
