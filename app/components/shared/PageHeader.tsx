import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'

interface PageHeaderProps {
  badge: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function PageHeader({ badge, title, description, actionLabel, actionHref, onAction }: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
      <div className='space-y-3'>
        <span className='inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary'>
          {badge}
        </span>
        <div>
          <h1 className='text-3xl font-semibold text-foreground md:text-4xl'>{title}</h1>
          <p className='mt-2 text-sm text-muted-foreground md:text-base'>{description}</p>
        </div>
      </div>

      {(actionLabel && actionHref) || onAction ? (
        <Button
          asChild={!!actionHref}
          onClick={onAction}
          className='inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
        >
          {actionHref ? (
            <Link to={actionHref}>
              <Plus className='h-4 w-4' />
              {actionLabel}
            </Link>
          ) : (
            <>
              <Plus className='h-4 w-4' />
              {actionLabel}
            </>
          )}
        </Button>
      ) : null}
    </div>
  )
}
