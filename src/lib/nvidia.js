import OpenAI from 'openai'

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const NVIDIA_MODEL = 'nvidia/nemotron-3-super-120b-a12b'

function getClient() {
  // Kept for compatibility with the existing deployment environment.
  const apiKey = import.meta.env.VITE_GITHUB_TOKEN

  if (!apiKey) {
    throw new Error('VITE_GITHUB_TOKEN is not set in the environment')
  }

  return new OpenAI({
    baseURL: NVIDIA_BASE_URL,
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

function completionOptions(messages, systemPrompt) {
  return {
    model: NVIDIA_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 8192,
    chat_template_kwargs: { enable_thinking: false },
  }
}

export async function callModelStream(messages, systemPrompt, onChunk, signal) {
  const client = getClient()
  const stream = await client.chat.completions.create(
    { ...completionOptions(messages, systemPrompt), stream: true },
    { signal },
  )

  let fullText = ''
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content || ''
    if (!content) continue

    fullText += content
    onChunk(content, fullText)
  }

  return fullText
}

export async function callModel(messages, systemPrompt) {
  const client = getClient()
  const response = await client.chat.completions.create(
    completionOptions(messages, systemPrompt),
  )

  return response.choices?.[0]?.message?.content || ''
}
