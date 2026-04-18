// source_handbook: week11-hackathon-preparation
import { useState, useCallback } from 'react'
import { callGemini } from '@/lib/gemini'
import { getDestinationPrompt, buildDestinationMessage } from '@/prompts/destinationPrompt'

/**
 * Custom hook for Gemini destination suggestions.
 * Handles loading, error, and empty states.
 * @returns {{ destinations, loading, error, fetchDestinations }}
 */
export function useGemini() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDestinations = useCallback(async (vibe) => {
    if (!vibe?.trim()) return

    setLoading(true)
    setError(null)
    setDestinations([])

    try {
      const systemPrompt = getDestinationPrompt()
      const userMessage = buildDestinationMessage(vibe)
      const results = await callGemini(systemPrompt, userMessage)

      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('No destinations returned. Try rephrasing your vibe.')
      }

      setDestinations(results)
    } catch (err) {
      setError(err.message || 'Failed to fetch destinations')
    } finally {
      setLoading(false)
    }
  }, [])

  return { destinations, loading, error, fetchDestinations }
}
