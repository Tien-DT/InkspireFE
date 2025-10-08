import { ProjectCard } from '~/components/manage-project/ProjectCard'
import { useProjects } from '~/hooks/useProjects'
import type { Project } from '~/apis/project.api'

export function ProjectList() {
  const { data, isLoading, error } = useProjects()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-semibold text-red-900 mb-2'>Có lỗi xảy ra</h3>
        <p className='text-red-600'>Không thể tải dữ liệu dự án. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const projects = data?.data || []

  if (projects.length === 0) {
    return (
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có dự án nào</h3>
        <p className='text-gray-600'>Bạn chưa có dự án nào trong danh sách.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {projects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
