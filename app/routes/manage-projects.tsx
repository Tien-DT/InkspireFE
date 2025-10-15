import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Folder } from 'lucide-react'
import { ProjectList } from '~/components/manage-project/ProjectList'
import { PageHeader, UnifiedStatsCards, FilterTabs } from '~/components/shared'
import type { StatsCardConfig, FilterOption } from '~/components/shared'
import { useProjects } from '~/hooks/useProjects'
import type { Project } from '~/apis/project.api'

export default function ManageProject() {
  const [activeTab, setActiveTab] = useState('all')
  const { data, isLoading, error } = useProjects()

  const projects = useMemo<Project[]>(() => data?.data ?? [], [data])

  const projectCounts = useMemo(() => {
    return projects.reduce(
      (acc, project) => {
        acc.all += 1
        if (project.status === 1) acc.pending += 1
        if (project.status === 2) acc.active += 1
        if (project.status === 3) acc.completed += 1
        return acc
      },
      { all: 0, pending: 0, active: 0, completed: 0 }
    )
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (activeTab === 'all') {
      return [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    const statusMap: Record<string, number> = { pending: 1, active: 2, completed: 3 }
    const status = statusMap[activeTab]
    if (!status) {
      return [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return projects
      .filter((project) => project.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [projects, activeTab])

  const statsCards = useMemo<StatsCardConfig[]>(
    () => [
      {
        key: 'all',
        label: 'Tất cả dự án',
        description: 'Tổng số dự án trong hệ thống',
        value: projectCounts.all,
        icon: Folder,
        accent: 'from-primary/20 via-primary/5 to-transparent'
      },
      {
        key: 'pending',
        label: 'Chờ duyệt',
        description: 'Đang chờ phê duyệt',
        value: projectCounts.pending,
        icon: AlertCircle,
        accent: 'from-amber-200/40 via-transparent to-transparent'
      },
      {
        key: 'active',
        label: 'Đang hoạt động',
        description: 'Đã được phê duyệt',
        value: projectCounts.active,
        icon: Clock,
        accent: 'from-sky-200/40 via-transparent to-transparent'
      },
      {
        key: 'completed',
        label: 'Hoàn thành',
        description: 'Đã hoàn tất dự án',
        value: projectCounts.completed,
        icon: CheckCircle2,
        accent: 'from-emerald-200/40 via-transparent to-transparent'
      }
    ],
    [projectCounts]
  )

  const filterOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: 'Tất cả', count: projectCounts.all },
      { value: 'pending', label: 'Chờ duyệt', count: projectCounts.pending },
      { value: 'active', label: 'Đang hoạt động', count: projectCounts.active },
      { value: 'completed', label: 'Hoàn thành', count: projectCounts.completed }
    ],
    [projectCounts]
  )

  return (
    <main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-10'>
      <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 md:px-6 lg:px-10'>
        <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md backdrop-blur-sm md:p-10'>
          <PageHeader
            badge='Bảng điều khiển dự án'
            title='Quản lý công việc'
            description='Theo dõi tiến độ, trao đổi và cập nhật dự án chỉ trong một nơi.'
          />

          <div className='mt-8 space-y-6'>
            <UnifiedStatsCards cards={statsCards} isLoading={isLoading} />
            <FilterTabs options={filterOptions} activeValue={activeTab} onChange={setActiveTab} />
          </div>
        </section>

        <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md backdrop-blur-sm md:p-8'>
          <ProjectList projects={filteredProjects} activeTab={activeTab} isLoading={isLoading} error={error} />
        </section>
      </div>
    </main>
  )
}
