import { UserRole } from '~/types/user.type'

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND'
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email chưa được xác thực',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn',
  [AuthErrorCode.USER_NOT_FOUND]: 'Không tìm thấy tài khoản'
} as const

export type RoleType = 'client' | 'freelancer'

export const ROLE_MAP: Record<RoleType, UserRole> = {
  client: UserRole.CLIENT,
  freelancer: UserRole.FREELANCER
} as const
