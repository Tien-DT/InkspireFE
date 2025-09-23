import * as React from 'react'

import { cn } from '~/utils/cn'

type SeparatorProps = React.ComponentProps<'div'>

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      data-orientation={orientation}
      role='separator'
      className={cn(
        'bg-border/60',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
