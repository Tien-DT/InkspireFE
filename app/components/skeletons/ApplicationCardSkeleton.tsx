import { Skeleton } from '~/components/ui/skeleton'
import { Card, CardContent } from '~/components/ui/card'

export const ApplicationCardSkeleton = () => {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-6'>
          {/* Left section - Job info */}
          <div className='flex-1 space-y-4'>
            {/* Job title and company */}
            <div>
              <Skeleton className='h-6 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2' />
            </div>

            {/* Job description */}
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />

            {/* Tags */}
            <div className='flex gap-2 flex-wrap'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-6 w-16 rounded-full' />
              ))}
            </div>

            {/* Meta info */}
            <div className='flex items-center gap-4 text-sm'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>

          {/* Right section - Status and actions */}
          <div className='text-right space-y-3 min-w-[160px]'>
            <Skeleton className='h-6 w-28 ml-auto rounded-full' />
            <Skeleton className='h-4 w-full' />
            <div className='flex gap-2'>
              <Skeleton className='h-9 flex-1' />
              <Skeleton className='h-9 flex-1' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List loading with multiple skeletons
export const ApplicationListSkeleton = () => {
  return (
    <div className='space-y-4'>
      {[1, 2, 3, 4].map((i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  )
}
