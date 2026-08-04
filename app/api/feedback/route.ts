import { NextRequest, NextResponse } from 'next/server'
import { API_LIMITER } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = API_LIMITER.check(req)
  if (limited) return limited

  try {
    const { type, rating, message, email, page, site } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (botToken && chatId && process.env.TELEGRAM_NOTIFICATIONS_DISABLED !== 'true') {
      const stars = rating ? '⭐'.repeat(rating) : 'no rating'
      const text = [
        `📣 *Feedback — ${site ?? 'SocialSpark'}*`,
        `Type: ${type ?? 'other'}  |  ${stars}`,
        `Page: ${page ?? '/'}`,
        ``,
        message.trim(),
        email ? `\nReply to: ${email}` : '',
      ].filter(Boolean).join('\n')

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      }).catch(() => { /* non-fatal */ })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
}
