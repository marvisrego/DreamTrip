// source_handbook: week11-hackathon-preparation
// All frontend AI calls go through this file
// Updated to use GitHub Models API (gpt-4o-mini) directly from the frontend

import { callGroq, callGroqStream } from './groq'
import { getDestinationPrompt, buildDestinationMessage } from '../prompts/destinationPrompt'
import { getItineraryPrompt } from '../prompts/itineraryPrompt'
import { getChatPrompt } from '../prompts/chatPrompt'

// Fetch destination suggestions
export async function fetchDestinations(vibe) {
  const systemPrompt = getDestinationPrompt()
  const userMessage = buildDestinationMessage(vibe)
  
  const raw = await callGroq([{ role: 'user', content: userMessage }], systemPrompt)
  console.log('RAW LLM OUTPUT:', raw);
  
  // Clean potential markdown or extra text to get valid JSON
  const clean = raw.replace(/```json|```/g, '').trim()
  console.log('CLEANED OUTPUT:', clean);
  
  try {
    const parsed = JSON.parse(clean);
    console.log('PARSED:', parsed);
    // If the LLM returned { destinations: [...] }, extract it, else return it as is
    return Array.isArray(parsed) ? parsed : (parsed.destinations || []);
  } catch (err) {
    console.error('Failed to parse destinations JSON:', err, 'Raw:', raw)
    throw new Error('Failed to parse destination suggestions')
  }
}


// Stream itinerary — calls onChunk with each text piece as it arrives
export async function streamItinerary(destination, vibe, onChunk) {
  const systemPrompt = getItineraryPrompt(destination, vibe, '7–10 days')
  const userMessage = `Please generate a detailed itinerary for ${destination} based on this vibe: ${vibe}`

  await callGroqStream(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    (chunk) => {
      onChunk(chunk) // Pass each text piece as it arrives
    }
  )
}

// Stream chat response
export async function streamChat(message, history, destination, vibe, itinerary, onChunk) {
  const systemPrompt = getChatPrompt(destination, vibe, itinerary)
  
  // Ensure history includes the latest message if not already there,
  // but usually it's passed from the component state before this call
  const messages = [
    ...history,
    { role: 'user', content: message }
  ]

  await callGroqStream(
    messages,
    systemPrompt,
    (chunk) => {
      onChunk(chunk)
    }
  )
}

