import { Skeleton } from '~/components/ui/skeleton'
import { Card, CardContent } from '~/components/ui/card'

interface LoadingCardProps {
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

/**
 * Unified loading card component with shimmer effect
 * Supports different variants for various use cases
 */
export function LoadingCard({ variant = 'default', className = '' }: LoadingCardProps) {
  return (
    <Card className={`border-border/30 ${className}`}>
      <CardContent className='p-4 sm:p-5 md:p-6'>
        {variant === 'compact' && <CompactLoadingSkeleton />}
        {variant === 'default' && <DefaultLoadingSkeleton />}
        {variant === 'detailed' && <DetailedLoadingSkeleton />}
      </CardContent>
    </Card>
  )
}

/**
 * Compact skeleton - for simple list items
 */
function CompactLoadingSkeleton() {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between gap-3'>
        <Skeleton className='h-6 w-3/4' />
        <Skeleton className='h-5 w-20 rounded-full' />
      </div>
      <Skeleton className='h-4 w-full' />
      <div className='flex gap-2'>
        <Skeleton className='h-6 w-16 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
        <Skeleton className='h-6 w-24 rounded-full' />
      </div>
    </div>
  )
}

/**
 * Default skeleton - for job/project cards
 */
function DefaultLoadingSkeleton() {
  return (
    <div className='flex flex-col md:flex-row md:items-stretch md:justify-between gap-5 md:gap-8'>
      {/* Left Content */}
      <div className='md:w-3/4 space-y-4'>
        {/* Title + Badge */}
        <div className='flex items-start justify-between gap-3'>
          <Skeleton className='h-7 w-3/4' />
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>

        {/* User/Company Info */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-4 w-32' />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>

        {/* Tags/Skills */}
        <div className='flex gap-2 flex-wrap'>
          <Skeleton className='h-6 w-20 rounded-full' />
          <Skeleton className='h-6 w-24 rounded-full' />
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-28 rounded-full' />
        </div>

        {/* Meta Footer */}
        <div className='flex gap-4'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-32' />
        </div>
      </div>

      {/* Right Content - Status & Actions */}
      <div className='md:w-1/4 min-w-[200px] flex flex-col justify-between gap-4'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-4 w-24' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-11 w-full rounded-lg' />
          <Skeleton className='h-11 w-full rounded-lg' />
        </div>
      </div>
    </div>
  )
}

/**
 * Detailed skeleton - for profile/showcase cards
 */
function DetailedLoadingSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header with avatar */}
      <div className='flex items-center gap-4'>
        <Skeleton className='h-16 w-16 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-6 w-2/3' />
          <Skeleton className='h-4 w-1/2' />
        </div>
        <Skeleton className='h-6 w-24 rounded-full' />
      </div>

      {/* Content sections */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
      </div>

      {/* Skills grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
      </div>

      {/* Footer actions */}
      <div className='flex gap-3 pt-4 border-t border-border/30'>
        <Skeleton className='h-10 flex-1 rounded-lg' />
        <Skeleton className='h-10 flex-1 rounded-lg' />
      </div>
    </div>
  )
}

/**
 * Loading list component - renders multiple loading cards
 */
interface LoadingListProps {
  count?: number
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export function LoadingList({ count = 5, variant = 'default', className = '' }: LoadingListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <LoadingCard key={index} variant={variant} />
      ))}
    </div>
  )
}
