const tabs = [
  { id: 'all', label: 'Tất cả', count: 0, status: null },
  { id: 'pending', label: 'Chờ duyệt', count: 0, status: 1 },
  { id: 'active', label: 'Đang hoạt động', count: 0, status: 2 },
  { id: 'completed', label: 'Hoàn thành', count: 0, status: 3 }
]

interface ProjectTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  projectCounts?: Record<string, number>
}

export function ProjectTabs({ activeTab, onTabChange, projectCounts = {} }: ProjectTabsProps) {
  return (
    <div className='grid grid-cols-4 gap-0 mb-6 rounded-lg overflow-hidden border'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-[oklch(0.55_0.15_240)] text-white'
              : 'bg-white text-foreground hover:bg-secondary'
          }`}
        >
          {tab.label} ({projectCounts[tab.id] || 0})
        </button>
      ))}
    </div>
  )
}
