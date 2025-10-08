export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT'
}

export enum ProjectStatus {
  DRAFT = 0,
  ACTIVE = 1,
  CLOSED = 2,
  COMPLETED = 3
}

// API Response Types
export interface RecruitmentCategory {
  id: string
  title: string
  description: string
}

export interface Skill {
  id: string
  name: string
  userSkills?: unknown[]
  recruitmentPostSkills?: unknown[]
}

export interface CategoriesResponse {
  success: boolean
  message: string
  data: RecruitmentCategory[]
}

export interface SkillsResponse {
  success: boolean
  message: string
  data: Skill[]
}

// Step 1 Data
export interface PostProjectStep1 {
  title: string
  category: string
  description: string
  budget: number
  startDate: string
  endDate: string
  skills: string[]
}

// Step 2 Data
export interface PostProjectStep2 {
  specialRequirements?: string
  experienceLevel: ExperienceLevel
  teamSize: number
  isUrgent?: boolean
  requireNDA?: boolean
  requireInterview?: boolean
}

// Combined data for submission
export interface CreateRecruitmentRequest {
  title: string
  projectName: string
  category: string
  description: string
  budget: number
  startDate: string
  endDate: string
  skills: string[]
  userId?: string
}

export interface CreateRecruitmentResponse {
  id: string
  title: string
  projectName: string
  message: string
  createdAt: string
}

export interface RecruitmentPost {
  id: string
  title: string
  description: string
  projectName: string
  budget: number
  teamSize: string
  startTime: string
  endTime: string
  createdAt: string
  status: number
  skills: Skill[]
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  project: {
    id: string
    projectName: string
    description: string
  }
  categories: RecruitmentCategory[]
}

export interface PaginationInfo {
  currentPage: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface RecruitmentResponse {
  success: boolean
  message: string
  data: RecruitmentPost[]
  pagination: PaginationInfo
}

// Application / Applicant Types
export interface Application {
  id: string
  userId: string
  recruitmentPostId: string
  cvFileUrl: string
  coverLetter: string
  createdAt: string
  updatedAt: string
  status: number
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface ApplicationsResponse {
  success: boolean
  message: string
  data: {
    items: Application[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
  }
}
