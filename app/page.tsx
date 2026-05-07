'use client'

import { useState } from 'react'

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

export default function Home() {
  const [platform, setPlatform] = useState('instagram')
  const [style, setStyle]       = useState('photorealistic')
  const [prompt, setPrompt]     = useState('')
  const [image, setImage]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [limitHit, setLimitHit] = useState(false)

  async function generate() {
    if (!prompt.trim()) return
    const remaining = getRemainingFree()
    if (remaining <= 0) { setLimitHit(true); return }

    setLoading(true); setError(''); setImage(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setImage(data.image)
      incrementUsage()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-400">AI Social Content</h1>
          <p className="text-xs text-gray-500">Generate stunning social media images with AI</p>
        </div>
        <div className="text-sm text-gray-400">
          {getRemainingFree()} free images left today
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Platform</label>
          <div className="flex gap-3 flex-wrap">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  platform === p.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'
                }`}
              >
                {p.label} <span className="text-xs opacity-60">({p.size})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Style</label>
          <div className="flex gap-3 flex-wrap">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  style === s.id
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image Prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the image you want... e.g. 'A coffee shop with warm morning light, latte art on the counter'"
            className="w-full h-28 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Generate */}
        {limitHit ? (
          <div className="rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Free limit reached</h3>
            <p className="text-gray-400 mb-4">You&apos;ve used all 3 free images today. Upgrade for unlimited generation.</p>
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition-colors">
              Upgrade to Pro — $9/month
            </button>
          </div>
        ) : (
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {image && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Generated" className="w-full" />
            </div>
            <a
              href={image}
              download={`social-${platform}-${Date.now()}.jpg`}
              className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-medium transition-colors"
            >
              Download Image
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
