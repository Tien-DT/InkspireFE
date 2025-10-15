export enum ApplicationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  WITHDRAWN = 3
}

export interface SkillDto {
  id: string
  name: string
}

export interface UserSummaryDto {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface RecruitmentPostSummaryDto {
  id: string
  title: string | null
  description: string | null
  projectName: string | null
  duration: string | null
  budget: number | null
  teamSize: string | null
  postExpired: string | null
  createdAt: string | null
  status: number | null
  skills: SkillDto[]
  userName: string | null
}

export interface UserCVDto {
  id: string
  userId: string
  recruitmentPostId: string
  cvFileUrl: string | null
  coverLetter: string | null
  createdAt: string | null
  updatedAt: string | null
  status: number | null
  user: UserSummaryDto | null
  recruitmentPost: RecruitmentPostSummaryDto | null
}

export interface PagingResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNext?: boolean
  hasPrevious?: boolean
}

export interface UserCVsResponse {
  success: boolean
  message: string
  data: PagingResult<UserCVDto>
  pagination?: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface ApplyRequest {
  userId: string
  recruitmentPostId: string
  cvFileUrl: string
  coverLetter?: string
}
