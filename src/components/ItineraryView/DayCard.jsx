// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { Sun, Coffee, Moon, UtensilsCrossed, DollarSign } from 'lucide-react'

function extractSection(text, label) {
  const regex = new RegExp(`${label}:\\s*(.+?)(?=(?:Morning|Afternoon|Evening|Meals|Estimated cost|Day \\d|$))`, 's')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

const sectionConfig = [
  { key: 'morning',   label: 'Morning',       icon: Sun,             color: '#fbbf24', bgColor: 'rgba(251,191,36,0.08)',   glowColor: 'rgba(251,191,36,0.30)' },
  { key: 'afternoon', label: 'Afternoon',      icon: Coffee,          color: '#fb923c', bgColor: 'rgba(251,146,60,0.08)',   glowColor: null },
  { key: 'evening',   label: 'Evening',        icon: Moon,            color: '#818cf8', bgColor: 'rgba(129,140,248,0.08)',  glowColor: null },
  { key: 'meals',     label: 'Meals',          icon: UtensilsCrossed, color: '#34d399', bgColor: 'rgba(52,211,153,0.08)',   glowColor: null, isMeals: true },
  { key: 'cost',      label: 'Estimated Cost', icon: DollarSign,      color: '#d4a84b', bgColor: 'rgba(212,168,75,0.08)',   glowColor: null },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 44, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 22 },
  },
}

const headerVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24, delay: 0.12 },
  },
}

const sectionsContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.22 } },
}

const sectionItem = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 26 },
  },
}

export default function DayCard({ dayText, dayNumber }) {
  const titleMatch = dayText.match(/Day\s*\d+:\s*(.+?)(?:\n|$)/)
  const title = titleMatch ? titleMatch[1].trim() : `Day ${dayNumber}`

  const sections = sectionConfig.map(({ key, label, icon, color, bgColor, glowColor, isMeals }) => ({
    key, label, Icon: icon, color, bgColor, glowColor, isMeals,
    content: extractSection(dayText, label),
  })).filter(s => s.content)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative pb-8"
      // padding-left applied here, not on inner card, so header text never clips
      style={{ paddingLeft: '2rem' }}
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.05 }}
        style={{
          position: 'absolute',
          left: 0,
          top: '10px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--color-accent)',
          boxShadow: '0 0 0 3px rgba(212,168,75,0.15), 0 0 14px rgba(212,168,75,0.55)',
        }}
      />

      {/* Card — overflow visible so watermark never clips */}
      <div
        className="relative glass-card"
        style={{ overflow: 'visible' }}
      >
        {/* Gold left-border — draws down from top; needs its own clip context */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            style={{
              transformOrigin: 'top',
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: '3px',
              background: 'linear-gradient(to bottom, var(--color-accent), rgba(212,168,75,0.4), transparent)',
            }}
          />
        </div>

        {/* Day-number watermark — fixed inside, no overflow needed */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '20px',
            top: '10px',
            fontSize: 'clamp(100px, 12vw, 160px)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            color: 'rgba(212,168,75,0.05)',
            zIndex: 0,
          }}
        >
          {dayNumber}
        </div>

        <div className="relative" style={{ padding: '28px 32px', zIndex: 1 }}>

          {/* ── Day header ── */}
          <motion.div variants={headerVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.28em',
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Day {dayNumber}
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                style={{
                  transformOrigin: 'left',
                  height: '1px',
                  flex: 1,
                  background: 'linear-gradient(to right, rgba(212,168,75,0.22), transparent)',
                }}
              />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                color: '#ffffff',
                marginBottom: '24px',
                lineHeight: 1.25,
                letterSpacing: '-0.3px',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                minWidth: 0,
              }}
            >
              {title}
            </h3>
          </motion.div>

          {/* ── Timeline sections — cascades from card's whileInView ── */}
          <motion.div
            variants={sectionsContainer}
            style={{ position: 'relative' }}
          >
            {/* Vertical connecting line through icon column */}
            {sections.length > 1 && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '15px',   // center of 32px icon
                  top: '36px',    // below first icon
                  bottom: '36px', // above last icon
                  width: '1px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                  pointerEvents: 'none',
                }}
              />
            )}

            {sections.map(({ key, label, Icon, color, bgColor, glowColor, isMeals, content }, sectionIndex) => (
              <motion.div key={key} variants={sectionItem}>
                {/* Meals gets a more prominent separator */}
                {isMeals && sectionIndex > 0 && (
                  <div
                    style={{
                      height: '1px',
                      margin: '20px 0 20px 0',
                      background: 'linear-gradient(to right, rgba(52,211,153,0.15), rgba(255,255,255,0.04), transparent)',
                    }}
                  />
                )}
                {/* Regular section separator (not before meals, handled above) */}
                {!isMeals && sectionIndex > 0 && (
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '20px 0' }} />
                )}

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Icon with optional glow */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: glowColor ? `0 0 12px ${glowColor}` : 'none',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Icon style={{ width: '15px', height: '15px', color }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    {/* Small-caps label */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'rgba(156,163,175,0.8)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '6px',
                        fontVariantCaps: 'all-small-caps',
                      }}
                    >
                      {label}
                    </p>
                    {/* Body text — fades out gracefully at bottom when very long */}
                    <div style={{ position: 'relative' }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.88)',
                          lineHeight: 1.75,
                          margin: 0,
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 8,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {content}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
