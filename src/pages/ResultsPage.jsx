// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden">

      {/* ── Ambient mesh gradient background ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top-right purple/blue orb */}
        <div
          className="absolute animate-drift"
          style={{
            top: '-8%',
            right: '-4%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,72,185,0.18) 0%, rgba(56,38,120,0.08) 50%, transparent 75%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Mid-left accent orb */}
        <div
          className="absolute animate-drift2"
          style={{
            top: '30%',
            left: '-8%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,168,75,0.07) 0%, rgba(212,168,75,0.02) 50%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Bottom-right subtle blue */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,64,120,0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Center Spotlight behind Header */}
        <div
          className="absolute left-1/2 -ml-[400px]"
          style={{
            top: '-10%',
            width: '800px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at top, rgba(212,168,75,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── Content layer ── */}
      <div className="relative z-10">
        {/* Header */}
        <div className="relative w-[95%] max-w-[1800px] mx-auto px-6 pt-16 pb-16 flex flex-col items-center text-center">
          
          {/* Start over - Absolute top left */}
          <div className="absolute top-6 left-6 md:left-10 z-20">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate('/')}
              aria-label="Start over"
              className="flex items-center gap-2 py-2 text-white/50 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-semibold tracking-widest uppercase font-[var(--font-body)]">Start over</span>
            </motion.button>
          </div>

          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center max-w-4xl relative z-10"
          >
            {/* Search Chip — elegant minimalist pill */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="search-chip" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212, 168, 75, 0.25)', padding: '8px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" style={{ boxShadow: '0 0 10px var(--color-accent)' }} />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 ml-4">
                  Profile
                </span>
                <span className="mx-4 text-white/10">|</span>
                <span className="font-[var(--font-heading)] text-[12px] font-bold text-white tracking-[0.15em] uppercase">
                  {vibe}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-[var(--font-heading)] text-white mb-6 leading-[1.05] tracking-tight drop-shadow-2xl"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}
            >
              <span className="font-light">Your Dream</span> <br className="md:hidden" />
              <span className="italic font-normal text-gold-gradient" style={{ paddingRight: '0.05em' }}>Destinations</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              className="font-[var(--font-body)] font-light tracking-[0.15em] text-[0.85rem] text-white/50 max-w-2xl leading-[1.8] uppercase"
            >
              Curated exclusively for your travel style. <br className="hidden md:block" />
              Select a location to generate a masterclass itinerary.
            </motion.p>
          </motion.div>
        </div>

        {/* Results grid */}
        <div className="w-[95%] max-w-[1800px] mx-auto px-6 pb-24">
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
    </div>
  )
}
