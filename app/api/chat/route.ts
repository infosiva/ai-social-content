import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { AI_LIMITER } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited
  try {
    const { messages, system } = await req.json()
    const systemPrompt = system ?? 'You are SocialContent AI — a social media expert. Help users write better captions, hashtags, ad copy, and content strategies for Instagram, Twitter, LinkedIn. Be creative and concise.'
    const text = await aiChat(messages, systemPrompt, 400, 'fast')
    return NextResponse.json({ text: text || 'Happy to help!' })
  } catch (err) {
    console.error('[ai-social-content][chat]', err)
    return NextResponse.json({ text: 'Try again in a moment!' }, { status: 200 })
  }
}
