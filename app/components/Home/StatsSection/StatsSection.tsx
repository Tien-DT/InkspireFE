import { LaptopMinimalCheck, TrendingUp, User } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../animation'
import { useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
}

function AnimatedCounter({ value, suffix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
      }
    })
    return unsubscribe
  }, [springValue, suffix])

  return <div ref={ref} />
}

export function StatsSection() {
  const stats = [
    {
      icon: <User className='w-8 h-8' />,
      number: 50000,
      suffix: '+',
      label: 'Freelancer tài năng',
      color: 'from-blue-400/20 to-cyan-400/20'
    },
    {
      icon: <LaptopMinimalCheck className='w-8 h-8' />,
      number: 25000,
      suffix: '+',
      label: 'Dự án hoàn thành',
      color: 'from-purple-400/20 to-pink-400/20'
    },
    {
      icon: <TrendingUp className='w-8 h-8' />,
      number: 98,
      suffix: '%',
      label: 'Tỷ lệ hài lòng',
      color: 'from-green-400/20 to-emerald-400/20'
    }
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
            <motion.div key={index} variants={fadeInUp} className='flex flex-col space-y-3 items-center group'>
              <div
                className={`relative p-4 rounded-full bg-gradient-to-br ${stat.color} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110`}
              >
                <div className='absolute inset-0 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300' />
                <div className='relative text-primary'>{stat.icon}</div>
              </div>
              <div className='text-2xl md:text-3xl font-bold text-primary'>
                <AnimatedCounter value={stat.number} suffix={stat.suffix} />
              </div>
              <div className='text-2xl text-muted-foreground text-center'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
