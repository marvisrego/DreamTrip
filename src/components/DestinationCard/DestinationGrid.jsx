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
//   Row 2:                   [Regular] [Regular] [Regular]
//   Row 3:                   [Regular] [Regular] [Regular]
//   Row 4 (full-width):      [Banner col-span-3]
// Total = 1 featured + 7 regular + 1 banner = 9 cards

export default function DestinationGrid({ destinations, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Simulate the bento skeleton */}
        <div className="lg:col-span-2 min-h-[420px]">
          <CardSkeleton tall />
        </div>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <div className="lg:col-span-3">
          <CardSkeleton wide />
        </div>
      </div>
    )
  }

  if (!destinations || destinations.length === 0) return null

  const featured  = destinations[0]                                      // index 0 → featured
  const regular   = destinations.slice(1, destinations.length - 1)       // indices 1..n-2
  const banner    = destinations[destinations.length - 1]                 // last index → banner

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <AnimatePresence>
        {/* ── Featured card (2 columns) ── */}
        <div key={featured.destination} className="lg:col-span-2">
          <DestinationCard
            destination={featured}
            index={0}
            variant="featured"
            onSelect={onSelect}
          />
        </div>

        {/* ── Regular cards ── */}
        {regular.map((dest, i) => (
          <DestinationCard
            key={dest.destination}
            destination={dest}
            index={i + 1}
            variant="regular"
            onSelect={onSelect}
          />
        ))}

        {/* ── Banner card (full width) ── */}
        {destinations.length > 1 && (
          <div key={banner.destination} className="lg:col-span-3">
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
