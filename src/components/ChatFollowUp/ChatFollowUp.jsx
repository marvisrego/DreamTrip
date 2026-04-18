// source_handbook: week11-hackathon-preparation
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ArrowUp, X, Sparkles } from 'lucide-react'
import { useGroq } from '@/hooks/useGroq'
import { getChatPrompt } from '@/prompts/chatPrompt'
import ChatMessage from './ChatMessage'

export default function ChatFollowUp({ destination, vibe, itinerary }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const {
    streamedText,
    loading,
    error,
    startStream,
    messages,
  } = useGroq()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamedText])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim() || loading) return
    const systemPrompt = getChatPrompt(destination, vibe, itinerary)
    startStream(systemPrompt, input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Filter out system messages for display and build display list
  const displayMessages = messages.filter(m => m.role !== 'system')

  return (
    <>
      {/* Toggle button — fixed at bottom */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="
              fixed bottom-6 right-6 z-50
              flex items-center gap-2 px-5 py-3
              bg-[var(--color-accent)] text-[var(--color-bg-primary)]
              rounded-full font-medium text-sm
              shadow-[0_4px_20px_rgba(212,168,75,0.3)]
              hover:shadow-[0_4px_30px_rgba(212,168,75,0.5)]
              transition-shadow cursor-pointer
            "
          >
            <Sparkles className="w-4 h-4" />
            Refine your trip ✦
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              fixed bottom-0 left-0 right-0 z-50
              h-[50vh] max-h-[500px]
              bg-[var(--color-bg-primary)] border-t border-white/10
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm font-medium text-white">Refine Your Trip</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="p-2 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
              >
                <X className="w-4 h-4 text-[var(--color-text-muted)]" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {displayMessages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-8 h-8 text-[var(--color-accent)]/30 mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Ask me to refine your itinerary
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    e.g. "make it more adventurous" or "I'm vegetarian"
                  </p>
                </div>
              )}

              {displayMessages.map((msg, i) => (
                <ChatMessage key={i} message={msg} index={i} />
              ))}

              {/* Streaming indicator */}
              {loading && streamedText && (
                <ChatMessage
                  message={{ role: 'assistant', content: streamedText }}
                  index={displayMessages.length}
                />
              )}

              {loading && !streamedText && (
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs">Thinking...</span>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. make it more adventurous / add a beach day"
                  disabled={loading}
                  aria-label="Chat input"
                  autoComplete="off"
                  className="flex-1 bg-transparent border-none outline-none focus-visible:ring-0 text-sm text-white placeholder:text-[var(--color-text-subtle)] disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="
                    shrink-0 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full
                    bg-[var(--color-accent)] text-[var(--color-bg-primary)]
                    flex items-center justify-center
                    disabled:opacity-30 transition-opacity cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] outline-none
                  "
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
