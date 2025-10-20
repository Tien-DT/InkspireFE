import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { proposalApi } from '~/apis/proposal.api'
import type { ProposalsResponse } from '~/types/proposal.type'
import { signalRNotificationService } from '~/lib/signalr-notification'

export const useProposalsByFreelancer = (freelancerId: string | undefined) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!freelancerId) return

    const handleProposalCreated = (proposal: any) => {
      console.log('[useProposals] ProposalCreated event:', proposal)
      if (proposal.freelancerId === freelancerId) {
        queryClient.invalidateQueries({ queryKey: ['proposals', 'freelancer', freelancerId] })
      }
    }

    const handleProposalUpdated = (proposal: any) => {
      console.log('[useProposals] ProposalUpdated event:', proposal)
      queryClient.invalidateQueries({ queryKey: ['proposals', 'freelancer', freelancerId] })
    }

    const handleProposalDeleted = (proposalId: string) => {
      console.log('[useProposals] ProposalDeleted event:', proposalId)
      queryClient.invalidateQueries({ queryKey: ['proposals', 'freelancer', freelancerId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onProposalCreated: handleProposalCreated,
      onProposalUpdated: handleProposalUpdated,
      onProposalDeleted: handleProposalDeleted
    })

    return () => {
      // Cleanup handled by service
    }
  }, [freelancerId, queryClient])

  return useQuery<ProposalsResponse>({
    queryKey: ['proposals', 'freelancer', freelancerId],
    queryFn: () => proposalApi.getProposalsByFreelancerId(freelancerId!),
    enabled: !!freelancerId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useProposalsByProject = (projectId: string | undefined) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!projectId) return

    const handleProposalCreated = (proposal: any) => {
      console.log('[useProposals] ProposalCreated event:', proposal)
      if (proposal.projectId === projectId) {
        queryClient.invalidateQueries({ queryKey: ['proposals', 'project', projectId] })
      }
    }

    const handleProposalUpdated = (proposal: any) => {
      console.log('[useProposals] ProposalUpdated event:', proposal)
      queryClient.invalidateQueries({ queryKey: ['proposals', 'project', projectId] })
    }

    const handleProposalDeleted = (proposalId: string) => {
      console.log('[useProposals] ProposalDeleted event:', proposalId)
      queryClient.invalidateQueries({ queryKey: ['proposals', 'project', projectId] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onProposalCreated: handleProposalCreated,
      onProposalUpdated: handleProposalUpdated,
      onProposalDeleted: handleProposalDeleted
    })

    return () => {
      // Cleanup handled by service
    }
  }, [projectId, queryClient])

  return useQuery<ProposalsResponse>({
    queryKey: ['proposals', 'project', projectId],
    queryFn: () => proposalApi.getProposalsByProjectId(projectId!),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}
