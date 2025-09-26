import { LaptopMinimalCheck, TrendingUp, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'

export function StatsSection() {
  const stats = [
    { icon: <User />, number: '50,000+', label: 'Freelancer tài năng' },
    { icon: <LaptopMinimalCheck />, number: '25,000+', label: 'Dự án hoàn thành' },
    { icon: <TrendingUp />, number: '98%', label: 'Tỷ lệ hài lòng' }
  ]

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className='flex flex-col space-y-3 items-center'>
              <div>{stat.icon}</div>
              <div className='text-2xl md:text-3xl font-bold text-primary'>{stat.number}</div>
              <div className='text-2xl text-muted-foreground'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
