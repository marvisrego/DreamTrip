import { Sparkles, User } from 'lucide-react'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <span className="chat-avatar" aria-hidden="true">
        {isUser ? <User size={14} /> : <Sparkles size={14} />}
      </span>
      <p>{message.content}</p>
    </div>
  )
}
