import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Thermometer } from 'lucide-react'
import { useUnsplash } from '../../hooks/useUnsplash'
import { getFallbackImageUrl } from '../../lib/unsplash.js'

function MatchBadge({ score }) {
  const color  = score >= 90 ? 'var(--color-accent)' : score >= 80 ? '#34d399' : 'rgba(255,255,255,0.5)'
  const bg     = score >= 90 ? 'rgba(212,168,75,0.15)' : score >= 80 ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.06)'
  const border = score >= 90 ? 'rgba(212,168,75,0.45)' : score >= 80 ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.15)'
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

const goldBtn = {
  width: '100%',
  background: 'linear-gradient(135deg, #d4a84b 0%, #b8922f 100%)',
  color: '#0a0f1e',
  fontFamily: 'var(--font-body)',
  fontWeight: 700,
  letterSpacing: '0.04em',
  borderRadius: '0.75rem',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  cursor: 'pointer',
  boxShadow: '0 4px 18px rgba(212,168,75,0.3)',
}

// ─── HERO CARD (featured / top match) ────────────────────────────────────────
function HeroCard({ destination, onSelect, imageUrl, imageLoaded, setImageLoaded, handleImageError, credit }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 230, damping: 22, delay: 0.05 }}
      whileHover={{ scale: 1.005 }}
      className="relative overflow-hidden cursor-pointer group w-full aspect-video md:aspect-[3/1]"
      style={{
        borderRadius: '1.5rem',
        border: '1.5px solid rgba(212,168,75,0.5)',
        boxShadow: '0 0 80px rgba(212,168,75,0.2), 0 0 30px rgba(212,168,75,0.08), 0 28px 72px rgba(0,0,0,0.7)',
        minHeight: '220px',
      }}
      onClick={() => onSelect(destination)}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${destination.destination}, ${destination.country}`}
          onLoad={setImageLoaded}
          onError={(e) => handleImageError(e, getFallbackImageUrl(destination.destination))}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.05) 68%, transparent 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 55%)',
      }} />

      {/* Top row */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '7px 16px', borderRadius: '999px',
          background: 'rgba(212,168,75,0.12)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(212,168,75,0.5)',
          boxShadow: '0 0 22px rgba(212,168,75,0.18)',
        }}>
          <span style={{ color: '#d4a84b', fontSize: '11px', lineHeight: 1 }}>✦</span>
          <span style={{
            fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.2em', color: '#d4a84b', fontFamily: 'var(--font-body)',
          }}>
            Top Pick for You
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {destination.countryCode && (
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
          )}
          {destination.matchScore && <MatchBadge score={destination.matchScore} />}
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="flex-1 min-w-0">
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff',
            fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)', lineHeight: 1.05,
            letterSpacing: '-0.5px', marginBottom: '10px',
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
          }}>
            {destination.destination}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {destination.climate && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '5px 12px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)',
                fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)',
              }}>
                <Thermometer className="w-3 h-3" />{destination.climate}
              </span>
            )}
            {destination.priceRange && (
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '5px 12px', borderRadius: '999px',
                border: '1px solid rgba(212,168,75,0.35)',
                background: 'rgba(212,168,75,0.08)', backdropFilter: 'blur(6px)',
                fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)',
                fontFamily: 'var(--font-heading)',
              }}>
                {destination.priceRange}
              </span>
            )}
            {destination.sustainabilityScore >= 8 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '5px 12px', borderRadius: '999px',
                border: '1px solid rgba(52,211,153,0.25)',
                background: 'rgba(52,211,153,0.07)',
                fontSize: '11px', color: '#34d399', fontFamily: 'var(--font-body)',
              }}>
                <Leaf className="w-3 h-3" />{destination.sustainabilityScore}/10
              </span>
            )}
          </div>

          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65,
            fontFamily: 'var(--font-body)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            maxWidth: '540px',
          }}>
            {destination.reason}
          </p>
        </div>

        <div className="flex-shrink-0 w-full md:w-52">
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{ ...goldBtn, fontSize: '13px', padding: '13px 20px', boxShadow: '0 6px 28px rgba(212,168,75,0.4)' }}
            onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
          >
            Plan This Trip <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {credit && imageLoaded && (
        <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '8px', color: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }}>
          {credit}
        </div>
      )}
    </motion.div>
  )
}

// ─── POSTCARD CARD (remaining destinations, scroll-revealed) ─────────────────
function PostcardCard({ destination, delay, onSelect, imageUrl, imageLoaded, setImageLoaded, handleImageError, credit }) {
  // Delay lives inside the variant so it doesn't bleed into hover animations
  const revealVariants = {
    hidden:   { opacity: 0, y: 60 },
    visible:  { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22, delay } },
  }

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6, scale: 1.02 }}
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
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${destination.destination}, ${destination.country}`}
          onLoad={setImageLoaded}
          onError={(e) => handleImageError(e, getFallbackImageUrl(destination.destination))}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.07] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.08) 65%, transparent 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 35%)',
      }} />

      {/* Top row */}
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

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff',
          fontSize: 'clamp(1.3rem, 2.2vw, 1.65rem)', lineHeight: 1.05,
          letterSpacing: '-0.3px', marginBottom: '8px',
        }}>
          {destination.destination}
        </h3>

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

        <p style={{
          fontSize: '11.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55,
          fontFamily: 'var(--font-body)', marginBottom: '14px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {destination.reason}
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{ ...goldBtn, fontSize: '12px', padding: '10px 16px' }}
          onClick={(e) => { e.stopPropagation(); onSelect(destination) }}
        >
          Plan This Trip <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
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
export default function DestinationCard({ destination, index = 0, isFeatured = false, onSelect, onImageReady }) {
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

  const sharedProps = {
    destination, onSelect, imageUrl, imageLoaded,
    setImageLoaded: handleImageLoaded,
    handleImageError, credit,
  }

  if (isFeatured) return <HeroCard {...sharedProps} />

  // index=1 → delay 0, index=2 → 0.15, index=3 → 0.30 …
  const delay = Math.max(0, (index - 1) * 0.15)
  return <PostcardCard {...sharedProps} delay={delay} />
}
