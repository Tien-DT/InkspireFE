import { CheckCircle2 } from 'lucide-react'

interface SuccessOverlayProps {
  message?: string
  show: boolean
}

export function SuccessOverlay({ message = 'Thành công!', show }: SuccessOverlayProps) {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <div className='h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in duration-500'>
              <CheckCircle2 className='h-10 w-10 text-emerald-500 animate-in zoom-in duration-700' />
            </div>
          </div>
          <p className='text-sm font-medium text-gray-700'>{message}</p>
        </div>
      </div>
    </div>
  )
}
