// source_handbook: week11-hackathon-preparation
import { Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import ResultsPage from '@/pages/ResultsPage'
import ItineraryPage from '@/pages/ItineraryPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/itinerary/:destination" element={<ItineraryPage />} />
      </Routes>
    </div>
  )
}
