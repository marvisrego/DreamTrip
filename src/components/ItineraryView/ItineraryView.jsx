import DayCard from './DayCard.jsx'

function parseDays(text) {
  if (!text) return []
  return text
    .split(/(?=Day\s+\d+\s*:)/i)
    .map((part) => part.trim())
    .filter((part) => /^Day\s+\d+\s*:/i.test(part))
}

function DaySkeleton({ index }) {
  return (
    <div className="day-card day-card--skeleton" aria-hidden="true">
      <div className="day-node">{String(index).padStart(2, '0')}</div>
      <div className="day-card__body">
        <div className="skeleton-block skeleton-line skeleton-line--short" />
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-line" />
        <div className="skeleton-block skeleton-line skeleton-line--medium" />
      </div>
    </div>
  )
}

export default function ItineraryView({ streamedText, loading }) {
  const days = parseDays(streamedText)

  return (
    <div className="itinerary-timeline" aria-live="polite" aria-busy={loading}>
      {days.map((day, index) => (
        <DayCard key={`${index}-${day.slice(0, 30)}`} dayText={day} dayNumber={index + 1} />
      ))}

      {loading && days.length === 0 && [1, 2, 3].map((index) => (
        <DaySkeleton key={index} index={index} />
      ))}

      {loading && days.length > 0 && (
        <div className="timeline-status">
          <span className="status-dot" /> Planning the next day…
        </div>
      )}
    </div>
  )
}
