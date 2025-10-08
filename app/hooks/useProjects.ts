import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, type CreateMilestonePayload, type UpdateMilestonePayload } from '~/apis/project.api'
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
    staleTime: 1000 * 60 * 5 // 5 minutes
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
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

export const useMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => projectApi.getMilestonesByProject(projectId),
    enabled: !!projectId,
    staleTime: 30000 // 30 seconds
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
