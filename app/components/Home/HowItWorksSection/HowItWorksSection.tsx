import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { ArrowRight } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      title: 'Dành cho Freelancer',
      number: ['1', '2', '3', '4'],
      stepName: ['Tạo hồ sơ', 'Tìm dự án', 'Thực hiện công việc', 'Nhận thanh toán'],
      description: [
        'Xây dựng hồ sơ chuyên nghiệp với portfolio ấn tượng',
        'Duyệt và ứng tuyển các dự án phù hợp với kỹ năng',
        'Hoàn thành dự án theo yêu cầu và thời hạn đã thỏa thuận',
        'Nhận tiền an toàn qua hệ thống thanh toán tự động'
      ],
      color: 'primary'
    },
    {
      title: 'Dành cho Khách hàng',
      number: ['1', '2', '3', '4'],
      stepName: ['Đăng dự án', 'Chọn freelancer', 'Theo dõi tiến độ', 'Nhận kết quả'],
      description: [
        'Mô tả chi tiết dự án và ngân sách mong muốn',
        'Xem xét hồ sơ và chọn freelancer phù hợp nhất',
        'Giám sát và phản hồi trong suốt quá trình thực hiện',
        'Nhận sản phẩm hoàn thiện và thanh toán '
      ],
      color: 'chart-4'
    }
  ]

  return (
    <section className='py-16 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-5xl font-bold mb-2 text-gradient'>Cách thức hoạt động</h2>
          <p className='text-muted-foreground'>Quy trình đơn giản, hiệu quả cho cả freelancer và khách hàng</p>
        </div>
        <motion.div
          className='flex flex-col gap-24'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, stepIndex) => (
            <motion.div
              className={`flex flex-col ${stepIndex % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              key={stepIndex}
              variants={fadeInUp}
            >
              {/* Left/Right Section - Title & Visual */}
              <div className='flex-1 flex flex-col items-center lg:items-start'>
                <h3 className={`text-4xl font-bold mb-6 ${step.color === 'primary' ? 'text-primary' : 'text-chart-4'}`}>
                  {step.title}
                </h3>
                <div className='w-full max-w-md aspect-square bg-gradient-to-br from-muted to-background rounded-2xl flex items-center justify-center border-2 border-border'>
                  <div className='text-6xl font-bold text-muted-foreground/20'>{stepIndex === 0 ? '💼' : '👔'}</div>
                </div>
              </div>

              {/* Right/Left Section - Steps with Connectors */}
              <div className='flex-1 w-full'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 relative'>
                  {/* Visual Connector Line */}
                  <div className='hidden sm:block absolute top-6 left-1/2 w-px h-[calc(100%-3rem)] bg-gradient-to-b from-border via-primary/50 to-border -translate-x-1/2 -z-10' />

                  {step.number.map((num, i) => (
                    <div
                      className='relative bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
                      key={i}
                    >
                      {/* Step Number Badge */}
                      <div
                        className={`absolute -top-4 -left-4 ${step.color === 'primary' ? 'bg-primary' : 'bg-chart-4'} text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-transform group-hover:scale-110`}
                      >
                        {num}
                      </div>

                      {/* Arrow Connector for non-last items */}
                      {i < step.number.length - 1 && (
                        <div className='hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30'>
                          <ArrowRight className='w-6 h-6' />
                        </div>
                      )}

                      <h4 className='text-lg font-bold mb-2 mt-2'>{step.stepName[i]}</h4>
                      <p className='text-muted-foreground text-sm leading-relaxed'>{step.description[i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
