import type { Metadata } from "next";
import "./globals.css";
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

export const metadata: Metadata = {
  title: "AI Social Content - Generate Social Media Images",
  description: "Generate stunning social media images with AI for Instagram, Twitter, LinkedIn, and Facebook",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
