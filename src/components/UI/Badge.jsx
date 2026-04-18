// source_handbook: week11-hackathon-preparation

export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1 text-xs font-medium tracking-wide
        rounded-full
        bg-[var(--color-accent)]/10
        text-[var(--color-accent)]
        border border-[var(--color-accent)]/20
        ${className}
      `}
    >
      {children}
    </span>
  )
}
