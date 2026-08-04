'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingChatWrapper() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! Need help with captions, hashtags or ad copy? I'll make your posts shine ✍️" },
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
          background: 'linear-gradient(135deg,#e11d48,#be123c)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(225,29,72,0.30)',
          zIndex: 1000, fontSize: 20,
          color: 'white',
          transition: 'box-shadow 150ms',
        }}
      >
        {open ? '✕' : '✍️'}
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
              background: '#fffaf5',
              border: '1px solid #e7e5e4',
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              zIndex: 1000, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f5f5f4',
              fontSize: 13, fontWeight: 700, color: '#1c1917',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'white',
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 8,
                background: '#e11d48', color: 'white', fontSize: 11, fontWeight: 800,
              }}>S</span>
              SocialSpark AI
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 8,
              background: '#fffaf5',
            }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#e11d48' : 'white',
                  color: m.role === 'user' ? 'white' : '#1c1917',
                  border: m.role === 'user' ? 'none' : '1px solid #e7e5e4',
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
                  background: 'white', border: '1px solid #e7e5e4',
                  padding: '8px 14px', borderRadius: '12px 12px 12px 4px',
                  fontSize: 12, color: '#a8a29e',
                }}>
                  Thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 12px',
              borderTop: '1px solid #f5f5f4',
              display: 'flex', gap: 8,
              background: 'white',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about captions, hashtags…"
                style={{
                  flex: 1,
                  background: '#fafaf9',
                  border: '1px solid #e7e5e4',
                  borderRadius: 8, padding: '7px 10px',
                  fontSize: 12.5, color: '#1c1917', outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  background: '#e11d48', border: 'none',
                  borderRadius: 8, padding: '7px 13px',
                  fontSize: 13, color: '#fff', cursor: 'pointer',
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
