// source_handbook: week11-hackathon-preparation

export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1.5 text-[11px] font-semibold tracking-wide
        rounded-full
        bg-[var(--color-accent)]/10
        text-[var(--color-accent)]
        border border-[var(--color-accent)]/20
        backdrop-blur-sm
        font-[var(--font-body)]
        ${className}
      `}
    >
      {children}
    </span>
  )
}
