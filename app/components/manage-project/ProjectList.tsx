import { AlertTriangle, Inbox } from 'lucide-react'
import type { Project } from '~/apis/project.api'
import { ProjectCard } from '~/components/manage-project/ProjectCard'
import { ProjectListSkeleton } from '~/components/skeletons'

interface ProjectListProps {
  projects: Project[]
  activeTab: string
  isLoading: boolean
  error: unknown
}

export function ProjectList({ projects, activeTab, isLoading, error }: ProjectListProps) {
  if (isLoading) {
    return <ProjectListSkeleton />
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
          <AlertTriangle className='h-6 w-6' />
        </div>
        <h3 className='mt-4 text-lg font-semibold text-destructive'>Không thể tải dữ liệu</h3>
        <p className='mt-2 max-w-md text-sm text-destructive/80'>
          Đã xảy ra lỗi trong quá trình lấy danh sách dự án. Vui lòng thử lại sau ít phút.
        </p>
      </div>
    )
  }

  if (projects.length === 0) {
    const tabLabel =
      activeTab === 'all'
        ? 'Bạn chưa có dự án nào trong hệ thống.'
        : activeTab === 'pending'
          ? 'Chưa có dự án nào ở trạng thái Chờ duyệt.'
          : activeTab === 'active'
            ? 'Chưa có dự án nào đang hoạt động.'
            : 'Chưa có dự án nào đã hoàn thành.'

    return (
      <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center'>
        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Inbox className='h-7 w-7' />
        </div>
        <h3 className='mt-4 text-lg font-semibold text-foreground'>Chưa có dự án phù hợp</h3>
        <p className='mt-2 max-w-md text-sm text-muted-foreground'>{tabLabel}</p>
      </div>
    )
  }

  return (
    <div className='space-y-5'>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
