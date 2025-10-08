import { TabsList, TabsTrigger } from '~/components/ui/tabs'

type TabType = 'intro' | 'portfolio' | 'reviews'

const TABS: Array<{ value: TabType; label: string }> = [
  { value: 'intro', label: 'Giới thiệu' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Lịch sử & Đánh giá' }
]

export function ProfileTabs() {
  return (
    <TabsList className='inline-flex h-11 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-full'>
      {TABS.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm'
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
