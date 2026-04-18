// source_handbook: week11-hackathon-preparation
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useGemini } from '@/hooks/useGemini'
import DestinationGrid from '@/components/DestinationCard/DestinationGrid'
import Button from '@/components/UI/Button'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const vibe = location.state?.vibe

  const { destinations, loading, error, fetchDestinations } = useGemini()

  useEffect(() => {
    if (vibe) {
      fetchDestinations(vibe)
    }
  }, []) // Only fetch on mount

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
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate('/')}
          aria-label="Start over"
          className="flex items-center gap-2 py-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Start over</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
            <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold text-white">
              Here are your matches
            </h1>
          </div>
          <p className="text-[var(--color-text-muted)] font-[var(--font-body)] italic">
            "{vibe}"
          </p>
        </motion.div>
      </div>

      {/* Results grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => fetchDestinations(vibe)}>Try Again</Button>
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
