import { TabsList, TabsTrigger } from '~/components/ui/tabs'

type TabType = 'intro' | 'portfolio' | 'reviews'

interface ProfileTabsProps {
  userRole?: number
}

const ALL_TABS: Array<{ value: TabType; label: string; requiredRole?: number }> = [
  { value: 'intro', label: 'Giới thiệu' },
  { value: 'portfolio', label: 'Portfolio', requiredRole: 2 }, // Only for freelancers (role 2)
  { value: 'reviews', label: 'Lịch sử & Đánh giá' }
]

export function ProfileTabs({ userRole = 1 }: ProfileTabsProps) {
  // Filter tabs based on user role
  const visibleTabs = ALL_TABS.filter(tab => !tab.requiredRole || tab.requiredRole === userRole)

  return (
    <TabsList className='inline-flex h-10 w-full items-center justify-start rounded-lg bg-transparent p-0 text-muted-foreground'>
      {visibleTabs.map((tab) => (
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
