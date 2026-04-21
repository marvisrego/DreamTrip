import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import DestinationCard from './DestinationCard'

export default function DestinationGrid({ destinations, loading, onSelect, onAllImagesReady }) {
  const [imagesReady, setImagesReady] = useState(0)
  const [timedOut, setTimedOut]       = useState(false)

  useEffect(() => {
    setImagesReady(0)
    setTimedOut(false)
  }, [destinations])

  // Safety net: fire ready after 6 s even if an image never fires load/error
  useEffect(() => {
    if (!destinations?.length || loading) return
    const id = setTimeout(() => setTimedOut(true), 6000)
    return () => clearTimeout(id)
  }, [destinations, loading])

  const handleImageReady = useCallback(() => setImagesReady((n) => n + 1), [])

  const hasDestinations = destinations && destinations.length > 0
  const allImagesLoaded = hasDestinations && (imagesReady >= destinations.length || timedOut)

  useEffect(() => {
    if (allImagesLoaded) onAllImagesReady?.()
  }, [allImagesLoaded, onAllImagesReady])

  const featured = hasDestinations ? destinations[0]      : null
  const rest      = hasDestinations ? destinations.slice(1) : []

  return (
    <div
      style={!allImagesLoaded
        ? { position: 'absolute', top: 0, left: 0, right: 0, opacity: 0, pointerEvents: 'none' }
        : {}}
    >
      {hasDestinations && (
        <div className="flex flex-col gap-0">

          {/* ── Featured hero card ── */}
          <DestinationCard
            key={featured.destination}
            destination={featured}
            index={0}
            isFeatured
            onSelect={onSelect}
            onImageReady={handleImageReady}
          />

          {/* ── Scroll indicator ── */}
          {rest.length > 0 && (
            <div className="flex flex-col items-center gap-2 py-10">
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}>
                Scroll to explore more
              </span>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown style={{ width: '18px', height: '18px', color: 'rgba(212,168,75,0.45)' }} />
              </motion.div>
            </div>
          )}

          {/* ── Remaining destinations grid ── */}
          {rest.length > 0 && (
            <div className={`grid gap-6 w-full ${
              rest.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : rest.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2 lg:grid-cols-3'
            }`}>
              {rest.map((dest, i) => (
                <DestinationCard
                  key={dest.destination}
                  destination={dest}
                  index={i + 1}
                  isFeatured={false}
                  onSelect={onSelect}
                  onImageReady={handleImageReady}
                />
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
