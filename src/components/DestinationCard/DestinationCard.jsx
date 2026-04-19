// source_handbook: week11-hackathon-preparation
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Thermometer, Globe, Leaf } from 'lucide-react'
import { useUnsplash } from '@/hooks/useUnsplash'
import { getFallbackImageUrl } from '@/lib/unsplash'
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton'

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
}

// ── Match Ring (Glowing glass circle) ──
function MatchRing({ score }) {
  const tier =
    score >= 90 ? 'gold' :
    score >= 80 ? 'green' : 'dim'
  const textColor =
    tier === 'gold' ? 'var(--color-accent)' :
    tier === 'green' ? '#34d399' : 'rgba(255,255,255,0.5)'
  return (
    <div className={`match-ring match-ring--${tier}`}>
      <span style={{ color: textColor, fontSize: '15px', fontWeight: 800, lineHeight: 1, fontFamily: 'var(--font-body)' }}>
        {score}
      </span>
      <span style={{ color: textColor, fontSize: '7px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.75 }}>
        match
      </span>
    </div>
  )
}

// ── Eco Rating (Color-coded leaf icon) ──
function EcoRating({ score }) {
  const color = score >= 8 ? '#34d399' : score >= 5 ? '#fbbf24' : '#fb923c'
  return (
    <span className="tag-pill" style={{ borderColor: `${color}33`, color, background: `${color}0d` }}>
      <Leaf className="w-3 h-3" />{score}/10
    </span>
  )
}

// ── Country Pill ──
function CountryPill({ code, name }) {
  if (!code) return null
  return (
    <span className="tag-pill" style={{ background: '#0a0f1e', borderColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      <img src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} alt={name} className="w-[18px] h-auto rounded-sm" style={{ flexShrink: 0 }} />
      <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>{name}</span>
    </span>
  )
}

// ── Climate Pill ──
function ClimatePill({ climate }) {
  if (!climate) return null
  return (
    <span className="tag-pill" style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)' }}>
      <Thermometer className="w-3 h-3" />{climate}
    </span>
  )
}

// ── Ghost Tag (subtle 1px border, no fill) ──
function GhostTag({ children }) {
  return (
    <span className="tag-pill" style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}>
      {children}
    </span>
  )
}

// ─── FEATURED CARD (Hero — 2 columns) ────────────────────────────────────
function FeaturedCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.006 }}
      whileTap={{ scale: 0.997 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden cursor-pointer group h-full"
      style={{
        borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        minHeight: '520px',
      }}
      onClick={() => onSelect(destination)}
    >
      {/* Full-bleed background image with zoom on hover */}
      <div className="absolute inset-0 overflow-hidden">
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
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'scale(1)' }}
            onMouseOver={() => {}}
          />
        )}
        {/* Cinematic overlay — legible text guaranteed */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0) 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
      </div>

      {/* Image zoom on group hover */}
      <style>{`
        .group:hover img { transform: scale(1.06) !important; }
      `}</style>

      {/* TOP: "Top Pick" badge overlapping card edge */}
      <div className="absolute top-0 left-6 z-20" style={{ transform: 'translateY(-1px)' }}>
        <span
          className="tag-pill tag-pill--gold"
          style={{
            padding: '6px 16px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFD700, #D4A84B, #B8860B)',
            color: '#0a0f1e',
            borderColor: 'transparent',
            boxShadow: '0 4px 14px rgba(212,168,75,0.35)',
            borderRadius: '0 0 12px 12px',
          }}
        >
          ✦ Top Pick
        </span>
      </div>

      {/* TOP-RIGHT: Match ring */}
      {destination.matchScore && (
        <div className="absolute top-5 right-5 z-20">
          <MatchRing score={destination.matchScore} />
        </div>
      )}

      {/* Country pill */}
      <div className="absolute top-16 left-5 z-10">
        <CountryPill code={destination.countryCode} name={destination.country} />
      </div>

      {/* Left Sleek Side-Panel */}
      <div className="absolute top-0 bottom-0 left-0 z-10 w-[85%] md:w-[45%] lg:w-[35%]">
        <div
          className="w-full h-full flex flex-col justify-end"
          style={{
            padding: '40px 32px',
            background: 'rgba(20, 20, 20, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Destination name — massive serif */}
          <h3
            className="font-[var(--font-heading)] font-black text-white leading-[1.05]"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', letterSpacing: '-1px', marginBottom: '8px' }}
          >
            {destination.destination}
          </h3>

          {/* Meta pills row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ClimatePill climate={destination.climate} />
            {destination.continent && (
              <span className="tag-pill">
                <Globe className="w-3 h-3" />{destination.continent}
              </span>
            )}
            {destination.bestFor && (
              <span className="tag-pill" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Clock className="w-3 h-3" />{destination.bestFor}
              </span>
            )}
            {destination.sustainabilityScore && <EcoRating score={destination.sustainabilityScore} />}
          </div>

          {/* Price — editorial style */}
          {destination.priceRange && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>Starting from</span>
              <br />
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>{destination.priceRange}</span>
            </div>
          )}

          {/* Reason */}
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.5, fontFamily: 'var(--font-body)', marginBottom: '16px', maxWidth: '100%' }}>
            {destination.reason}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            {destination.tags?.map((tag) => (
              <GhostTag key={tag}>{tag}</GhostTag>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="lux-btn"
            onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
          >
            Plan This Trip <ArrowRight className="w-4 h-4" />
          </button>

          {credit && imageLoaded && (
            <p style={{ position: 'absolute', bottom: '10px', right: '20px', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{credit}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── BANNER CARD (last card, full width) ──────────────────────────────────
function BannerCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.004 }}
      whileTap={{ scale: 0.997 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden cursor-pointer group flex"
      style={{
        borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10, 15, 30, 0.72)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        minHeight: '260px',
      }}
      onClick={() => onSelect(destination)}
    >
      {/* Image — left 40% */}
      <div className="relative w-2/5 flex-shrink-0 overflow-hidden" style={{ borderRadius: '1.5rem 0 0 1.5rem' }}>
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(10,15,30,0.72))' }} />
      </div>

      {/* Content — right 60% */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px', flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="tag-pill" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            Hidden Gem
          </span>
          {destination.matchScore && <MatchRing score={destination.matchScore} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          {destination.countryCode && (
            <img src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`} alt={destination.country} className="w-5 h-auto rounded-sm" />
          )}
          <h3 className="font-[var(--font-heading)] font-black text-white" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
            {destination.destination}
            <span style={{ color: 'var(--color-text-muted)', fontSize: '16px', fontWeight: 400, marginLeft: '8px' }}>{destination.country}</span>
          </h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.6, fontFamily: 'var(--font-body)', marginBottom: '12px', maxWidth: '560px' }}>
          {destination.reason}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          {destination.tags?.map((tag) => <GhostTag key={tag}>{tag}</GhostTag>)}
          <ClimatePill climate={destination.climate} />
          {destination.priceRange && (
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '8px' }}>
              <span style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1, marginBottom: '2px' }}>Starting from</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {destination.priceRange}
              </span>
            </div>
          )}
          {destination.sustainabilityScore && <EcoRating score={destination.sustainabilityScore} />}
        </div>

        <button
          className="lux-btn lux-btn--outline"
          style={{ alignSelf: 'flex-start' }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
        >
          Explore <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── REGULAR CARD ──────────────────────────────────────────────────────────
function RegularCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="overflow-hidden cursor-pointer group flex flex-col"
      style={{
        borderRadius: '1.25rem',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10, 15, 30, 0.72)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onClick={() => onSelect(destination)}
    >
      {/* Image with zoom */}
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
            className={`w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

        {/* Country pill */}
        <div className="absolute top-3 left-3">
          <CountryPill code={destination.countryCode} name={destination.country} />
        </div>

        {/* Glowing match ring */}
        {destination.matchScore && (
          <div className="absolute top-3 right-3">
            <MatchRing score={destination.matchScore} />
          </div>
        )}

        {credit && imageLoaded && (
          <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>{credit}</div>
        )}
      </div>

      {/* Content — glassmorphism */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '8px',
          background: 'rgba(10, 15, 30, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', overflow: 'hidden' }}>
          <h3
            className="font-[var(--font-heading)] font-black text-white"
            style={{ fontSize: '18px', lineHeight: 1.2, letterSpacing: '-0.3px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {destination.destination}
          </h3>
          {destination.bestFor && (
            <span className="tag-pill" style={{ fontSize: '10px', padding: '3px 10px', flexShrink: 0, maxWidth: '48%', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,0.4)' }}>
              <Clock className="w-3 h-3" style={{ flexShrink: 0 }} />{destination.bestFor}
            </span>
          )}
        </div>

        {/* Tags + climate */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <ClimatePill climate={destination.climate} />
          {destination.tags?.map((tag) => (
            <GhostTag key={tag}>{tag}</GhostTag>
          ))}
        </div>

        {/* Price + eco */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {destination.priceRange && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1, marginBottom: '2px' }}>Starting from</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px', lineHeight: 1 }}>
                {destination.priceRange}
              </span>
            </div>
          )}
          {destination.sustainabilityScore && <EcoRating score={destination.sustainabilityScore} />}
        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.6, fontFamily: 'var(--font-body)', flex: 1 }}>
          {destination.reason}
        </p>

        <button
          className="lux-btn lux-btn--outline"
          style={{ width: '100%', marginTop: 'auto', fontSize: '13px', padding: '9px 20px' }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
        >
          Plan This Trip <ArrowRight className="w-3.5 h-3.5" />
        </button>
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
