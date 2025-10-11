import { useEffect, useState } from 'react'
import { Card } from '~/components/ui/card'
import { adminApi } from '~/apis/admin.api'

type ProjectStat = {
  value: string
  label: string
  accentClass: string
}

export function ProjectStatsCards() {
  const [stats, setStats] = useState<ProjectStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectStats()
  }, [])

  const fetchProjectStats = async () => {
    try {
      const data = await adminApi.getDashboardStats()
      const projectStats = data.projectStats
      
      const formattedStats: ProjectStat[] = [
        { value: projectStats.totalProjects.toLocaleString(), label: 'Tổng dự án', accentClass: 'text-teal-600' },
        { value: projectStats.activeProjects.toLocaleString(), label: 'Đang thực hiện', accentClass: 'text-blue-600' },
        { value: projectStats.completedProjects.toLocaleString(), label: 'Đã hoàn thành', accentClass: 'text-amber-600' },
        { value: projectStats.pendingProjects.toLocaleString(), label: 'Chờ duyệt', accentClass: 'text-red-600' }
      ]
      setStats(formattedStats)
    } catch (error) {
      console.error('Failed to fetch project stats:', error)
      // Use default data if API fails
      setStats(getDefaultStats())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultStats = (): ProjectStat[] => [
    { value: '0', label: 'Tổng dự án', accentClass: 'text-teal-600' },
    { value: '0', label: 'Đang thực hiện', accentClass: 'text-blue-600' },
    { value: '0', label: 'Đã hoàn thành', accentClass: 'text-amber-600' },
    { value: '0', label: 'Chờ duyệt', accentClass: 'text-red-600' }
  ]

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-white/90 p-6 shadow-sm backdrop-blur-sm'>
            <div className='h-16 animate-pulse bg-gray-200 rounded'></div>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='bg-white/90 p-6 shadow-sm backdrop-blur-sm'>
          <div className='space-y-1'>
            <p className={`text-3xl font-bold ${stat.accentClass}`}>{stat.value}</p>
            <p className='text-sm text-slate-600'>{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
