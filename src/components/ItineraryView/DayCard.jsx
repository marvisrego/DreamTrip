import { CloudSun, Coffee, Moon, Sun, Utensils, WalletCards } from 'lucide-react'

const SECTION_LABELS = ['Morning', 'Afternoon', 'Evening', 'Meals', 'Estimated cost']
const SECTION_ICONS = {
  Morning: Coffee,
  Afternoon: Sun,
  Evening: Moon,
  Meals: Utensils,
  'Estimated cost': WalletCards,
}

function extractSection(text, label) {
  const followingLabels = SECTION_LABELS.filter((item) => item !== label).join('|')
  const expression = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n?(?:${followingLabels}):|$)`, 'i')
  return text.match(expression)?.[1]?.trim() || ''
}

export default function DayCard({ dayText, dayNumber }) {
  const heading = dayText.match(/^Day\s+\d+\s*:\s*(.*?)(?:\n|$)/i)
  const title = heading?.[1]?.trim() || `Day ${dayNumber}`
  const sections = SECTION_LABELS
    .map((label) => ({ label, content: extractSection(dayText, label) }))
    .filter((section) => section.content)

  return (
    <article className="day-card">
      <div className="day-node" aria-hidden="true">{String(dayNumber).padStart(2, '0')}</div>
      <div className="day-card__body">
        <header className="day-card__header">
          <span>Day {dayNumber}</span>
          <h3>{title}</h3>
        </header>

        <div className="day-sections">
          {sections.length ? sections.map(({ label, content }) => {
            const Icon = SECTION_ICONS[label] || CloudSun
            return (
              <section className={`day-section ${label === 'Estimated cost' ? 'day-section--cost' : ''}`} key={label}>
                <div className="day-section__label"><Icon size={16} /><span>{label}</span></div>
                <p>{content}</p>
              </section>
            )
          }) : (
            <div className="day-writing" aria-label="Writing this day">
              <span /> <span /> <span />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
