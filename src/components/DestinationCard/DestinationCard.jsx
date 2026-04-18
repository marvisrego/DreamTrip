// source_handbook: week11-hackathon-preparation
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Clock } from 'lucide-react'
import { useUnsplash } from '@/hooks/useUnsplash'
import { getFallbackImageUrl } from '@/lib/unsplash'
import Badge from '@/components/UI/Badge'
import Button from '@/components/UI/Button'
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton'

export default function DestinationCard({ destination, index = 0, onSelect }) {
  const { imageUrl, credit, loading: imageLoading } = useUnsplash(destination.destination)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => onSelect(destination)}
    >
      {/* Image section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {(imageLoading || !imageLoaded) && <ImageSkeleton className="absolute inset-0" />}

        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${destination.destination}, ${destination.country}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Swap to Pollinations fallback if image fails
              const fallback = getFallbackImageUrl(destination.destination)
              if (e.target.src !== fallback) {
                e.target.src = fallback
              }
            }}
            className={`
              w-full h-full object-cover
              group-hover:scale-105 transition-transform duration-700 ease-out
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}

        {/* Country flag overlay */}
        {destination.countryCode && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
            <img
              src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`}
              alt={destination.country}
              className="w-5 h-auto rounded-sm"
            />
            <span className="text-xs text-white/90 font-medium">
              {destination.country}
            </span>
          </div>
        )}

        {/* Photo credit */}
        {credit && imageLoaded && (
          <div className="absolute bottom-3 right-3 text-[10px] text-white/40">
            {credit}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold font-[var(--font-heading)] text-white">
            {destination.destination}
          </h3>
          {destination.bestFor && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] shrink-0 mt-1">
              <Clock className="w-3 h-3" />
              {destination.bestFor}
            </span>
          )}
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.3 }}
          className="flex flex-wrap gap-1.5"
        >
          {destination.tags?.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </motion.div>

        {/* Reason */}
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          {destination.reason}
        </p>

        {/* CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(destination)
          }}
        >
          Plan This Trip
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
