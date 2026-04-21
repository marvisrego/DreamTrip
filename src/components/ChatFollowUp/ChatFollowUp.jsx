import { useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Sparkles, Globe, BrainCog, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { streamChat } from '../../lib/api.js'
import ChatMessage from './ChatMessage'

// ── Solid "Gemini-style" pill input ──────────────────────────────────────────
function SolidChatInput({ input, setInput, textareaRef, loading, onSend, onKeyDown }) {
  const [focused, setFocused] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showThink, setShowThink] = useState(false)
  const hasContent = input.trim().length > 0

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  return (
    <div
      style={{
        width: '90%',
        position: 'relative',
        borderRadius: '40px',
        // Gradient border via padding-box / border-box trick
        background: focused
          ? 'linear-gradient(#1E2028, #1E2028) padding-box, linear-gradient(135deg, rgba(212,168,75,0.9), rgba(234,88,12,0.7)) border-box'
          : 'linear-gradient(#1A1C22, #1A1C22) padding-box, linear-gradient(135deg, rgba(212,168,75,0.35), rgba(234,88,12,0.25)) border-box',
        border: '1.5px solid transparent',
        boxShadow: focused
          ? '0 0 28px rgba(212,168,75,0.18), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 8px 8px 14px',
        gap: '4px',
      }}>

        {/* ── Left: Globe + BrainCog toggles ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => { setShowSearch(p => !p); setShowThink(false) }}
            aria-label="Toggle web search"
            style={{
              width: '34px', height: '34px',
              borderRadius: '50%',
              border: showSearch ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              background: showSearch ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: showSearch ? '#818cf8' : 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <Globe style={{ width: '15px', height: '15px' }} />
          </button>

          <button
            type="button"
            onClick={() => { setShowThink(p => !p); setShowSearch(false) }}
            aria-label="Toggle deep reasoning"
            style={{
              width: '34px', height: '34px',
              borderRadius: '50%',
              border: showThink ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
              background: showThink ? 'rgba(168,85,247,0.12)' : 'transparent',
              color: showThink ? '#c084fc' : 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <BrainCog style={{ width: '15px', height: '15px' }} />
          </button>

          {/* Thin divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 6px', flexShrink: 0 }} />
        </div>

        {/* ── Textarea ── */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={loading}
          placeholder={
            showSearch ? 'Search the web for places...'
            : showThink ? 'Think deeply about constraints...'
            : 'e.g. Can we make day 2 less rushed?'
          }
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#ffffff',
            fontFamily: 'var(--font-body)',
            padding: '9px 52px 9px 0',
            minHeight: '42px',
            maxHeight: '120px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        />

        {/* ── Right: Send button ── */}
        <motion.button
          onClick={onSend}
          disabled={!hasContent || loading}
          aria-label="Send"
          whileHover={hasContent && !loading ? { scale: 1.08 } : {}}
          whileTap={hasContent && !loading ? { scale: 0.93 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: hasContent && !loading ? '#ffffff' : 'rgba(255,255,255,0.1)',
            color: hasContent && !loading ? '#0a0c10' : 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hasContent && !loading ? 'pointer' : 'default',
            boxShadow: hasContent && !loading ? '0 2px 12px rgba(255,255,255,0.18)' : 'none',
            transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
            flexShrink: 0,
          }}
        >
          {loading
            ? <Sparkles style={{ width: '15px', height: '15px' }} className="animate-pulse" />
            : <ArrowUp style={{ width: '16px', height: '16px' }} strokeWidth={2.5} />
          }
        </motion.button>

      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function ChatFollowUp({ destination, vibe, itinerary }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamedText])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)
    setStreamedText('')
    setInput('')
    let accumulated = ''
    try {
      await streamChat(text, messages, destination, vibe, itinerary, (chunk) => {
        accumulated += chunk
        setStreamedText(accumulated)
      })
      setMessages([...newMessages, { role: 'assistant', content: accumulated }])
      setStreamedText('')
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const displayMessages = messages.filter(m => m.role !== 'system')
  const isEmpty = displayMessages.length === 0 && !loading

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>

      {/* ── FAB trigger ── */}
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-6 py-3.5 rounded-full font-[var(--font-heading)] font-bold text-base cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{
            background: 'linear-gradient(135deg, #d4a84b 0%, #ea580c 100%)',
            color: '#0a0c10',
            boxShadow: '0 8px 28px rgba(212,168,75,0.38), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <Sparkles className="w-4 h-4" />
          Make Changes
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Blurred overlay — modal itself stays fully opaque */}
        <Dialog.Overlay
          className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        />

        {/* ── Modal ── */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-[700px] flex flex-col outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{
            background: '#0A0C10',
            borderRadius: '32px',
            border: '1px solid rgba(212,168,75,0.16)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,168,75,0.04) inset',
            maxHeight: '90vh',
            overflow: 'hidden',
          }}
        >
          {/* Close — absolute top-right */}
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </Dialog.Close>

          {/* ── Centered title ── */}
          <div style={{ padding: '28px 48px 0', textAlign: 'center' }}>
            <Dialog.Title
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '21px',
                color: '#ffffff',
                letterSpacing: '-0.4px',
                lineHeight: 1.2,
              }}
            >
              Refine Your Trip
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Chat with AI to refine your itinerary for {destination}
            </Dialog.Description>
          </div>

          {/* ── Message / Empty area ── */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              minHeight: isEmpty ? '320px' : '260px',
              maxHeight: '420px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(212,168,75,0.2) transparent',
            }}
          >
            {/* Empty cockpit state */}
            <AnimatePresence>
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '24px',
                    padding: '36px 32px 20px',
                  }}
                >
                  {/* Sparkle icon + golden radial glow */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Outer ambient glow */}
                    <div style={{
                      position: 'absolute',
                      width: '140px', height: '140px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(212,168,75,0.20) 0%, rgba(212,168,75,0.06) 50%, transparent 70%)',
                      filter: 'blur(12px)',
                      pointerEvents: 'none',
                    }} />
                    {/* Inner ring */}
                    <div style={{
                      position: 'relative',
                      width: '68px', height: '68px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, rgba(212,168,75,0.18), rgba(212,168,75,0.06))',
                      border: '1px solid rgba(212,168,75,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 32px rgba(212,168,75,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}>
                      <Sparkles style={{ width: '30px', height: '30px', color: 'var(--color-accent)' }} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '22px',
                      color: '#ffffff',
                      letterSpacing: '-0.4px',
                      margin: 0,
                      lineHeight: 1.25,
                    }}>
                      How can we improve this?
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13.5px',
                      color: 'rgba(255,255,255,0.42)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      Ask me to swap activities, find cheaper food options, inject a spa day, or adapt to a shorter budget.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat messages */}
            {!isEmpty && (
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {displayMessages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} index={i} />
                ))}

                {loading && streamedText && (
                  <ChatMessage message={{ role: 'assistant', content: streamedText }} index={displayMessages.length} />
                )}

                {loading && !streamedText && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', gap: '5px', padding: '10px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {[0, 150, 300].map(delay => (
                        <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(212,168,75,0.8)', animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.14)', borderRadius: '12px', padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Solid pill chatbox ── */}
          <div style={{ padding: '12px 24px 24px', display: 'flex', justifyContent: 'center' }}>
            <SolidChatInput
              input={input}
              setInput={setInput}
              textareaRef={textareaRef}
              loading={loading}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
            />
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
