# AI Social Content design

Source of truth: `design-system/` (MASTER.md, tokens, `components/AnimatedBg.tsx`). This file only records project choices.

- Accent: `#c026d3` (magenta); palette checked with `design-system/scripts/check-palettes.mjs`.
- Hub override: Edge Config `theme_ai-social-content.design` (dials, brief, palette, `layout.bgAnimation`/`bgSpeed`) wins over these values; loaded by `lib/theme-loader.ts` and applied in `app/layout.tsx`.
- Background: `components/AnimatedBg.tsx` (hub-driven, reduced-motion safe).
- Logo: `components/Logo.tsx` (AI Social Content wordmark), used in the navbar/header; favicon is `app/icon.svg` (same mark).
- ai-core: exempt: single-shot post generation via `app/api/generate/route.ts` on the shared free-first chain; no documents, RAG or memory.
