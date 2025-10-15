import type { LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Skeleton } from '~/components/ui/skeleton'

export interface StatsCardConfig {
  key: string
  label: string
  description: string
  value: number | string
  icon: LucideIcon
  accent: string
}

interface UnifiedStatsCardsProps {
  cards: StatsCardConfig[]
  isLoading?: boolean
}

export function UnifiedStatsCards({ cards, isLoading = false }: UnifiedStatsCardsProps) {
  const gridCols =
    cards.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'

  return (
    <div className={cn('grid gap-4', gridCols)}>
      {cards.map(({ key, label, description, value, icon: Icon, accent }) => (
        <div
          key={key}
          className='relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md'
        >
          <span
            className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t opacity-70', accent)}
            aria-hidden
          />
          <div className='relative flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs uppercase tracking-wide text-muted-foreground' title={label}>
                {label}
              </p>
              {isLoading ? (
                <Skeleton className='mt-2 h-9 w-16 rounded-lg bg-muted/60' />
              ) : (
                <p className='mt-2 text-3xl font-semibold text-foreground'>{value}</p>
              )}
              <p className='mt-1 line-clamp-2 text-xs text-muted-foreground/80' title={description}>
                {description}
              </p>
            </div>
            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm'>
              <Icon className='h-5 w-5' />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
