// source_handbook: week11-hackathon-preparation
import DestinationCard from './DestinationCard'
import CardSkeleton from '@/components/Skeleton/CardSkeleton'

export default function DestinationGrid({ destinations, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {destinations.map((dest, index) => (
        <DestinationCard
          key={dest.destination}
          destination={dest}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
