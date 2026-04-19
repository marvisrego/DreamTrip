import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Plane, ChevronDown, ArrowUp } from 'lucide-react'

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

export default function LandingPage() {
  const navigate           = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const [activeVideo, setActiveVideo] = useState(1)
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const activeRef = videoRefs[activeVideo - 1].current
    if (activeRef) {
      activeRef.currentTime = 0
      activeRef.play().catch(() => {})
    }
  }, [activeVideo])

  const handleVideoEnded = () => setActiveVideo((prev) => (prev % 4) + 1)

  const handleSend = () => {
    if (input.trim()) navigate('/results', { state: { vibe: input.trim() } })
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
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  const hasContent = input.trim().length > 0

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0 bg-black">
        {[1, 2, 3, 4].map((n) => (
          <video
            key={n}
            ref={videoRefs[n - 1]}
            autoPlay={n === 1}
            muted
            playsInline
            loop={false}
            onEnded={handleVideoEnded}
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

          {/* ── Clean ChatGPT-style Input ── */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-2xl"
          >
            <div className="relative flex items-end rounded-3xl bg-white/[0.07] border border-white/[0.1] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-200 focus-within:border-white/[0.2] focus-within:bg-white/[0.09]">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 200))}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Describe your dream trip..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-base text-white placeholder:text-white/35 px-6 py-4 min-h-[56px] max-h-[120px] leading-relaxed font-[var(--font-body)]"
                style={{ scrollbarWidth: 'none' }}
              />

              {/* Send button — ChatGPT style */}
              <div className="p-2.5">
                <button
                  onClick={handleSend}
                  disabled={!hasContent}
                  aria-label="Send"
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer outline-none
                    ${hasContent
                      ? 'bg-white text-[#0a0f1e] shadow-lg hover:bg-white/90 hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-white/10 text-white/25 cursor-default'
                    }
                  `}
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Character counter */}
            <div className="flex justify-end mt-2 px-2">
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
            Powered by GitHub Models &middot; GPT-4o mini
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
