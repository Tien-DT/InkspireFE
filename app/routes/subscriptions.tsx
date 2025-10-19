import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Crown, Check, Star, Zap } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import { useProfile } from '~/hooks/useProfile'
import subscriptionApi, { type Subscription, type PurchaseSubscriptionRequest } from '~/apis/subscription.api'
import { UserRole } from '~/types/user.type'

const PAYMENT_METHODS = [
  { value: 'vnpay', label: 'VNPay', description: 'Thanh toán qua ví điện tử VNPay' },
  { value: 'momo', label: 'MoMo', description: 'Thanh toán qua ví MoMo' },
  { value: 'sepay', label: 'SePay', description: 'Thanh toán qua ngân hàng với SePay' }
]

const DURATION_OPTIONS = [
  { value: 1, label: '1 tháng', discount: 0 },
  { value: 3, label: '3 tháng', discount: 5 },
  { value: 6, label: '6 tháng', discount: 10 },
  { value: 12, label: '12 tháng', discount: 20 }
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { data: profile, isLoading: isLoadingProfile } = useProfile()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('vnpay')
  const [duration, setDuration] = useState(1)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    // Check if user is logged in and is a client
    if (!isLoadingProfile && profile) {
      if (profile.role !== UserRole.CLIENT) {
        toast.error('Chỉ có khách hàng mới có thể mua gói đăng ký')
        navigate('/')
      }
    }
  }, [profile, isLoadingProfile, navigate])

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionApi.getSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Không thể tải danh sách gói đăng ký')
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePrice = (basePrice: number, durationMonths: number): number => {
    const discount = DURATION_OPTIONS.find((d) => d.value === durationMonths)?.discount || 0
    const totalPrice = basePrice * durationMonths
    const discountAmount = (totalPrice * discount) / 100
    return totalPrice - discountAmount
  }

  const handlePurchase = async (subscription: Subscription) => {
    if (!profile) {
      toast.error('Vui lòng đăng nhập để mua gói đăng ký')
      navigate('/login')
      return
    }

    if (profile.role !== UserRole.CLIENT) {
      toast.error('Chỉ có khách hàng mới có thể mua gói đăng ký')
      return
    }

    setSelectedSubscription(subscription)
  }

  const confirmPurchase = async () => {
    if (!selectedSubscription) return

    setIsPurchasing(true)
    try {
      const request: PurchaseSubscriptionRequest = {
        subscriptionId: selectedSubscription.id,
        paymentMethod,
        durationMonths: duration
      }

      const response = await subscriptionApi.purchaseSubscription(request)

      if (response.success) {
        toast.success('Đang chuyển hướng đến trang thanh toán...')
        // Redirect to payment URL
        window.location.href = response.data.paymentUrl
      } else {
        toast.error(response.message || 'Không thể khởi tạo thanh toán')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi mua gói đăng ký')
    } finally {
      setIsPurchasing(false)
      setSelectedSubscription(null)
    }
  }

  const getSubscriptionIcon = (type?: number) => {
    switch (type) {
      case 1:
        return <Zap className='h-8 w-8' />
      case 2:
        return <Crown className='h-8 w-8' />
      case 3:
        return <Star className='h-8 w-8' />
      default:
        return <Zap className='h-8 w-8' />
    }
  }

  const getSubscriptionColor = (type?: number) => {
    switch (type) {
      case 1:
        return 'text-blue-500'
      case 2:
        return 'text-purple-500'
      case 3:
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  if (isLoading || isLoadingProfile) {
    return null
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Chọn Gói Đăng Ký Phù Hợp</h1>
          <p className='text-xl text-muted-foreground'>
            Nâng cao trải nghiệm của bạn với các tính năng premium dành cho khách hàng
          </p>
        </div>

        {/* Subscription Cards */}
        <div className='grid md:grid-cols-3 gap-8 mb-12'>
          {subscriptions.map((subscription) => (
            <Card
              key={subscription.id}
              className='relative bg-white backdrop-blur-md shadow-none border-none transition-all hover:backdrop-blur-lg'
            >
              {subscription.type === 2 && (
                <Badge className='absolute -top-3 left-1/2 transform -translate-x-1/2' variant='default'>
                  Phổ biến nhất
                </Badge>
              )}
              <CardHeader>
                <div className={`flex justify-center mb-4 ${getSubscriptionColor(subscription.type)}`}>
                  {getSubscriptionIcon(subscription.type)}
                </div>
                <CardTitle className='text-2xl text-center'>{subscription.title}</CardTitle>
                <CardDescription className='text-center'>{subscription.description}</CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <div className='mb-6'>
                  <span className='text-4xl font-bold'>{subscription.price.toLocaleString('vi-VN')}</span>
                  <span className='text-muted-foreground'> VNĐ/tháng</span>
                </div>
                <ul className='space-y-3 text-left'>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span>Đăng không giới hạn dự án</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span>Ưu tiên hiển thị dự án</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                    <span>Hỗ trợ khách hàng 24/7</span>
                  </li>
                  {subscription.type === 2 && (
                    <li className='flex items-center'>
                      <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                      <span>Báo cáo phân tích chi tiết</span>
                    </li>
                  )}
                  {subscription.type === 3 && (
                    <>
                      <li className='flex items-center'>
                        <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                        <span>Báo cáo phân tích chi tiết</span>
                      </li>
                      <li className='flex items-center'>
                        <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                        <span>Quản lý dự án nâng cao</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='w-full'
                      variant={subscription.type === 2 ? 'default' : 'outline'}
                      onClick={() => handlePurchase(subscription)}
                    >
                      Chọn Gói
                    </Button>
                  </DialogTrigger>
                  {selectedSubscription?.id === subscription.id && (
                    <DialogContent className='max-w-md'>
                      <DialogHeader>
                        <DialogTitle>Xác Nhận Mua Gói {selectedSubscription.title}</DialogTitle>
                        <DialogDescription>Chọn thời hạn và phương thức thanh toán</DialogDescription>
                      </DialogHeader>
                      <div className='space-y-6'>
                        {/* Duration Selection */}
                        <div className='space-y-3'>
                          <Label>Thời hạn đăng ký</Label>
                          <RadioGroup value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                            {DURATION_OPTIONS.map((option) => (
                              <div
                                key={option.value}
                                className='flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent'
                              >
                                <RadioGroupItem value={option.value.toString()} id={`duration-${option.value}`} />
                                <Label htmlFor={`duration-${option.value}`} className='flex-1 cursor-pointer'>
                                  <div className='flex justify-between items-center'>
                                    <span>{option.label}</span>
                                    <div className='text-right'>
                                      {option.discount > 0 && (
                                        <Badge variant='secondary' className='ml-2'>
                                          Giảm {option.discount}%
                                        </Badge>
                                      )}
                                      <p className='text-sm font-semibold'>
                                        {calculatePrice(selectedSubscription.price, option.value).toLocaleString(
                                          'vi-VN'
                                        )}{' '}
                                        VNĐ
                                      </p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Payment Method Selection */}
                        <div className='space-y-3'>
                          <Label>Phương thức thanh toán</Label>
                          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            {PAYMENT_METHODS.map((method) => (
                              <div
                                key={method.value}
                                className='flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent'
                              >
                                <RadioGroupItem value={method.value} id={method.value} />
                                <Label htmlFor={method.value} className='flex-1 cursor-pointer'>
                                  <div>
                                    <p className='font-medium'>{method.label}</p>
                                    <p className='text-sm text-muted-foreground'>{method.description}</p>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Total Price */}
                        <div className='border-t pt-4'>
                          <div className='flex justify-between items-center text-lg font-semibold'>
                            <span>Tổng thanh toán:</span>
                            <span className='text-primary'>
                              {calculatePrice(selectedSubscription.price, duration).toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-3'>
                          <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => setSelectedSubscription(null)}
                            disabled={isPurchasing}
                          >
                            Hủy
                          </Button>
                          <Button className='flex-1' onClick={confirmPurchase} disabled={isPurchasing}>
                            {isPurchasing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className='mb-8 bg-transparent backdrop-blur-md shadow-none border-none'>
          <CardHeader>
            <CardTitle className='text-2xl'>Lợi Ích Khi Nâng Cấp Gói Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold mb-2'>Tiếp cận freelancer chất lượng</h3>
                <p className='text-muted-foreground'>
                  Dự án của bạn sẽ được ưu tiên hiển thị, thu hút nhiều freelancer tài năng hơn
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Quản lý dự án hiệu quả</h3>
                <p className='text-muted-foreground'>
                  Công cụ quản lý dự án chuyên nghiệp giúp theo dõi tiến độ và chất lượng công việc
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Hỗ trợ ưu tiên</h3>
                <p className='text-muted-foreground'>
                  Nhận hỗ trợ từ đội ngũ chăm sóc khách hàng 24/7 với thời gian phản hồi nhanh nhất
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>Báo cáo chi tiết</h3>
                <p className='text-muted-foreground'>
                  Phân tích chi tiết về dự án, chi phí và hiệu suất giúp tối ưu hóa quy trình làm việc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
