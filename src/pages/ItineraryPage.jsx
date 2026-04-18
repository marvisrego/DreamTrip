// source_handbook: week11-hackathon-preparation
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { useGroq } from '@/hooks/useGroq'
import { useUnsplash } from '@/hooks/useUnsplash'
import { getFallbackImageUrl } from '@/lib/unsplash'
import { getItineraryPrompt } from '@/prompts/itineraryPrompt'
import ItineraryView from '@/components/ItineraryView/ItineraryView'
import ChatFollowUp from '@/components/ChatFollowUp/ChatFollowUp'
import Badge from '@/components/UI/Badge'
import Button from '@/components/UI/Button'
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton'

export default function ItineraryPage() {
  const { destination: destParam } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const destinationData = location.state?.destination
  const vibe = location.state?.vibe
  const destinationName = destinationData?.destination || decodeURIComponent(destParam)

  const { imageUrl, loading: imageLoading } = useUnsplash(destinationName)
  const { streamedText, fullText, loading, error, startStream } = useGroq()
  const [imageLoaded, setImageLoaded] = useState(false)

  // Subtle parallax effect on scroll
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  // Request itinerary on mount
  useEffect(() => {
    if (destinationName && vibe) {
      const systemPrompt = getItineraryPrompt(
        destinationName,
        vibe,
        destinationData?.bestFor || '7 days'
      )
      startStream(systemPrompt, `Create my itinerary for ${destinationName}`)
    }
  }, []) // Only on mount

  if (!destinationName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-text-muted)]">No destination selected.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24">
      {/* Hero section */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
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
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={`
              absolute inset-0 w-full h-[120%] -top-[10%] object-cover
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              transition-opacity duration-500
            `}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-black/40 to-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {destinationData?.countryCode && (
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={`https://flagcdn.com/w40/${destinationData.countryCode.toLowerCase()}.png`}
                  alt={destinationData.country}
                  className="w-6 rounded-sm"
                />
                <span className="text-sm text-white/70">
                  {destinationData.country}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-[var(--font-heading)] font-bold text-white mb-3">
              {destinationName}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {destinationData?.bestFor && (
                <Badge>
                  <Clock className="w-3 h-3 mr-1" />
                  {destinationData.bestFor}
                </Badge>
              )}
              {destinationData?.tags?.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Itinerary content */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-[var(--font-heading)] font-semibold text-white mb-8"
        >
          Your Itinerary
        </motion.h2>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => {
              const systemPrompt = getItineraryPrompt(
                destinationName,
                vibe || '',
                destinationData?.bestFor || '7 days'
              )
              startStream(systemPrompt, `Create my itinerary for ${destinationName}`)
            }}>
              Try Again
            </Button>
          </div>
        )}

        <ItineraryView streamedText={streamedText} loading={loading} />
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
