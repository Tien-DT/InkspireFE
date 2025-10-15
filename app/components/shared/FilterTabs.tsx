import { cn } from '~/lib/utils'

export interface FilterOption {
  value: string
  label: string
  count: number
}

interface FilterTabsProps {
  options: FilterOption[]
  activeValue: string
  onChange: (value: string) => void
}

export function FilterTabs({ options, activeValue, onChange }: FilterTabsProps) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {options.map(({ value, label, count }) => (
        <button
          key={value}
          type='button'
          onClick={() => onChange(value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            activeValue === value && 'border-primary/60 bg-primary/15 text-primary shadow-sm'
          )}
        >
          <span>{label}</span>
          <span
            className={cn(
              'rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground',
              activeValue === value && 'bg-primary text-primary-foreground'
            )}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  )
}
