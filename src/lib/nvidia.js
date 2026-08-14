const NVIDIA_PROXY_URL = '/api/nvidia'

async function readError(response) {
  try {
    const payload = await response.json()
    return [payload.error, payload.details].filter(Boolean).join(' ')
  } catch {
    return `The trip planner returned HTTP ${response.status}.`
  }
}

async function requestCompletion(messages, systemPrompt, stream, signal) {
  const response = await fetch(NVIDIA_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt, stream }),
    signal,
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response
}

function parseStreamEvent(eventText, onContent) {
  const data = eventText
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('')

  if (!data || data === '[DONE]') return

  try {
    const payload = JSON.parse(data)
    const content = payload.choices?.[0]?.delta?.content || ''
    if (content) onContent(content)
  } catch {
    // A partial event remains buffered and is retried with the next chunk.
  }
}

export async function callModelStream(messages, systemPrompt, onChunk, signal) {
  const response = await requestCompletion(messages, systemPrompt, true, signal)
  if (!response.body) throw new Error('The NVIDIA response did not include a stream.')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  const handleContent = (content) => {
    fullText += content
    onChunk(content, fullText)
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    events.forEach((eventText) => parseStreamEvent(eventText, handleContent))
  }

  buffer += decoder.decode()
  if (buffer.trim()) parseStreamEvent(buffer, handleContent)

  return fullText
}

export async function callModel(messages, systemPrompt) {
  const response = await requestCompletion(messages, systemPrompt, false)
  const payload = await response.json()
  return payload.choices?.[0]?.message?.content || ''
}
