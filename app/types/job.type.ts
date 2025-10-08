export interface Job {
  id: string
  title: string
  description: string
  budget: number
  status: number
  endTime: string
  createdAt: string
  teamSize: string // Changed from number to string to match RecruitmentPost
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  categories: Array<{
    id: string
    title: string
  }>
  skills: Array<{
    id: string
    name: string
  }>
}

export interface JobFilterValues {
  keyword: string
  category: string
  minBudget?: number
  maxBudget?: number
  timeline: string[]
  experienceLevel: string[]
  sortBy: 'newest' | 'budget-high' | 'budget-low'
}

export interface ApplicationFormData {
  cvFile: File | null
  coverLetter: string
}
