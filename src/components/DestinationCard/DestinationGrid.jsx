// source_handbook: week11-hackathon-preparation
import { motion, AnimatePresence } from 'framer-motion'
import DestinationCard from './DestinationCard'
import CardSkeleton from '@/components/Skeleton/CardSkeleton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export default function DestinationGrid({ destinations, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {destinations.map((dest, index) => (
          <DestinationCard
            key={dest.destination}
            destination={dest}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
