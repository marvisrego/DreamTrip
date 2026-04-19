// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Globe, MapPin } from 'lucide-react'
import { transitions } from '@/lib/transitions'
import { fetchDestinations } from '@/lib/api'
import DestinationGrid from '@/components/DestinationCard/DestinationGrid'
import Button from '@/components/UI/Button'

// Floating orb positions (decorative background)
const orbs = [
  { size: 600, top: '-15%', left: '-10%',  delay: 0,  cls: 'animate-drift'  },
  { size: 500, top: '30%',  right: '-8%',  delay: 0,  cls: 'animate-drift2' },
  { size: 400, top: '70%',  left: '20%',   delay: 0,  cls: 'animate-drift'  },
]

export default function ResultsPage() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const vibe      = location.state?.vibe

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  const loadDestinations = async (vibe) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDestinations(vibe)
      setDestinations(data)
    } catch {
      setError('Failed to fetch destinations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vibe) loadDestinations(vibe)
  }, [vibe])

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
      state: { destination, vibe },
    })
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-primary)] overflow-x-hidden">

      {/* ── Floating orb background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        {orbs.map((orb, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-[0.04] ${orb.cls}`}
            style={{
              width:  orb.size,
              height: orb.size,
              top:    orb.top,
              left:   orb.left,
              right:  orb.right,
              background: 'radial-gradient(circle, #d4a84b 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        ))}
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full">

        {/* ── Hero header ── */}
        <div className="w-full px-6 md:px-10 lg:px-14 pt-8 pb-10">
          {/* Back button */}
          <motion.button
            onClick={() => navigate('/')}
            aria-label="Start over"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transitions.smooth}
            whileHover={{ x: -3 }}
            className="flex items-center gap-2 py-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Start over</span>
          </motion.button>

          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-accent)]">
                AI-Matched Destinations
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-heading)] font-bold text-white leading-tight mb-4">
              Your Perfect{' '}
              <span className="text-gold-gradient">Matches</span>
            </h1>

            {/* Vibe pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-[var(--color-border)] mb-3">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
              <span className="text-sm text-white/80 italic font-[var(--font-body)]">"{vibe}"</span>
            </div>

            {/* Stats row */}
            <AnimatePresence>
              {!loading && destinations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 mt-4"
                >
                  <Stat icon={<Globe className="w-4 h-4" />} value={destinations.length} label="destinations found" />
                  <Stat
                    icon={<Sparkles className="w-4 h-4" />}
                    value={`${destinations[0]?.matchScore ?? '—'}%`}
                    label="top match score"
                  />
                  <Stat
                    icon={<MapPin className="w-4 h-4" />}
                    value={[...new Set(destinations.map(d => d.continent).filter(Boolean))].length}
                    label="continents covered"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Results grid ── */}
        <div className="w-full px-6 md:px-10 lg:px-14 pb-24">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={() => loadDestinations(vibe)}>Try Again</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <DestinationGrid
            destinations={destinations}
            loading={loading}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}

// Small stat chip
function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
      <span className="text-[var(--color-accent)]">{icon}</span>
      <span className="text-white font-semibold text-sm">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}
