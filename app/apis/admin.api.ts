import { getAccessTokenFromLS } from '~/utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062'

export interface AdminDashboardStats {
  userStats: {
    totalUsers: number
    totalFreelancers: number
    totalClients: number
    activeUsers: number
    userGrowthPercentage: number
    usersByRole: Array<{
      roleName: string
      count: number
    }>
  }
  projectStats: {
    totalProjects: number
    activeProjects: number
    pendingProjects: number
    completedProjects: number
    projectGrowthPercentage: number
    totalProjectValue: number
  }
  transactionStats: {
    totalRevenue: number
    monthlyRevenue: number
    commissionEarned: number
    serviceFees: number
    totalTransactions: number
    revenueGrowthPercentage: number
    transactionsByType: Array<{
      type: string
      count: number
      totalAmount: number
    }>
  }
  recruitmentStats: {
    totalRecruitmentPosts: number
    activeRecruitmentPosts: number
    pendingApproval: number
    totalProposals: number
    recruitmentGrowthPercentage: number
  }
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  userName: string
  timestamp: string
  status: string
  metadata?: any
}

export interface AdminUser {
  id: string
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role?: number
  roleName: string
  status?: number
  statusName: string
  emailVerified: boolean
  totalProjects: number
  totalEarnings: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminProject {
  id: string
  name?: string
  description?: string
  budget: number
  status: number
  statusName: string
  clientId: string
  clientName: string
  recruitmentPostId?: string
  totalMilestones: number
  completedMilestones: number
  totalProposals: number
  startDate?: string
  endDate?: string
  createdAt?: string
}

export interface AdminTransaction {
  id: string
  type: string
  amount: number
  fromUserName: string
  toUserName: string
  fromUserId?: string
  toUserId?: string
  projectId?: string
  projectName?: string
  status: string
  description?: string
  paymentMethod?: string
  transactionCode?: string
  createdAt?: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  success?: boolean
  pagination?: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

class AdminApi {
  private getHeaders(): Record<string, string> {
    const token = getAccessTokenFromLS()
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    return result.data || result
  }

  // Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers
    })
    return this.handleResponse<AdminDashboardStats>(response)
  }

  async getRecentActivities(limit = 10): Promise<RecentActivity[]> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-activities?limit=${limit}`, {
      headers
    })
    return this.handleResponse<RecentActivity[]>(response)
  }

  // Users
  async getTotalUsersCount(params: {
    role?: number
    status?: number
  } = {}): Promise<number> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.role !== undefined) queryParams.append('role', params.role.toString())
    if (params.status !== undefined) queryParams.append('status', params.status.toString())

    const response = await fetch(`${API_BASE_URL}/api/admin/users/count?${queryParams}`, {
      headers
    })
    return this.handleResponse<number>(response)
  }

  async getUsers(params: {
    page?: number
    pageSize?: number
    search?: string
    role?: number
    status?: number
  } = {}): Promise<ApiResponse<PagedResult<AdminUser>>> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.role !== undefined) queryParams.append('role', params.role.toString())
    if (params.status !== undefined) queryParams.append('status', params.status.toString())

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${queryParams}`, {
      headers
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async getUserById(userId: string): Promise<AdminUser> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers
    })
    return this.handleResponse<AdminUser>(response)
  }

  async updateUserRole(userId: string, role: number): Promise<void> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role })
    })
    await this.handleResponse<void>(response)
  }

  async updateUserStatus(userId: string, status: number): Promise<void> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    })
    await this.handleResponse<void>(response)
  }

  async createUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: number
    status: number
    phoneNumber?: string
  }): Promise<AdminUser> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return this.handleResponse<AdminUser>(response)
  }

  async updateUser(userId: string, data: {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    role?: number
    status?: number
  }): Promise<AdminUser> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return this.handleResponse<AdminUser>(response)
  }

  async deleteUser(userId: string): Promise<void> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers
    })
    await this.handleResponse<void>(response)
  }

  // Projects
  async getTotalProjectsCount(params: {
    status?: number
  } = {}): Promise<number> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.status !== undefined) queryParams.append('status', params.status.toString())

    const response = await fetch(`${API_BASE_URL}/api/admin/projects/count?${queryParams}`, {
      headers
    })
    return this.handleResponse<number>(response)
  }

  async getProjects(params: {
    page?: number
    pageSize?: number
    search?: string
    status?: number
  } = {}): Promise<ApiResponse<PagedResult<AdminProject>>> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.status !== undefined) queryParams.append('status', params.status.toString())

    const response = await fetch(`${API_BASE_URL}/api/admin/projects?${queryParams}`, {
      headers
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async getProjectById(projectId: string): Promise<AdminProject> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
      headers
    })
    return this.handleResponse<AdminProject>(response)
  }

  async updateProjectStatus(projectId: string, status: number, reason?: string): Promise<void> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, reason })
    })
    await this.handleResponse<void>(response)
  }

  async createProject(data: {
    title: string
    description?: string
    budgetMin: number
    budgetMax: number
    clientId: string
    recruitmentPostId?: string
    deadline?: string
    status?: number
  }): Promise<AdminProject> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return this.handleResponse<AdminProject>(response)
  }

  async updateProject(projectId: string, data: {
    title?: string
    description?: string
    budgetMin?: number
    budgetMax?: number
    clientId?: string
    deadline?: string
    status?: number
  }): Promise<AdminProject> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return this.handleResponse<AdminProject>(response)
  }

  async deleteProject(projectId: string): Promise<void> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}`, {
      method: 'DELETE',
      headers
    })
    await this.handleResponse<void>(response)
  }

  // Transactions
  async getTransactions(params: {
    page?: number
    pageSize?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
  } = {}): Promise<ApiResponse<PagedResult<AdminTransaction>>> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params.type) queryParams.append('type', params.type)
    if (params.status) queryParams.append('status', params.status)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const response = await fetch(`${API_BASE_URL}/api/admin/transactions?${queryParams}`, {
      headers
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async getTransactionById(transactionId: string): Promise<AdminTransaction> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/transactions/${transactionId}`, {
      headers
    })
    return this.handleResponse<AdminTransaction>(response)
  }

  async getTransactionStats(startDate?: string, endDate?: string): Promise<any> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const response = await fetch(`${API_BASE_URL}/api/admin/transactions/stats?${queryParams}`, {
      headers
    })
    return this.handleResponse<any>(response)
  }

  // Reports
  async exportUsersReport(format = 'xlsx'): Promise<Blob> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/users/export?format=${format}`, {
      headers
    })
    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`)
    return response.blob()
  }

  async exportTransactionsReport(params: {
    startDate?: string
    endDate?: string
    format?: string
  } = {}): Promise<Blob> {
    const headers = this.getHeaders()
    const queryParams = new URLSearchParams()
    
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.format) queryParams.append('format', params.format)

    const response = await fetch(`${API_BASE_URL}/api/admin/reports/transactions/export?${queryParams}`, {
      headers
    })
    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`)
    return response.blob()
  }

  async exportProjectsReport(format = 'xlsx'): Promise<Blob> {
    const headers = this.getHeaders()
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/projects/export?format=${format}`, {
      headers
    })
    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`)
    return response.blob()
  }
}

export const adminApi = new AdminApi()
