// source_handbook: week11-hackathon-preparation
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Thermometer, Globe, Leaf } from 'lucide-react'
import { useUnsplash } from '@/hooks/useUnsplash'
import { getFallbackImageUrl } from '@/lib/unsplash'
import Badge from '@/components/UI/Badge'
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton'

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
}

// Colour tint per climate
const climateColour = {
  Tropical:      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Mediterranean: 'text-sky-400    bg-sky-400/10    border-sky-400/20',
  Alpine:        'text-blue-300   bg-blue-300/10   border-blue-300/20',
  Desert:        'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Temperate:     'text-teal-400   bg-teal-400/10   border-teal-400/20',
  Arctic:        'text-cyan-300   bg-cyan-300/10   border-cyan-300/20',
}

function MatchScorePill({ score }) {
  const colour =
    score >= 90 ? 'text-[var(--color-accent)] border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10' :
    score >= 80 ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                  'text-[var(--color-text-muted)] border-white/10 bg-white/5'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-widest ${colour}`}>
      {score}% match
    </span>
  )
}

// ─── FEATURED CARD (index 0) ───────────────────────────────────────────────
function FeaturedCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative glass-card card-shine overflow-hidden cursor-pointer group h-full min-h-[420px]"
      onClick={() => onSelect(destination)}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {(!imageLoaded) && <ImageSkeleton className="absolute inset-0 w-full h-full" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${destination.destination}, ${destination.country}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const fallback = getFallbackImageUrl(destination.destination)
              if (e.target.src !== fallback) e.target.src = fallback
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* TOP badge row */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-[10px] font-bold tracking-widest uppercase">
          ✦ Top Pick
        </span>
        {destination.matchScore && <MatchScorePill score={destination.matchScore} />}
      </div>

      {/* Flag */}
      {destination.countryCode && (
        <div className="absolute top-14 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
          <img
            src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`}
            alt={destination.country}
            className="w-5 h-auto rounded-sm"
          />
          <span className="text-xs text-white/90 font-medium">{destination.country}</span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold text-white mb-1 leading-tight">
          {destination.destination}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {destination.climate && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${climateColour[destination.climate] || climateColour.Temperate}`}>
              <Thermometer className="w-3 h-3" />{destination.climate}
            </span>
          )}
          {destination.continent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[10px] font-medium">
              <Globe className="w-3 h-3" />{destination.continent}
            </span>
          )}
          {destination.bestFor && (
            <span className="inline-flex items-center gap-1 text-white/50 text-[10px]">
              <Clock className="w-3 h-3" />{destination.bestFor}
            </span>
          )}
          {destination.sustainabilityScore && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 text-[10px] font-medium">
              <Leaf className="w-3 h-3" />Eco Rating: {destination.sustainabilityScore}/10
            </span>
          )}
        </div>

        {destination.priceRange && (
          <div className="mb-2 text-xl font-[var(--font-heading)] font-semibold text-[var(--color-accent)]">
            {destination.priceRange} <span className="text-[10px] text-white/40 font-light uppercase tracking-widest ml-1">starting</span>
          </div>
        )}

        <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-lg">
          {destination.reason}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {destination.tags?.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-sm font-bold tracking-wide transition-colors hover:bg-[var(--color-accent-hover)] cursor-pointer"
        >
          Plan This Trip <ArrowRight className="w-4 h-4" />
        </motion.button>

        {credit && imageLoaded && (
          <p className="absolute bottom-3 right-4 text-[10px] text-white/30">{credit}</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── BANNER CARD (last card, full width) ──────────────────────────────────
function BannerCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative glass-card card-shine overflow-hidden cursor-pointer group flex min-h-[220px]"
      onClick={() => onSelect(destination)}
    >
      {/* Image — left 40% */}
      <div className="relative w-2/5 flex-shrink-0 overflow-hidden">
        {!imageLoaded && <ImageSkeleton className="absolute inset-0 w-full h-full" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${destination.destination}, ${destination.country}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const fallback = getFallbackImageUrl(destination.destination)
              if (e.target.src !== fallback) e.target.src = fallback
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-glass)]" />
      </div>

      {/* Content — right 60% */}
      <div className="flex flex-col justify-center px-6 py-5 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold tracking-widest uppercase">
            Hidden Gem
          </span>
          {destination.matchScore && <MatchScorePill score={destination.matchScore} />}
        </div>

        <div className="flex items-center gap-3 mb-1">
          {destination.countryCode && (
            <img
              src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`}
              alt={destination.country}
              className="w-5 h-auto rounded-sm"
            />
          )}
          <h3 className="text-2xl font-[var(--font-heading)] font-bold text-white">
            {destination.destination}
            <span className="text-[var(--color-text-muted)] text-lg font-normal ml-2">{destination.country}</span>
          </h3>
        </div>

        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-3 max-w-xl">
          {destination.reason}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {destination.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          {destination.climate && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${climateColour[destination.climate] || climateColour.Temperate}`}>
              <Thermometer className="w-3 h-3" />{destination.climate}
            </span>
          )}
          {destination.priceRange && (
            <span className="text-white font-semibold text-sm">
              {destination.priceRange}
            </span>
          )}
          {destination.sustainabilityScore && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px]">
              <Leaf className="w-2.5 h-2.5" /> Eco {destination.sustainabilityScore}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
          className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border-hover)] text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
        >
          Explore <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── REGULAR CARD ──────────────────────────────────────────────────────────
function RegularCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212,168,75,0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="glass-card card-shine overflow-hidden cursor-pointer group flex flex-col"
      onClick={() => onSelect(destination)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {!imageLoaded && <ImageSkeleton className="absolute inset-0" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${destination.destination}, ${destination.country}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const fallback = getFallbackImageUrl(destination.destination)
              if (e.target.src !== fallback) e.target.src = fallback
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Overlaid destination name */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white/80 text-xs font-medium truncate">{destination.destination}, {destination.country}</p>
        </div>

        {/* Flag */}
        {destination.countryCode && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            <img
              src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`}
              alt={destination.country}
              className="w-4 h-auto rounded-sm"
            />
            <span className="text-[10px] text-white/90 font-medium">{destination.country}</span>
          </div>
        )}

        {/* Match score */}
        {destination.matchScore && (
          <div className="absolute top-3 right-3">
            <MatchScorePill score={destination.matchScore} />
          </div>
        )}

        {credit && imageLoaded && (
          <div className="absolute bottom-2 right-2 text-[9px] text-white/30">{credit}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold font-[var(--font-heading)] text-white leading-tight">
            {destination.destination}
          </h3>
          {destination.bestFor && (
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] shrink-0 mt-0.5">
              <Clock className="w-3 h-3" />{destination.bestFor}
            </span>
          )}
        </div>

        {/* Climate + continent */}
        <div className="flex flex-wrap gap-1.5">
          {destination.climate && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${climateColour[destination.climate] || climateColour.Temperate}`}>
              <Thermometer className="w-2.5 h-2.5" />{destination.climate}
            </span>
          )}
          {destination.tags?.map((tag) => (
            <Badge key={tag} className="text-[10px] px-2 py-0.5">{tag}</Badge>
          ))}
          {destination.priceRange && (
            <span className="text-white/90 text-[10px] font-bold">
              {destination.priceRange}
            </span>
          )}
          {destination.sustainabilityScore && (
            <span className="flex items-center gap-1 text-emerald-400/80 text-[10px] font-medium">
              <Leaf className="w-2.5 h-2.5" /> {destination.sustainabilityScore}
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">
          {destination.reason}
        </p>

        <motion.button
          whileHover={{ x: 3 }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
          className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-white/5 text-white text-xs font-medium transition-all cursor-pointer"
        >
          Plan This Trip <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────
export default function DestinationCard({ destination, index = 0, variant = 'regular', onSelect }) {
  const { imageUrl, credit, loading: imageLoading } = useUnsplash(destination.destination)
  const [imageLoaded, setImageLoaded] = useState(false)

  const props = { destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }

  if (variant === 'featured') return <FeaturedCard {...props} />
  if (variant === 'banner')   return <BannerCard   {...props} />
  return <RegularCard {...props} />
}
