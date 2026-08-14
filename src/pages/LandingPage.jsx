import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Compass, LoaderCircle, Map, Sparkles } from 'lucide-react'
import AppHeader from '../components/UI/AppHeader.jsx'
import GenerationLoader from '../components/UI/GenerationLoader.jsx'
import { fetchDestinations } from '../lib/api.js'
import { prepareDestinationImages } from '../lib/unsplash.js'
import heroVideo from '../../7262-199224619_medium.mp4'

const STARTERS = [
  'Quiet coast, local food, no crowds',
  'A mountain reset with scenic train rides',
  'A lively city break under $1,500',
]

function RoutePreview() {
  return (
    <aside className="route-preview" aria-label="How DreamTrip works">
      <div className="route-preview__map" aria-hidden="true">
        <svg viewBox="0 0 520 310" role="presentation">
          <path className="contour contour--one" d="M-20 68C76 20 147 105 226 62s162-48 310 13" />
          <path className="contour contour--two" d="M-10 246c112-67 182 21 283-23s163-39 268 16" />
          <path className="journey-line" d="M71 245C129 174 151 184 207 130s126-38 178-87" />
          <circle className="journey-stop" cx="71" cy="245" r="7" />
          <circle className="journey-stop" cx="207" cy="130" r="7" />
          <circle className="journey-stop journey-stop--last" cx="385" cy="43" r="9" />
        </svg>
        <span className="map-label map-label--start">Your brief</span>
        <span className="map-label map-label--middle">9 matches</span>
        <span className="map-label map-label--end">Your route</span>
      </div>

      <div className="route-preview__content">
        <p className="eyebrow">From feeling to flight plan</p>
        <h2>One thoughtful brief. A trip you can actually use.</h2>
        <ol className="route-steps">
          <li><span><Check size={14} /></span><div><strong>Describe the feeling</strong><small>Budget, pace, people, and what you want more of.</small></div></li>
          <li><span><Compass size={14} /></span><div><strong>Compare real matches</strong><small>Nine places ranked against your priorities.</small></div></li>
          <li><span><Map size={14} /></span><div><strong>Build the days</strong><small>A practical itinerary you can refine in conversation.</small></div></li>
        </ol>
      </div>
    </aside>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const planTrip = async (event) => {
    event?.preventDefault()
    const vibe = input.trim()
    if (!vibe || loading) return

    setLoading(true)
    setError('')

    try {
      const destinations = await fetchDestinations(vibe)
      const preparedDestinations = await prepareDestinationImages(destinations)
      navigate('/results', { state: { vibe, destinations: preparedDestinations } })
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'We could not create matches from that brief. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <GenerationLoader variant="destinations" />
  }

  return (
    <div className="page page--landing">
      <AppHeader
        trailing={<span className="model-note"><Sparkles size={14} /> NVIDIA Nemotron</span>}
      />

      <main className="landing-main">
        <video
          className="landing-video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={(event) => {
            event.currentTarget.currentTime = 0
            event.currentTarget.play().catch(() => {})
          }}
        />
        <div className="landing-video-scrim" aria-hidden="true" />

        <section className="landing-copy" aria-labelledby="landing-title">
          <p className="eyebrow">AI trip planning, led by you</p>
          <h1 id="landing-title">Tell us how you want the trip to <em>feel.</em></h1>
          <p className="landing-lede">
            Skip the filter maze. Describe the pace, budget, company, and moments you want—DreamTrip will find the places that fit.
          </p>

          <form className="trip-composer" onSubmit={planTrip}>
            <label htmlFor="trip-brief">Your travel brief</label>
            <div className="composer-field">
              <textarea
                id="trip-brief"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: Ten quiet days by the sea, excellent food, easy walks, and no party towns…"
                rows={4}
                maxLength={800}
                disabled={loading}
              />
              <button
                className="composer-submit"
                type="submit"
                disabled={!input.trim() || loading}
                aria-label={loading ? 'Finding destinations' : 'Find destinations'}
              >
                {loading ? <LoaderCircle className="spin" size={20} /> : <ArrowRight size={20} />}
              </button>
            </div>
            <div className="composer-meta">
              <span>{loading ? 'Reading your brief and matching places…' : 'Add as much detail as you like'}</span>
              <span>{input.length}/800</span>
            </div>
          </form>

          {error && <div className="inline-error" role="alert">{error}</div>}

          <div className="starter-row" aria-label="Example travel briefs">
            <span>Try</span>
            {STARTERS.map((starter) => (
              <button type="button" key={starter} onClick={() => setInput(starter)}>
                {starter}
              </button>
            ))}
          </div>
        </section>

        <RoutePreview />
      </main>

      <footer className="landing-footer">
        <span>Destination ideas and itineraries can be imperfect. Confirm bookings and entry rules independently.</span>
        <span>30° N · 31° E → anywhere</span>
      </footer>
    </div>
  )
}
