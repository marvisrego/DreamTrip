// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'

export default function ChatMessage({ message, index = 0 }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-accent)]/10 flex items-center justify-center mt-1 ring-1 ring-[var(--color-accent)]/20">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`
          max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed font-[var(--font-body)]
          ${isUser
            ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] rounded-tr-md shadow-[0_2px_12px_rgba(212,168,75,0.2)]'
            : 'bg-white/[0.04] border border-white/[0.08] text-[var(--color-text-primary)]/90 rounded-tl-md backdrop-blur-sm'
          }
        `}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center mt-1 ring-1 ring-white/10">
          <User className="w-3.5 h-3.5 text-white/70" />
        </div>
      )}
    </motion.div>
  )
}
