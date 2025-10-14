import { ArrowLeft, CheckCircle2, Loader2, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { isAxiosError } from 'axios'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { AuthErrorBoundary } from '~/components/errors'
import { ProjectFormSteps } from '~/components/post-project'
import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
import { useAuth } from '~/contexts/AuthContext'
import { recruitmentApi } from '~/apis/recruitment.api'
import { projectApi } from '~/apis/project.api'
import { subscriptionApi } from '~/apis/subscription.api'
import { walletApi } from '~/apis/wallet.api'
import type { Subscription } from '~/apis/subscription.api'
import type { RecruitmentCategory, Skill } from '~/types/recruitment.type'
import { UserRole } from '~/types/user.type'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { getAccessTokenFromLS, parseJwtPayload } from '~/utils/auth'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog'

type SubscriptionsPayload = Subscription[] | { value?: Subscription[] }

const normalizeSubscriptions = (payload: SubscriptionsPayload): Subscription[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload.value && Array.isArray(payload.value)) {
    return payload.value
  }

  return []
}

function PostProjectConfirmPage() {
  const navigate = useNavigate()
  const { step1Data, getCombinedData, resetForm, setCurrentStep } = useRecruitmentForm()
  const { profile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [categories, setCategories] = useState<RecruitmentCategory[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const [limitInfo, setLimitInfo] = useState<{
    projectsThisMonth: number
    limit: number | null
    remaining: number | null
  } | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

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
      // Check post limit first
      const limitCheck = await projectApi.checkPostLimit(userId)

      if (!limitCheck.data.canPost) {
        setLimitInfo({
          projectsThisMonth: limitCheck.data.projectsThisMonth,
          limit: limitCheck.data.limit,
          remaining: limitCheck.data.remaining
        })
        setShowLimitDialog(true)
        setIsSubmitting(false)
        return
      }

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

  const handlePurchasePremium = async () => {
    // Check if user is a client (role 1)
    if (profile?.role !== UserRole.CLIENT) {
      toast.error('Chỉ khách hàng mới có thể mua gói cao cấp')
      return
    }

    if (!profile?.id) {
      toast.error('Vui lòng đăng nhập để nâng cấp gói')
      navigate('/login')
      return
    }

    setIsPurchasing(true)

    try {
      // Get user's wallet balance
      const walletResponse = await walletApi.getWalletByUserId(profile.id)
      const wallet = walletResponse.data

      // Fetch subscriptions
      const data = await subscriptionApi.getSubscriptions()
      const availableSubscriptions = normalizeSubscriptions(data as SubscriptionsPayload)

      // Find the premium subscription (49k price or by title)
      const premiumSubscription = availableSubscriptions.find((sub) => {
        const lowerTitle = sub.title.toLowerCase()
        return (
          sub.price === 49000 ||
          sub.price === 49000.0 ||
          lowerTitle.includes('cao cấp') ||
          lowerTitle.includes('premium')
        )
      })

      if (!premiumSubscription) {
        toast.error('Không tìm thấy gói cao cấp. Vui lòng liên hệ admin.')
        return
      }

      // Check if wallet balance is sufficient
      if (wallet.balance < 49000) {
        toast.error(
          <div>
            <p className='font-semibold'>Số dư ví không đủ</p>
            <p className='text-sm'>Số dư hiện tại: {wallet.balance.toLocaleString()}₫</p>
            <p className='text-sm'>Cần: 49,000₫</p>
            <p className='text-sm mt-1'>Vui lòng nạp thêm tiền vào ví</p>
          </div>,
          { duration: 5000 }
        )
        setTimeout(() => navigate('/payment'), 2000)
        return
      }

      // Call the purchase with wallet API
      const purchaseResponse = await subscriptionApi.purchaseSubscriptionWithWallet({
        subscriptionId: premiumSubscription.id,
        durationMonths: 1
      })

      if (purchaseResponse.success) {
        const responseData = purchaseResponse.data
        setShowLimitDialog(false)
        toast.success(
          <div>
            <p className='font-semibold'>🎉 Mua gói cao cấp thành công!</p>
            <p className='text-sm'>Số dư ví mới: {responseData.newWalletBalance.toLocaleString()}₫</p>
            <p className='text-sm'>
              Có hiệu lực đến: {new Date(responseData.subscription.endDate).toLocaleDateString('vi-VN')}
            </p>
          </div>,
          { duration: 5000 }
        )

        // Wait a bit then retry posting the project
        setTimeout(() => {
          toast.info('Đang thử đăng dự án lại...')
          handleSubmit()
        }, 2000)
      } else {
        toast.error(purchaseResponse.message || 'Có lỗi xảy ra khi mua gói')
      }
    } catch (error) {
      console.error('Purchase failed:', error)

      if (isAxiosError<{ message?: string }>(error)) {
        const status = error.response?.status
        const message = error.response?.data?.message

        if (message) {
          toast.error(message)
          return
        }

        if (!error.response) {
          toast.error('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.')
          return
        }

        if (status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
          setTimeout(() => navigate('/login'), 1500)
          return
        }

        if (status === 403) {
          toast.error('Bạn không có quyền thực hiện hành động này')
          return
        }

        toast.error(`Có lỗi xảy ra khi mua gói cao cấp (${status ?? 'unknown'})`)
        return
      }

      toast.error('Có lỗi xảy ra khi mua gói cao cấp')
    } finally {
      setIsPurchasing(false)
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

      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent className='max-w-md bg-white shadow-2xl border-2 border-gray-200'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-xl text-gray-900'>
              <span className='text-2xl'>⚠️</span>
              Đã đạt giới hạn đăng bài
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-4 pt-3'>
              <p className='text-base text-gray-700'>
                Gói miễn phí chỉ được đăng tối đa <strong className='text-red-600'>20 dự án/tháng</strong>.
              </p>
              {limitInfo && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-700 font-medium'>Đã đăng trong tháng:</span>
                    <span className='font-bold text-red-600'>{limitInfo.projectsThisMonth} dự án</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-700 font-medium'>Giới hạn:</span>
                    <span className='font-bold text-gray-900'>{limitInfo.limit} dự án/tháng</span>
                  </div>
                </div>
              )}
              <div className='bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4'>
                <p className='text-base font-semibold text-gray-900 mb-2'>🎯 Nâng cấp lên gói Cao cấp để:</p>
                <ul className='text-sm text-gray-700 space-y-1 ml-4'>
                  <li className='flex items-center gap-2'>
                    <span className='text-green-600'>✓</span>
                    Đăng không giới hạn dự án
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-green-600'>✓</span>
                    Ưu tiên hiển thị trên trang tìm việc
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-green-600'>✓</span>
                    Badge Premium trên dự án
                  </li>
                </ul>
                <p className='text-lg font-bold text-orange-600 mt-3'>Chỉ 49,000₫/tháng</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col sm:flex-row gap-2 mt-2'>
            <AlertDialogCancel className='sm:flex-1 border-gray-300' disabled={isPurchasing}>
              Đóng
            </AlertDialogCancel>
            <Button
              className='sm:flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg'
              onClick={handlePurchasePremium}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Crown className='mr-2 h-4 w-4' fill='white' />
                  Nâng cấp ngay
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
