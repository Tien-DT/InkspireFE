import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { BadgeCheck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useState, useEffect } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '~/contexts/AuthContext'
import { UserRole } from '~/types/user.type'
import { subscriptionApi } from '~/apis/subscription.api'
import { walletApi } from '~/apis/wallet.api'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { usePremiumStatus } from '~/hooks/usePremiumStatus'
import type { Subscription } from '~/apis/subscription.api'

type SubscriptionPayload = Subscription[] | { value?: Subscription[] } | undefined | null

const normalizeSubscriptions = (payload: SubscriptionPayload): Subscription[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload?.value && Array.isArray(payload.value)) {
    return payload.value
  }

  return []
}

export function PricingSection() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const { data: isPremium } = usePremiumStatus(profile?.id, isAuthenticated)

  // Fetch available subscriptions on mount
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await subscriptionApi.getSubscriptions()
        setSubscriptions(normalizeSubscriptions(data))
      } catch (error) {
        console.error('Failed to fetch subscriptions', error)
      }
    }

    fetchSubscriptions()
  }, [])

  const handleUpgrade = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để nâng cấp gói')
      navigate('/login')
      return
    }

    // Check if user is a client (role 1)
    if (profile?.role !== UserRole.CLIENT) {
      toast.error('Chỉ khách hàng mới có thể mua gói cao cấp')
      return
    }

    setIsLoading(true)

    try {
      // Get user's wallet balance
      const walletResponse = await walletApi.getWalletByUserId(profile.id)
      const wallet = walletResponse.data

      // Fetch subscriptions if not loaded yet
      let availableSubscriptions = subscriptions
      if (availableSubscriptions.length === 0) {
        const data = await subscriptionApi.getSubscriptions()
        availableSubscriptions = normalizeSubscriptions(data)
        setSubscriptions(availableSubscriptions)
      }

      // Find the premium subscription (49k price or by title)
      const premiumSubscription = availableSubscriptions.find((sub) => {
        const normalizedTitle = sub.title.toLowerCase()
        return (
          sub.price === 49000 ||
          sub.price === 49000.0 ||
          normalizedTitle.includes('cao cấp') ||
          normalizedTitle.includes('premium')
        )
      })

      if (!premiumSubscription) {
        toast.error(
          `Không tìm thấy gói cao cấp. Tổng số gói: ${availableSubscriptions.length}. Vui lòng liên hệ admin để tạo gói subscription.`
        )
        return
      }

      // Check if wallet balance is sufficient
      if (wallet.balance < 49000) {
        toast.error(`Số dư ví không đủ. Số dư hiện tại: ${wallet.balance.toLocaleString()}₫, Cần: 49,000₫`)
        // Optionally navigate to wallet top-up page
        navigate('/payment')
        return
      }

      // Call the purchase with wallet API
      const purchaseResponse = await subscriptionApi.purchaseSubscriptionWithWallet({
        subscriptionId: premiumSubscription.id,
        durationMonths: 1
      })

      if (purchaseResponse.success) {
        const data = purchaseResponse.data
        toast.success(
          <div>
            <p className='font-semibold'>🎉 Mua gói cao cấp thành công!</p>
            <p className='text-sm'>Số dư ví mới: {data.newWalletBalance.toLocaleString()}₫</p>
            <p className='text-sm'>
              Có hiệu lực đến: {new Date(data.subscription.endDate).toLocaleDateString('vi-VN')}
            </p>
          </div>,
          { duration: 5000 }
        )

        // Reload page để cập nhật premium badge và wallet balance
        setTimeout(() => {
          window.location.reload()
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
          if (status !== 401) {
            return
          }
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
      setIsLoading(false)
    }
  }

  const plans = [
    {
      title: 'Miễn phí',
      description: 'Hoàn hảo để bắt đầu',
      price: '0₫',
      features: ['Đăng tối đa 20 bài/tháng', 'Hồ sơ cơ bản', 'Hỗ trợ cơ bản'],
      textBtn: 'Bắt đầu miễn phí',
      isPremium: false
    },
    {
      title: 'Cao cấp',
      description: 'Dành cho chuyên gia',
      price: '49,000₫',
      features: [
        'Đăng không giới hạn bài',
        'Báo cáo chi tiết hiệu suất',
        'Hỗ trợ ưu tiên 24/7',
        'Đấu thầu tự động, ưu tiên hồ sơ',
        'Đẩy top hồ sơ/bài viết 3 lần/ngày',
        'Ưu tiên đề xuất việc theo từ khóa tìm kiếm'
      ],
      textBtn: 'Nâng cấp ngay',
      isPremium: true
    }
  ]

  const colorMap: Record<'Miễn phí' | 'Cao cấp', { button: string }> = {
    'Miễn phí': {
      button: 'bg-black text-white'
    },
    'Cao cấp': {
      button: 'bg-primary text-white'
    }
  }

  const isKnownPlan = (title: string): title is keyof typeof colorMap => title === 'Miễn phí' || title === 'Cao cấp'

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl font-bold text-gradient mb-4'>Sẵn sàng tăng tốc sự nghiệp?</h2>
          <p className='text-muted-foreground'>
            Chỉ từ <strong>49.000đ/tháng</strong> – đầu tư nhỏ, cơ hội lớn!
          </p>
        </div>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {plans.map((plan, index) => {
            const buttonClasses = isKnownPlan(plan.title)
              ? colorMap[plan.title].button
              : 'bg-muted text-foreground'

            return (
              <motion.div key={index} variants={fadeInUp} className='relative'>
              {plan.isPremium && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
                  <span className='bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg'>
                    Phổ biến nhất
                  </span>
                </div>
              )}
              <Card
                className={`h-full transition-all duration-300 ${
                  plan.isPremium
                    ? 'border-primary/50 shadow-lg shadow-primary/20 md:scale-105 hover:scale-110 hover:shadow-xl hover:shadow-primary/30'
                    : 'hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                <CardHeader className='text-center'>
                  <CardTitle className={`text-3xl font-bold ${plan.isPremium ? 'text-primary' : 'text-foreground'}`}>
                    {plan.title}
                  </CardTitle>
                  <p className='text-muted-foreground'>{plan.description}</p>
                  <div>
                    <span className={`text-3xl font-bold ${plan.isPremium ? 'text-primary' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    /<span className='font-bold'>tháng</span>
                  </div>
                </CardHeader>
                <CardContent className='flex flex-col gap-4 h-full'>
                  <ul className='flex flex-col gap-3 flex-1'>
                    {plan.features.map((feature, index) => (
                      <li className='flex items-center gap-2' key={index}>
                        <span className='text-green-500 shrink-0'>
                          <BadgeCheck />
                        </span>
                        <span className='text-sm'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${buttonClasses}`}
                    variant='outline'
                    onClick={plan.isPremium && !isPremium ? handleUpgrade : undefined}
                    disabled={(plan.isPremium && isLoading) || (plan.isPremium && isPremium)}
                  >
                    {plan.isPremium && isLoading
                      ? 'Đang xử lý...'
                      : plan.isPremium && isPremium
                        ? 'Gói hiện tại'
                        : plan.textBtn}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
