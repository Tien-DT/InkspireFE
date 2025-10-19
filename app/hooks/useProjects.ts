import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  projectApi,
  type CreateMilestonePayload,
  type UpdateMilestonePayload,
  type UpdateProjectPayload
} from '~/apis/project.api'
import { getProfileFromLS } from '~/utils/auth'

export const useProjects = () => {
  const profile = getProfileFromLS()

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
    // staleTime: 1000 * 60 * 5 // OLD: 5 minutes
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}

export const useProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }
      return projectApi.getProjectById(projectId)
    },
    enabled: !!projectId,
    // staleTime: 1000 * 60 * 5 // OLD: 5 minutes
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
  })
}

export const useMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => projectApi.getMilestonesByProject(projectId),
    enabled: !!projectId,
    // staleTime: 30000 // OLD: 30 seconds
    staleTime: 1000 * 3, // NEW: 3 seconds
    refetchInterval: 1000 * 6 // NEW: Refetch every 6 seconds
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
  return useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: () => projectApi.getComplaint(complaintId),
    enabled: !!complaintId,
    refetchInterval: (state) => {
      // Poll every 3 seconds while processing (status 0 or 1)
      const processingStatus = (state as unknown as Record<string, unknown>)?.processingStatus
      return processingStatus === 0 || processingStatus === 1 ? 3000 : false
    }
  })
}

export const useComplaintsByMilestone = (milestoneId: string) => {
  return useQuery({
    queryKey: ['milestoneComplaints', milestoneId],
    queryFn: () => projectApi.getMilestoneComplaints(milestoneId),
    enabled: !!milestoneId,
    staleTime: 1000 * 3,
    refetchInterval: 1000 * 6
  })
}
