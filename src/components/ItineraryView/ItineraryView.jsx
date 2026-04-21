import { useMemo, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import DayCard from './DayCard'

function parseDays(text) {
  if (!text) return []
  const parts = text.split(/(?=Day\s+\d+:)/i)
  return parts
    .map(part => part.trim())
    .filter(part => /^Day\s+\d+:/i.test(part))
}

// Pulse-animated skeleton that matches the DayCard silhouette
function DayCardSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24, delay: index * 0.1 }}
      className="relative pb-8"
      style={{ paddingLeft: '2rem' }}
    >
      {/* Timeline dot */}
      <div style={{
        position: 'absolute', left: 0, top: '10px',
        width: '12px', height: '12px', borderRadius: '50%',
        background: 'rgba(212,168,75,0.15)',
        boxShadow: '0 0 0 3px rgba(212,168,75,0.06)',
      }} />

      {/* Card body */}
      <div
        className="glass-card animate-pulse"
        style={{ padding: '24px', overflow: 'hidden' }}
      >
        {/* Day label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '8px', borderRadius: '4px', background: 'rgba(212,168,75,0.14)' }} />
          <div style={{ flex: 1, height: '1px', background: 'rgba(212,168,75,0.08)' }} />
        </div>
        {/* Title */}
        <div style={{ width: '58%', height: '20px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', marginBottom: '26px' }} />
        {/* Three section rows */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: i < 2 ? '22px' : 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '55px', height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '9px' }} />
              <div style={{ width: '100%', height: '11px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', marginBottom: '5px' }} />
              <div style={{ width: `${70 + i * 8}%`, height: '11px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ItineraryView({ streamedText, loading }) {
  const days = useMemo(() => parseDays(streamedText), [streamedText])
  const timelineRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.25'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })

  // Loading gate: only render a DayCard when its text is fully received.
  // While streaming, the last element of `days` is still being written → show it as skeleton.
  const completeDays = useMemo(() => {
    if (!loading) return days
    return days.slice(0, -1)
  }, [days, loading])

  const showInitialSkeletons = loading && days.length === 0
  const showStreamingSkeleton = loading && days.length > 0

  if (!streamedText && !loading) return null

  return (
    <div ref={timelineRef} className="relative">
      {/* Scroll-driven timeline line */}
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-[5px] top-0 bottom-0 w-px timeline-line"
      />
      <div className="absolute left-[5px] top-0 bottom-0 w-px bg-white/[0.04]" />

      <div className="space-y-2">
        {/* Completed days — fade in with slide-up on mount */}
        {completeDays.map((dayText, index) => (
          <DayCard
            key={dayText.slice(0, 30)}
            dayText={dayText}
            dayNumber={index + 1}
            index={index}
          />
        ))}

        {/* Skeleton for the day currently being streamed */}
        {showStreamingSkeleton && (
          <DayCardSkeleton key="streaming" index={0} />
        )}

        {/* Initial skeletons before any day arrives */}
        {showInitialSkeletons && [0, 1, 2].map(i => (
          <DayCardSkeleton key={`init-${i}`} index={i} />
        ))}
      </div>

      {/* "More days loading" indicator while streaming beyond the first */}
      {loading && completeDays.length > 0 && (
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
            <span className="text-sm font-[var(--font-body)]">Planning more days…</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
