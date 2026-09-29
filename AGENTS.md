# AGENTS.md — guide for any AI/LLM working on this repo

Read this file fully before changing anything. Keep it up to date: when the
owner gives a standing instruction, add it to **Standing instructions** below
in the same change.

## What this is

**Dopamine Web** (working name, domain TBD): a site of short (30–120 s), funny,
shareable interactive "experiences". First experience: **Dhaka CNG Simulator**.
Core loop: curiosity → play → unexpected outcome → share link → friend plays.
Primary metric: **share rate per completed experience**.

Full product spec: the project's original instructions (Claude Project
"dopamine site"). This file is the condensed, authoritative working guide.

## Stack (resolved versions)

Next.js 16.3 (App Router) · React 19.3 · TypeScript 5.9 strict · Tailwind 4.3 ·
Motion 12 (`motion/react`, formerly Framer Motion) · ESLint 9 flat config ·
npm · Docker · GitHub Actions · GHCR · Vercel (Hobby for now) · GA4.

No database, no backend server, no auth, no paid APIs. Experience data is
TypeScript in `data/`. Business logic runs in the browser.

## Running — Docker only (owner installs nothing locally)

```bash
cp .env.example .env                                   # once
docker compose up --build dev                          # dev + hot reload → http://localhost:3000
docker compose run --rm dev sh -c "npm install && npm run check"   # lint + typecheck
docker compose up --build                              # production image → http://localhost:3000
```

Compose reads `.env` (not `.env.local`). `NEXT_PUBLIC_*` are inlined at build
time → rebuild the prod image after changing them. Never run `npm install`
on the host.

## CI/CD

- `.github/workflows/ci.yml`: npm ci → lint → build → `tsc --noEmit` on PRs and `main`.
- `.github/workflows/docker.yml`: builds the image on PRs; on `main` pushes
  `ghcr.io/<owner>/<repo>` with `latest`, `main`, `sha-<short>` (GITHUB_TOKEN only).
- Optional repo variables: `SITE_URL`, `GA_ID`, `CONTACT_EMAIL`.
- Vercel deploys from GitHub (PR → Preview, `main` → Production); it never uses the image.

## Layout

```
app/                     routes (App Router), globals.css = design tokens
components/
  providers/             MotionProvider (LazyMotion strict + reducedMotion="user")
  analytics/             GoogleAnalytics (GA4 + Consent Mode defaults)
data/
  categories.ts
  upcoming.ts            "Cooking…" teaser cards (not playable, not in sitemap)
  experiences/index.ts   registry list; one file per experience
lib/
  site.ts                siteConfig, absoluteUrl()
  random.ts              seeded RNG (FNV-1a + Mulberry32), weightedPick
  analytics.ts           track() — the ONLY analytics entry point
  sharing.ts             share-target URLs, copyText() with fallback
  og.tsx                 renderOgCard() for link previews (English only; Satori can't shape Bangla)
  experience/
    types.ts             Experience schema (single source of types)
    engine.ts            runExperience(), pickBeat(), validateExperience()
    registry.ts          getExperience(), listExperiences(), categories
    result-token.ts      encode/decodeResultToken()
```

## Engine rules

- Experience = ordered `steps` (`choice` = user picks, `beat` = seeded random
  flavour) + weighted `outcomes`. Weights may be functions of choices/beats.
- Determinism: every random decision uses its own RNG from
  `(slug, seed, decisionKey)`. **Never use `Math.random()` for gameplay.**
  `pickRandom()` (crypto) is only for UI like Surprise Me.
- Result token v1: `1.<slug>.<seed36>.<outcomeId>.<choice~choice>` at
  `/result/<token>`. The **outcome id is stored**, not recomputed, so
  changing weights never alters shared results.
- Player navigates to `/result/<token>?me=1` (own view: Share first); the
  param is stripped client-side so forwarded links show the friend view
  ("Can you do better?" first).
- **Never rename or reuse** an outcome/option id or slug once shipped. Retire
  outcomes with `retired: true`. Ids: `/^[a-z0-9-]{1,40}$/`.
- `validateExperience()` runs from the registry; bad data fails the build.

## Languages (English + Bangla)

- Same URLs for both languages. Choice lives in the `lang` cookie (1 year);
  English is the default. `getI18n()` (server, `lib/i18n/server.ts`) and
  `useI18n()` (client, `LangProvider`) give `{ lang, d }`. Reading the cookie
  makes pages dynamic (server-rendered per request) — accepted trade-off.
- UI strings: `lib/i18n/dictionary.ts` (`bn` must match every `en` key).
- Content: bilingual `Text` fields (`string | { en, bn }`) rendered with
  `t(text, lang)`. Driver quotes stay Bangla in both languages.
- SEO metadata, sitemap and OG images are English (crawlers have no cookie;
  Satori can't shape Bangla). Numbers: `num(n, lang)` for Bangla digits.
- Every new experience must ship with both `en` and `bn` copy.

## Conventions

- Server Components by default; `"use client"` only where interaction needs it.
- Animations: `m.*` components only (LazyMotion strict); CSS for simple ones.
- Design language: "sticker zine" — butter-cream dotted paper, loud candy
  accents (cng, marigold, chili, violet, sky, tangerine, lime), thick ink
  borders, offset `shadow-pop`, slight rotations. Light-only on purpose.
  Accents are backgrounds with `text-ink`; coloured text uses `*-deep`
  tokens (AA-safe). Shared class strings live in `components/ui/styles.ts`.
- Owner feedback: the site must feel fun and playful, never bland (inspired
  by the energy of foodnevercomes.com, but 100% original design and copy).
- Analytics: call `track()` from `lib/analytics.ts` only. No personal data in
  params. App must work with GA empty or blocked.
- Humor targets situations (traffic, haggling), never people or groups.
- Mobile first: design at 360–412 px, 44 px+ touch targets, no horizontal scroll.
- Code file names follow framework conventions (`page.tsx` etc.). Non-code
  notes/docs the AI creates use `YYYY-MM-DD-descriptive-name.md`.

## Standing instructions from the owner

1. Plan multi-step work first; wait for approval before executing. After each
   major step, summarize what was done and what's next.
2. Split work into tasks and show progress in the task list/sidebar.
3. Before deleting, overwriting or renaming an existing file, show what will
   change and wait for confirmation.
4. Only modify files inside this project folder.
5. At the end of a task, list all files created or modified.
6. Everything runs through Docker Compose; install nothing on the host.
7. Keep this AGENTS.md current; record every new standing instruction here.
8. Analytics = GA4. Site will be monetized later (Vercel Hobby is
   non-commercial → move to Vercel Pro or Cloudflare before ads).

## Phase status

- [x] Phase 1 — scaffold, design tokens, Docker dev/prod
- [x] Phase 2 — engine: types, seeded RNG, result tokens, registry, analytics
- [x] Phase 3 — Dhaka CNG Simulator content + play UI
- [x] Phase 4 — result page, result card, OG image, sharing
- [x] Phase 5 — redesign (sticker-zine palette), homepage, listing, categories, about/privacy/terms, 404/error, sitemap, robots, JSON-LD
- [x] Phase 5b — Bangla/English toggle, share panel with photo card
- [x] Phase 6 — CI (lint/build/typecheck), Docker → GHCR, README, Vercel + domain docs
- [ ] Phase 7 — full verification (mobile viewports, Lighthouse, Docker)
