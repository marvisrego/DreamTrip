// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { Sun, Coffee, Moon, UtensilsCrossed, DollarSign } from 'lucide-react'

/**
 * Parse a section from the day text.
 * Looks for patterns like "Morning: ..." and extracts the content.
 */
function extractSection(text, label) {
  const regex = new RegExp(`${label}:\\s*(.+?)(?=(?:Morning|Afternoon|Evening|Meals|Estimated cost|Day \\d|$))`, 's')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

const sectionConfig = [
  { key: 'morning', label: 'Morning', icon: Sun, color: 'text-amber-400', bgColor: 'bg-amber-400/8' },
  { key: 'afternoon', label: 'Afternoon', icon: Coffee, color: 'text-orange-400', bgColor: 'bg-orange-400/8' },
  { key: 'evening', label: 'Evening', icon: Moon, color: 'text-indigo-400', bgColor: 'bg-indigo-400/8' },
  { key: 'meals', label: 'Meals', icon: UtensilsCrossed, color: 'text-emerald-400', bgColor: 'bg-emerald-400/8' },
  { key: 'cost', label: 'Estimated cost', icon: DollarSign, color: 'text-[var(--color-accent)]', bgColor: 'bg-[var(--color-accent)]/8' },
]

export default function DayCard({ dayText, dayNumber, index = 0 }) {
  // Parse day title from "Day N: Title"
  const titleMatch = dayText.match(/Day\s*\d+:\s*(.+?)(?:\n|$)/)
  const title = titleMatch ? titleMatch[1].trim() : `Day ${dayNumber}`

  // Extract each section
  const sections = sectionConfig.map(({ key, label, icon, color, bgColor }) => ({
    key,
    label,
    Icon: icon,
    color,
    bgColor,
    content: extractSection(dayText, label),
  })).filter(s => s.content)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: index * 0.08 }}
      className="relative pl-8 md:pl-12 pb-8"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" />

      {/* Card */}
      <div className="relative glass-card overflow-hidden">
        {/* Day number watermark */}
        <div
          className="absolute -right-4 -top-6 text-[120px] md:text-[160px] font-[var(--font-heading)] font-bold leading-none select-none pointer-events-none"
          style={{ color: 'rgba(212, 168, 75, 0.04)' }}
          aria-hidden="true"
        >
          {dayNumber}
        </div>

        {/* Gold left-border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/40 to-transparent" />

        <div className="relative p-6 md:p-8">
          {/* Day header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-[0.25em] font-[var(--font-body)]">
              Day {dayNumber}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent" />
          </div>
          <h3 className="text-xl md:text-2xl font-[var(--font-heading)] font-semibold text-white mb-6 leading-tight">
            {title}
          </h3>

          {/* Sections */}
          <div className="space-y-5">
            {sections.map(({ key, label, Icon, color, bgColor, content }, sectionIndex) => (
              <div key={key}>
                {sectionIndex > 0 && (
                  <div className="h-px bg-white/[0.04] mb-5" />
                )}
                <div className="flex gap-4">
                  <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-1.5 font-[var(--font-body)]">
                      {label}
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)]/90 leading-[1.75] font-[var(--font-body)]">
                      {content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
