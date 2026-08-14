import { useEffect, useState } from 'react'
import { MapPin, Plane, Sparkles } from 'lucide-react'

const CONTENT = {
  destinations: {
    eyebrow: 'Reading your travel brief',
    title: 'Tracing the places that fit.',
    steps: [
      'Comparing pace, budget, and atmosphere',
      'Ranking the strongest destination matches',
      'Loading every view before the reveal',
    ],
    note: 'Your shortlist will open when every destination is ready.',
  },
  itinerary: {
    eyebrow: 'Building your route',
    title: 'Turning a place into days.',
    steps: [
      'Finding a natural rhythm for the trip',
      'Balancing landmarks with local moments',
      'Finishing the complete day-by-day plan',
    ],
    note: 'The full itinerary will appear all at once when it is ready.',
  },
}

export default function GenerationLoader({ variant = 'destinations', destination = '' }) {
  const content = CONTENT[variant] || CONTENT.destinations
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStep((current) => (current + 1) % content.steps.length)
    }, 1800)

    return () => window.clearInterval(interval)
  }, [content.steps.length])

  return (
    <section className="generation-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="generation-loader__topography" aria-hidden="true">
        <svg viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice">
          <path className="loader-contour loader-contour--one" d="M-60 195C102 44 251 264 403 129s296-14 395-85 177-10 265 79" />
          <path className="loader-contour loader-contour--two" d="M-72 475c146-152 283 50 430-61s265-33 377-121 237-31 342 46" />
          <path className="loader-contour loader-contour--three" d="M56 680c52-161 197-182 328-121s232-39 328-4 182 3 276-104" />
          <path className="loader-route" d="M118 521C220 452 205 340 346 326s155-132 282-88 167-85 260-130" />
          <circle className="loader-stop" cx="118" cy="521" r="9" />
          <circle className="loader-stop" cx="346" cy="326" r="8" />
          <circle className="loader-stop loader-stop--last" cx="888" cy="108" r="11" />
        </svg>
      </div>

      <div className="generation-loader__card">
        <div className="generation-loader__stamp" aria-hidden="true">
          {variant === 'itinerary' ? <MapPin size={24} /> : <Plane size={24} />}
        </div>
        <p className="eyebrow"><Sparkles size={13} /> {content.eyebrow}</p>
        <h1>{destination ? `Planning ${destination}.` : content.title}</h1>
        <div className="generation-loader__status">
          <span className="generation-loader__pulse" aria-hidden="true" />
          <p key={step}>{content.steps[step]}</p>
        </div>
        <div className="generation-loader__meter" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <small>{content.note}</small>
      </div>
    </section>
  )
}
