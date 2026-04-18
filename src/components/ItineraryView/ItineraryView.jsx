// source_handbook: week11-hackathon-preparation
import { useMemo } from 'react'
import DayCard from './DayCard'
import Loader from '@/components/UI/Loader'

/**
 * Parse streaming itinerary text into individual day blocks.
 * Splits on "Day N:" pattern and returns an array of day texts.
 */
function parseDays(text) {
  if (!text) return []

  // Split by "Day N:" pattern, keeping the delimiter
  const parts = text.split(/(?=Day\s+\d+:)/i)
  return parts
    .map(part => part.trim())
    .filter(part => /^Day\s+\d+:/i.test(part))
}

export default function ItineraryView({ streamedText, loading }) {
  const days = useMemo(() => parseDays(streamedText), [streamedText])

  if (loading && !streamedText) {
    return <Loader text="Crafting your perfect itinerary..." />
  }

  if (!streamedText && !loading) {
    return null
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[5px] md:left-[5px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)]/50 via-[var(--color-accent)]/20 to-transparent" />

      {/* Day cards */}
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
        <div className="pl-8 md:pl-12 pt-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Planning more days...</span>
          </div>
        </div>
      )}
    </div>
  )
}
