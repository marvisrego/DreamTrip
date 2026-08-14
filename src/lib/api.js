import { callModel, callModelStream } from './nvidia.js'
import { getDestinationPrompt, buildDestinationMessage } from '../prompts/destinationPrompt'
import { getItineraryPrompt } from '../prompts/itineraryPrompt'
import { getChatPrompt } from '../prompts/chatPrompt'

export async function fetchDestinations(vibe) {
  const raw = await callModel(
    [{ role: 'user', content: buildDestinationMessage(vibe) }],
    getDestinationPrompt(),
  )
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return Array.isArray(parsed) ? parsed : (parsed.destinations || [])
  } catch (error) {
    console.error('Failed to parse destination suggestions:', error)
    throw new Error('The destination response was not valid JSON')
  }
}

async function fetchTavilyContext(destination) {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY
  if (!apiKey) return ''

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${destination} travel guide tips food culture visa ${new Date().getFullYear()}`,
        max_results: 3,
        search_depth: 'basic',
      }),
    })
    if (!response.ok) return ''

    const data = await response.json()
    return (data.results || []).map((result) => result.content).filter(Boolean).join('\n\n')
  } catch {
    return ''
  }
}

export async function streamItinerary(destination, vibe, onChunk) {
  const context = await fetchTavilyContext(destination)
  const systemPrompt = getItineraryPrompt(destination, vibe, '7–10 days', context)
  const userMessage = `Create a detailed itinerary for ${destination} based on this travel brief: ${vibe}`

  return callModelStream(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    onChunk,
  )
}

export async function streamChat(message, history, destination, vibe, itinerary, onChunk) {
  return callModelStream(
    [...history, { role: 'user', content: message }],
    getChatPrompt(destination, vibe, itinerary),
    onChunk,
  )
}
