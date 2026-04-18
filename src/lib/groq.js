// source_handbook: week11-hackathon-preparation
// Groq API wrapper — itinerary generation and chat
// Uses llama-3.3-70b-versatile with real SSE streaming via ReadableStream
// Accepts onChunk callback for progressive UI rendering

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Call Groq API with streaming support.
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {string} systemPrompt - System prompt for the model
 * @param {function} onChunk - Callback called with each text chunk as it arrives
 * @param {AbortSignal} [signal] - Optional abort signal to cancel the stream
 * @returns {Promise<string>} Full completed response text
 */
export async function callGroqStream(messages, systemPrompt, onChunk, signal) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not set in environment variables')
  }

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ]

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Groq API error (${response.status}): ${errorData?.error?.message || response.statusText}`
    )
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Process SSE lines from the buffer
    const lines = buffer.split('\n')
    // Keep the last potentially incomplete line in the buffer
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue
      
      const data = trimmed.slice(6) // Remove 'data: ' prefix
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) {
          fullText += content
          onChunk(content, fullText)
        }
      } catch {
        // Skip malformed SSE chunks silently
      }
    }
  }

  return fullText
}

/**
 * Call Groq API without streaming (single response).
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {string} systemPrompt - System prompt
 * @returns {Promise<string>} Complete response text
 */
export async function callGroq(messages, systemPrompt) {
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
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Groq API error (${response.status}): ${errorData?.error?.message || response.statusText}`
    )
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
