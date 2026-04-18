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
  { key: 'morning', label: 'Morning', icon: Sun, color: 'text-amber-400' },
  { key: 'afternoon', label: 'Afternoon', icon: Coffee, color: 'text-orange-400' },
  { key: 'evening', label: 'Evening', icon: Moon, color: 'text-indigo-400' },
  { key: 'meals', label: 'Meals', icon: UtensilsCrossed, color: 'text-emerald-400' },
  { key: 'cost', label: 'Estimated cost', icon: DollarSign, color: 'text-[var(--color-accent)]' },
]

export default function DayCard({ dayText, dayNumber, index = 0 }) {
  // Parse day title from "Day N: Title"
  const titleMatch = dayText.match(/Day\s*\d+:\s*(.+?)(?:\n|$)/)
  const title = titleMatch ? titleMatch[1].trim() : `Day ${dayNumber}`

  // Extract each section
  const sections = sectionConfig.map(({ key, label, icon, color }) => ({
    key,
    label,
    Icon: icon,
    color,
    content: extractSection(dayText, label),
  })).filter(s => s.content)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-12 pb-10"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />

      {/* Card */}
      <div className="glass-card p-6">
        {/* Day header */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-widest">
            Day {dayNumber}
          </span>
          <h3 className="text-xl font-[var(--font-heading)] font-semibold text-white">
            {title}
          </h3>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map(({ key, label, Icon, color, content }) => (
            <div key={key} className="flex gap-3">
              <div className={`shrink-0 mt-0.5 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
