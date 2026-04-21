import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Plane, ChevronDown, ArrowUp, ChevronRight, Sparkles } from 'lucide-react'
import { fetchDestinations } from '../lib/api.js'
import { fetchDestinationImage } from '../lib/unsplash.js'

/* ── Stagger variants ───────────────────────────────────────── */
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,  transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

/* ── Mode options for the switcher ── */
const MODES = [
  { id: 'plan',    label: 'Plan Trip',   icon: '✈️' },
  { id: 'think',   label: 'Thinking',    icon: '💭' },
  { id: 'explore', label: 'Explore',     icon: '🧭' },
]

export default function LandingPage() {
  const navigate           = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const [activeVideo, setActiveVideo] = useState(1)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [input, setInput] = useState('')
  const [activeMode, setActiveMode] = useState(MODES[0])
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)
  const modeMenuRef = useRef(null)
  const vibeRef = useRef('')
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const activeRef = videoRefs[activeVideo - 1].current
    if (activeRef) {
      activeRef.currentTime = 0
      activeRef.play().catch(() => {})
    }
  }, [activeVideo])

  const handleVideoEnded = () => setActiveVideo((prev) => (prev % 4) + 1)

  const handleSend = async () => {
    const vibe = input.trim()
    if (!vibe) return
    vibeRef.current = vibe
    setLoading(true)
    try {
      const destinations = await fetchDestinations(vibe)
      const imageResults = await Promise.all(
        destinations.map(d => fetchDestinationImage(d.destination))
      )
      await Promise.all(
        imageResults.map(({ url }) => new Promise(resolve => {
          const img = new window.Image()
          img.onload = img.onerror = resolve
          img.src = url
        }))
      )
      const imageMap = Object.fromEntries(
        destinations.map((d, i) => [d.destination, imageResults[i]])
      )
      navigate('/results', { state: { vibe, destinations, imageMap } })
    } catch {
      navigate('/results', { state: { vibe } })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }, [input])

  // Close mode menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target)) {
        setShowModeMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const hasContent = input.trim().length > 0

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video splash / buffer screen ── */}
      <AnimatePresence>
        {!videoReady && !videoError && (
          <motion.div
            key="video-splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: '#0a0f1e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <Plane style={{ width: '48px', height: '48px', color: 'var(--color-accent)' }} />
              <h1
                className="text-gold-gradient text-glow-gold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 'clamp(40px, 8vw, 72px)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  userSelect: 'none',
                }}
              >
                DreamTrip
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search loading overlay ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="landing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(9,9,15,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '28px',
            }}
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
                Discovering your destinations…
              </motion.p>
              {vibeRef.current && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(212,168,75,0.65)', letterSpacing: '0.08em', margin: 0, maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  "{vibeRef.current}"
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0" style={{ background: '#0a0f1e' }}>
        {!videoError && [1, 2, 3, 4].map((n) => (
          <video
            key={n}
            ref={videoRefs[n - 1]}
            autoPlay={n === 1}
            muted
            playsInline
            loop={false}
            onEnded={handleVideoEnded}
            onCanPlayThrough={n === 1 ? () => setVideoReady(true) : undefined}
            onError={() => { setVideoError(true); setVideoReady(true) }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              activeVideo === n ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={n === 1 ? 'https://d12is9znbjsq5c.cloudfront.net/video.mp4' : `https://d12is9znbjsq5c.cloudfront.net/video${n}.mp4`} type="video/mp4" />
          </video>
        ))}

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center text-center">

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* ── Logo row ── */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={shouldReduceMotion ? {} : {
                y: [0, -10, 0],
                transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Plane className="w-10 h-10 md:w-14 md:h-14 text-[var(--color-accent)]" />
            </motion.div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-[var(--font-heading)] font-bold tracking-tight text-gold-gradient text-glow-gold select-none"
              aria-label="DreamTrip"
            >
              DreamTrip
            </h1>
          </motion.div>

          {/* ── Tagline ── */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg font-[var(--font-body)] font-light tracking-[0.22em] uppercase text-white/70 mb-14"
          >
            Describe your dream &nbsp;·&nbsp; We'll plan the trip
          </motion.p>

          {/* ═══════════════════════════════════════════
              Professional Chat Input — Pill Design
              ═══════════════════════════════════════════ */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-[720px]"
          >
            <div
              className="chat-input-container"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                borderRadius: '32px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
                padding: '8px',
                transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
                fontFamily: "var(--font-body)",
              }}
              onFocus={() => {}}
            >
              {/* ── Textarea ── */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                minWidth: 0,
                paddingLeft: '16px',
                paddingRight: '8px',
              }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 200))}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Describe your dream trip..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    padding: '10px 0',
                    minHeight: '44px',
                    maxHeight: '140px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                  }}
                  className="chat-textarea"
                />
              </div>

              {/* ── Right: Mode Switcher + Actions ── */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '6px',
                paddingRight: '4px',
                paddingBottom: '4px',
                flexShrink: 0,
              }}>
                {/* Mode Switcher Pill */}
                <div ref={modeMenuRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px 4px 8px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                    }}
                  >
                    <span>{activeMode.icon}</span>
                    <span>{activeMode.label}</span>
                    <ChevronDown className="w-3 h-3" style={{
                      transition: 'transform 0.2s ease',
                      transform: showModeMenu ? 'rotate(180deg)' : 'rotate(0)',
                    }} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showModeMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 6px)',
                          right: 0,
                          background: 'rgba(20, 22, 30, 0.97)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '14px',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(20px)',
                          padding: '4px',
                          minWidth: '160px',
                          zIndex: 60,
                        }}
                      >
                        {MODES.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => { setActiveMode(mode); setShowModeMenu(false) }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              background: activeMode.id === mode.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                              color: activeMode.id === mode.id ? '#fff' : 'rgba(255,255,255,0.6)',
                              fontSize: '13px',
                              fontFamily: 'var(--font-body)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => {
                              if (activeMode.id !== mode.id) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (activeMode.id !== mode.id) {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                              }
                            }}
                          >
                            <span>{mode.icon}</span>
                            <span>{mode.label}</span>
                            {activeMode.id === mode.id && (
                              <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'var(--color-accent)' }} />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Row: Mic + Send */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {/* Send Button — White circle when active */}
                  <motion.button
                    onClick={handleSend}
                    disabled={!hasContent}
                    aria-label="Send"
                    whileHover={hasContent ? { scale: 1.08 } : {}}
                    whileTap={hasContent ? { scale: 0.92 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: hasContent ? 'pointer' : 'default',
                      transition: 'all 0.25s ease',
                      background: hasContent ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: hasContent ? '#0a0f1e' : 'rgba(255,255,255,0.2)',
                      boxShadow: hasContent ? '0 2px 12px rgba(255,255,255,0.2)' : 'none',
                    }}
                  >
                    <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Character counter */}
            <div className="flex justify-end mt-2 px-4">
              <span className={`text-xs font-[var(--font-body)] transition-colors ${input.length > 180 ? 'text-red-400' : 'text-white/20'}`}>
                {input.length}/200
              </span>
            </div>
          </motion.div>

          {/* ── Provider hint ── */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[11px] tracking-[0.18em] uppercase text-white/25 font-[var(--font-body)]"
          >
            Powered by Groq &middot; Llama 3.3 70B
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-[var(--font-body)]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/30 animate-scroll-bounce" />
      </motion.div>
    </div>
  )
}
