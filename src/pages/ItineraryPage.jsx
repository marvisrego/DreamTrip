// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { streamItinerary } from '@/lib/api'
import { useUnsplash } from '@/hooks/useUnsplash'
import { useWeather } from '@/hooks/useWeather'
import { getFallbackImageUrl } from '@/lib/unsplash'
import { getItineraryPrompt } from '@/prompts/itineraryPrompt'
import ItineraryView from '@/components/ItineraryView/ItineraryView'
import ChatFollowUp from '@/components/ChatFollowUp/ChatFollowUp'
import Badge from '@/components/UI/Badge'
import Button from '@/components/UI/Button'
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Copy, Check } from 'lucide-react'

const WeatherIcons = { Sun, Cloud, CloudRain, CloudSnow, CloudLightning }

export default function ItineraryPage() {
  const { destination: destParam } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const destinationData = location.state?.destination
  const vibe = location.state?.vibe
  const destinationName = destinationData?.destination || decodeURIComponent(destParam)

  const { imageUrl, loading: imageLoading } = useUnsplash(destinationName)
  const { weather, conditionText, iconName, loading: weatherLoading } = useWeather(destinationName)
  const [streamedText, setStreamedText] = useState('')
  const [fullText, setFullText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  const WeatherIcon = WeatherIcons[iconName] || Sun

  // Subtle parallax effect on scroll
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0])

  const generateItinerary = async () => {
    if (!destinationName || !vibe) return
    
    setLoading(true)
    setError(null)
    setStreamedText('')
    
    try {
      let accumulated = ''
      await streamItinerary(destinationName, vibe, (chunk) => {
        accumulated += chunk
        setStreamedText(accumulated)
      })
      setFullText(accumulated)
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Request itinerary on mount
  useEffect(() => {
    generateItinerary()
  }, []) // Only on mount

  if (!destinationName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-text-muted)]">No destination selected.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    )
  }

  const copyToClipboard = async () => {
    if (!streamedText) return
    await navigator.clipboard.writeText(streamedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24">
      {/* Sticky navigation bar */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 nav-blur"
      >
        <div className="max-w-[var(--content-max)] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium font-[var(--font-body)]">Back</span>
          </button>
          <span className="text-sm font-medium text-white/50 font-[var(--font-body)] truncate max-w-[200px]">
            {destinationName}
          </span>
          <div className="w-[60px]" /> {/* Spacer for centering */}
        </div>
      </motion.nav>

      {/* Hero section */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {/* Background image */}
        {(imageLoading || !imageLoaded) && (
          <div className="absolute inset-0 shimmer bg-[var(--color-bg-secondary)]" />
        )}
        {imageUrl && (
          <motion.img
            src={imageUrl}
            alt={destinationName}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const fallback = getFallbackImageUrl(destinationName)
              if (e.target.src !== fallback) {
                e.target.src = fallback
              }
            }}
            style={{ y }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className={`
              absolute inset-0 w-full h-[120%] -top-[10%] object-cover
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              transition-opacity duration-700
            `}
          />
        )}

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-[var(--content-max)] mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {destinationData?.countryCode && (
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={`https://flagcdn.com/w40/${destinationData.countryCode.toLowerCase()}.png`}
                  alt={destinationData.country}
                  className="w-6 rounded-sm"
                />
                <span className="text-sm text-white/60 font-[var(--font-body)] tracking-wide">
                  {destinationData.country}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[var(--font-heading)] font-bold text-white mb-4 leading-[1.1]">
              {destinationName}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {destinationData?.bestFor && (
                <Badge>
                  <Clock className="w-3 h-3 mr-1" />
                  {destinationData.bestFor}
                </Badge>
              )}
              {destinationData?.tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {!weatherLoading && weather && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white/90 text-sm font-medium font-[var(--font-body)]">
                  <WeatherIcon className="w-4 h-4 text-amber-300" />
                  {weather.temp}°C {conditionText}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Itinerary content wrapper */}
      <div className="max-w-4xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        
        {/* Main itinerary column */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-[0.25em] mb-2 font-[var(--font-body)]">
                Day by Day
              </p>
              <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] font-semibold text-white">
                Your Itinerary
              </h2>
            </motion.div>
            
            {streamedText && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </motion.div>
            )}
          </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4 font-[var(--font-body)]">{error}</p>
            <Button onClick={generateItinerary}>
              Try Again
            </Button>
          </div>
        )}

        <ItineraryView streamedText={streamedText} loading={loading} />
        </div>

        {/* Sidebar wrapper */}
        <div className="hidden lg:block space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="glass-card overflow-hidden sticky top-20"
          >
            <div className="p-4 border-b border-white/5 font-semibold text-sm font-[var(--font-heading)]">
              <MapPin className="w-4 h-4 inline-block mr-2 text-[var(--color-accent)]" />
              Destination Map
            </div>
            <iframe
              title="Google Map"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationName)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
            />
          </motion.div>
        </div>
      </div>

      {/* Chat follow-up */}
      {fullText && (
        <ChatFollowUp
          destination={destinationName}
          vibe={vibe || ''}
          itinerary={fullText}
        />
      )}
    </div>
  )
}
