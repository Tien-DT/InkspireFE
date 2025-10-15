import { cn } from '~/lib/utils'

const TABS = [
  { id: 'all', label: 'Tất cả', accent: 'from-primary/60 via-primary/50 to-primary/40' },
  { id: 'pending', label: 'Chờ duyệt', accent: 'from-amber-400/60 via-amber-300/50 to-orange-300/40' },
  { id: 'active', label: 'Đang hoạt động', accent: 'from-sky-400/60 via-blue-300/50 to-indigo-300/40' },
  { id: 'completed', label: 'Hoàn thành', accent: 'from-emerald-400/60 via-green-300/50 to-teal-300/40' }
]

interface ProjectTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  projectCounts?: Record<string, number>
  isScrollable?: boolean
}

export function ProjectTabs({ activeTab, onTabChange, projectCounts = {}, isScrollable = false }: ProjectTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl border border-border/40 bg-card/80 p-1 shadow-inner shadow-black/5',
        isScrollable && 'overflow-x-auto pb-1'
      )}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type='button'
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex min-w-[140px] items-center justify-between gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-all',
              'bg-transparent',
              'outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
              isActive
                ? 'text-white shadow-lg shadow-primary/20'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            {isActive && (
              <span
                className={cn(
                  'pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br opacity-100',
                  tab.accent
                )}
              />
            )}
            <span>{tab.label}</span>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                isActive ? 'bg-white/20 text-white' : 'bg-muted text-foreground/80'
              )}
            >
              {projectCounts[tab.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
