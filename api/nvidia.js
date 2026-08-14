const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL = 'nvidia/nemotron-3-super-120b-a12b'
const MAX_REQUEST_SIZE = 120_000

function jsonError(message, status, details) {
  return Response.json(
    { error: message, ...(details ? { details } : {}) },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function handleNvidiaRequest(
  request,
  apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_GITHUB_TOKEN,
) {
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 405)
    }

    if (!apiKey) {
      return jsonError(
        'NVIDIA_API_KEY is not configured for this Vercel environment.',
        500,
      )
    }

    let requestBody
    try {
      requestBody = await request.json()
    } catch {
      return jsonError('The request body must be valid JSON.', 400)
    }

    if (JSON.stringify(requestBody).length > MAX_REQUEST_SIZE) {
      return jsonError('The request is too large.', 413)
    }

    const { messages, systemPrompt, stream = false } = requestBody
    if (!Array.isArray(messages) || typeof systemPrompt !== 'string') {
      return jsonError('Messages and a system prompt are required.', 400)
    }

    try {
      const upstream = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 1,
          top_p: 0.95,
          max_tokens: 8192,
          chat_template_kwargs: { enable_thinking: false },
          stream: Boolean(stream),
        }),
      })

      if (!upstream.ok) {
        const upstreamText = await upstream.text()
        let details = `NVIDIA returned HTTP ${upstream.status}.`

        try {
          const parsed = JSON.parse(upstreamText)
          details = parsed?.error?.message || parsed?.detail || details
        } catch {
          // Keep the status-only message when the provider response is not JSON.
        }

        console.error('NVIDIA API request failed', upstream.status, details)
        return jsonError('NVIDIA could not complete the request.', upstream.status, details)
      }

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': upstream.headers.get('content-type') || 'application/json',
          'Cache-Control': 'no-store',
        },
      })
    } catch (error) {
      console.error('NVIDIA proxy failed', error)
      return jsonError('The NVIDIA service could not be reached.', 502)
    }
}

export default {
  fetch(request) {
    return handleNvidiaRequest(request)
  },
}
