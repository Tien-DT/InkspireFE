import axiosClient from '~/lib/axios'
import type { ProposalsResponse, CreateProposalRequest, UpdateProposalRequest } from '~/types/proposal.type'

export const URL_PROPOSALS = '/api/proposals'
export const URL_PROPOSALS_BY_FREELANCER = (freelancerId: string) => `${URL_PROPOSALS}/freelancers/${freelancerId}`
export const URL_PROPOSALS_BY_PROJECT = (projectId: string) => `${URL_PROPOSALS}/projects/${projectId}`

export const proposalApi = {
  // Get all proposals by freelancer ID
  getProposalsByFreelancerId: async (freelancerId: string) => {
    const response = await axiosClient.get<ProposalsResponse>(URL_PROPOSALS_BY_FREELANCER(freelancerId))
    return response.data
  },

  // Get all proposals by project ID
  getProposalsByProjectId: async (projectId: string) => {
    const response = await axiosClient.get<ProposalsResponse>(URL_PROPOSALS_BY_PROJECT(projectId))
    return response.data
  },

  // Get proposal by ID
  getProposalById: async (proposalId: string) => {
    const response = await axiosClient.get<{ success: boolean; message: string; data: any }>(
      `${URL_PROPOSALS}/${proposalId}`
    )
    return response.data
  },

  // Create a new proposal
  createProposal: async (data: CreateProposalRequest) => {
    const response = await axiosClient.post<{ success: boolean; message: string; data: any }>(URL_PROPOSALS, data)
    return response.data
  },

  // Update a proposal
  updateProposal: async (proposalId: string, data: UpdateProposalRequest) => {
    const response = await axiosClient.put<{ success: boolean; message: string; data: any }>(
      `${URL_PROPOSALS}/${proposalId}`,
      data
    )
    return response.data
  },

  // Delete a proposal (withdraw application)
  deleteProposal: async (proposalId: string) => {
    const response = await axiosClient.delete<{ success: boolean; message: string }>(`${URL_PROPOSALS}/${proposalId}`)
    return response.data
  }
}
