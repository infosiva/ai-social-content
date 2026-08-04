import type { Metadata } from "next";
import "./globals.css";
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import FeedbackWidget from '@/components/FeedbackWidget'
import Script from "next/script";
import { loadSiteTheme, buildThemeStyleTag } from '@/lib/theme-loader'

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-social-content.vercel.app"),
  title: "SocialSpark — AI Social Media Image Generator",
  description: "Turn a short prompt into a platform-ready image for Instagram, Twitter/X, LinkedIn, and Facebook in seconds. 3 free images daily, no signup needed.",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load theme from Edge Config (graceful no-op if unconfigured)
  const theme = await loadSiteTheme('ai-social-content')
  const themeStyle = buildThemeStyleTag(theme, {
    background: '#fafafa',
    primary: '#e11d48',
    secondary: '#f97316',
  })

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        {themeStyle && (
          <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        )}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SocialSpark",
              "url": "https://ai-social-content.vercel.app",
              "description": "AI-powered social media content and image generator for Instagram, Twitter/X, LinkedIn, and Facebook",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ai-social-content.vercel.app/generate",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <FloatingChatWrapper />
        <FeedbackWidget siteName="SocialSpark" accentColor="#e11d48" />
      </body>
    </html>
  );
}
