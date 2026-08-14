import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CloudSun,
  Copy,
  Leaf,
  MapPin,
  WalletCards,
} from 'lucide-react'
import AppHeader from '../components/UI/AppHeader.jsx'
import Badge from '../components/UI/Badge.jsx'
import Button from '../components/UI/Button.jsx'
import GenerationLoader from '../components/UI/GenerationLoader.jsx'
import ItineraryView from '../components/ItineraryView/ItineraryView.jsx'
import ChatFollowUp from '../components/ChatFollowUp/ChatFollowUp.jsx'
import { streamItinerary } from '../lib/api.js'
import { useUnsplash } from '../hooks/useUnsplash.js'
import { useWeather } from '../hooks/useWeather.js'
import { getFallbackImageUrl } from '../lib/unsplash.js'

export default function ItineraryPage() {
  const { destination: encodedDestination } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const destinationName = decodeURIComponent(encodedDestination || '')
  const destinationData = location.state?.destination || { destination: destinationName }
  const vibe = location.state?.vibe || sessionStorage.getItem('dreamtrip:lastVibe') || 'A balanced, locally focused trip'
  const preparedHeroImage = destinationData.imageUrl
    ? { url: destinationData.imageUrl, credit: destinationData.imageCredit }
    : null
  const { imageUrl, credit, loading: imageLoading } = useUnsplash(destinationName, preparedHeroImage)
  const { weather, conditionText } = useWeather(destinationName)
  const [imageLoaded, setImageLoaded] = useState(Boolean(preparedHeroImage))
  const [streamedText, setStreamedText] = useState('')
  const [fullText, setFullText] = useState('')
  const [loading, setLoading] = useState(Boolean(destinationName))
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const started = useRef(false)

  const generateItinerary = useCallback(async () => {
    if (!destinationName) return
    setLoading(true)
    setError('')
    setStreamedText('')
    setFullText('')

    try {
      const complete = await streamItinerary(
        destinationName,
        vibe,
        () => {},
      )
      setStreamedText(complete)
      setFullText(complete)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'We could not build this itinerary. Try again.')
    } finally {
      setLoading(false)
    }
  }, [destinationName, vibe])

  useEffect(() => {
    if (started.current) return
    started.current = true
    generateItinerary()
  }, [generateItinerary])

  const copyItinerary = async () => {
    if (!streamedText) return
    await navigator.clipboard.writeText(streamedText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (!destinationName) {
    return (
      <div className="empty-page">
        <span className="empty-page__icon"><MapPin size={22} /></span>
        <h1>Choose a destination first</h1>
        <p>Your day-by-day plan starts from the destination shortlist.</p>
        <Button onClick={() => navigate('/results')}>View matches</Button>
      </div>
    )
  }

  const preparingPage = loading || imageLoading || (Boolean(imageUrl) && !imageLoaded)

  return (
    <div className="page page--itinerary">
      {preparingPage && (
        <GenerationLoader variant="itinerary" destination={destinationName} />
      )}
      <AppHeader
        onBack={() => navigate(-1)}
        backLabel="All matches"
        trailing={(
          <span className={`plan-status ${loading ? 'plan-status--working' : ''}`}>
            <span /> {loading ? 'Building your plan' : 'Plan ready'}
          </span>
        )}
      />

      <main>
        <section className="itinerary-hero">
          <div className="itinerary-hero__media">
            {(imageLoading || !imageLoaded) && <div className="image-skeleton" aria-hidden="true" />}
            {imageUrl && (
              <img
                className={imageLoaded ? 'is-loaded' : ''}
                src={imageUrl}
                alt={`Landscape in ${destinationName}`}
                onLoad={() => setImageLoaded(true)}
                onError={(event) => {
                  const fallback = getFallbackImageUrl(destinationName)
                  if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback
                  setImageLoaded(true)
                }}
              />
            )}
            <div className="itinerary-hero__shade" />
            {credit && <span className="image-credit">{credit}</span>}
          </div>

          <div className="itinerary-hero__content">
            <p className="eyebrow">Your route starts here</p>
            <h1>{destinationName}</h1>
            <p>{destinationData.reason || `A day-by-day route shaped around “${vibe}”.`}</p>
            <div className="hero-badges">
              {destinationData.country && <Badge variant="strong"><MapPin size={14} /> {destinationData.country}</Badge>}
              <Badge><CalendarDays size={14} /> {destinationData.bestFor || '7–10 days'}</Badge>
              {weather && <Badge><CloudSun size={14} /> {weather.temp}°C · {conditionText}</Badge>}
            </div>
          </div>
        </section>

        <div className="itinerary-page-layout">
          <section className="itinerary-content" aria-labelledby="itinerary-title">
            <header className="section-heading">
              <div>
                <p className="eyebrow">Day by day</p>
                <h2 id="itinerary-title">The plan, at a glance.</h2>
              </div>
              {streamedText && (
                <Button variant="secondary" size="sm" onClick={copyItinerary}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy plan'}
                </Button>
              )}
            </header>

            {error && (
              <div className="error-panel" role="alert">
                <div><strong>Itinerary unavailable</strong><p>{error}</p></div>
                <Button size="sm" onClick={generateItinerary}>Try again</Button>
              </div>
            )}

            {!error && <ItineraryView streamedText={streamedText} loading={false} />}
          </section>

          <aside className="itinerary-sidebar">
            <section className="trip-facts">
              <p className="eyebrow">Trip notes</p>
              <h3>Before you book</h3>
              <dl>
                <div><dt>Best length</dt><dd>{destinationData.bestFor || '7–10 days'}</dd></div>
                {destinationData.priceRange && <div><dt>Starting from</dt><dd><WalletCards size={15} /> {destinationData.priceRange}</dd></div>}
                {destinationData.sustainabilityScore && <div><dt>Local impact</dt><dd><Leaf size={15} /> {destinationData.sustainabilityScore}/10</dd></div>}
              </dl>
              <a
                className="map-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open {destinationName} in Maps <ArrowUpRight size={16} />
              </a>
            </section>

            {fullText && (
              <ChatFollowUp destination={destinationName} vibe={vibe} itinerary={fullText} />
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
