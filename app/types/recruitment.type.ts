export interface RecruitmentPost {
  id: string
  title: string
  description: string
  budget: number
  teamSize: string
  postExpired: string
  createdAt: string
  status: number
  userName: string
  projectName: string
}

export interface RecruitmentResponse {
  items: RecruitmentPost[]
  total?: number
  page?: number
  pageSize?: number
}
