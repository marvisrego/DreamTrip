import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Plane, ChevronDown } from 'lucide-react'
import { PromptInputBox } from '@/components/AIPromptBox/PromptInputBox'

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
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const activeRef = videoRefs[activeVideo - 1].current
    if (activeRef) {
      activeRef.currentTime = 0
      activeRef.play().catch(() => {})
    }
  }, [activeVideo])

  const handleVideoEnded = () => setActiveVideo((prev) => (prev % 4) + 1)

  const handleSend = (message) => {
    if (message.trim()) navigate('/results', { state: { vibe: message } })
  }

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
            <source src={n === 1 ? '/video.mp4' : `/video${n}.mp4`} type="video/mp4" />
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

          {/* ── Input box ── */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-2xl"
          >
            {/* Frosted pill wrapper — focus-within glow */}
            <div className="relative rounded-[2rem] p-[1px] transition-all duration-300 focus-within:shadow-[0_0_0_1px_rgba(212,168,75,0.6),0_0_28px_rgba(212,168,75,0.18)]">
              <PromptInputBox
                onSend={handleSend}
                placeholder="e.g. solo beaches, under £1000, warm weather"
                maxChars={200}
                className="rounded-[2rem] !bg-white/[0.06] border-white/[0.12] backdrop-blur-2xl"
              />
            </div>
          </motion.div>

          {/* ── Provider hint ── */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-[11px] tracking-[0.18em] uppercase text-white/25 font-[var(--font-body)]"
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
