import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        featured: 'bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-yellow-500 border-yellow-600/50 font-bold tracking-wide [a&]:hover:text-yellow-400 [a&]:hover:border-yellow-500 shadow-lg hover:shadow-yellow-500/20 transition-all',
        signature: 'bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-amber-400 border-amber-500/50 font-bold tracking-wide [a&]:hover:text-amber-300 [a&]:hover:border-amber-400 shadow-lg hover:shadow-amber-500/20 transition-all',
        blue: 'bg-blue-100 text-blue-800 border-blue-200 [a&]:hover:bg-blue-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200 [a&]:hover:bg-purple-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200 [a&]:hover:bg-orange-200',
        pink: 'bg-pink-100 text-pink-800 border-pink-200 [a&]:hover:bg-pink-200',
        green: 'bg-green-100 text-green-800 border-green-200 [a&]:hover:bg-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 [a&]:hover:bg-yellow-200',
        red: 'bg-red-100 text-red-800 border-red-200 [a&]:hover:bg-red-200',
        indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 [a&]:hover:bg-indigo-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot='badge' className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
