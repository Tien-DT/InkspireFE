import { Skeleton } from '~/components/ui/skeleton'
import { Card, CardContent } from '~/components/ui/card'

export const JobCardSkeleton = () => {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <Skeleton className='h-6 w-3/4 mb-2' />
            <Skeleton className='h-4 w-1/2 mb-3' />
            <Skeleton className='h-4 w-full mb-4' />
            <div className='flex gap-2 mb-4'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-6 w-20' />
              ))}
            </div>
            <div className='flex items-center space-x-6'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-28' />
            </div>
          </div>
          <div className='text-right ml-6'>
            <Skeleton className='h-8 w-32 mb-2' />
            <Skeleton className='h-4 w-24 mb-4' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
