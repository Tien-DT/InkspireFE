import axiosClient from '~/lib/axios'

export const URL_STATISTICS = '/api/statistics'

export interface FreelancerIncomeStats {
  totalProjectIncome: number
  platformFee: number
  expectedReceived: number
  totalReceived: number
  completedMilestones: number
  currency: string
  debug?: {
    totalMilestones: number
    completedMilestonesCount: number
    milestonesWithBudget: number
    totalTransactions: number
  }
}

export interface ClientSpendingStats {
  totalSpent: number
  totalPaid: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  currency: string
  debug?: {
    totalMilestones: number
    completedMilestonesCount: number
    milestonesWithBudget: number
    totalTransactions: number
  }
}

export interface FreelancerIncomeResponse {
  success: boolean
  message: string
  data: FreelancerIncomeStats
}

export interface ClientSpendingResponse {
  success: boolean
  message: string
  data: ClientSpendingStats
}

export const statisticsApi = {
  getFreelancerIncome: async (freelancerId: string): Promise<FreelancerIncomeResponse> => {
    const response = await axiosClient.get<FreelancerIncomeResponse>(
      `${URL_STATISTICS}/freelancer/${freelancerId}/income`
    )
    return response.data
  },

  getClientSpending: async (clientId: string): Promise<ClientSpendingResponse> => {
    const response = await axiosClient.get<ClientSpendingResponse>(
      `${URL_STATISTICS}/client/${clientId}/spending`
    )
    return response.data
  }
}
