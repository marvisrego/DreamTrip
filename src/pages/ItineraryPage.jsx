// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Plane, Calendar, Copy, Check } from 'lucide-react'
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
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'

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
        <p className="text-[var(--color-text-muted)] font-[var(--font-body)]">No destination selected.</p>
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
    <div className="min-h-screen bg-[var(--color-bg-primary)] pb-32">
      {/* ── Sticky top navigation ── */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 nav-blur"
      >
        <div className="max-w-[var(--content-max)] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] rounded-full hover:bg-white/5 px-3 -ml-3"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium font-[var(--font-body)] tracking-wide">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span className="text-sm font-[var(--font-heading)] font-semibold text-white/80 truncate max-w-[240px]">
              {destinationName}
            </span>
          </div>
          <div className="w-[76px]" /> {/* Spacer for centering */}
        </div>
      </motion.nav>

      {/* ── Hero section ── */}
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
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
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src={`https://flagcdn.com/w40/${destinationData.countryCode.toLowerCase()}.png`}
                  alt={destinationData.country}
                  className="w-7 rounded-sm shadow-lg"
                />
                <span className="text-sm text-white/60 font-[var(--font-body)] tracking-wide uppercase">
                  {destinationData.country}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[var(--font-heading)] font-bold text-white mb-5 leading-[1.05] tracking-tight">
              {destinationName}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {destinationData?.bestFor && (
                <Badge>
                  <Clock className="w-3 h-3 mr-1.5" />
                  {destinationData.bestFor}
                </Badge>
              )}
              {destinationData?.tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {!weatherLoading && weather && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/12 bg-black/40 backdrop-blur-md text-white/90 text-sm font-medium font-[var(--font-body)]">
                  <WeatherIcon className="w-4 h-4 text-amber-300" />
                  {weather.temp}°C · {conditionText}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Full-width itinerary content ── */}
      <div className="max-w-[var(--content-max)] mx-auto px-6 pt-12">

        {/* Section header */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <p className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-[0.3em] font-[var(--font-body)]">
                Day by Day
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold text-white tracking-tight">
              Your Itinerary
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            {streamedText && (
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2 rounded-full">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy itinerary'}</span>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Two-column layout: itinerary + map side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
          {/* Main itinerary — fills available width */}
          <div>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 glass-card mb-8"
              >
                <p className="text-red-400 mb-4 font-[var(--font-body)] text-sm">{error}</p>
                <Button onClick={generateItinerary}>
                  Try Again
                </Button>
              </motion.div>
            )}

            <ItineraryView streamedText={streamedText} loading={loading} />
          </div>

          {/* Sidebar — map + quick info */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Map card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="glass-card overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-[var(--font-heading)] font-semibold text-sm text-white">Destination Map</span>
                </div>
                <iframe
                  title="Google Map"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationName)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                />
              </motion.div>

              {/* Quick info card */}
              {destinationData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  className="glass-card p-5"
                >
                  <h3 className="font-[var(--font-heading)] font-semibold text-sm text-white mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    {destinationData.reason && (
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-[var(--font-body)]">
                        {destinationData.reason}
                      </p>
                    )}
                    {destinationData.priceRange && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)] font-[var(--font-body)]">Starting from</span>
                        <span className="font-[var(--font-heading)] font-bold text-[var(--color-accent)]">{destinationData.priceRange}</span>
                      </div>
                    )}
                    {destinationData.sustainabilityScore && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)] font-[var(--font-body)]">Eco Rating</span>
                        <span className="font-[var(--font-body)] font-semibold text-emerald-400">{destinationData.sustainabilityScore}/10</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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
