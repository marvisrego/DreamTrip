import { useState, useRef, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MessageSquare, X, Sparkles } from 'lucide-react'
import { streamChat } from '@/lib/api'
import ChatMessage from './ChatMessage'
import { AIPromptBox } from '@/components/AIPromptBox/AIPromptBox'

export default function ChatFollowUp({ destination, vibe, itinerary }) {
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamedText])

  const handleSend = async (text) => {
    if (!text || loading) return
    
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)
    setStreamedText('')
    
    let accumulated = ''
    try {
      await streamChat(text, messages, destination, vibe, itinerary, (chunk) => {
        accumulated += chunk
        setStreamedText(accumulated)
      })
      
      setMessages([...newMessages, { role: 'assistant', content: accumulated }])
      setStreamedText('')
    } catch (err) {
      setError('Failed to send message.')
    } finally {
      setLoading(false)
    }
  }

  // Filter out system messages for display
  const displayMessages = messages.filter(m => m.role !== 'system')

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="
            fixed bottom-8 right-8 z-40
            flex items-center gap-2 px-6 py-4
            bg-[var(--color-accent)] text-[var(--color-bg-primary)]
            rounded-full font-[var(--font-heading)] font-bold text-lg
            shadow-[0_8px_30px_rgba(212,168,75,0.4)]
            hover:shadow-[0_8px_40px_rgba(212,168,75,0.6)]
            hover:scale-105 transition-all cursor-pointer
            focus-visible:ring-2 focus-visible:ring-offset-2 outline-none
          "
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          Make Changes
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex flex-col w-[95vw] md:w-[700px] h-[85vh] md:h-[700px] translate-x-[-50%] translate-y-[-50%] border border-white/10 bg-[#0a0f1e]/95 backdrop-blur-2xl shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-[2rem] overflow-hidden outline-none">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-[var(--font-heading)] font-bold text-white">
                  Refine Your Trip
                </Dialog.Title>
                <Dialog.Description className="text-xs text-white/50">
                  AI Travel Assistant &middot; Global Knowledge
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close chat"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {displayMessages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--color-accent)] animate-pulse" />
                </div>
                <h3 className="text-xl font-[var(--font-heading)] font-semibold text-white mb-2">
                  How can we improve this?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Ask me to swap activities, find cheaper food options, inject a spa day, or adapt to a shorter budget.
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
              <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-2 mt-4 ml-6">
                <div className="flex gap-1.5 p-3 rounded-2xl bg-[#111827] border border-white/5 shadow-inner">
                  <span className="w-1.5 h-1.5 bg-[var(--color-accent)]/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--color-accent)]/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--color-accent)]/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-5 py-3 text-center">
                {error}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-t from-[#0a0f1e] to-transparent">
            <AIPromptBox 
              onSend={handleSend} 
              loading={loading}
              placeholder="e.g. Can we make day 2 less rushed?" 
            />
          </div>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
