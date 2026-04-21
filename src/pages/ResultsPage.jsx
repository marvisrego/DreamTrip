import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { fetchDestinations } from '../lib/api.js'
import DestinationGrid from '../components/DestinationCard/DestinationGrid.jsx'
import Button from '../components/UI/Button.jsx'

/* ── Session cache — keeps destination results across refreshes ── */
const CACHE_PREFIX  = 'dreamtrip:dest:'
const LAST_VIBE_KEY = 'dreamtrip:lastVibe'
const normalizeVibe = (v) => (v || '').toLowerCase().trim().replace(/\s+/g, ' ')

function readCache(vibe) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + normalizeVibe(vibe))
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch { return null }
}

function writeCache(vibe, destinations) {
  try {
    if (!vibe || !Array.isArray(destinations) || destinations.length === 0) return
    sessionStorage.setItem(CACHE_PREFIX + normalizeVibe(vibe), JSON.stringify(destinations))
  } catch { /* quota exceeded — silently ignore */ }
}

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}

function LoadingOverlay({ vibe }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      key="results-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeInOut' } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#09090f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '28px',
      }}
    >
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={reduce ? {} : { scale: [1, 1.22, 1], opacity: [0.2, 0.38, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,75,0.38) 0%, transparent 70%)', filter: 'blur(18px)' }}
        />
        <motion.div
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '144px', height: '144px', borderRadius: '50%', border: '1px dashed rgba(212,168,75,0.22)' }}
        />
        <motion.div
          animate={reduce ? {} : { rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '112px', height: '112px', borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: 'rgba(212,168,75,0.55)', borderRightColor: 'rgba(212,168,75,0.18)' }}
        />
        <motion.div
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '88px', height: '88px', borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: 'rgba(212,168,75,0.7)', borderLeftColor: 'rgba(212,168,75,0.25)' }}
        />
        <motion.div
          animate={reduce ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '68px', height: '68px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(212,168,75,0.18), rgba(212,168,75,0.06))', border: '1px solid rgba(212,168,75,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(212,168,75,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
        >
          <motion.div animate={reduce ? {} : { rotate: [0, 15, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Sparkles style={{ width: '28px', height: '28px', color: '#d4a84b', filter: 'drop-shadow(0 0 6px rgba(212,168,75,0.8))' }} />
          </motion.div>
        </motion.div>
      </div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <motion.p
          animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}
        >
          Curating your destinations…
        </motion.p>
        {vibe && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(212,168,75,0.65)', letterSpacing: '0.08em', margin: 0, maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{vibe}"
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Resolve vibe: from navigation state → sessionStorage (survives refresh)
  const vibe = location.state?.vibe
    || (typeof window !== 'undefined' ? sessionStorage.getItem(LAST_VIBE_KEY) : null)
  const preloadedDestinations = location.state?.destinations

  // Lazy initializer — runs once on mount. Picks the best source available.
  const [destinations, setDestinations] = useState(() => {
    if (Array.isArray(preloadedDestinations) && preloadedDestinations.length > 0) {
      return preloadedDestinations
    }
    const cached = vibe ? readCache(vibe) : null
    return cached || []
  })

  const [loading, setLoading] = useState(destinations.length === 0 && !!vibe)
  const [error, setError] = useState(null)
  const [imagesReady, setImagesReady] = useState(false)

  const loadDestinations = useCallback(async (v) => {
    setLoading(true)
    setError(null)
    setImagesReady(false)
    try {
      const data = await fetchDestinations(v)
      setDestinations(data)
      writeCache(v, data)
    } catch {
      setError('Failed to fetch destinations. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist vibe + seed cache from preloaded navigation state
  useEffect(() => {
    if (!vibe) return
    try { sessionStorage.setItem(LAST_VIBE_KEY, vibe) } catch {}
    if (Array.isArray(preloadedDestinations) && preloadedDestinations.length > 0) {
      writeCache(vibe, preloadedDestinations)
    }
  }, [vibe, preloadedDestinations])

  // Fetch only if we don't already have destinations (from state or cache)
  useEffect(() => {
    if (destinations.length === 0 && vibe) {
      loadDestinations(vibe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAllImagesReady = useCallback(() => setImagesReady(true), [])

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

  const revealed = !loading && destinations.length > 0 && imagesReady

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden">

      {/* Full-page overlay — dismisses only when text + all images are ready */}
      <AnimatePresence>
        {!revealed && !error && <LoadingOverlay vibe={vibe} />}
      </AnimatePresence>

      {/* Ambient mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute animate-drift"
          style={{
            top: '-8%', right: '-4%', width: '650px', height: '650px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,72,185,0.18) 0%, rgba(56,38,120,0.08) 50%, transparent 75%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute animate-drift2"
          style={{
            top: '30%', left: '-8%', width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,168,75,0.07) 0%, rgba(212,168,75,0.02) 50%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-10%', right: '15%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,64,120,0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute left-1/2 -ml-[400px]"
          style={{
            top: '-10%', width: '800px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse at top, rgba(212,168,75,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Content layer — fades in once overlay lifts */}
      <motion.div
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: revealed ? 0.15 : 0 }}
        className="relative z-10"
      >
        {/* Header */}
        <div className="relative w-[95%] max-w-[1800px] mx-auto px-6 pt-16 pb-16 flex flex-col items-center text-center">
          <div className="absolute top-6 left-6 md:left-10 z-20">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate('/')}
              aria-label="Start over"
              className="flex items-center gap-2 py-2 text-white/50 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] rounded-md transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-semibold tracking-widest uppercase font-[var(--font-body)]">Start over</span>
            </motion.button>
          </div>

          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={revealed ? 'visible' : 'hidden'}
            className="flex flex-col items-center max-w-4xl relative z-10"
          >
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

            <motion.h1
              variants={fadeUp}
              className="font-[var(--font-heading)] text-white mb-6 leading-[1.05] tracking-tight drop-shadow-2xl"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)' }}
            >
              <span className="font-light">Your Dream</span> <br className="md:hidden" />
              <span className="italic font-normal text-gold-gradient" style={{ paddingRight: '0.05em' }}>Destinations</span>
            </motion.h1>

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
            onAllImagesReady={handleAllImagesReady}
          />
        </div>
      </motion.div>
    </div>
  )
}
