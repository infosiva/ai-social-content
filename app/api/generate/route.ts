import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, platform, style } = await req.json()

    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const apiKey = process.env.STABILITY_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'STABILITY_API_KEY not configured' }, { status: 500 })

    // Platform-based dimensions
    const dimensions: Record<string, { width: number; height: number }> = {
      instagram: { width: 1024, height: 1024 },
      twitter:   { width: 1200, height: 675 },
      linkedin:  { width: 1200, height: 627 },
      facebook:  { width: 1200, height: 630 },
    }
    const { width, height } = dimensions[platform] ?? dimensions.instagram

    const stylePrompts: Record<string, string> = {
      photorealistic: 'photorealistic, high quality photography, professional lighting',
      illustration:   'digital illustration, colorful, artistic, vector art style',
      minimalist:     'minimalist design, clean lines, simple composition, white background',
      '3d':           '3D render, modern 3D design, studio lighting, product visualization',
    }
    const styleTag = stylePrompts[style] ?? stylePrompts.photorealistic
    const fullPrompt = `${prompt}, ${styleTag}, social media post, professional quality`

    const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: (() => {
        const form = new FormData()
        form.append('prompt', fullPrompt)
        form.append('output_format', 'jpeg')
        form.append('width', String(width))
        form.append('height', String(height))
        return form
      })(),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Stability AI error: ${err.slice(0, 200)}` }, { status: res.status })
    }

    const data = await res.json() as { image: string; finish_reason: string }
    return NextResponse.json({ image: `data:image/jpeg;base64,${data.image}`, platform, style })
  } catch (e: unknown) {
    console.error('[generate]', e)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
