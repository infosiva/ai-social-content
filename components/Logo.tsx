// Speech bubble + spark. Accent-coloured via hub-switchable CSS vars.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="18" fill="var(--accent)" />
      <path d="M14 17a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5H29l-10 9v-9a5 5 0 0 1-5-5z" fill="var(--on-accent)" />
      <path d="M36 18l2.4 5.6L44 26l-5.6 2.4L36 34l-2.4-5.6L28 26l5.6-2.4z" fill="var(--accent)" />
    </svg>
  )
}
