// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'

const variants = {
  default: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-bg-primary)] font-semibold',
  outline: 'border border-[var(--color-border-hover)] bg-transparent hover:bg-white/5 text-[var(--color-text-primary)]',
  ghost: 'bg-transparent hover:bg-white/5 text-[var(--color-text-muted)] hover:text-white',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
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
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2
        font-[var(--font-body)] tracking-wide
        transition-colors duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
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
