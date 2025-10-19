import { Button } from '~/components/ui/button'

/**
 * @deprecated ProfileLoadingState - Sử dụng hydrateFallback của React Router thay vào đó
 * Trả về null từ route khi isLoading = true, React Router sẽ hiển thị HydrateFallback
 */
export function ProfileLoadingState() {
  // No longer used - hydrateFallback will handle loading
  return null
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4'>
      <div className='mx-auto w-full max-w-md rounded-2xl border border-border/30 bg-card/30 p-8 text-center backdrop-blur-md'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center text-destructive/70'>
          <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-foreground'>Có lỗi xảy ra</h3>
        <p className='mx-auto mt-2 max-w-sm text-sm text-muted-foreground/70'>{message}</p>
        <Button onClick={onRetry || (() => window.location.reload())} variant='shine' size='lg' className='mt-6 px-8'>
          Tải lại trang
        </Button>
      </div>
    </div>
  )
}
