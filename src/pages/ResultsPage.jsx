// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react'
import { fetchDestinations } from '@/lib/api'
import DestinationGrid from '@/components/DestinationCard/DestinationGrid'
import Button from '@/components/UI/Button'

/* ── Stagger variants ── */
const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const vibe = location.state?.vibe

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDestinations = async (vibe) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDestinations(vibe)
      setDestinations(data)
    } catch (err) {
      setError('Failed to fetch destinations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vibe) {
      loadDestinations(vibe)
    }
  }, [vibe]) // Fetch on mount or vibe change


  // Redirect if no vibe was passed
  if (!vibe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-text-muted)]">No vibe provided. Start from the beginning.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    )
  }

  const handleSelect = (destination) => {
    navigate(`/itinerary/${encodeURIComponent(destination.destination)}`, {
      state: {
        destination,
        vibe,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="max-w-[var(--content-max)] mx-auto px-6 pt-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate('/')}
          aria-label="Start over"
          className="flex items-center gap-2 py-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium font-[var(--font-body)]">Start over</span>
        </motion.button>

        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          {/* Decorative accent */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--color-accent)]/10">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-5xl font-[var(--font-heading)] font-bold text-white mb-4 leading-tight"
          >
            Your Dream Destinations
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl font-[var(--font-body)] italic max-w-2xl"
            style={{ color: 'var(--color-accent)' }}
          >
            "{vibe}"
          </motion.p>
        </motion.div>
      </div>

      {/* Results grid */}
      <div className="max-w-[var(--content-max)] mx-auto px-6 pb-24">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-red-400 mb-4 font-[var(--font-body)]">{error}</p>
            <Button onClick={() => loadDestinations(vibe)}>Try Again</Button>
          </motion.div>
        )}

        <DestinationGrid
          destinations={destinations}
          loading={loading}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}
