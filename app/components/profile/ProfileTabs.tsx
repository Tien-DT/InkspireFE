import { TabsList, TabsTrigger } from '~/components/ui/tabs'

type TabType = 'intro' | 'portfolio' | 'reviews'

const TABS: Array<{ value: TabType; label: string }> = [
  { value: 'intro', label: 'Giới thiệu' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Lịch sử & Đánh giá' }
]

export function ProfileTabs() {
  return (
    <TabsList className='inline-flex h-10 w-full items-center justify-start rounded-lg bg-transparent p-0 text-muted-foreground'>
      {TABS.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className='inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all border-b-2 border-transparent focus-visible:outline-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent'
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
