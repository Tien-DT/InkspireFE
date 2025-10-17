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
      // Gọi tuần tự các API count và log để debug
      const activeProjects = await adminApi.getTotalProjectsCount({ status: 1 })
      console.log('Active projects:', activeProjects, typeof activeProjects)

      const completedProjects = await adminApi.getTotalProjectsCount({ status: 2 })
      console.log('Completed projects:', completedProjects, typeof completedProjects)

      const pendingProjects = await adminApi.getTotalProjectsCount({ status: 0 })
      console.log('Pending projects:', pendingProjects, typeof pendingProjects)

      // Đảm bảo tất cả là số
      const active = Number(activeProjects) || 0
      const completed = Number(completedProjects) || 0
      const pending = Number(pendingProjects) || 0

      // Tính tổng thực tế
      const actualTotal = active + completed + pending

      const formattedStats: ProjectStat[] = [
        { value: actualTotal.toString(), label: 'Tổng dự án', accentClass: 'text-teal-600' },
        { value: active.toString(), label: 'Đang thực hiện', accentClass: 'text-blue-600' },
        { value: completed.toString(), label: 'Đã hoàn thành', accentClass: 'text-amber-600' },
        { value: pending.toString(), label: 'Chờ duyệt', accentClass: 'text-red-600' }
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
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-white dark:bg-slate-950 p-4 sm:p-6 shadow-none border-0 backdrop-blur-sm'>
            <div className='h-12 sm:h-16 animate-pulse bg-gray-200 rounded'></div>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='bg-white dark:bg-slate-950 p-6 shadow-none border-0 backdrop-blur-sm'>
          <div className='space-y-1'>
            <p className={`text-3xl font-bold ${stat.accentClass}`}>{stat.value}</p>
            <p className='text-sm text-slate-600'>{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
