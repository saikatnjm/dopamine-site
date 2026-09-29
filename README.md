# 🧠 Dopamine Web

**Tiny simulators for everyday chaos.** One-minute interactive experiences with
unexpected endings, made to be shared. First experience: **🛺 Dhaka CNG Simulator**.
English and Bangla. No accounts, no database, no backend server.

> Working name — the final brand and domain are still to be chosen.

---

## Contents

1. [Tech stack](#tech-stack)
2. [Architecture](#architecture)
3. [Quick start (Docker only)](#quick-start-docker-only)
4. [Environment variables](#environment-variables)
5. [Commands](#commands)
6. [Project structure](#project-structure)
7. [Adding a new experience](#adding-a-new-experience)
8. [GitHub setup, CI and GHCR](#github-setup-ci-and-ghcr)
9. [Deploying to Vercel](#deploying-to-vercel)
10. [Custom domain (Cloudflare DNS)](#custom-domain-cloudflare-dns)
11. [Analytics (GA4)](#analytics-ga4)
12. [Troubleshooting](#troubleshooting)
13. [Hosting cost](#hosting-cost)

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4, design tokens in `app/globals.css` |
| Animation | Motion 12 (`motion/react`, formerly Framer Motion) |
| Lint | ESLint 9 (flat config, `eslint-config-next`) |
| Package manager | npm (`package-lock.json` is committed) |
| Containers | Docker multi-stage image, Docker Compose |
| CI/CD | GitHub Actions, GitHub Container Registry (GHCR) |
| Hosting | Vercel (builds natively from GitHub) |
| Analytics | Google Analytics 4 (optional) |

## Architecture

```
Browser ──► Vercel (Next.js)
              ├─ pages rendered on the server (language from a cookie)
              ├─ experience data: TypeScript files in data/
              ├─ game logic: runs in the browser (seeded RNG)
              └─ /result/<token>: shareable results, no database
```

- **No database.** A result link *is* the data: `/result/1.<slug>.<seed>.<outcome>.<choices>`.
  The outcome id is stored in the link, so changing probabilities never changes an old shared result.
- **Deterministic randomness.** Same experience + choices + seed → same result on every device
  (`lib/random.ts`, `lib/experience/engine.ts`).
- **Two languages, same URLs.** The `lang` cookie picks English (default) or Bangla.
  SEO metadata and link-preview images are English.
- **Link previews / photo cards** are generated per result with `next/og` (`opengraph-image.tsx`).
- The **Docker image** is for local runs, CI and portability. Vercel does not use it.

Detailed rules for contributors and AI assistants: [`AGENTS.md`](./AGENTS.md).

## Quick start (Docker only)

Only [Docker](https://docs.docker.com/get-docker/) (with Compose v2) is required. Nothing is installed on your machine.

```bash
git clone <your-repo-url> dopamine-web && cd dopamine-web
cp .env.example .env

# Development with hot reload
docker compose up --build dev
# → http://localhost:3000

# Production image (same as CI)
docker compose up --build
# → http://localhost:3000
```

Run only one of `dev` / `app` at a time — both use port 3000.
`node_modules` and `.next` live in Docker volumes, never in your folder.

<details>
<summary>Without Docker (optional)</summary>

Requires Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local
npm run dev
```
</details>

## Environment variables

Copy `.env.example` to `.env` (Docker) or `.env.local` (plain npm). All are public, build-time values.

| Variable | Required | Example | Used for |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | `https://example.com` | Canonical URLs, sitemap, share links, OG images |
| `NEXT_PUBLIC_GA_ID` | no | `G-XXXXXXXXXX` | Google Analytics 4. Empty = analytics off |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | `hello@example.com` | Shown on About/Privacy. Empty = hidden |

- `NEXT_PUBLIC_*` values are inlined **at build time** → rebuild after changing them.
- Never put secrets in `NEXT_PUBLIC_*` variables. There are no server secrets in this project.
- Never commit `.env` / `.env.local` (already in `.gitignore`).

## Commands

| Task | Docker | npm |
| --- | --- | --- |
| Dev server | `docker compose up --build dev` | `npm run dev` |
| Lint + typecheck | `docker compose run --rm dev sh -c "npm install && npm run check"` | `npm run check` |
| Production build | `docker compose build app` | `npm run build` |
| Run production | `docker compose up --build` | `npm run build && npm start` |
| Build image only | `docker build -t dopamine-web:test .` | — |
| Stop / clean | `docker compose down` (add `-v` to drop volumes) | — |

## Project structure

```
app/                         routes (App Router)
  page.tsx                   homepage
  experiences/               listing + [slug] experience pages
  categories/[slug]/         category pages
  result/[token]/            shareable result page + photo card (opengraph-image)
  about, privacy, terms/     static-ish pages (EN + BN)
  sitemap.ts, robots.ts      SEO
  icon.svg, favicon.ico      favicons
components/
  experience/                player, cards, Surprise Me
  result/                    result card, share panel
  navigation/                header, footer, language toggle
  providers/                 Motion + language providers
  ui/                        shared styles, marquee, page shell
data/
  experiences/               one file per experience + index.ts registry
  categories.ts, upcoming.ts
lib/
  experience/                types, engine, registry, result tokens
  i18n/                      language core, dictionary, server helper
  random.ts                  seeded RNG
  analytics.ts               track() wrapper (GA4)
  sharing.ts, og.tsx, site.ts
```

## Adding a new experience

1. Create `data/experiences/<slug>.ts` exporting an `Experience` (copy `dhaka-cng.ts` as a template).
   - `steps`: `choice` (user picks) and `beat` (random moment) steps, in order.
   - `outcomes`: each with a `weight` (number or function of choices/beats).
   - Every human-readable field is bilingual: `{ en: "…", bn: "…" }`.
2. Register it in `data/experiences/index.ts`.
3. Run the checks. Bad data (duplicate/invalid ids, no outcomes) **fails the build** with a clear message.
4. Remove its teaser from `data/upcoming.ts` if there was one.

**Never rename or reuse** a slug, option id or outcome id after launch — old share links contain them.
Retire an outcome with `retired: true` instead of deleting it.

## GitHub setup, CI and GHCR

```bash
git init -b main
git add .
git commit -m "Initial commit"
# Create an empty repo on GitHub (no README), then:
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

Workflows (no extra secrets — they use the built-in `GITHUB_TOKEN`):

| Workflow | Runs on | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | every PR and push to `main` | `npm ci` → lint → build → `tsc --noEmit`; fails on any error |
| `.github/workflows/docker.yml` | PRs | builds the production image (no push) |
| | push to `main` | builds and publishes `ghcr.io/<owner>/<repo>` with tags `latest`, `main`, `sha-<short>` |

Optional repository **variables** (Settings → Secrets and variables → Actions → *Variables*):
`SITE_URL`, `GA_ID`, `CONTACT_EMAIL` — used as build values in CI and the image.

Pull the published image:

```bash
docker pull ghcr.io/<owner>/<repo>:latest
docker run -p 3000:3000 ghcr.io/<owner>/<repo>:latest
```

New GHCR packages are private by default. To make it public: GitHub → your profile → Packages → the package → Package settings → Change visibility.

Recommended: protect `main` (Settings → Branches) and require the **CI** and **Docker** checks before merging.

## Deploying to Vercel

Vercel builds from GitHub directly (it does **not** use the Docker image).

1. Sign in at [vercel.com](https://vercel.com) with GitHub → **Add New… → Project** → import the repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/output settings at their defaults.
3. **Environment Variables** (Production, and Preview if you like):
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://example.com`)
   - `NEXT_PUBLIC_GA_ID` = your GA4 ID (optional)
   - `NEXT_PUBLIC_CONTACT_EMAIL` (optional)
4. **Deploy.**

After that: every PR gets a **Preview** deployment, every push to `main` goes to **Production**.

## Custom domain (Cloudflare DNS)

Before buying, check availability and **renewal** price (not just year one), search for trademark
conflicts, and prefer `.com` if reasonably priced.

1. Buy the domain (Cloudflare Registrar sells at cost) or move its DNS to Cloudflare.
2. Vercel → Project → **Settings → Domains** → add `example.com` and `www.example.com`.
3. Vercel shows the exact DNS records to create — copy those values into **Cloudflare → DNS**.
4. In Cloudflare set those records to **DNS only** (grey cloud). Vercel handles HTTPS itself.
5. Set `NEXT_PUBLIC_SITE_URL=https://example.com` in Vercel and redeploy.
6. Test a share link in WhatsApp/Facebook — the preview should show the photo card.
   Facebook caches previews; re-scrape with the [Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Analytics (GA4)

1. Create a GA4 property and a **Web** data stream → copy the Measurement ID (`G-…`).
2. Set `NEXT_PUBLIC_GA_ID` (Vercel env var / `.env`) and redeploy.

Events sent (via `lib/analytics.ts` → `track()` only): `experience_start`, `experience_complete`,
`result_view`, `result_share` (with `method`), `experience_retry`, `surprise_me_click`.
`page_view` is automatic.

**Key metric — share rate per completed experience** = `result_share` ÷ `experience_complete`.
In GA4, mark `result_share` and `experience_complete` as key events and build an Exploration.

GA loads after the page is interactive, with ad storage denied by default (Consent Mode v2).
The site works normally if GA is empty or blocked. Before adding ads, add a certified consent
banner for EEA/UK/CH visitors and update the Privacy page.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Port 3000 already in use | Stop the other container (`docker compose down`) or change the port mapping in `docker-compose.yml` |
| `permission denied` writing `package-lock.json` in dev container | Your user ID isn't 1000. Run `docker compose run --rm --user root dev chown -R node:node /app/node_modules /app/.next` or ask to adjust the Dockerfile |
| Changes to `.env` not visible | `NEXT_PUBLIC_*` are build-time: restart `dev`, or rebuild the `app` image |
| Build fails fetching Google Fonts | The build needs internet access (fonts are downloaded and self-hosted at build time) |
| "Invalid experience data" error | Fix the listed ids/steps in `data/experiences/*` |
| Share preview shows no image | Only works on a public URL (not localhost). Re-scrape in Facebook's Sharing Debugger |
| Bangla text looks cramped | Bangla headings get extra line height via `html:lang(bn)` in `globals.css`; keep that rule |
| Stale dependencies in Docker | `docker compose down -v` then `docker compose up --build dev` |

## Hosting cost

| Service | Cost today | Notes |
| --- | --- | --- |
| GitHub + Actions | Free | Free minutes for public repos; limited minutes for private ones |
| GHCR | Free | Public packages free; private packages count against storage limits |
| Vercel Hobby | Free | **Non-commercial use only**; usage limits apply |
| Cloudflare DNS | Free | |
| Google Analytics 4 | Free | |
| Domain | ~yearly fee | Check renewal price |
| Database / backend | None | |

Limits and prices change — check the providers' current pricing pages.

- Pages are server-rendered per request (for the language toggle), which counts toward Vercel
  function usage. Normal traffic stays well within Hobby limits; if you hit a limit, check
  Vercel's usage page for the exact metric before paying for anything.
- **Before running ads or sponsorships**, move off Hobby: Vercel Pro (paid, per member) or a host
  whose free tier allows commercial use (e.g. Cloudflare), or self-host the Docker image.
