export const transitions = {
  spring:       { type: 'spring', stiffness: 300, damping: 24 },
  springBouncy: { type: 'spring', stiffness: 500, damping: 15 },
  springStiff:  { type: 'spring', stiffness: 700, damping: 30 },
  smooth:       { type: 'tween', duration: 0.3, ease: 'easeInOut' },
  snappy:       { type: 'tween', duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
}
