import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { rateLimit } from '@/lib/rateLimit'
import { log } from '@/lib/log'

const CHAT_LIMITER = rateLimit({ windowMs: 3_600_000, max: 60 })
const SYSTEM = 'You are the SocialSpark assistant, a social media expert. Help with captions, hashtags, image prompt ideas and content strategy for Instagram, Twitter/X, LinkedIn and Facebook. Be creative and concise. If asked anything outside social media content, reply: "I\'m trained for SocialSpark. For that, try Google or ChatGPT!"'

// Always 200: the widget shows `text`, so failures degrade to a friendly message, never a 500.
export async function POST(req: NextRequest) {
  if (CHAT_LIMITER.check(req)) return NextResponse.json({ text: 'You have reached the hourly chat limit. Please try again later.' })
  try {
    const { messages } = await req.json()
    if (!Array.isArray(messages)) return NextResponse.json({ text: 'Ask me about captions, hashtags or post ideas.' })
    const safe = messages.slice(-12).map((m: { role?: string; content?: unknown }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content ?? '').slice(0, 1500),
    }))
    const text = await aiChat(safe as never, SYSTEM, 400, 'fast')
    return NextResponse.json({ text: text || 'Happy to help. What are you posting about?' })
  } catch (err) {
    log('error', 'chat.failed', { msg: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ text: 'I could not reach the AI just now. Please try again in a moment.' })
  }
}
