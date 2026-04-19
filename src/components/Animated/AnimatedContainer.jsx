import { motion, useReducedMotion } from 'framer-motion'

const animations = {
  fadeIn:       { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  fadeInUp:     { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  fadeInDown:   { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
  scaleIn:      { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  slideInLeft:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  slideInRight: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
}

export function AnimatedContainer({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  className,
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      animate="visible"
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
