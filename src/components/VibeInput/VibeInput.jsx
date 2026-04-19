// source_handbook: week11-hackathon-preparation
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '@/components/UI/Button'

export default function VibeInput({ onSubmit, loading = false }) {
  const [vibe, setVibe] = useState('')
  const maxChars = 200

  const handleSubmit = (e) => {
    e.preventDefault()
    if (vibe.trim() && !loading) {
      onSubmit(vibe.trim())
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative group">
        {/* Glow effect behind the input */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-accent)]/10 to-[var(--color-accent)]/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

        <div className="relative glass-card p-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--color-accent)] ml-2 shrink-0" />
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value.slice(0, maxChars))}
              placeholder="e.g. solo trip, beaches, not touristy, under £1000"
              disabled={loading}
              aria-label="Trip vibe description"
              autoComplete="off"
              className="
                flex-1 bg-transparent border-none outline-none focus-visible:ring-0
                text-lg text-white placeholder:text-[var(--color-text-subtle)]
                font-[var(--font-body)] py-4 px-3
                disabled:opacity-50
              "
            />
            <Button
              type="submit"
              disabled={!vibe.trim() || loading}
              className="shrink-0 mr-1"
            >
              {loading ? 'Planning...' : 'Plan My Trip'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Character counter */}
      <div className="flex justify-end mt-2 px-2">
        <span className={`text-xs font-[var(--font-body)] transition-colors ${
          vibe.length > maxChars * 0.9
            ? 'text-red-400'
            : 'text-[var(--color-text-subtle)]'
        }`}>
          {vibe.length}/{maxChars}
        </span>
      </div>
    </motion.form>
  )
}
