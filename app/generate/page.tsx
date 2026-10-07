'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/Logo'
import { usePromo } from '@/hooks/usePromo'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', size: '1:1' },
  { id: 'twitter',   label: 'Twitter/X',  size: '16:9' },
  { id: 'linkedin',  label: 'LinkedIn',   size: '1.91:1' },
  { id: 'facebook',  label: 'Facebook',   size: '1.91:1' },
]

const STYLES = [
  { id: 'photorealistic', label: 'Photo' },
  { id: 'illustration',   label: 'Illustration' },
  { id: 'minimalist',     label: 'Minimalist' },
  { id: '3d',             label: '3D Render' },
]

const FREE_LIMIT = 3
const STORAGE_KEY = 'ai_social_usage'

function getUsage(): { count: number; date: string } {
  if (typeof window === 'undefined') return { count: 0, date: '' }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, date: '' }
    return JSON.parse(raw)
  } catch { return { count: 0, date: '' } }
}

function incrementUsage(): number {
  const today = new Date().toISOString().slice(0, 10)
  const usage = getUsage()
  const count = usage.date === today ? usage.count + 1 : 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: today }))
  return count
}

function getRemainingFree(): number {
  const today = new Date().toISOString().slice(0, 10)
  const usage = getUsage()
  if (usage.date !== today) return FREE_LIMIT
  return Math.max(0, FREE_LIMIT - usage.count)
}

export default function GeneratePage() {
  const [platform, setPlatform] = useState('instagram')
  const [style, setStyle]       = useState('photorealistic')
  const [prompt, setPrompt]     = useState('')
  const [image, setImage]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [limitHit, setLimitHit] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoMsg, setPromoMsg] = useState('')
  const { isUnlocked, daysLeft } = usePromo()

  // Avoid SSR/client mismatch — read localStorage after mount
  if (typeof window !== 'undefined' && remaining === null) {
    setRemaining(getRemainingFree())
  }

  async function redeemPromo() {
    if (!promoCode.trim()) return
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      })
      const data = await res.json()
      if (data.valid) { setPromoMsg('Unlocked! Refresh to apply.'); setLimitHit(false) }
      else setPromoMsg(data.message || 'Invalid code')
    } catch { setPromoMsg('Try again in a moment') }
  }

  async function generate() {
    if (!prompt.trim()) return
    const remainingNow = getRemainingFree()
    if (!isUnlocked && remainingNow <= 0) { setLimitHit(true); return }

    setLoading(true); setError(''); setImage(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, style }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Generation failed')
      setImage(data.image)
      incrementUsage()
      setRemaining(getRemainingFree())
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-(--ink)">
      <header className="sticky top-0 z-40 border-b border-(--line) bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={30} />
            <span className="text-lg font-bold tracking-tight">
              Social<span className="text-(--accent-ink)">Spark</span>
            </span>
          </Link>
          <div className="text-sm font-medium text-(--ink-2)">
            {isUnlocked
              ? <span className="text-(--accent-ink) font-semibold">Pro unlocked, {daysLeft}d left</span>
              : <>{remaining ?? FREE_LIMIT} free image{(remaining ?? FREE_LIMIT) === 1 ? '' : 's'} left today</>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-(--ink) mb-3">Platform</label>
          <div className="flex gap-3 flex-wrap">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-4 py-2.5 min-h-11 rounded-xl border text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
                  platform === p.id
                    ? 'bg-(--accent) border-(--accent) text-(--on-accent) shadow-sm'
                    : 'border-(--line) bg-(--surface) text-(--ink-2) hover:border-(--accent) hover:text-(--accent-ink)'
                }`}
              >
                {p.label} <span className="text-xs opacity-60">({p.size})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-semibold text-(--ink) mb-3">Style</label>
          <div className="flex gap-3 flex-wrap">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-4 py-2.5 min-h-11 rounded-xl border text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
                  style === s.id
                    ? 'bg-(--accent) border-(--accent) text-(--on-accent) shadow-sm'
                    : 'border-(--line) bg-(--surface) text-(--ink-2) hover:border-(--accent) hover:text-(--accent-ink)'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-semibold text-(--ink) mb-2">Image prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the image you want... e.g. 'A coffee shop with warm morning light, latte art on the counter'"
            className="w-full h-28 bg-(--surface) border border-(--line) rounded-2xl px-4 py-3 text-(--ink) placeholder:text-(--ink-2) focus:outline-none focus:ring-2 focus:ring-(--accent) resize-none transition-shadow duration-150"
          />
        </div>

        {/* Generate */}
        {limitHit && !isUnlocked ? (
          <div className="ds-card p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Free limit reached</h3>
            <p className="text-(--ink-2) mb-4">You&apos;ve used all {FREE_LIMIT} free images today. Come back tomorrow, or redeem a promo code. Paid plans are planned but not available yet.</p>
            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Have a promo code?"
                className="flex-1 bg-(--surface) border border-(--line) rounded-lg px-3 py-2.5 text-sm text-(--ink) placeholder:text-(--ink-2) focus:outline-none focus:ring-2 focus:ring-(--accent)"
              />
              <button
                onClick={redeemPromo}
                className="bg-(--ink) text-(--bg) px-4 py-2.5 min-h-11 rounded-lg text-sm font-medium btn-press"
              >
                Apply
              </button>
            </div>
            {promoMsg && <p className="text-xs text-(--ink-2) mt-2">{promoMsg}</p>}
          </div>
        ) : (
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-(--accent) text-(--on-accent) disabled:opacity-40 disabled:cursor-not-allowed py-3.5 min-h-12 rounded-2xl font-semibold btn-press shadow-lg shadow-[color-mix(in_oklab,var(--accent)_28%,transparent)]"
          >
            {loading ? 'Generating…' : 'Generate image'}
          </button>
        )}

        {error && (
          <div className="ds-card p-4 text-sm text-(--ink) border-l-4 border-l-(--accent)">
            {error}
          </div>
        )}

        {/* Result */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-4"
          >
            <div className="rounded-2xl overflow-hidden border border-(--line) shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Generated social media content" className="w-full" />
            </div>
            <a
              href={image}
              download={`social-${platform}-${Date.now()}.jpg`}
              className="flex items-center justify-center gap-2 w-full bg-(--ink) text-(--bg) py-3.5 min-h-12 rounded-2xl font-semibold btn-press"
            >
              Download image
            </a>
          </motion.div>
        )}
      </main>
    </div>
  )
}
