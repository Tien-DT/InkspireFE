import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'

interface ProfileLoadingStateProps {
  message?: string
}

export function ProfileLoadingState({ message = 'Đang tải thông tin profile...' }: ProfileLoadingStateProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 via-background to-background'>
      <div className='text-center'>
        <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center'>
          <Spinner size='lg' variant='blast' />
        </div>
        <p className='text-sm text-muted-foreground'>{message}</p>
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 via-background to-background px-4'>
      <Card className='mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/40 bg-card/90 shadow-2xl backdrop-blur'>
        <CardContent className='py-14 text-center'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <svg className='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-semibold text-foreground'>Có lỗi xảy ra</h3>
          <p className='mx-auto mt-3 max-w-sm text-sm text-muted-foreground'>{message}</p>
          <Button onClick={onRetry || (() => window.location.reload())} variant='shine' size='lg' className='mt-8 px-8'>
            Tải lại trang
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
