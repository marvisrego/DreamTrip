// source_handbook: week11-hackathon-preparation
// Destination suggestions — routed through Groq (Gemini quota broken)
// Uses llama-3.3-70b-versatile, returns parsed JSON array
// Strips markdown fences before parsing

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Call Groq API to suggest destinations based on a vibe string.
 * Drop-in replacement for the original Gemini call — same interface.
 * @param {string} systemPrompt - The system prompt with instructions
 * @param {string} userMessage - The user's vibe description
 * @returns {Promise<Array>} Parsed array of destination objects
 */
export async function callGemini(systemPrompt, userMessage) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not set in environment variables')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Groq API error (${response.status}): ${errorData?.error?.message || response.statusText}`
    )
  }

  const data = await response.json()
  const rawText = data?.choices?.[0]?.message?.content

  if (!rawText) {
    throw new Error('No response text from Groq')
  }

  // Strip markdown fences — LLMs sometimes wrap JSON in ```json ``` blocks
  const clean = rawText.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return parsed
  } catch (parseError) {
    throw new Error(`Failed to parse destination JSON: ${parseError.message}\nRaw: ${clean.substring(0, 200)}`)
  }
}
