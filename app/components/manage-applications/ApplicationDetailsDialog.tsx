import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Building2, DollarSign, Clock, MapPin, Calendar, Briefcase, FileText, XCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getStatusBadge } from './utils'
import type { JobApplication } from './ApplicationCard'

interface ApplicationDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: JobApplication | null
  onWithdraw?: () => void
  onEdit?: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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

export function ApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  onWithdraw,
  onEdit
}: ApplicationDetailsDialogProps) {
  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-[85vw] !w-[85vw] h-[90vh] bg-white flex flex-col p-0 gap-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0 bg-white'>
          <DialogTitle className='text-2xl'>Chi tiết ứng tuyển</DialogTitle>
          <DialogDescription>Thông tin chi tiết về công việc và hồ sơ ứng tuyển của bạn</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='job-info' className='flex-1 flex flex-col min-h-0 overflow-hidden'>
          <div className='px-6 pt-4 pb-2 shrink-0 bg-white border-b'>
            <TabsList className='grid w-full max-w-md grid-cols-2'>
              <TabsTrigger value='job-info'>Thông tin công việc</TabsTrigger>
              <TabsTrigger value='my-application'>Hồ sơ ứng tuyển</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Job Information */}
          <TabsContent value='job-info' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
            <div className='space-y-6'>
              {/* Company & Job Title */}
              <div className='flex items-start gap-4'>
                <Avatar className='h-20 w-20 shrink-0'>
                  <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-bold'>
                    {application.companyName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>{application.jobTitle}</h2>
                  <div className='flex items-center gap-2 text-gray-600 mb-2'>
                    <Building2 className='h-5 w-5' />
                    <span className='text-lg font-medium'>{application.companyName}</span>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </div>

              {/* Job Details Grid */}
              <div className='grid md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <h3 className='font-semibold flex items-center gap-2'>
                      <DollarSign className='h-5 w-5 text-green-600' />
                      Ngân sách dự án
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-2xl font-bold text-green-600'>
                      {formatCurrency(application.budget.min)} - {formatCurrency(application.budget.max)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className='font-semibold flex items-center gap-2'>
                      <Clock className='h-5 w-5 text-blue-600' />
                      Thời gian dự án
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xl font-semibold text-gray-900'>{application.projectDuration}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className='font-semibold flex items-center gap-2'>
                      <MapPin className='h-5 w-5 text-orange-600' />
                      Địa điểm
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xl font-semibold text-gray-900'>{application.location}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className='font-semibold flex items-center gap-2'>
                      <Calendar className='h-5 w-5 text-purple-600' />
                      Hạn nộp hồ sơ
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xl font-semibold text-gray-900'>
                      {format(new Date(application.deadline), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <h3 className='font-semibold text-lg'>Mô tả công việc</h3>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed'>{application.jobDescription}</p>
                </CardContent>
              </Card>

              {/* Required Skills */}
              <Card>
                <CardHeader>
                  <h3 className='font-semibold text-lg'>Kỹ năng yêu cầu</h3>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {application.requiredSkills.map((skill, index) => (
                      <Badge key={skill} className={`${skillColors[index % skillColors.length]} hover:opacity-80`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className='font-semibold text-lg'>Danh mục</h3>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {application.categories.map((category) => (
                      <Badge key={category} variant='outline' className='text-sm'>
                        <Briefcase className='h-3 w-3 mr-1' />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: My Application */}
          <TabsContent value='my-application' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
            <div className='space-y-6'>
              {/* Application Status */}
              <Card className='border-2'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Trạng thái ứng tuyển</h3>
                      <p className='text-gray-600 mb-3'>
                        Ngày ứng tuyển: {format(new Date(application.appliedDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proposed Rate */}
              <Card>
                <CardHeader>
                  <h3 className='font-semibold text-lg flex items-center gap-2'>
                    <DollarSign className='h-5 w-5 text-green-600' />
                    Mức giá đề xuất
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className='text-3xl font-bold text-green-600'>{formatCurrency(application.proposedRate)}</p>
                  <p className='text-gray-600 mt-2'>Thời gian ước tính: {application.estimatedTime}</p>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <h3 className='font-semibold text-lg flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    Thư xin việc
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{application.coverLetter}</p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {application.status === 'pending' && (
                <div className='flex gap-3 pt-4 border-t'>
                  {onWithdraw && (
                    <Button className='btn-cancel text-red-600 hover:text-red-700 hover:bg-red-50' onClick={onWithdraw}>
                      <XCircle className='h-4 w-4 mr-2' />
                      Rút ứng tuyển
                    </Button>
                  )}
                  {onEdit && (
                    <Button className='btn-submit' onClick={onEdit}>
                      <FileText className='h-4 w-4 mr-2' />
                      Chỉnh sửa hồ sơ
                    </Button>
                  )}
                </div>
              )}

              {application.status === 'accepted' && (
                <Card className='bg-green-50 border-green-200'>
                  <CardContent className='p-6'>
                    <div className='flex items-start gap-3'>
                      <CheckCircle className='h-6 w-6 text-green-600 shrink-0 mt-1' />
                      <div>
                        <h4 className='font-semibold text-green-900 mb-1'>Chúc mừng!</h4>
                        <p className='text-green-700'>
                          Hồ sơ của bạn đã được chấp nhận. Công ty sẽ liên hệ với bạn sớm để thảo luận chi tiết về dự
                          án.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {application.status === 'rejected' && (
                <Card className='bg-red-50 border-red-200'>
                  <CardContent className='p-6'>
                    <div className='flex items-start gap-3'>
                      <XCircle className='h-6 w-6 text-red-600 shrink-0 mt-1' />
                      <div>
                        <h4 className='font-semibold text-red-900 mb-1'>Rất tiếc</h4>
                        <p className='text-red-700'>
                          Hồ sơ của bạn chưa phù hợp với yêu cầu của dự án này. Đừng nản chí, hãy tiếp tục tìm kiếm các
                          cơ hội khác!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
