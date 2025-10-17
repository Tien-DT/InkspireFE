import { BadgeCheck, Palette, User, UserRoundSearch } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'

export function ServicesSection() {
  const services = [
    {
      icon: <User />,
      title: 'Freelancer',
      description: 'Xây dựng sự nghiệp tự do',
      features: [
        'Tạo hồ sơ chuyên nghiệp',
        'Tìm kiếm dự án phù hợp',
        'Quản lý công việc hiệu quả',
        'Nhận thanh toán an toàn'
      ]
    },
    {
      icon: <UserRoundSearch />,
      title: 'Khách hàng',
      description: 'Tìm kiếm tài năng hàng đầu',
      features: [
        'Tiếp cận hàng nghìn freelancer tài năng',
        'Quản lý dự án hiệu quả',
        'Bảo vệ ngân sách với hệ thống escrow',
        'Chất lượng được đảm bảo'
      ]
    },
    {
      icon: <Palette />,
      title: 'Họa sĩ minh họa',
      description: 'Showcase tài năng nghệ thuật',
      features: [
        'Showcase tác phẩm nghệ thuật',
        'Theo dõi tiến độ',
        'Công cụ thiết kế tích hợp',
        'Cộng đồng sáng tạo năng động'
      ]
    }
  ]

  const bgMap: Record<string, string> = {
    Freelancer: 'bg-chart-1',
    'Khách hàng': 'bg-chart-4',
    'Họa sĩ minh họa': 'bg-chart-5'
  }

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl font-bold text-gradient mb-4'>Được thiết kế cho mọi người</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            <strong>INKSPIRE</strong> mang đến giá trị tối ưu cho từng thành viên trong cộng đồng{' '}
          </p>
        </div>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8 '
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className='p-6 py-10 bg-transparent backdrop-blur-md hover:bg-white/20 transition-colors duration-300 rounded-4xl'>
                <CardContent className='flex flex-col items-center gap-8'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={`text-4xl text-white rounded-3xl w-fit mb-4 p-3 ${bgMap[service.title] ?? 'bg-chart-5/10'}`}
                    >
                      {service.icon}
                    </div>
                    <h3 className='text-2xl font-bold'>{service.title}</h3>
                    <p className='text-muted-foreground'>{service.description}</p>
                  </div>
                  <ul className='flex flex-col items-start gap-2 text-sm'>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className='flex items-center justify-center'>
                        <span className='text-green-500 mr-2'>
                          <BadgeCheck />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
