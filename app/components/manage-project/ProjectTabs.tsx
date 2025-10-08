import { useState } from 'react'

const tabs = [
  { id: 'active', label: 'Đang hoạt động', count: 3 },
  { id: 'pending', label: 'Chờ duyệt', count: 1 },
  { id: 'revision', label: 'Cần sửa đổi', count: 1 },
  { id: 'completed', label: 'Hoàn thành', count: 2 }
]

export function ProjectTabs() {
  const [activeTab, setActiveTab] = useState('active')

  return (
    <div className='grid grid-cols-4 gap-0 mb-6 rounded-lg overflow-hidden border'>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-[oklch(0.55_0.15_240)] text-white'
              : 'bg-white text-foreground hover:bg-secondary'
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  )
}
