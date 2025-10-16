import { Spinner } from '~/components/ui/spinner'

interface LoadingOverlayProps {
  message?: string
  show: boolean
}

export function LoadingOverlay({ message = 'Đang xử lý...', show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-card rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300'>
        <div className='flex flex-col items-center space-y-4'>
          <Spinner size='lg' variant='blast' />
          <p className='text-sm font-medium text-gray-700 dark:text-muted-foreground animate-pulse'>{message}</p>
        </div>
      </div>
    </div>
  )
}

