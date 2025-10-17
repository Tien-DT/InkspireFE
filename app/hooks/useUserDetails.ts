import { useEffect, useState } from 'react'
import { userApi } from '~/apis/user.api'

interface UserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: number
  status: number
}

export function useUserDetails(userId: string | undefined) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setUserDetails(null)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    userApi
      .getUserById(userId)
      .then((response) => {
        if (!cancelled && response.success && response.data) {
          setUserDetails(response.data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          console.error('[useUserDetails] Failed to fetch user:', err)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  return { userDetails, isLoading, error }
}
