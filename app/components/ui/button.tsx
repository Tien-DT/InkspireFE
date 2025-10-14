import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  "group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-shadow aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&_svg]:transition-transform",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-white active:scale-[0.98]',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 active:scale-[0.98]',
        outline:
          'border border-input bg-background text-foreground shadow-xs transition-colors duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:hover:text-primary/80 active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.98]',
        ghost:
          'text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary/90',
        link: 'text-primary underline-offset-4 hover:underline',
        pill: 'rounded-full bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-[0.98]',
        shine:
          'relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground shadow-md hover:shadow-lg active:scale-[0.98] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700',
        'ghost-white':
          'bg-transparent border-2 border-white/80 text-white/90 transition-all duration-300 hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.98]'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className='size-4 animate-spin' />
          <span className='sr-only'>Loading...</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
