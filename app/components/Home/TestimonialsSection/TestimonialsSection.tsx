import { Star } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'

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
      .split(' ') // Tách thành mảng ['Minh', 'Anh']
      .map((word) => word[0]) // Lấy ký tự đầu tiên của mỗi từ -> ['M', 'A']
      .join('') // Nối lại thành chuỗi 'MA'
  }

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl text-gradient font-bold mb-4'>Câu chuyện thành công</h2>
          <p className='text-muted-foreground'>
            Hàng nghìn freelancer và khách hàng đã tin tưởng <strong>INKSPIRE</strong>
          </p>
        </div>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card>
                <CardContent className='flex flex-col p-6 h-full gap-7'>
                  <div className='flex'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className='text-yellow-400 fill-yellow-400 mr-2' />
                    ))}
                  </div>
                  <p className='text-muted-foreground font-semibold flex-1'>"{testimonial.content}"</p>
                  <div className='flex flex-row items-center gap-3'>
                    <div className='font-semibold rounded-xl p-3 bg-black text-white'>{initials(testimonial.name)}</div>
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
      </div>
    </section>
  )
}
