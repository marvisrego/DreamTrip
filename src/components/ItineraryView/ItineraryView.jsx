// source_handbook: week11-hackathon-preparation
import { useMemo, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import DayCard from './DayCard'
import Loader from '../UI/Loader.jsx'

function parseDays(text) {
  if (!text) return []
  const parts = text.split(/(?=Day\s+\d+:)/i)
  return parts
    .map(part => part.trim())
    .filter(part => /^Day\s+\d+:/i.test(part))
}

export default function ItineraryView({ streamedText, loading }) {
  const days = useMemo(() => parseDays(streamedText), [streamedText])
  const timelineRef = useRef(null)

  // Scroll-driven timeline line — draws as the user scrolls through the list
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.25'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })

  if (loading && !streamedText) {
    return <Loader text="Crafting your perfect itinerary..." />
  }

  if (!streamedText && !loading) {
    return null
  }

  return (
    <div ref={timelineRef} className="relative">
      {/* Scroll-driven timeline line */}
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-[5px] top-0 bottom-0 w-px timeline-line"
      />
      {/* Static dim track behind the animated line */}
      <div className="absolute left-[5px] top-0 bottom-0 w-px bg-white/[0.04]" />

      <div className="space-y-2">
        {days.map((dayText, index) => (
          <DayCard
            key={index}
            dayText={dayText}
            dayNumber={index + 1}
            index={index}
          />
        ))}
      </div>

      {/* Streaming indicator */}
      {loading && days.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pl-8 md:pl-12 pt-4"
        >
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <div className="flex gap-1.5 p-3 rounded-2xl bg-[var(--color-bg-secondary)] border border-white/5">
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm font-[var(--font-body)]">Planning more days...</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
