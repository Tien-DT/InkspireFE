import { Outlet } from 'react-router'
import { cn } from '~/utils/cn'

interface HydrateFallbackProps {
  variant?: 'grid' | 'list' | 'details' | 'minimal'
  showHeader?: boolean
  items?: number
  className?: string
}

export function HydrateFallback({
  variant = 'grid',
  showHeader = true,
  items = 6,
  className
}: HydrateFallbackProps = {}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className='container mx-auto px-4 py-8 animate-pulse'>
        {showHeader && (
          <div className='space-y-4 mb-8'>
            <div className='h-8 w-[250px] bg-muted rounded' />
            {variant !== 'minimal' && <div className='h-4 w-[400px] bg-muted rounded opacity-70' />}
          </div>
        )}

        {variant === 'grid' && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: items }).map((_, i) => (
              <div key={i} className='p-4 rounded-lg border bg-card'>
                <div className='h-4 w-3/4 bg-muted rounded mb-2' />
                <div className='h-4 w-1/2 bg-muted rounded mb-4' />
                <div className='space-y-2'>
                  <div className='h-4 w-full bg-muted rounded' />
                  <div className='h-4 w-5/6 bg-muted rounded' />
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'list' && (
          <div className='space-y-4'>
            {Array.from({ length: items }).map((_, i) => (
              <div key={i} className='p-4 rounded-lg border bg-card flex gap-4'>
                <div className='w-16 h-16 rounded bg-muted' />
                <div className='flex-1 space-y-3'>
                  <div className='h-4 w-1/3 bg-muted rounded' />
                  <div className='h-4 w-3/4 bg-muted rounded opacity-70' />
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'details' && (
          <div className='max-w-2xl mx-auto space-y-6'>
            <div className='h-8 w-full bg-muted rounded mb-4' />
            <div className='space-y-4'>
              <div className='h-4 w-full bg-muted rounded' />
              <div className='h-4 w-5/6 bg-muted rounded' />
              <div className='h-4 w-4/5 bg-muted rounded' />
            </div>
            <div className='grid grid-cols-2 gap-4 mt-8'>
              <div className='h-20 bg-muted rounded' />
              <div className='h-20 bg-muted rounded' />
            </div>
          </div>
        )}

        {variant === 'minimal' && (
          <div className='max-w-md mx-auto space-y-4'>
            <div className='h-4 w-3/4 bg-muted rounded' />
            <div className='h-4 w-1/2 bg-muted rounded' />
          </div>
        )}
      </div>
      <Outlet />
    </div>
  )
}
