export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  SUSPENDED = 2
}

export enum UserRole {
  CLIENT = 1,
  FREELANCER = 2,
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

// API Response type that matches the backend structure
export interface UserApiResponse {
  id: string
  email: string
  emailVerified: boolean
  password: string
  phoneNumber: string
  firstName: string
  lastName: string
  role: number
  createdAt: string
  updatedAt?: string
  status: number
  wallets: unknown[]
  receipts: unknown[]
  transactions: unknown[]
  userSubscriptions: unknown[]
  portfolios: unknown[]
  userSkills: unknown[]
  ratingsGiven: unknown[]
  ratingsReceived: unknown[]
  socialPosts: unknown[]
  socialPostComments: unknown[]
  socialPostEmojis: unknown[]
  conversationMembers: unknown[]
  messagesSent: unknown[]
  attachments: unknown[]
  comics: unknown[]
  chapterComments: unknown[]
  notifications: unknown[]
  projectsAsClient: unknown[]
  projectUsers: unknown[]
  recruitmentPosts: unknown[]
  proposals: unknown[]
  userCVs: unknown[]
  userContractsAsFreelancer: unknown[]
  userContractsAsClient: unknown[]
  escrowsFunded: unknown[]
  thirdPartyAuthTokens: unknown[]
  refreshTokens: unknown[]
}
