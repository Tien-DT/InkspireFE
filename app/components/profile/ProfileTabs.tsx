import { TabsList, TabsTrigger } from '~/components/ui/tabs'

type TabType = 'intro' | 'portfolio' | 'reviews'

const TABS: Array<{ value: TabType; label: string }> = [
  { value: 'intro', label: 'Giới thiệu' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Lịch sử & Đánh giá' }
]

export function ProfileTabs() {
  return (
    <TabsList className='inline-flex h-12 w-full items-center justify-start rounded-2xl border border-border/50 bg-card/80 p-1 text-muted-foreground shadow-sm backdrop-blur-sm'>
      {TABS.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className='inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
