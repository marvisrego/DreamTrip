import { useState } from 'react'
import { ArrowUpRight, CalendarDays, Leaf, MapPin } from 'lucide-react'
import { useUnsplash } from '../../hooks/useUnsplash.js'
import { getFallbackImageUrl } from '../../lib/unsplash.js'

export default function DestinationCard({ destination, index = 0, isFeatured = false, onSelect }) {
  const preparedImage = destination.imageUrl
    ? { url: destination.imageUrl, credit: destination.imageCredit }
    : null
  const { imageUrl, credit, loading } = useUnsplash(destination.destination, preparedImage)
  const [imageLoaded, setImageLoaded] = useState(Boolean(preparedImage))

  const handleImageError = (event) => {
    const fallback = getFallbackImageUrl(destination.destination)
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback
    setImageLoaded(true)
  }

  return (
    <article className={`destination-card ${isFeatured ? 'destination-card--featured' : ''}`}>
      <button type="button" className="destination-card__button" onClick={() => onSelect(destination)}>
        <div className="destination-card__image-wrap">
          {(loading || !imageLoaded) && <div className="image-skeleton" aria-hidden="true" />}
          {imageUrl && (
            <img
              className={imageLoaded ? 'is-loaded' : ''}
              src={imageUrl}
              alt={`${destination.destination}, ${destination.country}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          )}
          <div className="destination-card__shade" />
          <span className="destination-rank">{String(index + 1).padStart(2, '0')}</span>
          {credit && <span className="image-credit">{credit}</span>}
          <div className="destination-card__title">
            <span><MapPin size={14} /> {destination.country}</span>
            <h2>{destination.destination}</h2>
          </div>
        </div>

        <div className="destination-card__content">
          <div className="match-row">
            <strong>{destination.matchScore || 90}% match</strong>
            <span aria-hidden="true"><ArrowUpRight size={18} /></span>
          </div>
          <p>{destination.reason}</p>

          <div className="destination-tags">
            {(destination.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="destination-facts">
            <span><CalendarDays size={15} /> {destination.bestFor || '7–10 days'}</span>
            {destination.priceRange && <span>{destination.priceRange}</span>}
            {destination.sustainabilityScore && (
              <span><Leaf size={15} /> {destination.sustainabilityScore}/10</span>
            )}
          </div>
        </div>
      </button>
    </article>
  )
}
