// source_handbook: week11-hackathon-preparation
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import VibeInput from '@/components/VibeInput/VibeInput'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleSubmit = (vibe) => {
    navigate('/results', { state: { vibe } })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 ken-burns bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')`,
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[var(--color-bg-primary)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        {/* Logo / wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <Plane className="w-8 h-8 text-[var(--color-accent)]" />
          <h1 className="text-5xl md:text-6xl font-[var(--font-heading)] font-bold text-gold-gradient">
            DreamTrip
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-xl md:text-2xl text-white/80 font-[var(--font-body)] font-light mb-12 tracking-wide"
        >
          Describe your dream. We'll plan the trip.
        </motion.p>

        {/* Vibe input */}
        <VibeInput onSubmit={handleSubmit} />

        {/* Subtle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 text-xs text-white/30 font-[var(--font-body)]"
        >
          Powered by Gemini & Groq AI
        </motion.p>
      </div>
    </div>
  )
}
