import { ArrowRight, CircleFadingArrowUp, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeInUp } from '../animation'
import { Link } from 'react-router'
import { PATH } from '~/constants/path'

interface HeroSectionProps {
  title: ReactNode
  subtitle: ReactNode
  primaryLabel: string
  secondaryLabel: string
  isHero?: boolean
  tagline?: ReactNode
}

export function HeroSection({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  isHero = false,
  tagline
}: HeroSectionProps) {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const y3 = useTransform(scrollY, [0, 500], [0, 200])

  return (
    <section className='relative bg-section text-white py-20 overflow-hidden'>
      {/* Animated Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px] animate-[pulse_8s_ease-in-out_infinite]' />
      </div>

      {/* Floating Abstract Shapes */}
      {isHero && (
        <>
          <motion.div
            style={{ y: y1 }}
            className='absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            style={{ y: y2 }}
            className='absolute top-40 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl'
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
          <motion.div
            style={{ y: y3 }}
            className='absolute bottom-20 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl'
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
          />
        </>
      )}

      <motion.div
        className='container mx-auto px-4 flex flex-col items-center text-center relative z-10'
        variants={fadeInUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className={`font-bold mb-6 text-balance ${isHero ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
          {title}
        </h1>
        <p
          className={`mx-auto opacity-90 ${isHero ? 'text-lg md:text-xl mb-8 max-w-2xl text-pretty' : 'text-lg mb-8 max-w-2xl'}`}
        >
          {subtitle}
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button size='lg' variant='default' asChild className='rounded-full'>
            <Link to={PATH.jobsFreelancer} className='flex items-center gap-2'>
              <Users />
              {primaryLabel}
            </Link>
          </Button>
          <Button size='lg' variant='ghost-white' asChild className='rounded-full'>
            <Link to={PATH.postProject} className='flex items-center gap-2'>
              <CircleFadingArrowUp />
              {secondaryLabel}
            </Link>
          </Button>
        </div>
        {isHero && tagline && (
          <Button variant='link' className='text-sm mt-6 text-white flex items-center gap-2 group' asChild>
            <Link to='#' className='flex items-center gap-2'>
              {tagline}
              <ArrowRight className='transition-transform group-hover:translate-x-2 duration-300' />
            </Link>
          </Button>
        )}
      </motion.div>
    </section>
  )
}
