export enum ProposalStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  WITHDRAWN = 3
}

export interface Proposal {
  id: string
  projectId: string
  freelancerId: string
  coverLetter: string | null
  bidAmount: number | null
  bidCurrency: string | null
  bidDays: number | null
  createdAt: string
  updatedAt: string | null
  status: number | null
  project: {
    id: string
    clientId: string | null
    recruitmentPostId: string | null
    freelancerId: string | null
    title: string | null
    description: string | null
    category: string | null
    budgetMin: number | null
    budgetMax: number | null
    currency: string | null
    deadline: string | null
    createdAt: string | null
    updatedAt: string | null
    deletedAt: string | null
    status: number | null
    client?: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    recruitmentPost?: {
      id: string
      userId: string
      projectId: string
      budget: number | null
      title: string | null
      description: string | null
      projectName: string | null
      duration: string | null
      teamSize: string | null
      postExpired: string | null
      startTime: string | null
      endTime: string | null
      createdAt: string | null
      updatedAt: string | null
      deletedAt: string | null
      status: number | null
      recruitmentPostSkills?: Array<{
        id: string
        recruitmentPostId: string
        skillId: string
        skill: {
          id: string
          name: string
        }
      }>
      recruitmentPostCategories?: Array<{
        id: string
        recruitmentPostId: string
        recruitmentCategoryId: string
        recruitmentCategory: {
          id: string
          title: string
        }
      }>
      user?: {
        id: string
        firstName: string
        lastName: string
        email: string
      }
    }
  }
  freelancer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface ProposalsResponse {
  success: boolean
  message: string
  data: Proposal[]
  pagination?: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface CreateProposalRequest {
  projectId: string
  freelancerId: string
  coverLetter?: string
  bidAmount?: number
  bidCurrency?: string
  bidDays?: number
  status?: number
}

export interface UpdateProposalRequest {
  coverLetter?: string
  bidAmount?: number
  bidCurrency?: string
  bidDays?: number
  status?: number
}
