import * as React from 'react'

import { cn } from '~/utils/cn'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-xs font-semibold uppercase tracking-wide text-muted-foreground/90', className)} {...props} />
))
Label.displayName = 'Label'

export { Label }
