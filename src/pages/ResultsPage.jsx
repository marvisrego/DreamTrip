import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RefreshCw, SlidersHorizontal } from 'lucide-react'
import AppHeader from '../components/UI/AppHeader.jsx'
import Button from '../components/UI/Button.jsx'
import DestinationGrid from '../components/DestinationCard/DestinationGrid.jsx'
import { fetchDestinations } from '../lib/api.js'

const CACHE_PREFIX = 'dreamtrip:dest:'
const LAST_VIBE_KEY = 'dreamtrip:lastVibe'
const normalizeVibe = (value) => (value || '').toLowerCase().trim().replace(/\s+/g, ' ')

function readCache(vibe) {
  try {
    const stored = sessionStorage.getItem(CACHE_PREFIX + normalizeVibe(vibe))
    const parsed = stored ? JSON.parse(stored) : null
    return Array.isArray(parsed) && parsed.length ? parsed : []
  } catch {
    return []
  }
}

function writeCache(vibe, destinations) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + normalizeVibe(vibe), JSON.stringify(destinations))
  } catch {
    // Session storage is an enhancement; the page works without it.
  }
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const vibe = location.state?.vibe || sessionStorage.getItem(LAST_VIBE_KEY) || ''
  const supplied = location.state?.destinations
  const [destinations, setDestinations] = useState(() => (
    Array.isArray(supplied) && supplied.length ? supplied : readCache(vibe)
  ))
  const [loading, setLoading] = useState(!destinations.length && Boolean(vibe))
  const [error, setError] = useState('')

  const loadDestinations = useCallback(async () => {
    if (!vibe) return
    setLoading(true)
    setError('')

    try {
      const matches = await fetchDestinations(vibe)
      setDestinations(matches)
      writeCache(vibe, matches)
    } catch (requestError) {
      console.error(requestError)
      setError('We could not refresh these matches. Check the NVIDIA API key, then try again.')
    } finally {
      setLoading(false)
    }
  }, [vibe])

  useEffect(() => {
    if (!vibe) return
    sessionStorage.setItem(LAST_VIBE_KEY, vibe)
    if (Array.isArray(supplied) && supplied.length) writeCache(vibe, supplied)
    if (!destinations.length) loadDestinations()
    // Initial hydration only; retry is handled explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectDestination = (destination) => {
    navigate(`/itinerary/${encodeURIComponent(destination.destination)}`, {
      state: { destination, vibe },
    })
  }

  if (!vibe) {
    return (
      <div className="empty-page">
        <span className="empty-page__icon"><SlidersHorizontal size={22} /></span>
        <h1>Start with a travel brief</h1>
        <p>Tell us how you want the trip to feel, and we’ll match places to it.</p>
        <Button onClick={() => navigate('/')}>Create a brief</Button>
      </div>
    )
  }

  return (
    <div className="page page--results">
      <AppHeader onBack={() => navigate('/')} backLabel="Edit brief" />

      <main className="results-main">
        <section className="results-heading">
          <div>
            <p className="eyebrow">Your destination shortlist</p>
            <h1>Places that fit the way you want to travel.</h1>
          </div>
          <blockquote>“{vibe}”</blockquote>
        </section>

        <div className="results-toolbar">
          <span>{loading ? 'Finding matches…' : `${destinations.length} places · ranked by fit`}</span>
          {!loading && (
            <button type="button" className="text-button" onClick={loadDestinations}>
              <RefreshCw size={15} /> Refresh matches
            </button>
          )}
        </div>

        {error && (
          <div className="error-panel" role="alert">
            <div><strong>Matches unavailable</strong><p>{error}</p></div>
            <Button size="sm" onClick={loadDestinations}>Try again</Button>
          </div>
        )}

        {!error && (
          <DestinationGrid destinations={destinations} loading={loading} onSelect={selectDestination} />
        )}
      </main>
    </div>
  )
}
