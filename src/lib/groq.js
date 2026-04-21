// Groq API wrapper — Llama 3.3 via OpenAI SDK
// Base URL: https://api.groq.com/openai/v1

import OpenAI from 'openai'

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

const getClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API
  if (!apiKey) {
    throw new Error('VITE_GROQ_API is not set in environment variables')
  }
  return new OpenAI({
    baseURL: GROQ_BASE_URL,
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

/**
 * Call Groq API with streaming support.
 */
export async function callGroqStream(messages, systemPrompt, onChunk, signal) {
  const client = getClient()
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  const stream = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: fullMessages,
    stream: true,
    temperature: 0.7,
    max_tokens: 4096,
  }, { signal })

  let fullText = ''
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      fullText += content
      onChunk(content, fullText)
    }
  }
  return fullText
}

/**
 * Call Groq API without streaming.
 */
export async function callGroq(messages, systemPrompt) {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })
  return response.choices[0]?.message?.content || ''
}
