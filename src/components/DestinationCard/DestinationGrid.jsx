// source_handbook: week11-hackathon-preparation
import { motion, AnimatePresence } from 'framer-motion'
import DestinationCard from './DestinationCard'
import CardSkeleton from '@/components/Skeleton/CardSkeleton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

// Bento layout:
//   Row 1 (lg:grid-cols-3): [Featured col-span-2] [Regular]
//   Row 2+:                  [Regular] [Regular] [Regular]
//   Last row (full-width):   [Banner col-span-3]
// Total = 1 featured + N regular + 1 banner

export default function DestinationGrid({ destinations, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 w-full max-w-[1800px] mx-auto">
        {/* Simulate the bento skeleton */}
        <div className="min-h-[460px]">
          <CardSkeleton tall />
        </div>
        <div>
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
        <div className="col-span-full">
          <CardSkeleton wide />
        </div>
      </div>
    )
  }

  if (!destinations || destinations.length === 0) return null

  const featured  = destinations[0]                                      // index 0 → featured
  const regular   = destinations.slice(1, destinations.length - 1)       // indices 1..n-2
  const banner    = destinations.length > 2 ? destinations[destinations.length - 1] : null  // last index → banner (only if 3+)

  // If only 2 destinations, show featured + one regular
  if (destinations.length === 2) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 w-full max-w-[1800px] mx-auto"
      >
        <div key={featured.destination}>
          <DestinationCard destination={featured} index={0} variant="featured" onSelect={onSelect} />
        </div>
        <div>
          <DestinationCard key={destinations[1].destination} destination={destinations[1]} index={1} variant="regular" onSelect={onSelect} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 w-full max-w-[1800px] mx-auto"
    >
      <AnimatePresence>
        {/* ── Featured card (2fr) ── */}
        <div key={featured.destination}>
          <DestinationCard
            destination={featured}
            index={0}
            variant="featured"
            onSelect={onSelect}
          />
        </div>

        {/* ── Regular cards (1fr) ── */}
        {regular.map((dest, i) => (
          <div key={dest.destination}>
            <DestinationCard
              destination={dest}
              index={i + 1}
              variant="regular"
              onSelect={onSelect}
            />
          </div>
        ))}

        {/* ── Banner card (full width 100%) ── */}
        {banner && (
          <div key={banner.destination} className="col-span-full">
            <DestinationCard
              destination={banner}
              index={destinations.length - 1}
              variant="banner"
              onSelect={onSelect}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
