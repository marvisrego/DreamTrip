import DestinationCard from './DestinationCard.jsx'

function DestinationSkeleton({ featured = false }) {
  return (
    <div className={`destination-skeleton ${featured ? 'destination-skeleton--featured' : ''}`} aria-hidden="true">
      <div className="skeleton-block skeleton-image" />
      <div className="skeleton-copy">
        <div className="skeleton-block skeleton-line skeleton-line--short" />
        <div className="skeleton-block skeleton-line" />
        <div className="skeleton-block skeleton-line skeleton-line--medium" />
      </div>
    </div>
  )
}

export default function DestinationGrid({ destinations = [], loading, onSelect }) {
  if (loading) {
    return (
      <div className="destination-grid" aria-label="Finding destination matches" aria-busy="true">
        {Array.from({ length: 7 }).map((_, index) => (
          <DestinationSkeleton key={index} featured={index === 0} />
        ))}
      </div>
    )
  }

  return (
    <div className="destination-grid">
      {destinations.map((destination, index) => (
        <DestinationCard
          key={`${destination.destination}-${destination.country}`}
          destination={destination}
          index={index}
          isFeatured={index === 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
