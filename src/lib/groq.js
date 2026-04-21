// GitHub Models API wrapper — GPT-4o mini via OpenAI-compatible SDK
// Base URL: https://models.inference.ai.azure.com

import OpenAI from 'openai'

const GITHUB_MODELS_BASE_URL = 'https://models.inference.ai.azure.com'
const DEFAULT_MODEL = 'gpt-4o-mini'

const getClient = () => {
  const apiKey = import.meta.env.VITE_GITHUB_TOKEN
  if (!apiKey) {
    throw new Error('VITE_GITHUB_TOKEN is not set in environment variables')
  }
  return new OpenAI({
    baseURL: GITHUB_MODELS_BASE_URL,
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

/**
 * Call GitHub Models API with streaming support.
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
 * Call GitHub Models API without streaming.
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
