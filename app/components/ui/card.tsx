import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const cardVariants = cva(
  'bg-card text-card-foreground flex flex-col rounded-xl transition-all duration-300 ease-in-out [&>[data-slot=card-header]+[data-slot=card-content]]:border-t [&>[data-slot=card-header]+[data-slot=card-content]]:pt-6 [&>[data-slot=card-content]+[data-slot=card-footer]]:border-t [&>[data-slot=card-content]+[data-slot=card-footer]]:pt-6',
  {
    variants: {
      size: {
        default: 'gap-6 p-6',
        compact: 'gap-4 p-4'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
      },
      variant: {
        default: '',
        gradient:
          'bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800'
      }
    },
    defaultVariants: {
      size: 'default',
      shadow: 'sm',
      variant: 'default'
    }
  }
)

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {
  isInteractive?: boolean
}

function Card({ className, size, shadow, variant, isInteractive, onClick, ...props }: CardProps) {
  const interactive = isInteractive || !!onClick

  return (
    <div
      data-slot='card'
      className={cn(
        cardVariants({ size, shadow, variant }),
        interactive && 'cursor-pointer hover:-translate-y-1 hover:shadow-md',
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-description' className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-content' className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-footer' className={cn('flex items-center', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, cardVariants }
export type { CardProps }
