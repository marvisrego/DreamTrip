import { useEffect, useRef, useState } from 'react'
import { ArrowUp, LoaderCircle, MessageCircle } from 'lucide-react'
import ChatMessage from './ChatMessage.jsx'
import { streamChat } from '../../lib/api.js'

const SUGGESTIONS = [
  'Make it more budget-friendly',
  'Add one slow day',
  'Suggest local food highlights',
]

export default function ChatFollowUp({ destination, vibe, itinerary }) {
  const [messages, setMessages] = useState([])
  const [streamedText, setStreamedText] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streamedText])

  const sendMessage = async (preset) => {
    const text = (typeof preset === 'string' ? preset : input).trim()
    if (!text || loading) return

    const priorMessages = messages
    const nextMessages = [...priorMessages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setStreamedText('')
    setLoading(true)
    setError('')

    try {
      const response = await streamChat(
        text,
        priorMessages,
        destination,
        vibe,
        itinerary,
        (_chunk, fullText) => setStreamedText(fullText),
      )
      setMessages([...nextMessages, { role: 'assistant', content: response }])
      setStreamedText('')
    } catch (requestError) {
      console.error(requestError)
      setError('That adjustment did not send. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-title">
      <header className="chat-panel__header">
        <span><MessageCircle size={17} /></span>
        <div><h3 id="chat-title">Adjust this plan</h3><p>Ask for a practical change</p></div>
      </header>

      <div className="chat-thread" ref={scrollRef}>
        {!messages.length && (
          <div className="chat-empty">
            <p>Keep the destination. Change the plan.</p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} message={message} />)}
        {streamedText && <ChatMessage message={{ role: 'assistant', content: streamedText }} />}
        {loading && !streamedText && (
          <div className="chat-thinking"><LoaderCircle className="spin" size={15} /> Rethinking the route…</div>
        )}
      </div>

      {error && <p className="chat-error" role="alert">{error}</p>}

      <div className="chat-composer">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Change a day, pace, or budget…"
          rows={2}
          disabled={loading}
          aria-label="Trip adjustment"
        />
        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          aria-label="Send adjustment"
        >
          <ArrowUp size={17} />
        </button>
      </div>
    </section>
  )
}
