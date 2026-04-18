// source_handbook: week11-hackathon-preparation

export default function CardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-[16/10] shimmer bg-[var(--color-bg-secondary)]" />

      {/* Content placeholder */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-6 w-3/4 rounded shimmer bg-[var(--color-bg-secondary)]" />
        {/* Subtitle */}
        <div className="h-4 w-1/2 rounded shimmer bg-[var(--color-bg-secondary)]" />
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-6 w-24 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-6 w-16 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
        </div>
        {/* Description */}
        <div className="h-4 w-full rounded shimmer bg-[var(--color-bg-secondary)]" />
        {/* Button */}
        <div className="h-10 w-full rounded-xl shimmer bg-[var(--color-bg-secondary)] mt-4" />
      </div>
    </div>
  )
}
