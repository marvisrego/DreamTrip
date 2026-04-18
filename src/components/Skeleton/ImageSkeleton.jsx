// source_handbook: week11-hackathon-preparation

export default function ImageSkeleton({ className = '' }) {
  return (
    <div
      className={`
        w-full aspect-[16/10]
        rounded-t-xl
        shimmer
        bg-[var(--color-bg-secondary)]
        ${className}
      `}
    />
  )
}
