// source_handbook: week11-hackathon-preparation
import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'

export default function ChatMessage({ message, index = 0 }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center mt-1">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] rounded-tr-sm'
            : 'bg-white/5 border border-white/10 text-[var(--color-text-primary)] rounded-tl-sm'
          }
        `}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center mt-1">
          <User className="w-3.5 h-3.5 text-white/70" />
        </div>
      )}
    </motion.div>
  )
}
