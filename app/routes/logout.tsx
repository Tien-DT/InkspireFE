import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { clearAllAuth } from '~/utils/auth'
import { toast } from 'sonner'
import { Spinner } from '~/components/ui/spinner'

export default function LogoutRoute() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all authentication data
        clearAllAuth()

        // Wait a bit for smooth animation
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Show success toast
        toast.success('Đăng xuất thành công', {
          description: 'Hẹn gặp lại bạn!'
        })

        // Redirect to home page
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Logout error:', error)
        // Still redirect even if there's an error
        navigate('/', { replace: true })
      } finally {
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [navigate])

  if (!isLoggingOut) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 animate-in fade-in duration-300'>
      <div className='flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500'>
        {/* Animated Logo/Icon */}
        <div className='relative flex items-center justify-center'>
          <Spinner size='xl' variant='blast' />
        </div>

        {/* Text with fade animation */}
        <div className='text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <h2 className='text-xl font-semibold text-gray-800'>Đang đăng xuất</h2>
          <p className='text-sm text-gray-600 animate-pulse'>Vui lòng đợi...</p>
        </div>

        {/* Progress bar */}
        <div className='w-48 h-1 bg-gray-200 rounded-full overflow-hidden'>
          <div className='h-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-[progress_800ms_ease-in-out]'></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
