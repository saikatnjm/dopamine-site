# AGENTS.md — guide for any AI/LLM working on this repo

Read this file fully before changing anything. Keep it up to date: when the
owner gives a standing instruction, add it to **Standing instructions** below
in the same change.

## What this is

**Hottogol** (হট্টগোল, "chaos") — live at https://hottogol.vercel.app — a site of short (30–120 s), funny,
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
  games/index.ts         games registry (slug, title, accent…); games/<slug>.ts = copy
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
  games/<slug>.ts        pure, seeded game rules (no DOM/React)
  games/shared.ts        seed/score share params, createBestStore(), prefersReducedMotion()
app/games/               Games index + one route per game (e.g. /games/cng-catch)
components/games/        game cards + client game components
```

## Games (reflex mini-games, separate from story experiences)

- Registry: `data/games/index.ts`; listed at `/games`, in header (🎮), footer, sitemap.
- Rules live in `lib/games/<slug>.ts` as pure functions of `(seed, roundIndex)`;
  the same seed replays identical traffic. Never `Math.random()` in gameplay.
- Challenge a Friend (shared by all games): `lib/challenge.ts` encodes
  `{game, seed, score}` as `1<code>.<seed36>.<score36>.<check>` → `/c/<token>`
  (≈18 chars). 2-letter game codes and per-game `maxScore` live in
  `CHALLENGE_GAMES` — never rename/reuse a code. The checksum only catches
  truncated/edited links (no secrets client-side; scores can be forged, so the
  UI only says "your friend scored X" — never rankings). `decodeChallenge` never
  throws; bad tokens → `app/c/[token]/not-found.tsx`. `/c/[token]` renders the
  game (code-split via next/dynamic) and has its own OG image.
  UI: `components/games/challenge-ui.tsx` — `ChallengeBanner`, `ChallengeOutcome`,
  `ShareActions` (Web Share → copy fallback + WhatsApp/Facebook/X/copy),
  `ResultStamp` (site + game on result cards for screenshots). A new game must
  add its slug to `CHALLENGE_GAMES` and to `GAMES` in `app/c/[token]/page.tsx`.
  Legacy `/games/<slug>?seed=&s=` links still work. Simulators keep their own
  result-token sharing (`/result/<token>`).
- Result title is a pure function of score (`rankFor`); never rename rank ids.
- Best score: `localStorage["hottogol:<slug>:best"]` via `useSyncExternalStore`
  (server snapshot 0, try/catch for blocked storage).
- Per-frame motion writes to the DOM from one `requestAnimationFrame` loop; React
  state changes only on events. Micro-animations use the Web Animations API
  (no extra bundle), skipped when `prefers-reduced-motion` is set. Individual
  `translate/rotate/scale` keyframes must respect Tailwind v4 utilities on the
  same element.
- Input: pointerdown (tap/click), Space/Enter (global during play), and
  keyboard/AT `click` (`detail === 0`) on the stage button.
- Analytics events: `game_start`, `game_retry`, `game_complete`, `game_share`.
- New games use `lib/games/shared.ts` (CNG Catch still has its own copies).
- Daily Hottogol (`/daily`, homepage `DailyCard`): `lib/daily.ts` derives one
  challenge per **Bangladesh date** (fixed UTC+6, no DST) → `{number, game, seed}`;
  game = `DAILY_ROTATION[dayIndex % len]` (append-only), seed = hash of the date.
  Computed client-side only (SSR renders a placeholder). The page pins its date
  so midnight never swaps a running game ("load new challenge" banner instead).
  Record per day in `localStorage["hottogol:daily:v1:<date>"]` = first/best/attempts.
  Games opt in via the `daily?: DailyMode` prop (`lib/games/shared.ts`) and must be
  registered in `DAILY_GAMES` (`components/daily/daily-play.tsx`). The 1 s clock
  lives in leaf components (`DailyCountdown`) so running games never re-render
  from it. Never show rankings or player counts — scores are local only.
- Bazar Bargain: turn-based (no rAF). `makeRun(seed)` fixes list, budget, vendor
  personality, hidden floor and opening price per stall; each reaction uses an
  RNG from (seed, stall, turn, action) so same seed + same choices = same story.
  8 endings (2 legendary, rare by design — re-run a bot sim if you tune numbers).
  Vendor quotes are Bangla in both languages with an English gloss in EN mode.
- Tea Balance: fixed-step sim; tea slosh is a damped spring driven by cart
  acceleration, hazard hits, wind. Spills past `SPILL_ANGLE`; 60 s = delivered.
  Balance was tuned with bots (`idle` ≈ 28 s; good ≈ 50–55 s, 12–25 % deliver) —
  re-run a bot sim if you change physics constants.
- Don't Tap: `roundPlan(seed, round, attempt)` gives each round's wait, decoys
  and real signal. The controller flips `data-tone` + text on the button directly
  (no React render on the hot path); "go" is applied inside a rAF and `goAt` is
  stamped right after the DOM change. Input uses native `pointerdown`/`keydown`
  listeners and `event.timeStamp` (performance.now() clock). No colour transition.
- Achievements (`/achievements`, toast via `AchievementToaster` in the root
  layout): all definitions + unlock rules live in `lib/achievements.ts`. They
  unlock from events already sent through `track()` — `onTrack()` is an
  in-browser listener that runs even when GA is blocked and sends nothing.
  So changing a game's `track("game_complete", …)` params can break a rule.
  Storage `localStorage["hottogol:achievements"] = { v: 1, unlocked, stats }`;
  bump the version + add a `migrate()` case for schema changes. `hidden: true`
  achievements show "Secret achievement" until unlocked. Never rename ids.
- Chaos Machine (`/games/chaos-machine`): `createScenario(seed)` rolls 9
  coherent ingredients (traffic follows time + weather, budget follows vehicle,
  "stay dry" only when wet, exact-change only for fare vehicles) and picks 5
  events (modifier event + 3 eligible + "last-stretch"). Event rules/effects in
  `lib/games/chaos-machine.ts`, copy (same ids) in `data/games/chaos-machine.ts`.
  10 outcomes (1 legendary), score × chaos level. Bot-tuned: random ≈ 4 %
  legendary. Uses the shared challenge/share UI and `game_complete` (with
  `outcome`) for achievements.
- Delivery Simulator (`/games/delivery-sim`, challenge code `ds`): turn-based
  rider sim. `createOrder(seed)` rolls restaurant/food/area/distance/pay/
  weather/promised time and one event per stage (7 stages: accept →
  restaurant → pickup → find → traffic → contact → deliver; `heavy-rain` only
  when raining). Choices are fixed effects or seeded gambles (`chance`,
  win/lose copy); RNG per (seed, stage, choice). 8 endings (1 legendary),
  score/earnings/chaos/★ rating are pure functions of the run. Rules in
  `lib/games/delivery-sim.ts`, copy (same ids) in `data/games/delivery-sim.ts`.
  Bot-tuned: random play ≈ 40 % late, 21 % perfect, 0.3 % legendary — re-run a
  bot sim if you change numbers. `game_complete` sends `outcome` + `rating`
  (achievements `five-star-rider`, `legendary-ending`).
- Chicken Crossing Dhaka (`/games/chicken-crossing`, challenge code `cx`):
  7-column grid, fixed-step sim. `rowPlan(seed, row, prev)` builds each row
  (footpath/divider/road, ≤ 4 roads in a row, mix + speed by level every
  `LEVEL_ROWS`); lanes created later are placed where they'd be since t = 0.
  Seeded event schedule (u-turn, bus-stop, cng-surprise, dog, rain,
  dhaka-mode from level 3). Camera creeps forward — idle ≈ 20 s = "left
  behind". Rows and vehicles are fixed DOM pools (17 / 80) moved by one rAF
  loop; the hop tween is visual only (skipped with reduced motion). Bot-tuned
  (careful bot ≈ 30 s, levels 1–3) — re-run a bot sim if you change numbers.
- Dhaka Traffic Controller (`/games/traffic-controller`, code `tc`): 4-way
  junction, left-hand traffic, one light per approach (tap / arrows / WASD,
  Space flips all). Fixed-step sim: seeded spawns (rate rises over 60 s, a
  "rush" approach moves every 12 s) and events (u-turn in the box, bus stop,
  rickshaw block, pedestrians, rain, VIP that ignores red, rush). Crossing
  rects overlapping in the box = crash; congestion ≥ 100 % for 2.5 s =
  gridlock. Flow multiplier from the exit streak (resets at ≥ 70 % or a
  6 s wait). Bot-tuned: a sensible controller survives ≈ 75 %; idle / fixed
  timer lights fail — re-run a bot sim if you change numbers.
- Queue Simulator (`/games/queue-sim`, code `qs`): turn-based, ≤ 8 rounds.
  `createQueue(seed)` rolls place, people ahead (12–18), counters (1–2) and a
  weighted event order; conditional events (`counter-closes` needs ≥ 2
  counters, `new-counter` ≤ 2) are skipped when not eligible. Each round: one
  event (fixed or gamble choice, RNG per (seed, round, choice)), then each
  counter serves 1–2 people. 6 endings (legendary `front-legend`; front after
  `CLOSING_MIN` = lunch break). Rank is `rankOf(queue, run)` (not score-only).
  Bot-tuned: random ≈ 55 % front, 19 % still waiting, 12 % gave up, 2 %
  legendary — re-run a bot sim if you change numbers.
- Programmer Rage Simulator (`/games/programmer-rage`, code `pr`): fictional
  deploy comedy (no real commands). `createIncident(seed)` rolls a hidden root
  cause, Friday (35 %), start time and 4 offered actions per turn (deploy-again
  always; rollback from turn 5). Actions add debug progress by relevance to the
  cause (`RELEVANCE`; x1.5 after the logs reveal it); ask-ai and deploy-again
  are seeded gambles (deploy chance = progress / 160, sure at 100). Seeded
  events pile on a second problem (−18) or "suddenly works". 6 endings;
  success between 02:30 and 04:30 = legendary 3 AM fix. Bot-tuned: random ≈
  4 % legendary, sensible ≈ 60 % success + 19 % legendary.
- Traffic Dodge: fixed-step sim (`STEP_MS`, 60 Hz) so traffic is identical per
  seed; each row keeps a safe lane within one lane of the previous row's; traffic
  sprites are a fixed DOM pool (24 nodes) reused by the loop — no canvas/engine.

## Result cards (shared by every game, simulator, quiz and excuse)

- One data shape: `ResultCardData` in `lib/result-card.ts` (game, emoji,
  accent, headline + label, title + emoji, rank pill, badge, blurb, stats,
  quote, path). Each experience maps its *existing* result data into it —
  never invent numbers.
- On screen: `components/share/result-card.tsx` (`ResultCard`, server- or
  client-rendered; extras like `ChallengeOutcome`, new-best and seed codes go
  in `children`). Convention: games with named endings → title = ending,
  `rank` = rank pill; score-only games → title = rank.
- Share kit: `components/share/result-share-kit.tsx` (`ResultShareKit`) =
  Share (Web Share → copy fallback) + Copy result (`resultText()`) + Save image.
  Challenge links stay in `ShareActions`; simulators keep `ResultActions`
  (now with Copy result and the canvas photo card).
- Image: `lib/result-image.ts` draws the card on a 1080×1350 canvas with the
  page's CSS colour variables and fonts (Bangla shaped by the browser), loaded
  lazily via dynamic import — no dependency, no server. OG images (Satori,
  English-only) are still used for link previews.
- Simulator mapping: `simulatorCard()` in `lib/experience/result-card-data.ts`.

## Weekly Boss (`/boss`)

- One special challenge per Bangladesh week. Pure date math (like Daily): the week key (Saturday that starts the week, UTC+6, no DST) picks the boss from `BOSS_ROTATION` (append-only, `lib/weekly-boss.ts`) and hashes to the seed. Same boss and traffic for everyone that week. No server, no global leaderboard — records live in this browser only: `localStorage["hottogol:boss:v1:<weekKey>"]` = `{boss, best, attempts, defeated}`.
- Framework: a boss is an id in `BOSS_ROTATION` + copy in `data/bosses.ts` + a component registered in `components/boss/boss-games.tsx` that implements `BossGameProps` (`components/boss/types.ts`). The shared shell (`components/boss/boss-arena.tsx`) handles intro, countdown, attempts, records, results, sharing and challenge links for every boss.
- First boss: `lib/bosses/traffic-boss.ts` (own engine, Traffic Dodge untouched): 5 lanes, 3 lives, 3 phases ramping chaos, 60-second fight. Fixed step + RNG streams from seed: same seed = same fight. Never use `Math.random()` in gameplay.
- Challenge code: "wb" (`lib/challenge.ts`), `/c/<token>` links work.
- Achievements: `boss-slayer` (defeat a weekly boss), `flawless-boss` (hidden, defeat without losing a life).
- No global leaderboard. Scores stay local.
- Bot-tuned: a careful bot defeats the boss ≈ 50 % (flawless ≈ 12 %); idle loses in ≈ 14 s — re-run a bot sim if you change density/speeds. `/games/traffic-boss` redirects to `/boss` (the games registry lists the boss so `/c/<token>` works).

## Hottogol World (`/world`, header 🗺️ + footer link)

- Discovery map. `data/world.ts` lists only ids + a zone tag per world
  (Bangladesh / Life / Arcade); titles, emoji, accents and durations come from
  the real registries (`getExperience`, `getGame`, page copy) in
  `app/world/page.tsx`. Add a node when a new activity ships.
- Progress (client, `components/world/world-map.tsx`) comes only from this
  device: achievements `stats.games` / `stats.sims`, best scores, quiz
  `found`, today's daily record. Nothing is locked (no gating system); no
  global numbers. `stats.sims` (distinct simulator slugs) was added to the
  achievements store — older stores migrate to `[]`, so sims played before
  that show as unplayed.

## Excuse Generator (`/excuses`, homepage `ExcuseCard`)

- Content (fragments with ids, credibility/chaos weights, verdicts) in
  `data/excuses.ts`; engine in `lib/excuses.ts`. Excuse = opener (category) +
  reason (category-weighted or shared) + twist + optional closer.
- Deterministic: `generateExcuse(category, seed)`; share link
  `/excuses?c=<category>&s=<seed36>` reproduces it. `?go=1` (homepage button)
  starts with a fresh one. `freshSeed()` avoids recently used fragments.
- Never reuse/rename fragment ids. Keep humor about situations, not people,
  and keep religion out of the jokes.
- Events: `excuse_generate`, `excuse_copy`, `excuse_share`.

## Dhaka Person quiz (`/dhaka-person`, homepage `DhakaPersonCard`)

- 10 questions, 4 options (a–d). Scoring in `lib/dhaka-person.ts` (pure): each
  option adds points to 8 traits; totals are normalised by each trait's max,
  result = closest profile by cosine similarity; an even spread (≥ 7 traits,
  top share ≤ 20 %) = `final-boss`. Copy (EN/BN) in `data/dhaka-person.ts`
  under the same ids. 10 results; exhaustive check of all 4¹⁰ answer sets gives
  7–14 % each — re-run it if you change effects/profiles.
- Share link `/dhaka-person?a=<letters>&r=<resultId>`; the stored result id
  wins over recomputation. Never rename/reuse question, option or result ids.
- Local record `localStorage["hottogol:dhaka-person:v1"] = { found, last }`.
- Events: `game_start`/`game_retry`/`game_share` (`game: "dhaka-person"`) and
  `quiz_complete` (`quiz`, `result`, `distinct`) → achievements
  `dhaka-certified` and hidden `identity-crisis` (3 distinct results).
- Result card says "just for fun, not science" — no claims about real people.

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
8. Analytics = GA4 only. Do NOT add Vercel Analytics (owner decision). Site will be monetized later (Vercel Hobby is
   non-commercial → move to Vercel Pro or Cloudflare before ads).
9. Always credit the creator: keep the GitHub badge (bottom-right corner) and
   the footer "Made by @saikatnjm" link to https://github.com/saikatnjm
   (`siteConfig.author`, `components/navigation/github-credit.tsx`).
10. Site URL: `NEXT_PUBLIC_SITE_URL` in Vercel; falls back to Vercel's production
    domain, never localhost, on Vercel (`lib/site.ts`).
11. Follow the core instructions in this file. Match model to task: hand
    low-level, mechanical work (renames, copy edits, file moves, simple
    lookups/checks) to a smaller/cheaper model or subagent; keep the main
    model for design, architecture and debugging.
12. The owner always tests locally first. Deliver changes to the local project
    folder and a PR for CI; never merge/push to `main` until the owner confirms.

## Phase status

- [x] Phase 1 — scaffold, design tokens, Docker dev/prod
- [x] Phase 2 — engine: types, seeded RNG, result tokens, registry, analytics
- [x] Phase 3 — Dhaka CNG Simulator content + play UI
- [x] Phase 4 — result page, result card, OG image, sharing
- [x] Phase 5 — redesign (sticker-zine palette), homepage, listing, categories, about/privacy/terms, 404/error, sitemap, robots, JSON-LD
- [x] Phase 5b — Bangla/English toggle, share panel with photo card
- [x] Phase 6 — CI (lint/build/typecheck), Docker → GHCR, README, Vercel + domain docs
- [x] Phase 7 — live audit (TTFB 63 ms, load 0.6 s, CLS 0; no overflow at 360/390/412)
- [x] Phase 8 — six more experiences: food delivery, Dhaka bus, job resignation,
      fake shopping, house rent, random life decision (all EN/BN, 11–12 endings)
- [x] Phase 9 — Games section + first game: CNG Catch (`/games/cng-catch`)
- [x] Phase 10 — second game: Dhaka Traffic Dodge (`/games/traffic-dodge`)
- [x] Phase 11 — Daily Hottogol (`/daily` + homepage card; CNG Catch / Traffic Dodge rotation)
- [x] Phase 12 — third game: Bazar Bargain (`/games/bazar-bargain`)
- [x] Phase 13 — fourth game: Tea Balance (`/games/tea-balance`)
- [x] Phase 14 — fifth game: Don't Tap (`/games/dont-tap`)
- [x] Phase 15 — Challenge a Friend: shared `/c/<token>` links + share UI for all games
- [x] Phase 16 — Achievements (local, versioned storage; 13 achievements incl. 2 secret)
- [x] Phase 17 — Chaos Machine (`/games/chaos-machine`)
- [x] Phase 18 — Excuse Generator (`/excuses` + homepage card)
- [x] Phase 19 — "What Kind of Dhaka Person Are You?" quiz (`/dhaka-person` + homepage card)
- [x] Phase 20 — Delivery Simulator (`/games/delivery-sim`)
- [x] Phase 21 — Chicken Crossing Dhaka (`/games/chicken-crossing`)
- [x] Phase 22 — Dhaka Traffic Controller (`/games/traffic-controller`)
- [x] Phase 23 — Queue Simulator (`/games/queue-sim`)
- [x] Phase 24 — Programmer Rage Simulator (`/games/programmer-rage`)
- [x] Phase 25 — Shared result cards: one card design, Copy result, canvas image download, for every experience
- [x] Phase 26 — Hottogol World discovery map (`/world`)
- [x] Phase 27 — Weekly Boss framework + 👹 Dhaka Traffic Boss (`/boss`)
- [ ] Owner: run production Docker image locally (`docker compose up --build`)
