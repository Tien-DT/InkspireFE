import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authApi } from '~/apis/auth.api'
import type { LoginRequest, RegisterRequest } from '~/types/auth.type'
import { clearLS, setAccessTokenToLS, setRefreshTokenToLS, setProfileToLS } from '~/utils/auth'
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
    onSuccess: (response) => {
      // Store tokens in localStorage
      setAccessTokenToLS(response.access_token)
      setRefreshTokenToLS(response.refresh_token)

      // Store user profile
      if (response.user) {
        setProfileToLS(response.user)
      }

      // Refresh auth state to update UI immediately
      refreshAuth()

      // Show success message
      toast.success('Đăng nhập thành công!', {
        description: 'Chào mừng bạn quay trở lại.'
      })

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

  const clearAuthState = () => {
    clearLS()
    localStorage.removeItem('user_status')
    localStorage.removeItem('email_verified')
  }

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all auth data from localStorage
      clearAuthState()

      toast.success('Đăng xuất thành công')

      // Redirect to login page
      navigate('/login')
    },
    onError: () => {
      // Even if API call fails, clear local storage and redirect
      clearAuthState()

      navigate('/login')
    }
  })
}
