import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { AuthErrorBoundary } from '~/components/errors'
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
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
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
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/post-project')
    }, 500)
  }

  if (!step1Data) {
    return null
  }

  const categoryName = categories.find((c) => c.id === step1Data.category)?.title || step1Data.category
  const selectedSkills = skills.filter((s) => step1Data.skills.includes(s.id))
  const skillColors = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      <div
        className={`transition-all duration-500 ease-out ${
          isTransitioning
            ? 'opacity-0 translate-x-12'
            : isVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-12'
        }`}
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-teal-500 mb-2'>Xác nhận thông tin dự án</h1>
          <p className='text-gray-600'>Kiểm tra lại thông tin trước khi đăng</p>
        </div>

        <div className='flex items-center justify-center mb-12'>
          <div className='flex items-center space-x-8'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300'>
                ✓
              </div>
              <span className='ml-2 text-blue-600 font-medium'>Thông tin cơ bản</span>
            </div>

            <div className='w-12 h-0.5 bg-blue-600 transition-all duration-500' />

            <div className='flex items-center'>
              <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300'>
                2
              </div>
              <span className='ml-2 text-blue-600 font-medium'>Xác nhận</span>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className='max-w-2xl mx-auto transition-all duration-700 ease-out'>
            <Card>
              <CardContent className='p-12 text-center'>
                <div className='transform transition-all duration-500 scale-100'>
                  <CheckCircle2 className='w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>Đăng dự án thành công!</h2>
                <p className='text-gray-600 mb-6'>
                  Dự án của bạn đã được đăng thành công. Freelancer sẽ sớm ứng tuyển.
                </p>
                <div className='flex items-center justify-center space-x-2 text-sm text-gray-500'>
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
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600'>Tiêu đề</p>
                    <p className='font-medium'>{step1Data.title}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Danh mục</p>
                    <p className='font-medium'>{categoryName}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Ngân sách</p>
                    <p className='font-medium'>{step1Data.budget.toLocaleString()} VNĐ</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-sm text-gray-600'>Thời gian mở form</p>
                    <p className='font-medium'>
                      {format(new Date(step1Data.startDate), 'dd/MM/yyyy')} -{' '}
                      {format(new Date(step1Data.endDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-sm text-gray-600'>Kỹ năng yêu cầu</p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {selectedSkills.map((skill, index) => (
                        <Badge key={skill.id} variant={skillColors[index % skillColors.length]}>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-sm text-gray-600'>Mô tả</p>
                    <p className='font-medium'>{step1Data.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-between pt-6'>
              <Button className='px-8 bg-white hover:bg-gray-50' onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft className='mr-2 h-4 w-4 text-black ' />
                <span className='text-black'>Quay lại</span>
              </Button>
              <Button
                className='bg-gray-800 hover:bg-gray-900 text-white px-6 py-2'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
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
      </div>
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
