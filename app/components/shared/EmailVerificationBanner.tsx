import { useState } from 'react'
import { AlertCircle, Mail, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '~/contexts/AuthContext'

export function EmailVerificationBanner() {
  const { profile } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Only show if user is logged in and email is not verified
  // status === 0 means email not verified
  if (!profile || profile.status !== 0 || !isVisible) {
    return null
  }

  const handleResendEmail = async () => {
    if (!profile.email) {
      toast.error('Không tìm thấy email')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: profile.email
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Email xác thực đã được gửi!', {
          description: 'Vui lòng kiểm tra hộp thư của bạn.'
        })
      } else if (response.status === 429) {
        toast.error('Vui lòng đợi một chút', {
          description: data.message || 'Email xác thực vừa mới được gửi.'
        })
      } else {
        toast.error(data.message || 'Không thể gửi email. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className='bg-amber-50 border-b border-amber-200'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3 flex-1'>
            <AlertCircle className='h-5 w-5 text-amber-600 flex-shrink-0' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-amber-900'>
                Email chưa được xác thực
              </p>
              <p className='text-xs text-amber-700 mt-0.5'>
                Vui lòng kiểm tra email <span className='font-semibold'>{profile.email}</span> để xác thực tài khoản.
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleResendEmail}
              disabled={isSending}
              className='bg-white border-amber-300 text-amber-900 hover:bg-amber-50 hover:border-amber-400'
            >
              <Mail className='h-4 w-4 mr-2' />
              {isSending ? 'Đang gửi...' : 'Gửi lại email'}
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => setIsVisible(false)}
              className='text-amber-700 hover:bg-amber-100'
              title='Đóng thông báo'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
