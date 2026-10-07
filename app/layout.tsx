import type { Metadata } from "next";
import "./globals.css";
import { AnimatedBg } from '@/components/AnimatedBg'
import Telemetry from '@/components/Telemetry'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import FeedbackWidget from '@/components/FeedbackWidget'
import Script from "next/script";
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet, isValidGa4Id } from '@/lib/theme-loader'

import { MotionProvider } from "@infosiva/shared-ui/modern";
// Hub theme is cached 600s in the loader; re-render on the same cadence.
export const revalidate = 600
const SITE_ID = 'ai-social-content'
const DEFAULT_ARCHETYPE = 'weekend-lifestyle'

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-social-content.vercel.app"),
  title: "SocialSpark — AI Social Media Image Generator",
  description: "Turn a short prompt into a platform-ready image for Instagram, Twitter/X, LinkedIn, and Facebook in seconds. 3 free images daily, no signup needed.",
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.svg' },
  keywords: ["social media content generator", "AI image generator", "Instagram posts", "content creation", "social media tool"],
  openGraph: {
    title: "SocialSpark — AI Social Media Image Generator",
    description: "Turn a short prompt into a platform-ready social media image in seconds. Free to try.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SocialSpark — AI Social Media Image Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialSpark — AI Social Media Image Generator",
    description: "Turn a short prompt into a platform-ready social media image in seconds. Free to try.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await loadSiteTheme(SITE_ID)
  const ga4 = theme?.analytics?.ga4Id
  return (
    <html lang="en" data-layout={theme?.layout?.archetype ?? DEFAULT_ARCHETYPE}>
      <head>
        <style id="hub-theme" dangerouslySetInnerHTML={{ __html: buildThemeStyleTag(theme) }} />
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176" crossOrigin="anonymous" strategy="afterInteractive" />
        {isValidGa4Id(ga4) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: buildGa4Snippet(theme) }} />
          </>
        )}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SocialSpark',
              url: 'https://ai-social-content.vercel.app',
              description: 'AI-powered social media image generator for Instagram, Twitter/X, LinkedIn, and Facebook',
            }),
          }}
        />
      </head>
      <body>
        <AnimatedBg theme={theme} fallback="aurora" />
        <MotionProvider>{children}</MotionProvider>
        <FloatingChatWrapper />
        <FeedbackWidget siteName="SocialSpark" accentColor="var(--accent)" />
        <Telemetry />
      </body>
    </html>
  )
}
