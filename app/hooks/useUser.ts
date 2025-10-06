import { useQuery } from '@tanstack/react-query'
import { userApi, type UserProfileResponse } from '~/apis/user.api'

/**
 * Custom hook to fetch user profile by userId
 * @param userId - User ID to fetch profile for
 * @returns React Query result with user profile data
 */
export const useUserProfile = (userId: string | undefined) => {
  return useQuery<UserProfileResponse>({
    queryKey: ['user-profile', userId],
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId, // Only fetch when userId is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  })
}
