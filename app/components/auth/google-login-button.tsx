import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signInWithPopup } from 'firebase/auth'
import { useMutation } from '@tanstack/react-query'
import { auth, googleProvider } from '~/lib/firebase'
import { authApi } from '~/apis/auth.api'
import { GoogleIcon } from '~/components/icons/google-icon'
import { Button } from '~/components/ui/button'
import { setAccessTokenToLS, setRefreshTokenToLS, setProfileToLS, setLastAuthContext } from '~/utils/auth'
import { useAuth } from '~/contexts/AuthContext'
import { toast } from 'sonner'

interface GoogleLoginButtonProps {
  rememberMe?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleLoginButton({ rememberMe = false, onSuccess, onError }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()

  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data) => {
      // Lưu tokens vào localStorage
      setAccessTokenToLS(data.access_token)
      setRefreshTokenToLS(data.refresh_token)
      
      // Lưu thông tin user nếu có
      if (data.user) {
        setProfileToLS(data.user as any)
      }
      
      // Lưu last auth context
      setLastAuthContext('google', data.user?.email)
      
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
    onError: (error: any) => {
      console.error('Google login error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập Google thất bại'
      toast.error(errorMessage)
      
      if (onError) {
        onError(errorMessage)
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
      
      // Call backend API with the ID token
      googleLoginMutation.mutate({
        idToken,
        firstName,
        lastName,
        rememberMe
      })
    } catch (error: any) {
      console.error('Firebase sign in error:', error)
      setIsLoading(false)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Đăng nhập bị hủy')
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Silent - user already has a popup open
      } else {
        toast.error('Không thể đăng nhập với Google')
      }
      
      if (onError) {
        onError(error.message)
      }
    }
  }

  const isButtonLoading = isLoading || googleLoginMutation.isPending

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-3 rounded-xl border-muted/40 bg-background text-sm font-semibold shadow-sm hover:bg-slate-50"
      onClick={handleGoogleLogin}
      disabled={isButtonLoading}
    >
      {isButtonLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          Đang đăng nhập...
        </>
      ) : (
        <>
          <GoogleIcon className="size-5" />
          Đăng nhập với Google
        </>
      )}
    </Button>
  )
}
