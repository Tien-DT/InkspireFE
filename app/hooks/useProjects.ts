import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  projectApi,
  type CreateMilestonePayload,
  type UpdateMilestonePayload,
  type UpdateProjectPayload
} from '~/apis/project.api'
import { getProfileFromLS } from '~/utils/auth'
import { signalRNotificationService } from '~/lib/signalr-notification'

export const useProjects = () => {
  const profile = getProfileFromLS()
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!profile?.id) return

    const handleProjectCreated = (project: any) => {
      console.log('[useProjects] ProjectCreated event:', project)
      queryClient.invalidateQueries({ queryKey: ['projects', profile.id, profile.role] })
    }

    const handleProjectUpdated = (project: any) => {
      console.log('[useProjects] ProjectUpdated event:', project)
      queryClient.invalidateQueries({ queryKey: ['projects', profile.id, profile.role] })
      queryClient.invalidateQueries({ queryKey: ['project', project.id] })
    }

    const handleProjectStatusChanged = (projectId: string, status: number) => {
      console.log('[useProjects] ProjectStatusChanged event:', projectId, status)
      queryClient.invalidateQueries({ queryKey: ['projects', profile.id, profile.role] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }

    const handleMilestoneUpdated = (milestone: any) => {
      console.log('[useProjects] MilestoneUpdated event:', milestone)
      queryClient.invalidateQueries({ queryKey: ['milestones', milestone.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects', profile.id, profile.role] })
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onProjectCreated: handleProjectCreated,
      onProjectUpdated: handleProjectUpdated,
      onProjectStatusChanged: handleProjectStatusChanged,
      onMilestoneUpdated: handleMilestoneUpdated
    })

    return () => {
      // No need to unregister - service handles multiple handlers
    }
  }, [profile?.id, profile?.role, queryClient])

  return useQuery({
    queryKey: ['projects', profile?.id, profile?.role],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error('User profile not found')
      }

      // Role 1 = Client, Role 2 = Freelancer (based on your requirement)
      if (profile.role === 1) {
        // Client
        return projectApi.getProjectsByClientId(profile.id)
      } else if (profile.role === 2) {
        // Freelancer
        return projectApi.getProjectsByFreelancerId(profile.id)
      } else {
        throw new Error('Invalid user role')
      }
    },
    enabled: !!profile?.id && (profile.role === 1 || profile.role === 2),
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING - SignalR handles updates!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useProjectById = (projectId: string) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!projectId) return

    const handleProjectUpdated = (project: any) => {
      console.log('[useProjectById] ProjectUpdated event:', project)
      if (project.id === projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    }

    const handleProjectStatusChanged = (updatedProjectId: string, status: number) => {
      console.log('[useProjectById] ProjectStatusChanged event:', updatedProjectId, status)
      if (updatedProjectId === projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    }

    const handleMilestoneUpdated = (milestone: any) => {
      console.log('[useProjectById] MilestoneUpdated event:', milestone)
      if (milestone.projectId === projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
      }
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onProjectUpdated: handleProjectUpdated,
      onProjectStatusChanged: handleProjectStatusChanged,
      onMilestoneUpdated: handleMilestoneUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [projectId, queryClient])

  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }
      return projectApi.getProjectById(projectId)
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useMilestones = (projectId: string) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time updates
  useEffect(() => {
    if (!projectId) return

    const handleMilestoneUpdated = (milestone: any) => {
      console.log('[useMilestones] MilestoneUpdated event:', milestone)
      if (milestone.projectId === projectId) {
        queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    }

    const handleProjectUpdated = (project: any) => {
      console.log('[useMilestones] ProjectUpdated event:', project)
      if (project.id === projectId) {
        queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
      }
    }

    // Register handlers
    signalRNotificationService.registerHandlers({
      onMilestoneUpdated: handleMilestoneUpdated,
      onProjectUpdated: handleProjectUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [projectId, queryClient])

  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => projectApi.getMilestonesByProject(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useCreateMilestone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMilestonePayload) => projectApi.createMilestone(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] })
    }
  })
}

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ milestoneId, payload }: { milestoneId: string; payload: UpdateMilestonePayload }) =>
      projectApi.updateMilestone(milestoneId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectPayload }) =>
      projectApi.updateProject(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
    }
  })
}

