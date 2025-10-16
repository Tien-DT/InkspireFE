import { cn } from '~/lib/utils'

interface ButtonSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

export function ButtonSpinner({ className, size = 'sm' }: ButtonSpinnerProps) {
  return <span className={cn('loader', sizeClasses[size], className)} />
}
