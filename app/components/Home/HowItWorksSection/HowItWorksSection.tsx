import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'

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
      ]
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
      ]
    }
  ]

  const colorMap: Record<string, { text: string; stepBg: string }> = {
    'Dành cho Freelancer': {
      text: 'text-primary',
      stepBg: 'bg-primary text-white'
    },
    'Dành cho Khách hàng': {
      text: 'text-chart-4',
      stepBg: 'bg-chart-4 text-white'
    }
  }

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl font-bold mb-2 text-gradient'>Cách thức hoạt động</h2>
          <p className='text-muted-foreground'>Quy trình đơn giản, hiệu quả cho cả freelancer và khách hàng</p>
        </div>
        <motion.div
          className='flex flex-col gap-35'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div className='flex flex-col gap-20 items-center' key={index} variants={fadeInUp}>
              <h3 className={`text-3xl font-bold ${colorMap[step.title].text}`}>{step.title}</h3>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                {step.number.map((num, i) => (
                  <div className='text-center' key={i}>
                    <div
                      className={`${colorMap[step.title].stepBg} w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                    >
                      {num}
                    </div>
                    <h3 className='text-lg font-bold mb-2'>{step.stepName[i]}</h3>
                    <p className='text-muted-foreground text-sm'>{step.description[i]}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
