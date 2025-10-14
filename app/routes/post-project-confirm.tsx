import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { AuthErrorBoundary } from '~/components/errors'
import { ProjectFormSteps } from '~/components/post-project'
import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
import { useAuth } from '~/contexts/AuthContext'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { RecruitmentCategory, Skill } from '~/types/recruitment.type'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { getAccessTokenFromLS, parseJwtPayload } from '~/utils/auth'

function PostProjectConfirmPage() {
  const navigate = useNavigate()
  const { step1Data, getCombinedData, resetForm, setCurrentStep } = useRecruitmentForm()
  const { profile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [categories, setCategories] = useState<RecruitmentCategory[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    setCurrentStep(2)

    const fetchData = async () => {
      try {
        const [categoriesRes, skillsRes] = await Promise.all([
          recruitmentApi.getCategories(),
          recruitmentApi.getSkills()
        ])
        setCategories(categoriesRes.data)
        setSkills(skillsRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
      }
    }

    fetchData()

    if (!step1Data && !hasRedirected) {
      setHasRedirected(true)
      navigate('/post-project', { replace: true })
      return
    }
  }, [setCurrentStep, step1Data, navigate, hasRedirected, profile])

  const handleSubmit = async () => {
    const combinedData = getCombinedData()

    if (!combinedData) {
      toast.error('Thiếu thông tin dự án')
      navigate('/post-project')
      return
    }

    // Try to get userId from profile first
    let userId = profile?.id

    // If profile doesn't have id, try to get from JWT token
    if (!userId) {
      const token = getAccessTokenFromLS()
      const payload = parseJwtPayload(token)

      // .NET JWT uses XML SOAP claim names
      userId =
        (payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string) ||
        (payload?.sub as string) ||
        (payload?.userId as string) ||
        (payload?.id as string)
    }

    if (!userId) {
      toast.error('Vui lòng đăng nhập để đăng dự án')
      navigate('/login')
      return
    }

    setIsSubmitting(true)

    try {
      const dataWithUserId = {
        ...combinedData,
        userId: userId
      }

      await recruitmentApi.createRecruitment(dataWithUserId)
      setIsSuccess(true)
      toast.success('Đăng dự án thành công!')

      setTimeout(() => {
        resetForm()
        navigate('/manage-project')
      }, 2000)
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err?.response?.data?.message || 'Đăng dự án thất bại')
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/post-project')
  }

  if (!step1Data) {
    return null
  }

  const categoryName = categories.find((c) => c.id === step1Data.category)?.title || step1Data.category
  const selectedSkills = skills.filter((s) => step1Data.skills.includes(s.id))

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <AnimatePresence mode='wait'>
        <motion.div
          key='post-project-confirm'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              Xác nhận thông tin dự án
            </h1>
            <p className='text-muted-foreground'>Kiểm tra lại thông tin trước khi đăng</p>
          </div>

          <ProjectFormSteps currentStep={2} />

          {isSuccess ? (
            <div className='max-w-2xl mx-auto'>
              <Card>
                <CardContent className='p-12 text-center'>
                  <div className='transform transition-all duration-500 scale-100'>
                    <CheckCircle2 className='w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse' />
                  </div>
                  <h2 className='text-2xl font-bold mb-2'>Đăng dự án thành công!</h2>
                  <p className='text-muted-foreground mb-6'>
                    Dự án của bạn đã được đăng thành công. Freelancer sẽ sớm ứng tuyển.
                  </p>
                  <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Đang chuyển hướng...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className='max-w-4xl mx-auto space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin dự án</CardTitle>
                </CardHeader>
                <CardContent data-slot='card-content' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Tiêu đề</p>
                      <p className='font-medium'>{step1Data.title}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Danh mục</p>
                      <p className='font-medium'>{categoryName}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Ngân sách</p>
                      <p className='font-medium'>{step1Data.budget.toLocaleString()} VNĐ</p>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-muted-foreground'>Thời gian mở form</p>
                      <p className='font-medium'>
                        {format(new Date(step1Data.startDate), 'dd/MM/yyyy')} -{' '}
                        {format(new Date(step1Data.endDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-muted-foreground'>Kỹ năng yêu cầu</p>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {selectedSkills.map((skill) => (
                          <Badge key={skill.id} variant='secondary'>
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-muted-foreground'>Mô tả</p>
                      <p className='font-medium'>{step1Data.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='flex justify-between pt-6'>
                <Button variant='outline' size='lg' onClick={handleBack} disabled={isSubmitting} className='px-8'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Quay lại
                </Button>
                <Button size='lg' onClick={handleSubmit} disabled={isSubmitting} className='px-8'>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Đang đăng...
                    </>
                  ) : (
                    'Đăng dự án'
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function PostProjectConfirm() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <PostProjectConfirmPage />
    </AuthErrorBoundary>
  )
}
