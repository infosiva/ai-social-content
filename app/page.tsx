'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import { MagneticButton } from '@infosiva/shared-ui/modern'

const ease = [0.23, 1, 0.32, 1] as const

// Illustrative demo: a prompt becomes a sized frame. No handles, likes or people; labelled as an example.
const DEMO = [
  { platform: 'Instagram', ratio: '1:1', aspect: '1 / 1', prompt: 'Latte art on a sunlit cafe counter, warm morning light', style: 'Photo' },
  { platform: 'Twitter / X', ratio: '16:9', aspect: '16 / 9', prompt: 'Laptop and notebook on a desk, launch day mood', style: 'Minimalist' },
  { platform: 'LinkedIn', ratio: '1.91:1', aspect: '1.91 / 1', prompt: 'Abstract growth chart in soft gradients', style: '3D Render' },
  { platform: 'Facebook', ratio: '1.91:1', aspect: '1.91 / 1', prompt: 'Spring flowers arranged on a handmade table', style: 'Illustration' },
]

const PLATFORMS = ['Instagram', 'Twitter / X', 'LinkedIn', 'Facebook']

const STEPS = [
  { n: '01', title: 'Pick a platform', body: 'Instagram, X, LinkedIn or Facebook. Sizing is handled for you.' },
  { n: '02', title: 'Describe the image', body: 'Type a short prompt and choose a visual style.' },
  { n: '03', title: 'Generate and download', body: 'A platform-ready image in seconds, ready to share.' },
]

const FEATURES = [
  { title: 'Right size, every time', body: 'Square, landscape and link-preview ratios generated for each network.' },
  { title: 'Four visual styles', body: 'Photo, illustration, minimalist or 3D render to match your brand look.' },
  { title: 'Free to try', body: '3 free images per day, no signup needed to try it.' },
]

function DemoPanel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % DEMO.length), 3200)
    return () => clearInterval(id)
  }, [])
  const d = DEMO[i]
  return (
    <div className="ds-card" style={{ padding: '1.1rem' }} aria-live="polite">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold uppercase tracking-wider text-(--ink-2)">Example</span>
        <span className="rounded-full px-2.5 py-1 font-semibold bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-(--accent-ink)">
          {d.platform} · {d.ratio}
        </span>
      </div>
      <div className="rounded-xl border border-(--line) bg-(--surface-strong) px-3.5 py-2.5 text-sm text-(--ink) mb-3 min-h-[3.2rem]">
        <span className="text-(--ink-2)">Prompt: </span>{d.prompt}
      </div>
      <div className="flex items-center justify-center rounded-xl bg-(--surface) border border-(--line) p-4" style={{ height: 200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease }}
            className="relative overflow-hidden rounded-lg max-h-full max-w-full"
            style={{
              aspectRatio: d.aspect,
              height: d.aspect === '1 / 1' ? '100%' : undefined,
              width: d.aspect === '1 / 1' ? undefined : '100%',
              background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent) 70%, var(--bg)), color-mix(in oklab, var(--accent) 25%, var(--bg)))',
            }}
          >
            <motion.span
              aria-hidden
              animate={{ x: ['-120%', '260%'] }}
              transition={{ duration: 2.2, ease: 'linear', repeat: Infinity, repeatDelay: 1.2 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            <span className="absolute bottom-2 left-3 text-[11px] font-semibold text-(--on-accent)">{d.style}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {DEMO.map((_, n) => (
          <button key={n} onClick={() => setI(n)} aria-label={`Show example ${n + 1}`} className="p-2 -m-1">
            <span className="block rounded-full transition-all duration-200" style={{ width: n === i ? 20 : 6, height: 6, background: n === i ? 'var(--accent)' : 'var(--line)' }} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen text-(--ink)">
      <header className="ds-nav sticky top-0 z-40 backdrop-blur-xl bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] border-b border-(--line)">
        <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-lg font-bold tracking-tight">Social<span className="text-(--accent-ink)">Spark</span></span>
          </Link>
          <Link href="/generate" className="ds-btn btn-press text-sm font-semibold px-4 py-2.5 rounded-xl bg-(--accent) text-(--on-accent) min-h-11 inline-flex items-center">
            Open generator
          </Link>
        </div>
      </header>

      <section className="ds-wrap mx-auto max-w-5xl px-5 pt-12 pb-16">
        <div className="ds-hero grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-(--accent-ink) bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] px-3 py-1.5 rounded-full mb-5 border border-[color-mix(in_oklab,var(--accent)_25%,transparent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-(--accent) motion-safe:animate-pulse" />
              AI image generator
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] mb-5">
              Social posts,<br /><span className="text-(--accent-ink)">designed by AI</span>
            </h1>
            <p className="text-lg text-(--ink-2) mb-7 leading-relaxed max-w-md">
              Turn a short prompt into a platform-ready image for Instagram, X, LinkedIn or Facebook.
            </p>
            <Link href="/generate" className="inline-flex mb-6">
              <MagneticButton
                tabIndex={-1}
                className="btn-press inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-2xl min-h-12 bg-(--accent) text-(--on-accent) shadow-lg shadow-[color-mix(in_oklab,var(--accent)_30%,transparent)]"
              >
                Generate your first image <span aria-hidden>→</span>
              </MagneticButton>
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-(--ink-2)">
              {PLATFORMS.map(p => (
                <span key={p} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />{p}</span>
              ))}
            </div>
            <p className="mt-4 text-xs text-(--ink-2)">3 free images per day. No signup required.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease, delay: 0.1 }} className="w-full max-w-sm mx-auto">
            <DemoPanel />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-(--line) bg-(--surface)">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">How it works</h2>
          <p className="text-center text-(--ink-2) text-sm mb-9">Three steps from prompt to platform-ready post</p>
          <div className="ds-grid grid sm:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, ease, delay: i * 0.08 }} className="ds-card relative p-6">
                <span className="text-3xl font-black text-[color-mix(in_oklab,var(--accent)_22%,transparent)] select-none absolute top-4 right-5">{s.n}</span>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-(--ink-2) leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Built for content creators</h2>
        <div className="ds-grid grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, ease, delay: i * 0.08 }} className="ds-card p-6">
              <span aria-hidden className="block h-1 w-8 rounded-full bg-(--accent) mb-4" />
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-(--ink-2) leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="rounded-3xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-(--on-accent)" style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 60%, var(--ink)))' }}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Ready to create?</h2>
            <p className="text-sm opacity-85">Free to try. No account needed.</p>
          </div>
          <Link href="/generate" className="btn-press inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-2xl min-h-12 whitespace-nowrap bg-(--bg) text-(--ink)">
            Start generating <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-(--line) py-6 text-center text-xs text-(--ink-2)">SocialSpark, AI social media image generator</footer>
    </div>
  )
}
