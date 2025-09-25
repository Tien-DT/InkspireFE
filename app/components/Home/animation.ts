// Animation variants cho hiệu ứng fade-in lên và slide-up
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const }
  }
}

// Animation variants cho hiệu ứng fade-in đơn giản
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' as const }
  }
}

// Animation container cho stagger children
export const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
}
