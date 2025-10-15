import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signInWithPopup } from 'firebase/auth'
import { useMutation } from '@tanstack/react-query'
import { auth, googleProvider } from '~/lib/firebase'
import { authApi } from '~/apis/auth.api'
import { GoogleIcon } from '~/components/icons/google-icon'
import { Button } from '~/components/ui/button'
import {
  setAccessTokenToLS,
  setRefreshTokenToLS,
  setProfileToLS,
  setLastAuthContext,
  extractUserFromToken
} from '~/utils/auth'
import { useAuth } from '~/contexts/AuthContext'
import { toast } from 'sonner'
import type { AuthError, GoogleLoginRequest, GoogleLoginResponse } from '~/types/auth.type'
import { UserRole } from '~/types/user.type'
import { RoleSelectionDialog } from './role-selection-dialog'

interface GoogleLoginButtonProps {
  rememberMe?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleLoginButton({ rememberMe = false, onSuccess, onError }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [pendingGoogleAuth, setPendingGoogleAuth] = useState<{
    idToken: string
    firstName?: string
    lastName?: string
  } | null>(null)
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()

  const googleLoginMutation = useMutation<GoogleLoginResponse, AuthError, GoogleLoginRequest>({
    mutationFn: authApi.googleLogin,
    onSuccess: async (data) => {
      console.log('Google Login Response:', data)

      // Lưu tokens vào localStorage
      setAccessTokenToLS(data.access_token)
      setRefreshTokenToLS(data.refresh_token)

      // Ưu tiên lưu user từ response
      if (data.user) {
        console.log('User from response:', data.user)
        setProfileToLS(data.user)
        setLastAuthContext('google', data.user?.email)
      } else {
        // Fallback: Decode JWT để lấy user info
        console.log('No user in response, extracting from JWT...')
        const userFromToken = extractUserFromToken(data.access_token)

        if (userFromToken) {
          console.log('User extracted from JWT:', userFromToken)
          setProfileToLS(userFromToken)
          setLastAuthContext('google', userFromToken.email)
        } else {
          // Last resort: gọi API getProfile
          console.log('Failed to extract from JWT, fetching profile from API...')
          try {
            const profile = await authApi.getProfile()
            console.log('Profile from API:', profile)
            setProfileToLS(profile)
            setLastAuthContext('google', profile?.email)
          } catch (error) {
            console.error('Failed to fetch profile:', error)
            toast.error('Không thể tải thông tin người dùng')
          }
        }
      }

      // Refresh auth state
      refreshAuth()

      toast.success('Đăng nhập thành công!')

      if (onSuccess) {
        onSuccess()
      } else {
        // Redirect to home page
        navigate('/')
      }
    },
    onError: (error: AuthError) => {
      console.error('Google login error FULL:', JSON.stringify(error, null, 2))
      console.log('Error response data:', error?.response?.data)
      console.log('Error status:', error?.response?.status)

      // Check ROLE_REQUIRED in any part of the error
      const errorString = JSON.stringify(error)
      if (errorString.includes('ROLE_REQUIRED')) {
        console.log('⚠️ ROLE_REQUIRED found in error, showing dialog')
        setShowRoleDialog(true)
        setIsLoading(false)
        return
      }

      // Xử lý các loại lỗi cụ thể từ backend
      if (error?.response?.status === 400) {
        // Check if this is a role required error for new user
        const errorCode = error?.response?.data?.error
        const errorMessage = error?.response?.data?.message
        
        console.log('Error code:', errorCode)
        console.log('Error message:', errorMessage)
        
        if (errorCode === 'ROLE_REQUIRED' || 
            (errorCode === 'google_auth_failed' && errorMessage?.includes('ROLE_REQUIRED'))) {
          console.log('ROLE_REQUIRED detected, showing dialog')
          // Don't show error toast, just open role selection dialog
          setShowRoleDialog(true)
          setIsLoading(false)
          return
        }
        
        if (errorCode === 'INVALID_CREDENTIALS') {
          toast.error('Email hoặc mật khẩu không đúng')
        } else if (error?.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Email chưa được xác thực', {
            description: 'Vui lòng kiểm tra email và xác thực tài khoản của bạn.'
          })
        } else {
          toast.error(error?.response?.data?.message || 'Thông tin đăng nhập không hợp lệ')
        }
      } else if (error?.response?.status === 401) {
        toast.error('Email hoặc mật khẩu không đúng')
      } else if (error?.response?.status === 403) {
        toast.error('Tài khoản của bạn đã bị khóa')
      } else if (error?.response?.status === 404) {
        toast.error('Không tìm thấy tài khoản')
      } else {
        toast.error(error?.response?.data?.message || 'Đăng nhập Google thất bại')
      }

      if (onError) {
        onError(error?.response?.data?.message || error?.message || 'Đăng nhập thất bại')
      }
    }
  })

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)

      // Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider)

      // Get the ID token from Firebase
      const idToken = await result.user.getIdToken()

      // Extract user info from Firebase
      const displayName = result.user.displayName || ''
      const nameParts = displayName.split(' ')
      const firstName = nameParts[0] || undefined
      const lastName = nameParts.slice(1).join(' ') || undefined

      // Store pending auth info in case role selection is needed
      setPendingGoogleAuth({ idToken, firstName, lastName })

      // Call backend API with the ID token
      googleLoginMutation.mutate({
        idToken,
        firstName,
        lastName,
        rememberMe
      })
    } catch (error) {
      console.error('Firebase sign in error:', error)
      setIsLoading(false)

      // Handle specific Firebase errors
      if (error instanceof Error) {
        const firebaseError = error as { code?: string; message: string }

        if (firebaseError.code === 'auth/popup-closed-by-user') {
          toast.info('Đăng nhập bị hủy')
        } else if (firebaseError.code === 'auth/cancelled-popup-request') {
          // Silent - user already has a popup open
        } else {
          toast.error('Không thể đăng nhập với Google')
        }

        if (onError) {
          onError(firebaseError.message)
        }
      } else {
        toast.error('Có lỗi xảy ra khi đăng nhập với Google')
        if (onError) {
          onError('Unknown error occurred')
        }
      }
    }
  }

  const handleRoleSelected = (role: UserRole) => {
    if (pendingGoogleAuth) {
      googleLoginMutation.mutate({
        idToken: pendingGoogleAuth.idToken,
        firstName: pendingGoogleAuth.firstName,
        lastName: pendingGoogleAuth.lastName,
        rememberMe,
        role
      })
      setPendingGoogleAuth(null)
    }
  }

  const handleDialogClose = () => {
    setShowRoleDialog(false)
    setPendingGoogleAuth(null)
    setIsLoading(false)
  }

  const isButtonLoading = isLoading || googleLoginMutation.isPending

  return (
    <>
      <Button
        type='button'
        variant='outline'
        className='w-full justify-center gap-3 rounded-xl border-muted/40 bg-background text-sm font-semibold shadow-sm hover:bg-slate-50'
        onClick={handleGoogleLogin}
        disabled={isButtonLoading}
      >
        {isButtonLoading ? (
          <>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
            Đang đăng nhập...
          </>
        ) : (
          <>
            <GoogleIcon className='size-5' />
            Đăng nhập với Google
          </>
        )}
      </Button>
      <RoleSelectionDialog
        open={showRoleDialog}
        onClose={handleDialogClose}
        onSelectRole={handleRoleSelected}
      />
    </>
  )
}
