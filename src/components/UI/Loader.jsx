// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Loader({ text = 'Loading...', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
    >
      <div className="relative">
        {/* Gold glow ring */}
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-[var(--color-accent)]/15 blur-xl animate-pulse" />
        <Loader2
          className="relative w-10 h-10 text-[var(--color-accent)] animate-spin"
        />
      </div>
      <p className="text-sm text-[var(--color-text-muted)] font-[var(--font-body)] tracking-wide">
        {text}
      </p>
    </motion.div>
  )
}
