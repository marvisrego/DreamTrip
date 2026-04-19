// source_handbook: week11-hackathon-preparation

export default function CardSkeleton({ tall = false, wide = false }) {
  if (wide) {
    return (
      <div className="glass-card overflow-hidden animate-pulse flex min-h-[220px]">
        <div className="w-2/5 shimmer bg-[var(--color-bg-secondary)]" />
        <div className="flex flex-col justify-center px-6 py-5 flex-1 space-y-3">
          <div className="h-4 w-24 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-7 w-1/2 rounded shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-4 w-full rounded shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-4 w-4/5 rounded shimmer bg-[var(--color-bg-secondary)]" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
            <div className="h-6 w-24 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
          </div>
          <div className="h-9 w-28 rounded-lg shimmer bg-[var(--color-bg-secondary)] mt-2" />
        </div>
      </div>
    )
  }

  if (tall) {
    return (
      <div className="glass-card overflow-hidden animate-pulse h-full min-h-[420px] relative">
        <div className="absolute inset-0 shimmer bg-[var(--color-bg-secondary)]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div className="h-4 w-20 rounded-full shimmer bg-white/10" />
          <div className="h-10 w-2/3 rounded shimmer bg-white/10" />
          <div className="h-4 w-full rounded shimmer bg-white/10" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full shimmer bg-white/10" />
            <div className="h-6 w-24 rounded-full shimmer bg-white/10" />
          </div>
          <div className="h-10 w-36 rounded-xl shimmer bg-white/10 mt-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/10] shimmer bg-[var(--color-bg-secondary)]" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded shimmer bg-[var(--color-bg-secondary)]" />
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
          <div className="h-5 w-24 rounded-full shimmer bg-[var(--color-bg-secondary)]" />
        </div>
        <div className="h-3 w-full rounded shimmer bg-[var(--color-bg-secondary)]" />
        <div className="h-3 w-4/5 rounded shimmer bg-[var(--color-bg-secondary)]" />
        <div className="h-9 w-full rounded-lg shimmer bg-[var(--color-bg-secondary)] mt-2" />
      </div>
    </div>
  )
}
