import { ArrowRight, CircleFadingArrowUp, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animation'

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
  return (
    <section className='bg-section text-white py-20'>
      <motion.div
        className='container mx-auto px-4 flex flex-col items-center text-center'
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
          <Button size='lg' variant='default'>
            <Users />
            {primaryLabel}
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='border-white text-white hover:bg-white hover:text-cyan-600 bg-transparent'
          >
            <CircleFadingArrowUp />
            {secondaryLabel}
          </Button>
        </div>
        {isHero && tagline && (
          <Button className='text-sm mt-6 bg-transparent shadow-none flex items-center hover:bg-transparent'>
            {tagline}
            <span>
              <ArrowRight className='animate-arrow-move' />
            </span>
          </Button>
        )}
      </motion.div>
    </section>
  )
}
