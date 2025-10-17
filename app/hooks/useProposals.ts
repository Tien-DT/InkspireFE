import { useQuery } from '@tanstack/react-query'
import { proposalApi } from '~/apis/proposal.api'
import type { ProposalsResponse } from '~/types/proposal.type'

export const useProposalsByFreelancer = (freelancerId: string | undefined) => {
  return useQuery<ProposalsResponse>({
    queryKey: ['proposals', 'freelancer', freelancerId],
    queryFn: () => proposalApi.getProposalsByFreelancerId(freelancerId!),
    enabled: !!freelancerId,
    // staleTime: 5 * 60 * 1000 // OLD: 5 minutes
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}

export const useProposalsByProject = (projectId: string | undefined) => {
  return useQuery<ProposalsResponse>({
    queryKey: ['proposals', 'project', projectId],
    queryFn: () => proposalApi.getProposalsByProjectId(projectId!),
    enabled: !!projectId,
    // staleTime: 5 * 60 * 1000 // OLD: 5 minutes
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}
