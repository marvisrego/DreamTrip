// source_handbook: week11-hackathon-preparation
import { useState, useCallback, useRef } from 'react'
import { callGroqStream } from '@/lib/groq'

/**
 * Custom hook for Groq streaming chat.
 * Provides progressive text rendering and conversation history.
 * @returns {{ streamedText, fullText, loading, error, startStream, messages, addUserMessage, resetChat }}
 */
export function useGroq() {
  const [streamedText, setStreamedText] = useState('')
  const [fullText, setFullText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const abortRef = useRef(null)

  const startStream = useCallback(async (systemPrompt, userMessage) => {
    setLoading(true)
    setError(null)
    setStreamedText('')

    // Add user message to history
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    // Create abort controller for cancellation
    abortRef.current = new AbortController()

    try {
      const result = await callGroqStream(
        newMessages,
        systemPrompt,
        (chunk, accumulated) => {
          setStreamedText(accumulated)
        },
        abortRef.current.signal
      )

      setFullText(result)
      // Add assistant response to history
      setMessages(prev => [...prev, { role: 'assistant', content: result }])
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to generate response')
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [messages])

  const addUserMessage = useCallback((content) => {
    setMessages(prev => [...prev, { role: 'user', content }])
  }, [])

  const resetChat = useCallback(() => {
    setMessages([])
    setStreamedText('')
    setFullText('')
    setError(null)
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }, [])

  const stopStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }, [])

  return {
    streamedText,
    fullText,
    loading,
    error,
    startStream,
    stopStream,
    messages,
    addUserMessage,
    resetChat,
  }
}
