"use client"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import {
  animate,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity
} from 'motion/react'

import { cn } from '~/utils/cn'

const springConfig = {
  stiffness: 100,
  damping: 20,
  mass: 0.5
}

type DragConstraints = {
  top: number
  left: number
  right: number
  bottom: number
}

type DraggableCardBodyProps = {
  className?: string
  children?: ReactNode
}

export function DraggableCardBody({ className, children }: DraggableCardBodyProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const [constraints, setConstraints] = useState<DragConstraints>({ top: 0, left: 0, right: 0, bottom: 0 })

  const velocityX = useVelocity(mouseX)
  const velocityY = useVelocity(mouseY)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig)
  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]), springConfig)
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]), springConfig)

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        top: -window.innerHeight / 2,
        left: -window.innerWidth / 2,
        right: window.innerWidth / 2,
        bottom: window.innerHeight / 2
      })
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event
    const rect = cardRef.current?.getBoundingClientRect()

    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(clientX - centerX)
    mouseY.set(clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = 'grabbing'
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = 'default'

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: { type: 'spring', ...springConfig }
        })

        const currentVelocityX = velocityX.get()
        const currentVelocityY = velocityY.get()
        const velocityMagnitude = Math.hypot(currentVelocityX, currentVelocityY)
        const bounce = Math.min(0.8, velocityMagnitude / 1000)

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 0.8
        })

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 0.8
        })
      }}
      style={{ rotateX, rotateY, opacity, willChange: 'transform' }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative min-h-96 w-80 overflow-hidden rounded-md bg-neutral-100 p-6 shadow-2xl transform-3d dark:bg-neutral-900',
        className
      )}
    >
      {children}
      <motion.div style={{ opacity: glareOpacity }} className='pointer-events-none absolute inset-0 select-none bg-white' />
    </motion.div>
  )
}

type DraggableCardContainerProps = {
  className?: string
  children?: ReactNode
}

export function DraggableCardContainer({ className, children }: DraggableCardContainerProps) {
  return <div className={cn('[perspective:3000px]', className)}>{children}</div>
}

