import { Card, CardContent } from '~/components/ui/card'

type TabType = 'intro' | 'portfolio' | 'reviews'

interface ProfileTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const TABS: Array<{ value: TabType; label: string }> = [
  { value: 'intro', label: 'Giới thiệu' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'reviews', label: 'Lịch sử & Đánh giá' }
]

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <Card>
      <CardContent className='p-0'>
        <div className='flex border-b'>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === tab.value
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
