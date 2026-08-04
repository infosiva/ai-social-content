import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #831843, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v6A2.5 2.5 0 0 1 17.5 14H10l-4.5 4v-4h-1A2.5 2.5 0 0 1 2 11.5v-6A2.5 2.5 0 0 1 4 5.5Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14.5 7.5 15.6 10l2.4 1-2.4 1-1.1 2.5L13.4 12l-2.4-1 2.4-1 1.1-2.5Z" fill="white"/>
      </svg>
    </div>
  )
}
