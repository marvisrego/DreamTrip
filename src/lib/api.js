// All frontend AI calls — Groq API (Llama 3.3 70B Versatile)

import { callGroq, callGroqStream } from './groq.js'
import { getDestinationPrompt, buildDestinationMessage } from '../prompts/destinationPrompt'
import { getItineraryPrompt } from '../prompts/itineraryPrompt'
import { getChatPrompt } from '../prompts/chatPrompt'

// Fetch destination suggestions
export async function fetchDestinations(vibe) {
  const systemPrompt = getDestinationPrompt()
  const userMessage = buildDestinationMessage(vibe)

  const raw = await callGroq([{ role: 'user', content: userMessage }], systemPrompt)
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return Array.isArray(parsed) ? parsed : (parsed.destinations || [])
  } catch (err) {
    console.error('Failed to parse destinations JSON:', err, 'Raw:', raw)
    throw new Error('Failed to parse destination suggestions')
  }
}

async function fetchTavilyContext(destination) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: import.meta.env.VITE_TAVILY_API_KEY,
        query: `${destination} travel guide tips food culture visa 2025`,
        max_results: 3,
        search_depth: 'basic',
      }),
    })
    if (!response.ok) return ''
    const data = await response.json()
    return (data.results || []).map((r) => r.content).filter(Boolean).join('\n\n')
  } catch {
    return ''
  }
}

// Stream itinerary — calls onChunk with each text piece as it arrives
export async function streamItinerary(destination, vibe, onChunk) {
  const context = await fetchTavilyContext(destination)
  const systemPrompt = getItineraryPrompt(destination, vibe, '7–10 days', context)
  const userMessage = `Please generate a detailed itinerary for ${destination} based on this vibe: ${vibe}`

  await callGroqStream(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    (chunk) => onChunk(chunk),
  )
}

// Stream chat response
export async function streamChat(message, history, destination, vibe, itinerary, onChunk) {
  const systemPrompt = getChatPrompt(destination, vibe, itinerary)
  const messages = [
    ...history,
    { role: 'user', content: message },
  ]

  await callGroqStream(
    messages,
    systemPrompt,
    (chunk) => onChunk(chunk),
  )
}
