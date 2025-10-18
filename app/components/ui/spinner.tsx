import { cn } from '~/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white' | 'gradient' | 'blast'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const borderSizes = {
  sm: 'border-2',
  md: 'border-3',
  lg: 'border-4',
  xl: 'border-[5px]'
}

/**
 * @deprecated Sử dụng hydrateFallback của React Router thay vào đó
 * Thay vì dùng component Spinner, hãy return null khi isLoading/!authReady
 * React Router sẽ tự động hiển thị HydrateFallback
 */
export function Spinner({ size = 'md', variant = 'blast', className, label }: SpinnerProps) {
  const baseClasses = cn('inline-block rounded-full animate-spin', sizeClasses[size], borderSizes[size], className)

  // Variant styles
  const variantClasses = {
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-muted/30 border-t-foreground',
    white: 'border-white/20 border-t-white',
    gradient: 'border-transparent'
  }

  if (variant === 'gradient') {
    return (
      <div className='relative inline-flex items-center justify-center'>
        {/* Gradient ring spinner */}
        <div
          className={cn(
            'rounded-full bg-gradient-to-tr from-primary via-primary/60 to-secondary',
            'animate-spin',
            sizeClasses[size]
          )}
          style={{
            maskImage: 'radial-gradient(circle, transparent 35%, black 35%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 35%, black 35%)'
          }}
        />
        {/* Inner pulse effect */}
        <div
          className={cn(
            'absolute inset-0 m-auto rounded-full bg-primary/20 animate-pulse',
            size === 'sm' && 'h-2 w-2',
            size === 'md' && 'h-4 w-4',
            size === 'lg' && 'h-6 w-6',
            size === 'xl' && 'h-8 w-8'
          )}
        />
        {label && <span className='sr-only'>{label}</span>}
      </div>
    )
  }

  if (variant === 'blast') {
    return (
      <div className='relative inline-flex items-center justify-center'>
        {/* Blast spinner */}
        <div className={cn('blast-loader', sizeClasses[size])} role='status'>
          <span className='sr-only'>{label || 'Đang tải...'}</span>
        </div>
        {label && <span className='sr-only'>{label}</span>}
      </div>
    )
  }

  return (
    <div className='inline-flex items-center gap-3'>
      <div className={cn(baseClasses, variantClasses[variant])} role='status'>
        <span className='sr-only'>{label || 'Đang tải...'}</span>
      </div>
      {label && <span className='text-sm text-muted-foreground'>{label}</span>}
    </div>
  )
}

/**
 * @deprecated Sử dụng hydrateFallback của React Router thay vào đó
 */
interface LoadingOverlayProps {
  message?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white' | 'gradient' | 'blast'
}

export function LoadingOverlay({ message = 'Đang tải...', size = 'lg', variant = 'blast' }: LoadingOverlayProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        <Spinner size={size} variant={variant} />
        {message && <p className='text-sm font-medium text-foreground animate-pulse'>{message}</p>}
      </div>
    </div>
  )
}

/**
 * @deprecated Sử dụng hydrateFallback của React Router thay vào đó
 */
interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'gradient' | 'blast'
  className?: string
}

export function LoadingState({
  message = 'Đang tải...',
  size = 'md',
  variant = 'blast',
  className
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16', className)}>
      <Spinner size={size} variant={variant} />
      {message && <p className='text-sm text-muted-foreground'>{message}</p>}
    </div>
  )
}

/**
 * Button loading spinner - GIỮ LẠI cho button submit states
 * Đây là ngoại lệ vì nó được dùng inline trong buttons, không phải layout-level loading
 */
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      role='status'
    >
      <span className='sr-only'>Đang tải...</span>
    </div>
  )
}
