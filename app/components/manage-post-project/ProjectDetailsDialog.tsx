import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'
import { Briefcase, Calendar, DollarSign, Users } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProjectStatus } from '~/types/recruitment.type'
import { ApplicantCard } from './ApplicantCard'

interface Skill {
  id: string
  name: string
}

interface Application {
  id: string
  status: number
  coverLetter: string
  cvFileUrl: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

interface ProjectDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: {
    id: string
    title: string
    description: string
    projectName: string
    budget: number
    teamSize: string
    createdAt: string
    status: number
    skills: Skill[]
  } | null
  applications: Application[]
  applicationsLoading: boolean
  applicationsError: Error | null
  onAcceptApplicant?: (applicantId: string) => void
  onRejectApplicant?: (applicantId: string) => void
}

const statusConfig = {
  [ProjectStatus.DRAFT]: {
    label: 'Bản nháp',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  },
  [ProjectStatus.ACTIVE]: {
    label: 'Đang tuyển',
    className: 'bg-green-100 text-green-800 hover:bg-green-100'
  },
  [ProjectStatus.CLOSED]: {
    label: 'Đã đóng',
    className: 'bg-red-100 text-red-800 hover:bg-red-100'
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Hoàn thành',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  }
}

const skillColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700'
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
  applications,
  applicationsLoading,
  applicationsError,
  onAcceptApplicant,
  onRejectApplicant
}: ProjectDetailsDialogProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-[95vw] !w-[95vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-white'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0'>
          <DialogTitle className='text-2xl font-bold'>{project.title}</DialogTitle>
          <DialogDescription>Chi tiết dự án và danh sách ứng viên</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='details' className='flex-1 flex flex-col min-h-0 overflow-hidden'>
          <div className='px-6 pt-4 shrink-0'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='details'>Thông tin chi tiết</TabsTrigger>
              <TabsTrigger value='applicants'>
                Ứng viên ({applicationsLoading ? '...' : applications.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Thông tin chi tiết dự án */}
          <TabsContent
            value='details'
            className='flex-1 overflow-y-auto px-6 pb-6 mt-4 space-y-6 scrollbar-hide min-h-0'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-2'>Mô tả dự án</h3>
                <p className='text-gray-700 leading-relaxed'>{project.description}</p>
              </div>

              <Separator />

              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Ngân sách</p>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='h-5 w-5 text-green-600' />
                      <p className='text-lg font-semibold text-gray-900'>{formatCurrency(project.budget)}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Quy mô nhóm</p>
                    <div className='flex items-center gap-2'>
                      <Users className='h-5 w-5 text-blue-600' />
                      <p className='text-lg font-semibold text-gray-900'>{project.teamSize} người</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Trạng thái</p>
                    <Badge className={statusConfig[project.status as ProjectStatus]?.className || ''}>
                      {statusConfig[project.status as ProjectStatus]?.label || 'Không xác định'}
                    </Badge>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Ngày đăng</p>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-5 w-5 text-purple-600' />
                      <p className='text-lg font-semibold text-gray-900'>{formatDate(project.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Tên dự án</p>
                    <div className='flex items-center gap-2'>
                      <Briefcase className='h-5 w-5 text-orange-600' />
                      <p className='text-lg font-semibold text-gray-900'>{project.projectName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {project.skills && project.skills.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-3'>Kỹ năng yêu cầu</h3>
                  <div className='flex flex-wrap gap-2'>
                    {project.skills.map((skill, index) => (
                      <Badge key={skill.id} className={`${skillColors[index % skillColors.length]} px-3 py-1`}>
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Danh sách ứng viên */}
          <TabsContent
            value='applicants'
            className='flex-1 overflow-y-auto px-6 pb-6 mt-4 scrollbar-hide min-h-0'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {applicationsLoading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
                <p className='text-gray-600'>Đang tải danh sách ứng viên...</p>
              </div>
            ) : applicationsError ? (
              <div className='text-center py-12'>
                <h3 className='text-lg font-semibold text-red-900 mb-2'>Có lỗi xảy ra</h3>
                <p className='text-red-600'>Không thể tải danh sách ứng viên</p>
              </div>
            ) : applications.length === 0 ? (
              <div className='text-center py-12'>
                <Users className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có ứng viên nào</h3>
                <p className='text-gray-600'>Chưa có ai nộp hồ sơ ứng tuyển cho vị trí này.</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {applications.map((application) => (
                  <ApplicantCard
                    key={application.id}
                    application={application}
                    onAccept={() => onAcceptApplicant?.(application.id)}
                    onReject={() => onRejectApplicant?.(application.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
