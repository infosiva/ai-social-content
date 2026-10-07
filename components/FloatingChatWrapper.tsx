'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingChatWrapper() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! Need help with captions, hashtags or ad copy? I'll help your posts shine." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text || 'Happy to help!' }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Try again in a moment!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button — rose accent matching site palette */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close chat' : 'Open AI assistant'}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--accent),color-mix(in oklab, var(--accent) 70%, var(--ink)))',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(225,29,72,0.30)',
          zIndex: 1000, fontSize: 20,
          color: 'var(--on-accent)',
          transition: 'box-shadow 150ms',
        }}
      >
        {open ? '✕' : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4a2.5 2.5 0 0 1-1-2z"/></svg>}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', bottom: 88, right: 24,
              width: 320, height: 420,
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              zIndex: 1000, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--line)',
              fontSize: 13, fontWeight: 700, color: 'var(--ink)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)',
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 8,
                background: 'var(--accent)', color: 'var(--on-accent)', fontSize: 11, fontWeight: 800,
              }}>S</span>
              SocialSpark AI
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 8,
              background: 'var(--bg)',
            }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                  color: m.role === 'user' ? 'var(--on-accent)' : 'var(--ink)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--line)',
                  padding: '8px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  fontSize: 12.5, lineHeight: '1.45',
                  maxWidth: '85%',
                }}>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  padding: '8px 14px', borderRadius: '12px 12px 12px 4px',
                  fontSize: 12, color: 'var(--ink-2)',
                }}>
                  Thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--line)',
              display: 'flex', gap: 8,
              background: 'var(--surface)',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about captions, hashtags…"
                style={{
                  flex: 1,
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 8, padding: '7px 10px',
                  fontSize: 12.5, color: 'var(--ink)', outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  background: 'var(--accent)', border: 'none',
                  borderRadius: 8, padding: '7px 13px',
                  fontSize: 13, color: 'var(--on-accent)', cursor: 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 150ms',
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
