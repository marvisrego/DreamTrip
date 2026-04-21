// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Plane, Calendar, Copy, Check, Sparkles, ArrowUpRight } from 'lucide-react'
import { streamItinerary } from '../lib/api.js'
import { useUnsplash } from '../hooks/useUnsplash'
import { useWeather } from '../hooks/useWeather'
import { getFallbackImageUrl } from '../lib/unsplash.js'
import { getItineraryPrompt } from '../prompts/itineraryPrompt'
import ItineraryView from '../components/ItineraryView/ItineraryView.jsx'
import ChatFollowUp from '../components/ChatFollowUp/ChatFollowUp.jsx'
import Badge from '../components/UI/Badge.jsx'
import Button from '../components/UI/Button.jsx'
import ImageSkeleton from '../components/Skeleton/ImageSkeleton.jsx'
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

  // Safety net: never let the hero image block the overlay for more than 6 s
  useEffect(() => {
    if (imageLoaded) return
    const id = setTimeout(() => setImageLoaded(true), 6000)
    return () => clearTimeout(id)
  }, [imageLoaded])

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

      {/* ── Full-screen loading overlay (holds until text AND hero image are ready) ── */}
      <AnimatePresence>
        {(loading || !imageLoaded) && (
          <motion.div
            key="itinerary-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeInOut' } }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#09090f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px' }}
          >
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.22, 1], opacity: [0.2, 0.38, 0.2] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,75,0.38) 0%, transparent 70%)', filter: 'blur(18px)' }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: '144px', height: '144px', borderRadius: '50%', border: '1px dashed rgba(212,168,75,0.22)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: '112px', height: '112px', borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: 'rgba(212,168,75,0.55)', borderRightColor: 'rgba(212,168,75,0.18)' }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: '88px', height: '88px', borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: 'rgba(212,168,75,0.7)', borderLeftColor: 'rgba(212,168,75,0.25)' }}
              />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '88px', height: '88px' }}>
                <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '7px', height: '7px', borderRadius: '50%', background: '#d4a84b', boxShadow: '0 0 8px rgba(212,168,75,0.9), 0 0 16px rgba(212,168,75,0.5)' }} />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '112px', height: '112px' }}>
                <div style={{ position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(212,168,75,0.7)', boxShadow: '0 0 6px rgba(212,168,75,0.7)' }} />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', width: '68px', height: '68px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(212,168,75,0.18), rgba(212,168,75,0.06))', border: '1px solid rgba(212,168,75,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(212,168,75,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
              >
                <motion.div animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Sparkles style={{ width: '28px', height: '28px', color: '#d4a84b', filter: 'drop-shadow(0 0 6px rgba(212,168,75,0.8))' }} />
                </motion.div>
              </motion.div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}
              >
                Crafting your bespoke itinerary…
              </motion.p>
              {destinationName && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(212,168,75,0.65)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  {destinationName}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex items-end justify-center px-6 md:px-10 pb-10 md:pb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center justify-center text-center w-full max-w-[900px] mx-auto"
          >
            {destinationData?.countryCode && (
              <div className="flex items-center justify-center gap-2.5 mb-4">
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

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-[var(--font-heading)] font-bold text-white mb-5 leading-[1.05] tracking-tight text-center"
              style={{ textShadow: '0 10px 30px rgba(0,0,0,0.42)' }}
            >
              {destinationName}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3">
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

      {/* ── Destination map — full-width gold-bordered card ── */}
      <div className="w-[90%] max-w-[1200px] mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(212, 168, 75, 0.5)',
              background: 'rgba(10, 15, 30, 0.72)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 50px rgba(212, 168, 75, 0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div
              className="flex items-center justify-center px-6 py-4 text-center"
              style={{
                borderBottom: '1px solid rgba(212,168,75,0.22)',
                background: 'linear-gradient(180deg, rgba(10,15,30,0.8) 0%, rgba(10,15,30,0.55) 100%)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }}
            >
              <div className="flex items-center justify-center gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="font-[var(--font-heading)] font-semibold text-[11px] text-white uppercase tracking-[0.28em]">
                  Explore The {destinationName}
                </span>
              </div>
            </div>
            <iframe
              title={`Map of ${destinationName}`}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationName)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
            />
          </div>

          {/* View Full Map — fallback button */}
          <div className="mt-4 flex justify-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-[var(--font-body)] text-sm font-medium text-white/70 hover:text-white transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,168,75,0.45)'
                e.currentTarget.style.background = 'rgba(212,168,75,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              }}
            >
              View Full Map
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Full-width itinerary content — fades in once overlay lifts ── */}
      <motion.div
        animate={{ opacity: (loading || !imageLoaded) ? 0 : 1 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        className="max-w-[var(--content-max)] mx-auto px-6 pt-12"
      >

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
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
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
          </div>

          {/* Sidebar — quick info */}
          <div className="hidden lg:block min-w-0">
            <div className="sticky top-20 space-y-6">
              {/* Quick info card */}
              {destinationData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  className="glass-card min-w-0"
                  style={{ padding: '20px 24px' }}
                >
                  <h3 className="font-[var(--font-heading)] font-semibold text-sm text-white mb-4">Quick Info</h3>
                  <div className="space-y-3 min-w-0">
                    {destinationData.reason && (
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-[var(--font-body)] break-words">
                        {destinationData.reason}
                      </p>
                    )}
                    {destinationData.priceRange && (
                      <div className="flex items-center justify-between gap-3 text-sm min-w-0">
                        <span className="text-[var(--color-text-muted)] font-[var(--font-body)] shrink-0">Starting from</span>
                        <span className="font-[var(--font-heading)] font-bold text-[var(--color-accent)]">{destinationData.priceRange}</span>
                      </div>
                    )}
                    {destinationData.sustainabilityScore && (
                      <div className="flex items-center justify-between gap-3 text-sm min-w-0">
                        <span className="text-[var(--color-text-muted)] font-[var(--font-body)] shrink-0">Eco Rating</span>
                        <span className="font-[var(--font-body)] font-semibold text-emerald-400">{destinationData.sustainabilityScore}/10</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

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
