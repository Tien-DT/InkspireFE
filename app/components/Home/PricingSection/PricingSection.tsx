import { motion } from 'framer-motion'
import { Link } from 'react-router'
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
      textBtn: 'Bắt đầu miễn phí',
      href: '/register'
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
      href: '/payment'
    }
  ]

  const colorMap: Record<string, { text: string; button: string }> = {
    'Miễn phí': {
      text: 'text-black',
      button: 'bg-black text-white'
    },
    'Cao cấp': {
      text: 'text-primary',
      button: 'bg-primary text-white'
    }
  }
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
            <motion.div key={index} variants={fadeInUp}>
              <Card className='h-full'>
                <CardHeader className='text-center'>
                  <CardTitle className={`text-3xl font-bold ${colorMap[plan.title].text}`}>{plan.title}</CardTitle>
                  <p className='text-muted-foreground'>{plan.description}</p>
                  <div>
                    <span className={`text-3xl font-bold ${colorMap[plan.title].text}`}>{plan.price}</span>/
                    <span className='font-bold'>tháng</span>
                  </div>
                </CardHeader>
                <CardContent className='flex flex-col gap-4 h-full'>
                  <ul className='flex flex-col gap-3 flex-1'>
                    {plan.features.map((feature, index) => (
                      <li className='flex items-center' key={index}>
                        <span className='text-green-500 mr-2'>
                          <BadgeCheck />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${colorMap[plan.title].button}`} variant='outline' asChild>
                    <Link to={plan.href}>{plan.textBtn}</Link>
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
