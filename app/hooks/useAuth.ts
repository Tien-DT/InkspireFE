import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authApi } from '~/apis/auth.api'
import type { LoginRequest, RegisterRequest } from '~/types/auth.type'
import { setAccessTokenToLS, setRefreshTokenToLS, setProfileToLS, extractUserFromToken } from '~/utils/auth'
import { useAuth } from '~/contexts/AuthContext'

/**
 * Custom hook for user login
 * Handles API call, loading state, error handling, and token storage
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      // Store tokens in localStorage
      setAccessTokenToLS(response.access_token)
      setRefreshTokenToLS(response.refresh_token)

      // Ưu tiên lưu user từ response
      if (response.user) {
        console.log('User from login response:', response.user)
        setProfileToLS(response.user)
      } else {
        // Fallback: Decode JWT để lấy user info
        console.log('No user in response, extracting from JWT...')
        const userFromToken = extractUserFromToken(response.access_token)

        if (userFromToken) {
          console.log('User extracted from JWT:', userFromToken)
          setProfileToLS(userFromToken)
        } else {
          // Last resort: gọi API getProfile
          console.log('Failed to extract from JWT, fetching profile from API...')
          try {
            const profile = await authApi.getProfile()
            console.log('Profile from API:', profile)
            setProfileToLS(profile)
          } catch (error) {
            console.error('Failed to fetch profile:', error)
            toast.error('Không thể tải thông tin người dùng')
          }
        }
      }

      // Refresh auth state to update UI immediately
      refreshAuth()

      // Show success message
      toast.success('Đăng nhập thành công!', {
        description: 'Chào mừng bạn quay trở lại.',
        duration: 2000
      })

      // Small delay for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to dashboard or home
      navigate('/dashboard-freelancer')
    },
    onError: (error: unknown) => {
      // Handle different error cases
      const err = error as {
        response?: { data?: { message?: string; error?: string }; status?: number }
        message?: string
      }
      const errorMessage = err?.response?.data?.message || err?.message
      const errorType = err?.response?.data?.error

      if (errorType === 'email_not_verified') {
        toast.error('Email chưa được xác thực', {
          description: 'Vui lòng kiểm tra email và xác thực tài khoản của bạn.'
        })
      } else if (err?.response?.status === 401) {
        toast.error('Đăng nhập thất bại', {
          description: 'Email hoặc mật khẩu không đúng.'
        })
      } else {
        toast.error('Đã có lỗi xảy ra', {
          description: errorMessage || 'Vui lòng thử lại sau.'
        })
      }
    }
  })
}

/**
 * Custom hook for user registration
 * Handles API call, loading state, error handling, and success redirect
 */
export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      // Show success message
      toast.success('Đăng ký thành công!', {
        description: response.message || 'Vui lòng kiểm tra email để xác thực tài khoản.'
      })

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    },
    onError: (error: unknown) => {
      // Handle different error cases
      const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string }
      const errorMessage = err?.response?.data?.message || err?.message
      const status = err?.response?.status

      if (status === 409) {
        // Conflict - email or phone already exists
        toast.error('Đăng ký thất bại', {
          description: errorMessage || 'Email hoặc số điện thoại đã được sử dụng.'
        })
      } else if (status === 400) {
        // Bad request - validation error
        toast.error('Thông tin không hợp lệ', {
          description: errorMessage || 'Vui lòng kiểm tra lại thông tin đã nhập.'
        })
      } else {
        toast.error('Đã có lỗi xảy ra', {
          description: errorMessage || 'Vui lòng thử lại sau.'
        })
      }
    }
  })
}

/**
 * Custom hook for user logout
 * Clears tokens and redirects to login page
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const { logout: contextLogout } = useAuth()

  return useMutation({
    mutationFn: async () => {
      // Optionally call backend to invalidate token
      try {
        await authApi.logout()
      } catch (error) {
        // Ignore backend errors, still logout locally
        console.warn('Backend logout failed, continuing with local logout', error)
      }
    },
    onSuccess: () => {
      // Clear all auth data via context
      contextLogout()

      toast.success('Đăng xuất thành công')

      // Redirect to login page
      navigate('/', { replace: true })
    },
    onError: () => {
      // Even if API call fails, clear local storage and redirect
      contextLogout()
      navigate('/', { replace: true })
    }
  })
}
