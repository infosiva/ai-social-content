'use client'

// Animated SVG mark: speech-bubble (social) + spark (AI-generated content).
// Draws in on mount, respects prefers-reduced-motion (falls back to static fill).
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl bg-rose-600 shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v6A2.5 2.5 0 0 1 17.5 14H10l-4.5 4v-4h-1A2.5 2.5 0 0 1 2 11.5v-6A2.5 2.5 0 0 1 4 5.5Z"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="logo-bubble"
        />
        <path
          d="M14.5 7.5 15.6 10l2.4 1-2.4 1-1.1 2.5L13.4 12l-2.4-1 2.4-1 1.1-2.5Z"
          fill="white"
          className="logo-spark"
        />
      </svg>
      <style>{`
        .logo-bubble {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw-in 700ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .logo-spark {
          opacity: 0;
          transform-origin: 15px 10px;
          animation: spark-pop 350ms cubic-bezier(0.23, 1, 0.32, 1) 600ms forwards;
        }
        @keyframes draw-in {
          to { stroke-dashoffset: 0; }
        }
        @keyframes spark-pop {
          0% { opacity: 0; transform: scale(0.4); }
          100% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-bubble { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          .logo-spark { opacity: 1; animation: none; }
        }
      `}</style>
    </span>
  )
}