export const useUploadMilestoneDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ milestoneId, file }: { milestoneId: string; file: File }) =>
      projectApi.uploadMilestoneDocument({ milestoneId, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
    }
  })
}

export const useEvaluateMilestoneFile = () => {
  return useMutation({
    mutationFn: ({ requirementText, file }: { requirementText: string; file: File }) =>
      projectApi.evaluateMilestoneFile({ requirementText, file })
  })
}

export const useEvaluateMilestoneFileByUrl = (
  options: { onSuccess?: (data: unknown) => void; onError?: (error: unknown) => void } = {}
) => {
  return useMutation({
    mutationFn: (body: { requirementText: string; fileUrl: string; fileName: string; contentType: string }) =>
      projectApi.evaluateMilestoneFileByUrl(body),
    onSuccess: options.onSuccess,
    onError: options.onError
  })
}

export const useSubmitComplaint = (options: { onSuccess?: (data: unknown) => void; onError?: (error: unknown) => void } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ milestoneId, body }: { milestoneId: string; body: { requirementText: string; contentType?: string } }) =>
      projectApi.submitComplaint(milestoneId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
      options.onSuccess?.(data)
    },
    onError: options.onError
  })
}

export const useGetComplaint = (complaintId: string) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time complaint updates
  useEffect(() => {
    if (!complaintId) return

    const handleComplaintUpdated = (complaint: any) => {
      console.log('[useGetComplaint] ComplaintUpdated event:', complaint)
      if (complaint.id === complaintId) {
        queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] })
      }
    }

    // Register handler
    signalRNotificationService.registerHandlers({
      onComplaintUpdated: handleComplaintUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [complaintId, queryClient])

  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => projectApi.getComplaint(complaintId),
    enabled: !!complaintId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING - SignalR handles complaint status updates!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useComplaintsByMilestone = (milestoneId: string) => {
  const queryClient = useQueryClient()

  // Listen to SignalR events for real-time complaint updates
  useEffect(() => {
    if (!milestoneId) return

    const handleComplaintUpdated = (complaint: any) => {
      console.log('[useComplaintsByMilestone] ComplaintUpdated event:', complaint)
      if (complaint.milestoneId === milestoneId) {
        queryClient.invalidateQueries({ queryKey: ['milestoneComplaints', milestoneId] })
      }
    }

    // Register handler
    signalRNotificationService.registerHandlers({
      onComplaintUpdated: handleComplaintUpdated
    })

    return () => {
      // Cleanup handled by service
    }
  }, [milestoneId, queryClient])

  return useQuery({
    queryKey: ['milestoneComplaints', milestoneId],
    queryFn: () => projectApi.getMilestoneComplaints(milestoneId),
    enabled: !!milestoneId,
    staleTime: 1000 * 60 * 5, // 5 minutes - rely on SignalR for updates
    refetchInterval: false, // ❌ NO MORE POLLING!
    refetchOnWindowFocus: true // Refetch when user returns to tab
  })
}

export const useRetryComplaint = (options: { onSuccess?: (data: unknown) => void; onError?: (error: unknown) => void } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (complaintId: string) => projectApi.retryComplaint(complaintId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestoneComplaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
      options.onSuccess?.(data)
    },
    onError: options.onError
  })
}

export const useCancelComplaint = (options: { onSuccess?: (data: unknown) => void; onError?: (error: unknown) => void } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (complaintId: string) => projectApi.cancelComplaint(complaintId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestoneComplaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
      options.onSuccess?.(data)
    },
    onError: options.onError
  })
}
