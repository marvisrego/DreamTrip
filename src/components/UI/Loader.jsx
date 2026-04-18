// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Loader({ text = 'Loading...', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
    >
      <Loader2
        className="w-8 h-8 text-[var(--color-accent)] animate-spin"
      />
      <p className="text-sm text-[var(--color-text-muted)] font-[var(--font-body)]">
        {text}
      </p>
    </motion.div>
  )
}
