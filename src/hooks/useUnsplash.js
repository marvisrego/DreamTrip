// source_handbook: week11-hackathon-preparation
import { useState, useEffect } from 'react'
import { fetchDestinationImage, getFallbackImageUrl } from '../lib/unsplash.js'

/**
 * Custom hook for fetching destination images with Unsplash + Pollinations fallback.
 * Loads asynchronously — never blocks the UI.
 * @param {string} destination - Destination name to fetch image for
 * @returns {{ imageUrl, credit, loading }}
 */
export function useUnsplash(destination, preparedImage = null) {
  const [imageUrl, setImageUrl] = useState(preparedImage?.url || null)
  const [credit, setCredit] = useState(preparedImage?.credit || null)
  const [loading, setLoading] = useState(!preparedImage?.url)

  useEffect(() => {
    if (!destination) {
      setLoading(false)
      return
    }

    if (preparedImage?.url) {
      setImageUrl(preparedImage.url)
      setCredit(preparedImage.credit || null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchDestinationImage(destination)
      .then((result) => {
        if (!cancelled) {
          setImageUrl(result.url)
          setCredit(result.credit)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setImageUrl(getFallbackImageUrl(destination))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [destination, preparedImage?.credit, preparedImage?.url])

  return { imageUrl, credit, loading }
}
