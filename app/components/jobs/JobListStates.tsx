import { Briefcase } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export function JobListLoading() {
  return (
    <div className='space-y-8'>
      {[...Array(3)].map((_, index) => (
        <Card key={index} className='border border-gray-200'>
          <CardContent className='px-6 py-4'>
            <div className='flex items-stretch justify-between gap-8'>
              <div className='w-3/4 space-y-5'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-8 rounded-full w-32' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
              <div className='w-1/4 flex flex-col justify-between gap-4'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function JobListEmpty() {
  return (
    <Card>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center'>
          <div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
            <Briefcase className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Không tìm thấy công việc</h3>
          <p className='text-gray-600 max-w-md'>
            Không có công việc nào phù hợp với tiêu chí tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa
            khác.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobListError({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Card>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center'>
          <div className='h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4'>
            <svg className='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Có lỗi xảy ra</h3>
          <p className='text-gray-600 mb-4'>{error.message}</p>
          {onRetry && (
            <button className='text-blue-600 hover:text-blue-800 font-medium' onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
