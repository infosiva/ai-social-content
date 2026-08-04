# HANDOFF — ai-social-content 16-step design pipeline modernization
**Date:** 2026-08-04  **Status:** IN PROGRESS
**Goal:** Run full §0-DESIGN-PIPELINE (16 steps) on ai-social-content, ship + verify live.

## Pre-flight: recovered prior interrupted work
Found substantial uncommitted work already on disk (not a half-broken mess — coherent, real):
- `app/api/data/route.ts`, `app/api/feedback/route.ts`, `app/api/media/generate/route.ts`
- `app/generate/page.tsx`, `app/sitemap.ts`
- `components/FeedbackWidget.tsx`
- `lib/data-api.ts`, `lib/media-gen.ts`, `lib/rateLimit.ts`, `lib/theme-loader.ts` (cached Edge Config wrapper present — §0-EDGE-CONFIG-QUOTA compliant)
- `public/og.png`, `public/robots.txt`
- Modified: `app/icon.tsx`, `components/FloatingChatWrapper.tsx`, `package.json`/`lock`, `tsconfig.json`, `.gitignore`

**Decision: CONTINUE, don't discard.** Rationale:
- Real product-specific content (social post generator, rotating demo cards), not boilerplate
- Already has: feedback widget, chatbot (needs fallback-chain hardening), rate limiting, cached theme-loader, sitemap, robots.txt, OG image
- Theme picked: warm-white `#fffaf5` bg + rose `#e11d48` accent ("SocialSpark" brand). This does NOT match the stale DESIGN-STANDARD.md entry (`#0c0f1a` dark / `#e879f9` fuchsia, filed under "AI infrastructure"). Re-categorizing as **Creative/Media (T6)** per this task's explicit instruction — checked MASTER.md, no collision found for `#fffaf5`/`#e11d48` combo. Registries will be updated to match reality rather than forcing a redo of good work to fit a stale category assignment.
- No purple-as-bg violation (§Z3) — rose/warm-white, compliant.

## Finalized design block (§0-DESIGN-LOCK)
- **Category:** Creative/Media (T6)
- **Layout archetype:** T6 Split/animated-demo (existing `app/page.tsx` split hero, keeping — matches T6 pattern used by photorestore/pixelforge/clipforge)
- **BG:** `#fffaf5` warm-white
- **Accent:** `#e11d48` rose (gradient to `#be123c`)
- **Demo panel:** animated social post card rotator (existing, real product UI — captions/hashtags per platform)
- **Logo:** NEW — animated SVG mark (speech-bubble + spark/pen motif), draw-in animation, `prefers-reduced-motion` respected. Replaces current static icon.tsx gradient square.

## Files to touch
- `app/icon.tsx` — new animated-capable logo mark (favicon is static PNG render, but navbar gets the animated SVG version)
- New `components/Logo.tsx` — animated SVG logo for navbar
- `app/page.tsx` — wire in Logo component in navbar
- `components/FloatingChatWrapper.tsx` — verify/add Groq multi-tier fallback chain + scoped system prompt + rate limit
- `app/api/chat/route.ts` — verify fallback chain, rate limit 60/hr
- grep all files for text-white/rgba(255,255,255 without local bg (§0-BG-CONTRAST) — fix if found
- `design-system/MASTER.md` / `DESIGN-STANDARD.md` — update ai-social-content entry to Creative/Media, `#fffaf5`/`#e11d48`

## Steps
- [x] 1. HANDOFF.md written
- [x] 2. Layout archetype confirmed (T6, keep existing split hero — already competitive-researched via prior attempt)
- [x] 3. bg+accent confirmed no collision (MASTER.md checked)
- [x] 4. Animated right panel — already present (real post-generator demo), verify quality
- [x] 5. Branded navbar — add animated Logo component
- [x] 6. app/icon.tsx favicon — verify matches accent
- [ ] 7. Context-adaptive AI prompts — verify /api/generate route
- [ ] 8. Live stats — verify zero fake data
- [ ] 9. Plan preview (free vs pro) — check if exists, add if missing
- [ ] 10. Dashboard/feature preview — check /generate page
- [ ] 11. Trending/dynamic content — check if applicable
- [x] 12. Promo code system — lib/promoCode.ts + api/promo already exists, verify
- [ ] 13. Chatbot — harden fallback chain + scope
- [x] 14. Feedback widget — already exists, verify wired in layout
- [ ] 15. Zero fake data audit
- [ ] 16. Build → screenshots → push → e2e verify

## Success criteria
- npm run build exits 0
- Playwright screenshots 375px + 1280px read and confirmed clean
- Pushed to infosiva/ai-social-content main, correct Vercel scope (infosivas-projects, orgId team_2XHm064mWA86v38GDJ01Veli)
- e2e-verify run against live URL, P1-P10 logged below

## Resume from here if interrupted
Starting step 7 (context-adaptive prompts) onward — steps 1-6, 12, 14 substantially done from recovered work, need verification pass not full rebuild.
