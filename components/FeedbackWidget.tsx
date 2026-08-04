'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  siteName?: string
  accentColor?: string
}

const TYPES = ['bug', 'idea', 'compliment', 'other'] as const
type FType = typeof TYPES[number]

const TYPE_LABELS: Record<FType, string> = {
  bug: '🐛 Bug',
  idea: '💡 Idea',
  compliment: '❤️ Love it',
  other: '💬 Other',
}

export default function FeedbackWidget({ siteName = 'SocialSpark', accentColor = '#e11d48' }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FType>('idea')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function submit() {
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type, rating, message: message.trim(),
          email: email.trim() || undefined,
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          site: siteName,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('done')
      setTimeout(() => { setOpen(false); setStatus('idle'); setMessage(''); setEmail(''); setRating(0) }, 2200)
    } catch {
      setStatus('error')
    }
  }

  const displayRating = hoverRating || rating

  return (
    <>
      {/* Trigger button — bottom-left so it doesn't collide with chat (bottom-right) */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Send feedback"
        style={{
          position: 'fixed', bottom: 24, left: 24,
          height: 38, borderRadius: 20,
          padding: '0 16px',
          background: 'white',
          border: `1px solid #e7e5e4`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12.5, fontWeight: 600, color: '#44403c',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: 14 }}>💬</span> Feedback
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', bottom: 72, left: 24,
              width: 300,
              background: '#fffaf5',
              border: '1px solid #e7e5e4',
              borderRadius: 16,
              zIndex: 1000, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f5f5f4',
              fontWeight: 700, fontSize: 13, color: '#1c1917',
              background: 'white',
            }}>
              Share feedback
            </div>

            {status === 'done' ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#44403c' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Thanks!</p>
                <p style={{ fontSize: 12, color: '#78716c' }}>We read every message.</p>
              </div>
            ) : (
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Type selector */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                        border: type === t ? `1.5px solid ${accentColor}` : '1.5px solid #e7e5e4',
                        background: type === t ? '#fff1f2' : 'white',
                        color: type === t ? accentColor : '#78716c',
                        transition: 'all 150ms',
                      }}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                        color: n <= displayRating ? '#f59e0b' : '#d6d3d1',
                        transition: 'color 100ms',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  style={{
                    width: '100%', background: 'white',
                    border: '1px solid #e7e5e4', borderRadius: 10,
                    padding: '8px 10px', fontSize: 12.5, color: '#1c1917',
                    resize: 'none', outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />

                {/* Email (optional) */}
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional — for follow-up)"
                  type="email"
                  style={{
                    width: '100%', background: 'white',
                    border: '1px solid #e7e5e4', borderRadius: 10,
                    padding: '7px 10px', fontSize: 12.5, color: '#1c1917',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />

                {status === 'error' && (
                  <p style={{ fontSize: 11.5, color: '#e11d48', margin: 0 }}>Failed to send — please try again.</p>
                )}

                <button
                  onClick={submit}
                  disabled={!message.trim() || status === 'sending'}
                  style={{
                    background: accentColor, color: 'white',
                    border: 'none', borderRadius: 10, padding: '8px 0',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: !message.trim() || status === 'sending' ? 0.5 : 1,
                    transition: 'opacity 150ms',
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
