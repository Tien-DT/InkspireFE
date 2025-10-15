import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '~/apis/auth.api'
import { setProfileToLS } from '~/utils/auth'
import { useAuth } from '~/contexts/AuthContext'
import { toast } from 'sonner'
import type { User } from '~/types/user.type'

/**
 * Hook to fetch user profile
 */
export const useProfile = () => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })
}

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { setProfile } = useAuth()

  return useMutation({
    mutationFn: (data: Partial<User>) => authApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Update profile in localStorage
      setProfileToLS(updatedProfile)

      // Update profile in context
      setProfile(updatedProfile)

      // Update profile in query cache
      queryClient.setQueryData(['profile'], updatedProfile)

      toast.success('Cập nhật thông tin thành công!')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message
      toast.error('Cập nhật thông tin thất bại', {
        description: errorMessage || 'Vui lòng thử lại sau.'
      })
    }
  })
}

/**
 * Hook to refresh profile data
 */
export const useRefreshProfile = () => {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] })
  }
}
