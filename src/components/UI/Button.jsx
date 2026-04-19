// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'

const variants = {
  default: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-bg-primary)] font-bold shadow-[0_2px_12px_rgba(212,168,75,0.25)] hover:shadow-[0_4px_20px_rgba(212,168,75,0.35)]',
  outline: 'border border-[var(--color-accent)]/40 bg-transparent hover:bg-[var(--color-accent)]/8 text-[var(--color-accent)] font-semibold hover:border-[var(--color-accent)]/60',
  ghost: 'bg-transparent hover:bg-white/5 text-[var(--color-text-muted)] hover:text-white font-medium',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
}

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center gap-2 min-h-[44px]
        font-[var(--font-body)] tracking-wide
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
