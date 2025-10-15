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

interface GoogleRegisterButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleRegisterButton({ onSuccess, onError }: GoogleRegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [pendingGoogleAuth, setPendingGoogleAuth] = useState<{
    idToken: string
    firstName?: string
    lastName?: string
  } | null>(null)
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()

  const googleRegisterMutation = useMutation<GoogleLoginResponse, AuthError, GoogleLoginRequest>({
    mutationFn: authApi.googleLogin,
    onSuccess: async (data) => {
      console.log('Google Register Response:', data)

      setAccessTokenToLS(data.access_token)
      setRefreshTokenToLS(data.refresh_token)

      if (data.user) {
        console.log('User from response:', data.user)
        setProfileToLS(data.user)
        setLastAuthContext('google', data.user?.email)
      } else {
        console.log('No user in response, extracting from JWT...')
        const userFromToken = extractUserFromToken(data.access_token)

        if (userFromToken) {
          console.log('User extracted from JWT:', userFromToken)
          setProfileToLS(userFromToken)
          setLastAuthContext('google', userFromToken.email)
        } else {
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

      refreshAuth()
      toast.success('Đăng ký thành công!')

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/')
      }
    },
    onError: (error: AuthError) => {
      console.error('Google register error:', error)

      if (error?.response?.status === 400) {
        if (error?.response?.data?.error === 'INVALID_CREDENTIALS') {
          toast.error('Thông tin xác thực không hợp lệ')
        } else if (error?.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Email chưa được xác thực')
        } else {
          toast.error(error?.response?.data?.message || 'Thông tin đăng ký không hợp lệ')
        }
      } else if (error?.response?.status === 409) {
        toast.error('Email đã được sử dụng')
      } else {
        toast.error(error?.response?.data?.message || 'Đăng ký Google thất bại')
      }

      if (onError) {
        onError(error?.response?.data?.message || error?.message || 'Đăng ký thất bại')
      }
    }
  })

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true)

      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      const displayName = result.user.displayName || ''
      const nameParts = displayName.split(' ')
      const firstName = nameParts[0] || undefined
      const lastName = nameParts.slice(1).join(' ') || undefined

      setPendingGoogleAuth({ idToken, firstName, lastName })
      setShowRoleDialog(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Firebase sign in error:', error)
      setIsLoading(false)

      if (error instanceof Error) {
        const firebaseError = error as { code?: string; message: string }

        if (firebaseError.code === 'auth/popup-closed-by-user') {
          toast.info('Đăng ký bị hủy')
        } else if (firebaseError.code === 'auth/cancelled-popup-request') {
          // Silent
        } else {
          toast.error('Không thể đăng ký với Google')
        }

        if (onError) {
          onError(firebaseError.message)
        }
      } else {
        toast.error('Có lỗi xảy ra khi đăng ký với Google')
        if (onError) {
          onError('Unknown error occurred')
        }
      }
    }
  }

  const handleRoleSelected = (role: UserRole) => {
    if (pendingGoogleAuth) {
      googleRegisterMutation.mutate({
        idToken: pendingGoogleAuth.idToken,
        firstName: pendingGoogleAuth.firstName,
        lastName: pendingGoogleAuth.lastName,
        rememberMe: false,
        role
      })
      setPendingGoogleAuth(null)
    }
  }

  const handleDialogClose = () => {
    setShowRoleDialog(false)
    setPendingGoogleAuth(null)
  }

  const isButtonLoading = isLoading || googleRegisterMutation.isPending

  return (
    <>
      <Button
        type='button'
        variant='outline'
        className='w-full justify-center gap-3 rounded-xl border-muted/40 bg-background text-sm font-semibold shadow-sm hover:bg-slate-50'
        onClick={handleGoogleRegister}
        disabled={isButtonLoading}
      >
        {isButtonLoading ? (
          <>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
            Đang xử lý...
          </>
        ) : (
          <>
            <GoogleIcon className='size-5' />
            Đăng ký với Google
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
