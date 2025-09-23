import * as React from 'react'

import { cn } from '~/utils/cn'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      type='checkbox'
      ref={ref}
      className={cn(
        'size-4 rounded-md border border-input bg-background text-primary accent-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }
