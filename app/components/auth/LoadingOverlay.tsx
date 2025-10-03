interface LoadingOverlayProps {
  message?: string
  show: boolean
}

export function LoadingOverlay({ message = 'Đang xử lý...', show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <div className='h-16 w-16 rounded-full border-4 border-emerald-100'></div>
            <div className='absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-500'></div>
          </div>
          <p className='text-sm font-medium text-gray-700 animate-pulse'>{message}</p>
        </div>
      </div>
    </div>
  )
}
