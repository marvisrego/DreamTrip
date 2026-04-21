import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import DestinationCard from './DestinationCard'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export default function DestinationGrid({ destinations, loading, onSelect, onAllImagesReady }) {
  const [imagesReady, setImagesReady] = useState(0)
  const [timedOut, setTimedOut] = useState(false)

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

  // Cards always rendered (even while invisible) so hooks & image fetches run.
  // Parent's sparkle overlay covers everything — no skeleton here.
  return (
    <div
      style={!allImagesLoaded
        ? { position: 'absolute', top: 0, left: 0, right: 0, opacity: 0, pointerEvents: 'none' }
        : {}}
    >
      {hasDestinations && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={allImagesLoaded ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1800px] mx-auto"
        >
          {destinations.map((dest, i) => (
            <DestinationCard
              key={dest.destination}
              destination={dest}
              index={i}
              onSelect={onSelect}
              onImageReady={handleImageReady}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
