import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { BadgeCheck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export function PricingSection() {
  const plans = [
    {
      title: 'Miễn phí',
      description: 'Hoàn hảo để bắt đầu',
      price: '0₫',
      features: ['Đăng tối đa 20 bài/tháng', 'Hồ sơ cơ bản', 'Hỗ trợ cơ bản'],
      buttonVariant: 'outline' as const,
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
      buttonVariant: 'default' as const,
      isPremium: true
    }
  ]

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
          {plans.map((plan, index) => (
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
                  <Button className='w-full' variant={plan.buttonVariant}>
                    {plan.isPremium ? 'Nâng cấp ngay' : 'Bắt đầu miễn phí'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
