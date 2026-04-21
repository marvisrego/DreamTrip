import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Thermometer } from 'lucide-react'
import { useUnsplash } from '../../hooks/useUnsplash'
import { getFallbackImageUrl } from '../../lib/unsplash.js'

const itemVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

function MatchBadge({ score }) {
  const color = score >= 90 ? 'var(--color-accent)' : score >= 80 ? '#34d399' : 'rgba(255,255,255,0.5)'
  const bg    = score >= 90 ? 'rgba(212,168,75,0.15)' : score >= 80 ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.06)'
  const border= score >= 90 ? 'rgba(212,168,75,0.45)' : score >= 80 ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.15)'
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: '44px', height: '44px', borderRadius: '50%',
      background: bg, border: `1.5px solid ${border}`,
      backdropFilter: 'blur(8px)',
      boxShadow: score >= 90 ? '0 0 14px rgba(212,168,75,0.25)' : 'none',
      flexShrink: 0,
    }}>
      <span style={{ color, fontSize: '14px', fontWeight: 800, lineHeight: 1, fontFamily: 'var(--font-body)' }}>{score}</span>
      <span style={{ color, fontSize: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>match</span>
    </div>
  )
}

// ─── POSTCARD CARD ───────────────────────────────────────────────────────────
function PostcardCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, handleImageError, credit }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        borderRadius: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
        aspectRatio: '3 / 4',
        minHeight: '320px',
      }}
      onClick={() => onSelect(destination)}
    >
      {/* Full-bleed photo */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${destination.destination}, ${destination.country}`}
          onLoad={setImageLoaded}
          onError={(e) => handleImageError(e, getFallbackImageUrl(destination.destination))}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.07] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Layered gradient — strong at bottom for legibility */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 65%, transparent 100%)',
      }} />
      {/* Subtle top vignette */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 35%)',
      }} />

      {/* ── TOP ROW: flag + match score ── */}
      <div className="absolute top-4 inset-x-4 flex items-start justify-between gap-2">
        {destination.countryCode ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '999px',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <img
              src={`https://flagcdn.com/w40/${destination.countryCode.toLowerCase()}.png`}
              alt={destination.country}
              style={{ width: '16px', height: 'auto', borderRadius: '2px' }}
            />
            <span style={{ color: '#fff', fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>
              {destination.country}
            </span>
          </div>
        ) : <div />}
        {destination.matchScore && <MatchBadge score={destination.matchScore} />}
      </div>

      {/* ── BOTTOM CONTENT ── */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        {/* Destination name */}
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff',
          fontSize: 'clamp(1.3rem, 2.2vw, 1.65rem)', lineHeight: 1.05,
          letterSpacing: '-0.3px', marginBottom: '8px',
        }}>
          {destination.destination}
        </h3>

        {/* Pills row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {destination.climate && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)',
              fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)',
            }}>
              <Thermometer className="w-2.5 h-2.5" />{destination.climate}
            </span>
          )}
          {destination.priceRange && (
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '4px 10px', borderRadius: '999px',
              border: '1px solid rgba(212,168,75,0.3)',
              background: 'rgba(212,168,75,0.08)', backdropFilter: 'blur(6px)',
              fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)',
              fontFamily: 'var(--font-heading)',
            }}>
              {destination.priceRange}
            </span>
          )}
          {destination.sustainabilityScore >= 8 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '999px',
              border: '1px solid rgba(52,211,153,0.25)',
              background: 'rgba(52,211,153,0.07)',
              fontSize: '10px', color: '#34d399', fontFamily: 'var(--font-body)',
            }}>
              <Leaf className="w-2.5 h-2.5" />{destination.sustainabilityScore}/10
            </span>
          )}
        </div>

        {/* Short reason — clipped to 2 lines */}
        <p style={{
          fontSize: '11.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55,
          fontFamily: 'var(--font-body)', marginBottom: '14px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {destination.reason}
        </p>

        {/* CTA */}
        <button
          className="lux-btn w-full"
          style={{ fontSize: '12px', padding: '9px 16px' }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
        >
          Plan This Trip <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {credit && imageLoaded && (
        <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '8px', color: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }}>
          {credit}
        </div>
      )}
    </motion.div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function DestinationCard({ destination, index = 0, onSelect, onImageReady }) {
  const { imageUrl, credit } = useUnsplash(destination.destination)
  const [imageLoaded, setImageLoaded] = useState(false)
  const readyFired = useRef(false)

  const handleImageLoaded = () => {
    setImageLoaded(true)
    if (!readyFired.current) { readyFired.current = true; onImageReady?.() }
  }
  const handleImageError = (e, fallback) => {
    if (e.target.src !== fallback) e.target.src = fallback
    if (!readyFired.current) { readyFired.current = true; onImageReady?.() }
  }

  return (
    <PostcardCard
      destination={destination}
      onSelect={onSelect}
      imageUrl={imageUrl}
      imageLoaded={imageLoaded}
      setImageLoaded={handleImageLoaded}
      handleImageError={handleImageError}
      credit={credit}
    />
  )
}
