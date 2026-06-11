'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ease = [0.23, 1, 0.32, 1] as const

// Animated social post cards for the right panel
const MOCK_POSTS = [
  {
    platform: 'Instagram',
    handle: '@brew.mornings',
    avatar: 'B',
    avatarBg: '#f97316',
    time: '2m ago',
    text: 'Golden hour at the corner café ☀️ Nothing beats that first sip.',
    tags: '#MorningVibes #CoffeeLover #InstaDaily',
    likes: '1.2k',
    color: 'from-orange-100 to-amber-50',
    accent: '#f97316',
  },
  {
    platform: 'Twitter / X',
    handle: '@designdrop',
    avatar: 'D',
    avatarBg: '#0ea5e9',
    time: '5m ago',
    text: 'Just shipped a new feature ✨ Built the whole campaign asset pack in under 3 minutes with AI.',
    tags: '#BuildInPublic #Design #AITools',
    likes: '847',
    color: 'from-sky-100 to-blue-50',
    accent: '#0ea5e9',
  },
  {
    platform: 'LinkedIn',
    handle: 'Maya Chen · Founder',
    avatar: 'M',
    avatarBg: '#6366f1',
    time: '12m ago',
    text: "After 6 months of building, we finally hit our first 1,000 users milestone. Here's what I learned:",
    tags: '#StartupLife #Entrepreneurship #GrowthMindset',
    likes: '3.4k',
    color: 'from-indigo-100 to-violet-50',
    accent: '#6366f1',
  },
  {
    platform: 'Facebook',
    handle: 'Bloom Studio',
    avatar: 'F',
    avatarBg: '#e11d48',
    time: '20m ago',
    text: 'Spring collection launch is LIVE 🌸 Every piece handcrafted with love. Link in bio!',
    tags: '#SpringCollection #Handmade #ShopLocal',
    likes: '2.1k',
    color: 'from-rose-100 to-pink-50',
    accent: '#e11d48',
  },
]

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitter',   label: 'Twitter / X' },
  { id: 'linkedin',  label: 'LinkedIn' },
  { id: 'facebook',  label: 'Facebook' },
]

const STEPS = [
  { n: '01', title: 'Pick a platform', body: 'Instagram, X, LinkedIn or Facebook — sizing handled automatically.' },
  { n: '02', title: 'Describe the image', body: 'Type a short prompt and choose a visual style.' },
  { n: '03', title: 'Generate & download', body: 'Platform-ready image in seconds, download and share immediately.' },
]

const FEATURES = [
  { icon: '◆', title: 'Perfect sizing, every time', body: 'Square, landscape, and link-preview ratios generated for every major network automatically.' },
  { icon: '◈', title: '4 distinct visual styles', body: 'Photorealistic, illustration, minimalist or 3D render — match your brand look precisely.' },
  { icon: '◉', title: 'Free to start', body: '3 free images every day with zero signup required to try it out.' },
]

function SocialPostCard({ post, index }: { post: typeof MOCK_POSTS[0]; index: number }) {
  return (
    <motion.div
      key={post.platform}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.97 }}
      transition={{ duration: 0.35, ease }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
        {/* Colored image area */}
        <div className={`bg-gradient-to-br ${post.color} flex-1 flex items-center justify-center min-h-[140px] relative overflow-hidden`}>
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 2.4, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
          <span className="text-4xl select-none">
            {index === 0 ? '☀️' : index === 1 ? '✨' : index === 2 ? '🚀' : '🌸'}
          </span>
        </div>

        {/* Post meta */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 rounded-full items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: post.avatarBg }}
            >
              {post.avatar}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-800 truncate">{post.handle}</p>
              <p className="text-[10px] text-stone-400">{post.platform} · {post.time}</p>
            </div>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed line-clamp-2">{post.text}</p>
          <p className="text-[10px] font-medium" style={{ color: post.avatarBg }}>{post.tags}</p>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[10px] text-stone-400">♥ {post.likes} likes</span>
            <span className="text-[10px] text-stone-400">↗ Share</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AnimatedPostPanel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % MOCK_POSTS.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative" style={{ height: 360 }}>
      {/* Progress dots */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {MOCK_POSTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="transition-all duration-200"
            aria-label={`Show post ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-200"
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                backgroundColor: i === index ? '#e11d48' : '#d1d5db',
              }}
            />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <SocialPostCard
          key={index}
          post={MOCK_POSTS[index]}
          index={index}
        />
      </AnimatePresence>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white font-black text-sm select-none">
              S
            </span>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              Social<span className="text-rose-600">Spark</span>
            </span>
          </div>
          <Link
            href="/generate"
            className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150 active:scale-[0.97]"
          >
            Open generator →
          </Link>
        </div>
      </header>

      {/* Hero — split layout */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full mb-5 border border-rose-100">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            AI image generator
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] mb-5 text-stone-900">
            Social posts,<br />
            <span className="text-rose-600">designed by AI</span>
          </h1>

          <p className="text-lg text-stone-500 mb-8 leading-relaxed max-w-md">
            Turn a short prompt into a platform-ready image for Instagram, X, LinkedIn or Facebook in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors duration-150 active:scale-[0.97] shadow-sm shadow-rose-200/60"
            >
              Generate your first image
              <span className="text-rose-200">→</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-400">
            {PLATFORMS.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                {p.label}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-stone-400">3 free images/day · No signup required</p>
        </motion.div>

        {/* Right: animated social post cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease, delay: 0.1 }}
          className="flex flex-col items-center justify-center pb-8"
        >
          {/* Card header row */}
          <div className="w-full max-w-sm mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Live preview</span>
            <span className="flex gap-1">
              {MOCK_POSTS.map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-stone-300" />
              ))}
            </span>
          </div>

          <div className="w-full max-w-sm">
            <AnimatedPostPanel />
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">How it works</h2>
          <p className="text-center text-stone-500 text-sm mb-10">Three steps from prompt to platform-ready post</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease, delay: i * 0.08 }}
                className="relative rounded-2xl border border-stone-200 bg-[#fafafa] p-6"
              >
                <span className="text-3xl font-black text-stone-100 select-none absolute top-4 right-5">{s.n}</span>
                <h3 className="font-semibold mb-2 text-stone-900">{s.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold tracking-tight mb-10 text-center">Built for content creators</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease, delay: i * 0.08 }}
              className="rounded-2xl bg-white border border-stone-200 p-6 hover:border-rose-200 hover:shadow-sm transition-shadow duration-200"
            >
              <span className="text-2xl text-rose-400 mb-3 block">{f.icon}</span>
              <h3 className="font-semibold mb-1.5 text-stone-900">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-3xl bg-stone-900 px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Ready to create?</h2>
            <p className="text-stone-400 text-sm">Free to try — no account needed.</p>
          </div>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-7 py-3.5 rounded-2xl transition-colors duration-150 active:scale-[0.97] whitespace-nowrap"
          >
            Start generating →
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-400">
        SocialSpark — AI social media image generator · No fake stats, no gimmicks
      </footer>
    </div>
  )
}
