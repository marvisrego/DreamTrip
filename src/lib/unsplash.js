// source_handbook: week11-hackathon-preparation
// Image fetcher — tries Unsplash API, falls back to curated Unsplash photos
// Always returns a usable image URL — never returns null

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos'

// Curated travel photos from Unsplash (direct URLs — no API key needed)
// These are real Unsplash photos that load instantly
const CURATED_TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // tropical beach
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', // mountain lake
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // paris
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80', // venice
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80', // santorini
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', // bali temple
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80', // maldives
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80', // paris eiffel
  'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80', // japan
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80', // italy coast
  'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80', // waterfall
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80', // travel general
]

/**
 * Get a deterministic curated image based on destination name.
 * Uses string hash to always return the same image for the same destination.
 */
function getCuratedImage(destination) {
  let hash = 0
  for (let i = 0; i < destination.length; i++) {
    hash = ((hash << 5) - hash) + destination.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % CURATED_TRAVEL_IMAGES.length
  return CURATED_TRAVEL_IMAGES[index]
}

/**
 * Fetch a destination landscape photo.
 * Tries Unsplash API first, falls back to curated Unsplash photos.
 * @param {string} destination - The destination name to search for
 * @returns {Promise<{url: string, credit: string|null}>}
 */
export async function fetchDestinationImage(destination) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  // Try Unsplash API if we have a key
  if (accessKey) {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}?query=${encodeURIComponent(destination + ' travel landscape')}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${accessKey}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const photo = data?.results?.[0]

        if (photo) {
          return {
            url: photo.urls.regular,
            credit: `${photo.user.name} on Unsplash`,
          }
        }
      }
    } catch {
      // Unsplash API failed — fall through to curated
    }
  }

  // Fallback: curated Unsplash photos (instant load, no API key)
  return {
    url: getCuratedImage(destination),
    credit: 'Unsplash',
  }
}

/**
 * Get a fallback image URL for when an <img> onError fires.
 * @param {string} destination
 * @returns {string}
 */
export function getFallbackImageUrl(destination) {
  return getCuratedImage(destination)
}
