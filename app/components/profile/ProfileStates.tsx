import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

interface ProfileLoadingStateProps {
  message?: string
}

export function ProfileLoadingState({ message = 'Đang tải thông tin profile...' }: ProfileLoadingStateProps) {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center'>
        <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mb-4'></div>
        <p className='text-gray-600'>{message}</p>
      </div>
    </div>
  )
}

interface ProfileErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ProfileErrorState({
  message = 'Không thể tải thông tin profile. Vui lòng thử lại sau.',
  onRetry
}: ProfileErrorStateProps) {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <Card className='max-w-md mx-4'>
        <CardContent className='py-12 text-center'>
          <div className='h-16 w-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4'>
            <svg className='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>Có lỗi xảy ra</h3>
          <p className='text-gray-600 mb-4'>{message}</p>
          <Button onClick={onRetry || (() => window.location.reload())} className='btn-submit'>
            Tải lại trang
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
