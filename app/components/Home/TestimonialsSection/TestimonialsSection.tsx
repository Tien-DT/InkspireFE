import { Star } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { useState } from 'react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Minh Anh',
      role: 'Graphic Designer',
      content:
        'INKSPIRE đã giúp tôi tìm được những dự án chất lượng và xây dựng được danh tiếng trong lĩnh vực thiết kế. Thu nhập của tôi đã tăng gấp 3 lần sau 6 tháng sử dụng.',
      rating: 5
    },
    {
      name: 'Hoàng Nam',
      role: 'Web Developer',
      content:
        'Là một startup, chúng tôi cần tìm freelancer có kỹ năng cao với ngân sách hợp lý. INKSPIRE đã kết nối chúng tôi với những tài năng tuyệt vời.',
      rating: 5
    },
    {
      name: 'Thu Hà',
      role: 'Content Writer',
      content:
        'Tôi đã bán được hàng trăm tác phẩm minh họa thông qua INKSPIRE. Nền tảng này thực sự hiểu được nhu cầu của các nghệ sĩ như chúng tôi.',
      rating: 5
    }
  ]

  const initials = (fullname: string) => {
    return fullname
      .split(' ')
      .map((word) => word[0])
      .join('')
  }

  // Generate unique color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const [dragConstraints] = useState({ left: 0, right: 0 })

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl text-gradient font-bold mb-4'>Câu chuyện thành công</h2>
          <p className='text-muted-foreground'>
            Hàng nghìn freelancer và khách hàng đã tin tưởng <strong>INKSPIRE</strong>
          </p>
        </div>

        {/* Desktop Grid */}
        <motion.div
          className='hidden md:grid grid-cols-1 md:grid-cols-3 gap-8'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className='h-full hover:-translate-y-2 hover:shadow-lg transition-all duration-300'>
                <CardContent className='flex flex-col p-6 h-full gap-6 relative'>
                  {/* Decorative Quote Mark */}
                  <div className='absolute top-4 right-4 text-6xl text-primary/10 font-serif leading-none'>"</div>

                  <div className='flex'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className='text-yellow-400 fill-yellow-400 w-5 h-5' />
                    ))}
                  </div>

                  <p className='text-muted-foreground font-medium flex-1 relative z-10 before:content-["""] before:text-3xl before:text-primary/30 before:absolute before:-left-2 before:-top-2 before:font-serif'>
                    {testimonial.content}
                  </p>

                  <div className='flex flex-row items-center gap-3'>
                    <div
                      className={`font-semibold rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(testimonial.name)} text-white shadow-md transition-transform hover:scale-110`}
                    >
                      {initials(testimonial.name)}
                    </div>
                    <div>
                      <div className='font-bold text-lg text-primary'>{testimonial.name}</div>
                      <div className='text-sm text-muted-foreground'>{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className='md:hidden overflow-hidden'>
          <motion.div
            drag='x'
            dragConstraints={dragConstraints}
            className='flex gap-4 cursor-grab active:cursor-grabbing'
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} className='min-w-[85vw] max-w-[85vw]'>
                <Card className='h-full'>
                  <CardContent className='flex flex-col p-6 h-full gap-6 relative'>
                    <div className='absolute top-4 right-4 text-6xl text-primary/10 font-serif leading-none'>"</div>

                    <div className='flex'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className='text-yellow-400 fill-yellow-400 w-5 h-5' />
                      ))}
                    </div>

                    <p className='text-muted-foreground font-medium flex-1 relative z-10'>{testimonial.content}</p>

                    <div className='flex flex-row items-center gap-3'>
                      <div
                        className={`font-semibold rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(testimonial.name)} text-white shadow-md`}
                      >
                        {initials(testimonial.name)}
                      </div>
                      <div>
                        <div className='font-bold text-lg text-primary'>{testimonial.name}</div>
                        <div className='text-sm text-muted-foreground'>{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <p className='text-center text-sm text-muted-foreground mt-4'>← Vuốt để xem thêm →</p>
        </div>
      </div>
    </section>
  )
}
