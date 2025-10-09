import { Skeleton } from '~/components/ui/skeleton'
import { Card, CardContent } from '~/components/ui/card'

export const RecruitmentPostSkeleton = () => {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-6'>
          {/* Left section - Post info */}
          <div className='flex-1 space-y-4'>
            {/* Title and company */}
            <div>
              <Skeleton className='h-7 w-3/4 mb-3' />
              <Skeleton className='h-4 w-1/2' />
            </div>

            {/* Description */}
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />

            {/* Tags/Skills */}
            <div className='flex gap-2 flex-wrap'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-6 w-20 rounded-full' />
              ))}
            </div>

            {/* Meta info */}
            <div className='flex items-center gap-6 text-sm'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-28' />
            </div>
          </div>

          {/* Right section - Status and actions */}
          <div className='text-right space-y-3 min-w-[180px]'>
            <Skeleton className='h-6 w-24 ml-auto rounded-full' />
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List loading with multiple skeletons
export const RecruitmentPostListSkeleton = () => {
  return (
    <div className='space-y-4'>
      {[1, 2, 3, 4, 5].map((i) => (
        <RecruitmentPostSkeleton key={i} />
      ))}
    </div>
  )
}
