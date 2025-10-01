import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authApi } from '~/apis/auth.api'
import type { LoginRequest, RegisterRequest } from '~/types/auth.type'

/**
 * Custom hook for user login
 * Handles API call, loading state, error handling, and token storage
 */
export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      // Store user status
      localStorage.setItem('user_status', response.status.toString())
      localStorage.setItem('email_verified', response.email_verified.toString())
      
      // Show success message
      toast.success('Đăng nhập thành công!', {
        description: 'Chào mừng bạn quay trở lại.'
      })
      
      // Redirect to dashboard or home
      navigate('/dashboard-freelancer')
    },
    onError: (error: any) => {
      // Handle different error cases
      const errorMessage = error?.response?.data?.message || error?.message
      const errorType = error?.response?.data?.error
      
      if (errorType === 'email_not_verified') {
        toast.error('Email chưa được xác thực', {
          description: 'Vui lòng kiểm tra email và xác thực tài khoản của bạn.'
        })
      } else if (error?.response?.status === 401) {
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
    onError: (error: any) => {
      // Handle different error cases
      const errorMessage = error?.response?.data?.message || error?.message
      const status = error?.response?.status
      
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

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all auth data from localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_status')
      localStorage.removeItem('email_verified')
      
      toast.success('Đăng xuất thành công')
      
      // Redirect to login page
      navigate('/login')
    },
    onError: () => {
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_status')
      localStorage.removeItem('email_verified')
      
      navigate('/login')
    }
  })
}
