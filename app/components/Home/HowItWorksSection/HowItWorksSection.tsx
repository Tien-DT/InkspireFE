import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { ArrowRight } from 'lucide-react'
import freelancerImg from '~/assets/freelancerImg.png'
import clientImg from '~/assets/client-img.png'

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
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      badgeColor: 'bg-primary',
      glowColor: 'shadow-primary/20'
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
      gradient: 'from-chart-4/20 via-chart-4/10 to-transparent',
      badgeColor: 'bg-chart-4',
      glowColor: 'shadow-chart-4/20'
    }
  ]

  return (
    <section className='relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black,transparent)] dark:bg-grid-slate-700/25' />
      <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl' />

      <div className='container relative mx-auto px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          className='text-center mb-16 md:mb-20'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
            Cách thức hoạt động
          </h2>
          <p className='text-base md:text-lg text-muted-foreground max-w-2xl mx-auto'>
            Quy trình đơn giản, minh bạch và hiệu quả cho cả freelancer lẫn khách hàng
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className='flex flex-col gap-20 md:gap-32'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.1 }}
        >
          {steps.map((step, stepIndex) => (
            <motion.div
              className={`flex flex-col ${stepIndex % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-12 xl:gap-16 items-center ${stepIndex % 2 === 0 ? '' : 'lg:justify-end'}`}
              key={stepIndex}
              variants={fadeInUp}
            >
              {/* Image Section */}
              <div
                className={`flex-1 flex flex-col ${stepIndex % 2 === 0 ? 'items-center lg:items-start' : 'items-center lg:items-end'} w-full max-w-xl lg:max-w-none`}
              >
                <div className={`mb-6 lg:mb-8 w-full ${stepIndex % 2 === 0 ? '' : 'lg:text-right'}`}>
                  <h3
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 ${
                      step.badgeColor === 'bg-primary' ? 'text-primary' : 'text-chart-4'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <div
                    className={`h-1.5 w-20 md:w-24 rounded-full bg-gradient-to-r ${step.gradient} ${stepIndex % 2 === 0 ? '' : 'lg:ml-auto'}`}
                  />
                </div>

                <div className='relative w-full max-w-md lg:max-w-lg group'>
                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
                  />

                  {/* Image container */}
                  <div className='relative aspect-square bg-gradient-to-br from-card via-card to-muted/50 rounded-3xl flex items-center justify-center border border-border/50 backdrop-blur-sm overflow-hidden shadow-xl'>
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-40`} />

                    <img
                      src={stepIndex === 0 ? freelancerImg : clientImg}
                      alt={step.title}
                      className='relative z-10 w-full h-full object-cover p-6 md:p-8 transition-transform duration-500 group-hover:scale-105'
                    />
                  </div>
                </div>
              </div>

              {/* Steps Grid */}
              <div className='flex-1 w-full max-w-3xl mx-auto lg:mx-0'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8'>
                  {step.number.map((num, i) => (
                    <motion.div
                      className='relative'
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {/* Card with fixed height for alignment */}
                      <div className='group relative h-full min-h-[200px] flex flex-col'>
                        <div
                          className={`relative flex-1 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-7 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${step.glowColor}`}
                        >
                          {/* Gradient accent */}
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-b-2xl`}
                          />

                          {/* Step Number Badge - Positioned consistently */}
                          <div className='absolute -top-4 -left-4'>
                            <div
                              className={`relative ${step.badgeColor} text-white w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                            >
                              <span className='relative z-10'>{num}</span>
                              {/* Shine effect */}
                              <div className='absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity' />
                            </div>
                          </div>

                          {/* Arrow Connector - Only for row transitions */}
                          {i < step.number.length - 1 && i % 2 === 0 && (
                            <div className='hidden sm:block absolute -right-7 top-1/2 -translate-y-1/2 z-10'>
                              <div className='text-muted-foreground/40 transition-all duration-300 group-hover:text-primary/60 group-hover:translate-x-1'>
                                <ArrowRight className='w-5 h-5 md:w-6 md:h-6' />
                              </div>
                            </div>
                          )}

                          {/* Vertical connector for mobile */}
                          {i < step.number.length - 1 && (
                            <div className='sm:hidden absolute -bottom-7 left-1/2 -translate-x-1/2 z-10'>
                              <div className='text-muted-foreground/40 rotate-90'>
                                <ArrowRight className='w-5 h-5' />
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className='mt-3 space-y-2.5'>
                            <h4 className='text-base md:text-lg font-bold text-foreground leading-tight'>
                              {step.stepName[i]}
                            </h4>
                            <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                              {step.description[i]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
