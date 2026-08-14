import { ArrowLeft, Route } from 'lucide-react'

export default function AppHeader({ onBack, backLabel = 'Back', trailing }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand"
          onClick={onBack || undefined}
          aria-label={onBack ? backLabel : 'DreamTrip home'}
        >
          <span className="brand-mark" aria-hidden="true"><Route size={18} /></span>
          <span>DreamTrip</span>
        </button>

        <div className="header-actions">
          {onBack && (
            <button type="button" className="text-button" onClick={onBack}>
              <ArrowLeft size={16} /> {backLabel}
            </button>
          )}
          {trailing}
        </div>
      </div>
    </header>
  )
}
