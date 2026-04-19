// source_handbook: week11-hackathon-preparation

export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-[var(--font-body)] ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 18px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(212,168,75,0.22)',
        color: 'var(--color-accent)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        fontFamily: 'var(--font-body)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        whiteSpace: 'nowrap',
        width: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </span>
  )
}
