import { Briefcase, RefreshCcw, Search } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

export function JobListLoading() {
  return (
    <div className='space-y-8'>
      {[...Array(3)].map((_, index) => (
        <Card key={index} className='border'>
          <CardContent className='p-4 sm:p-5 md:p-6'>
            <div className='flex flex-col md:flex-row md:items-stretch md:justify-between gap-5 md:gap-8'>
              {/* Left Content Skeleton */}
              <div className='md:w-3/4 space-y-4 sm:space-y-5'>
                {/* Title + Badge */}
                <div className='flex items-start justify-between gap-3'>
                  <Skeleton className='h-7 w-3/4' />
                  <Skeleton className='h-6 w-20 rounded-md' />
                </div>

                {/* User Info */}
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-4 w-32' />
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                </div>

                {/* Categories */}
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-32' />
                </div>

                {/* Skills */}
                <div className='flex gap-2 flex-wrap'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-28' />
                </div>

                {/* Footer */}
                <div className='flex gap-4'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>

              {/* Right Content Skeleton */}
              <div className='md:w-1/4 min-w-[200px] flex flex-col justify-between gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-4 w-24' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-11 w-full' />
                  <Skeleton className='h-11 w-full' />
                </div>
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
    <Card className='border-2 border-dashed'>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center max-w-md mx-auto'>
          <div className='h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 ring-8 ring-muted/30'>
            <Search className='h-10 w-10 text-muted-foreground' />
          </div>
          <h3 className='text-xl font-bold mb-2'>Không tìm thấy công việc</h3>
          <p className='text-muted-foreground leading-relaxed'>
            Không có công việc nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ
            khóa khác.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobListError({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Card className='border-destructive/50 bg-destructive/5'>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center max-w-md mx-auto'>
          <div className='h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4 ring-8 ring-destructive/10'>
            <Briefcase className='h-10 w-10 text-destructive' />
          </div>
          <h3 className='text-xl font-bold mb-2'>Có lỗi xảy ra</h3>
          <p className='text-muted-foreground mb-6 leading-relaxed'>{error.message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant='outline' className='gap-2'>
              <RefreshCcw className='h-4 w-4' />
              Thử lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
