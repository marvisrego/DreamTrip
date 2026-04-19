// source_handbook: week11-hackathon-preparation
// GitHub Models API wrapper — itinerary generation and chat
// Uses gpt-4o-mini via OpenAI SDK
// Base URL: https://models.inference.ai.azure.com

import OpenAI from 'openai'

const GITHUB_MODELS_URL = 'https://models.inference.ai.azure.com'
const DEFAULT_MODEL = 'gpt-4o-mini'

/**
 * Initialize OpenAI client for GitHub Models
 */
const getClient = () => {
  const apiKey = import.meta.env.VITE_GITHUB_TOKEN
  if (!apiKey) {
    throw new Error('VITE_GITHUB_TOKEN is not set in environment variables')
  }

  return new OpenAI({
    baseURL: GITHUB_MODELS_URL,
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for Vite/frontend
  })
}


/**
 * Call GitHub Models API with streaming support.
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {string} systemPrompt - System prompt for the model
 * @param {function} onChunk - Callback called with each text chunk as it arrives
 * @param {AbortSignal} [signal] - Optional abort signal to cancel the stream
 * @returns {Promise<string>} Full completed response text
 */
export async function callGroqStream(messages, systemPrompt, onChunk, signal) {
  const client = getClient()
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
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
 * Call GitHub Models API without streaming (single response).
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {string} systemPrompt - System prompt
 * @returns {Promise<string>} Complete response text
 */
export async function callGroq(messages, systemPrompt) {
  const client = getClient()
  
  const requestPayload = {
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 4096,
  };
  
  console.log('Sending this request to GitHub Models API:', requestPayload);

  const response = await client.chat.completions.create(requestPayload)

  return response.choices[0]?.message?.content || ''
}

