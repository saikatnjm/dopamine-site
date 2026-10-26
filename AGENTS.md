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
docker compose run --rm dev sh -c "npm install && npm run check"   # lint + typecheck + tests + content
docker compose run --rm dev npm test                     # Vitest unit tests (tests/*.test.ts)
docker compose run --rm dev npm run validate:content     # dialect content structure report
docker compose up --build                              # production image → http://localhost:3000
```

Compose reads `.env` (not `.env.local`). `NEXT_PUBLIC_*` are inlined at build
time → rebuild the prod image after changing them. Never run `npm install`
on the host.

## CI/CD

- `.github/workflows/ci.yml`: npm ci → lint → `npm test` → `validate:content` → build → `tsc --noEmit` on PRs and `main`.
- `.github/workflows/docker.yml`: builds the image on PRs; on `main` pushes
  `ghcr.io/<owner>/<repo>` with `latest`, `main`, `sha-<short>` (GITHUB_TOKEN only).
- Optional repo variables: `SITE_URL`, `GA_ID`, `CONTACT_EMAIL`.
- Vercel deploys from GitHub (PR → Preview, `main` → Production); it never uses the image.

## Layout

```
app/                     routes (App Router), globals.css = design tokens
components/
  providers/             MotionProvider (LazyMotion strict + reducedMotion="user"),
                         wrapped only around the experience player (not the root layout)
  analytics/             GoogleAnalytics (GA4 + Consent Mode defaults)
data/
  categories.ts
  upcoming.ts            "Cooking…" teaser cards (not playable, not in sitemap)
  divisions.ts           8 divisions → 64 districts (validated at import)
  district-clues.ts      Guess the District clues (sourced; owner verifies; validated at import)
  experiences/index.ts   registry list; one file per experience
  games/index.ts         games registry (slug, title, accent…); games/<slug>.ts = copy
  dialects/              regional dialect content (districts, regions, concepts, forms/, sources, map) + README
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
    result-token.ts      decodeResultToken() (+ re-exports encode)
    result-token-encode.ts encodeResultToken() — client-safe, no registry import
  games/<slug>.ts        pure, seeded game rules (no DOM/React)
  games/shared.ts        seed/score share params, createBestStore(), prefersReducedMotion()
  dialects/              types, validate (structure only), content (validated read access)
scripts/                 content CLIs (validate-content, review-checklist), build-map.mjs + register-ts.mjs
tests/                   Vitest unit tests + fake fixtures
app/games/               Games index + one route per game (e.g. /games/cng-catch)
components/games/        game cards + client game components
```

## Games (reflex mini-games, separate from story experiences)

- Registry: `data/games/index.ts`; listed at `/games`, in header (🎮), footer, sitemap.
  A game whose `/games/<slug>` route only redirects (e.g. `traffic-boss` → `/boss`) goes in
  `GAME_HREF_OVERRIDES`: links use the real page and the sitemap skips the redirect.
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
  Legacy `/games/<slug>?seed=&s=` links still work (validated by
  `legacyChallenge()` — same seed/max-score limits as tokens).
  Challenge flow copy: sender's result shows a challenge card ("😏 I scored
  X. / You won't beat me.") above `ShareActions`; recipient's `ChallengeBanner`
  ("😏 You've been challenged. / Beat X." + ⚔️ ACCEPT CHALLENGE → `onAccept`
  = the game's own start); `ChallengeOutcome` ("YOU SCORED X." + "You cooked
  them. 💀" / tie / rematch). Banner and outcome take `game` for analytics.
  Events: `challenge_created` (result with a valid link), `challenge_opened`
  (banner shown), `challenge_started` (banner hears this game's
  `game_start`/`game_retry` via `onTrack`), `challenge_completed`
  {result: win|tie|lose, score, target}, `challenge_shared` {method} (sent
  alongside `game_share`). `challenge_won` is kept for achievements. Simulators keep their own
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
  Upgrade (Phase 38): shared `DailySummary` (homepage card + `/daily`): "🔥 TODAY'S
  HOTTOGOL · #n" → game → "Everyone gets today's same challenge." → PLAY; after a
  result "🏆 TODAY'S SCORE" (first score), best today, **personal best**
  (`hottogol:daily:best:v1` = {game: best}, updated in `recordDailyResult`), **🔥
  day streak** (≥ 2; consecutive BD days with a record, `dailyStreak`, today
  unplayed keeps it alive), "Come back tomorrow." + countdown, Share (`/daily`),
  ⚔️ Challenge a friend (`/c/<token>` of the daily round, best score), Retry.
  `DailyChallenge.type` ("game" today) — future types add a player registry in
  `daily-play.tsx`. Events: `daily_challenge_view` {surface}, `daily_challenge_start`
  (heard via `onTrack` from the daily game's `game_start`/`game_retry`),
  `daily_challenge_complete`, `daily_challenge_share` {kind: result|challenge};
  legacy `daily_complete`/`daily_share` kept (achievements).
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
- **Book Cricket** (`/games/book-cricket`, code `bk`, maxScore 200, Phase 45, plan `docs/plans/2026-10-25-phase-45-book-cricket.md`):
  - **Format:** turn-based (no rAF loop). 12 legal balls, 3 wickets; it never ends early on passing the target.
  - **Rules** (`lib/games/book-cricket.ts`):
    - Pages are seeded per delivery index (`pageFor(seed, i)`, even 2–400) and never depend on choices, so a challenge replays the same pages and target.
    - The outcome table is in the module header (0 = slog out / defend dot except x00, 2/4/6 = runs, 8 = no ball + free hit; after 6 no-balls an 8 is a dot).
    - **Teacher alert:** once per match at a seeded legal ball 4–10. HIDE within 1.2 s (Space/Enter) or the ball is a legal dot that still uses up its page index. Pressing DEFEND/SLOG on Sir's ball triggers the alert immediately, so it can't be skipped by tapping fast.
    - Ending and rank ids are permanent. Achievements: `book-legend` (40+) and hidden `golden-duck` (`game_complete.firstBallOut`).
  - **Bot-tuned (10k seeds, target 24–50):**

    | Bot | Win | Last-ball win |
    |---|---|---|
    | always-slog | 44.4 % | 6.5 % |
    | always-defend | 0 % | 0 % |
    | smart | 45.6 % | 7.7 % |
    | optimal (exact DP) | ≈ 46 % | |

    With this outcome table even perfect play beats always-slog by only 1–3 points, so the plan's "smart 55–65 %" can't be reached by tuning the target. Changing that needs an outcome-table change (owner decision). Re-run a bot sim if you change numbers.
  - Not in `DAILY_ROTATION` yet (separate, owner-approved change). In Hot right now for the SA tour.
- **Guess the District** (`/games/guess-district`, code `gd`, maxScore 10, Phase 46, plan `docs/plans/2026-10-25-phase-46-guess-the-district.md`):
  - **Round** (`lib/games/guess-district.ts`, pure): 10 questions from (verified clue pool, seed) — 4 `locate` (map with one district filled), then `shape` (outline alone, viewBox = `bboxOf(path)`), then ≤ 2 `clue`; fewer verified clues → more shapes. No answer twice; the 6 smallest districts are never shape answers. Distractors: locate = other divisions, shape = 1 of the 4 nearest + 2 random, clue = 1 same-division + 2 random. Clue pool sorted by id before picking (adding clues may change old seeds' clue picks, like `ancholik-quiz`).
  - **Daily:** seed = `hashString("hottogol:guess-district:" + bdDateKey)`, number from `EPOCH_KEY` 2026-10-26 = #1 (`lib/games/guess-district-daily.ts`, map-free so the homepage card stays light). Date pinned via `getPinnedKey` (shared with `/daily`); after midnight a "🌙 new puzzle" banner offers `repinDaily()` instead of swapping. Record `localStorage["hottogol:guess-district:v1:<date>"]` = `{ first, best, attempts, grid }` (`first` = official). Practice = `newSeed()`, never touches the record. Not in `DAILY_ROTATION` (own daily number; owner decision).
  - **No answer leaks:** question visuals use neutral `aria-label`s and `DistrictMap anonymous` (no `data-district`). `DistrictMap` gained opt-in `fills` (colour overrides) and `anonymous` props.
  - **Clues** (`data/district-clues.ts`, rules + validation `lib/district-clues.ts`): facts about places — same rule as dialects: sourced, `needs_review` on import, **only the owner sets `verified`**, scored rounds use verified only. Validation fails the build on unknown districts/sources, missing sources, duplicate ids, or a clue containing the district's EN/BN name or an old spelling (`OLD_SPELLINGS`). Review list: `npm run content:checklist` also writes `data/district-clues-review/<date>-district-clue-checklist.md`; `validate:content` checks clues too.
  - Ranks (ids permanent): lost-tourist / bus-window-expert / local-guide / human-gps / district-legend. Result shares a spoiler-free 🟩🟥 grid; `ShareActions` challenge link replays the same seed. Achievement `district-detective` (10/10). Events add `mode` (daily|practice|challenge), now in the GA allowlist (`lib/analytics-taxonomy.ts`; other games' `mode` params reach GA too). Homepage card `components/games/guess-district-card.tsx` under the Daily card.
- **My Bangladesh Map** (`/games/my-bangladesh`, Phase 44, plan `docs/plans/2026-10-25-phase-44-my-bangladesh-map.md`):
  - **What it is:** tap the districts you've been to. You get a count, a title, badges, a 9:16 poster and a `?v=` friend link. It's self-reported, so it's **not** in `CHALLENGE_GAMES` and there are no achievements.
  - **Rules** (`lib/games/my-bangladesh.ts`, pure):
    - `DISTRICT_BIT_ORDER` is **FROZEN**: never reorder, insert or remove (share links depend on it).
    - `encodeVisited`/`decodeVisited` = 64-bit mask ⇄ BigInt ⇄ base36 (≤ 13 chars); decode never throws.
    - Title ids and badge ids (`all-divisions`, `division-<id>`, `hill-tracts`, `dhaka-bubble`) are permanent. Copy lives in `data/games/my-bangladesh.ts`.
    - `mapPercent` is the share of the projected map, so say "of the map", never "of the country".
  - **Divisions:** `data/divisions.ts` holds the 8 official divisions. It's validated at import (all 64 districts, each exactly once).
  - **Storage:** `localStorage["hottogol:my-bangladesh:v1"]` = `{ v: 1, visited, at }`, with an in-memory fallback so blocked storage still works for the session. A friend link is never written to it.
  - **UI:**
    - `components/games/district-map.tsx`: a per-district SVG (same paths and ink underlay as `DialectMap`, which it doesn't change). Keep the CC BY credit visible.
    - The division checklist (chips ≥ 44 px) is the accessible input; the map shapes are presentational.
    - Poster: `lib/district-poster.ts`.
  - **Events:** `game_start` (first toggle), `game_complete` {score, result} (once per count per session), `game_share`. Never send district ids (location history is personal).
  - **Hot right now:** in `data/hot.ts` while the district-map trend lasts. Remove it when the trend fades.

## Regional language games (Phases 42–43)

The regional-language content is the main attraction; the personality test is secondary (owner decision).

- **Routes:**
  - **শব্দের মানচিত্র** `/games/word-map` (`?c=<concept>`) + `/games/word-map/[region]`
  - **তুমি কোন এলাকার মানুষ?** `/games/which-region` (`?r=<region|mystery>`)
  - **আঞ্চলিক ভাষার লড়াই** `/games/ancholik-quiz` (challenge code `aq`, maxScore 10)
  - **তুমি কোন টাইপের বাঙালি?** `/games/personality`

  All four are games-registry entries (tag `language`).
- **Data model, concept-centric** (`lib/dialects/types.ts`, `data/dialects/`):
  - `Concept` (বিড়াল, "কোথায় যাচ্ছ?") × `RegionalForm` (exact form, regions, area, script, sources, confidence, status)
  - `DialectRegion` (13, **append-only**, each lists its *main* districts; a district is in at most one region; the Chittagong Hill Tracts are in none)
  - `District` (all 64)
  - `Source`

  Validation is structural only (`lib/dialects/validate.ts`); it runs at import from `lib/dialects/content.ts`, so bad data fails the build. CLI: `npm run validate:content`. How-to: `data/dialects/README.md`.
- **Visibility (owner decision 2026-10-25):**
  - Map + detective show **source-backed** forms: verified, or `needs_review` + confidence high/medium + Bangla script from the source. They are labelled "📚 from sources, not yet checked by locals", never "verified". Low confidence, romanized or rendered forms stay hidden.
  - The scored quiz uses **verified only** (`quizPool()` builds "এই শব্দের মানে কী?" questions from verified forms; distractors are other concepts' standard words).
  - **Never invent or auto-verify dialect facts.** Only a person sets `verified`. `npm run content:checklist` writes the review list.
- **Current data:**
  - 282 forms from `resources/2026-10-25-regional-dialect-research.md` (6 research reports, 79 sources); 239 are public, 0 verified.
  - Weak areas: Cumilla (romanized sources), Old Dhaka, Bogura.
  - The viral Jessore image is **not** fully supported: মেহুর is Pabna/Faridpur/Noakhali per Shahidullah; কুহুড়ো is unsourced.
- **Map:**
  - `data/dialects/map.ts` is generated by `scripts/build-map.mjs` (geoBoundaries BGD ADM2, **CC BY 3.0 IGO — the credit line must stay visible**: map figcaption + poster footer).
  - `components/dialects/dialect-map.tsx` is plain SVG (fills per region, ink coastline underlay, HTML label pills in `foreignObject`). It renders without JS on region pages.
  - Colours and label anchors: `lib/dialects/map-layout.ts`. Faded regions use an opaque `FADED_FILL` (alpha would show the ink underlay).
  - Posters: `lib/map-poster.ts` (1080×1920 canvas, same paths via Path2D; it reuses the helpers exported from `lib/result-image.ts`). `ResultShareKit` gets a `renderImage` prop.
- **Detective** (`lib/games/which-region.ts`, pure):
  - Questions: concepts whose options cover ≥ 4 regions. Same spelling in several regions = one option, ≤ 7 options chosen by greedy region cover, plus "অন্য কিছু". 10 per round (seeded).
  - Score: a pick votes 1/|regions| for each region using it; value = votes / (chances + 1); ties → hits → REGIONS order. All "other" → mystery.
  - The share link carries only `?r=`; the result is "a guess from a few words".
- **Quiz engine** (`lib/games/ancholik-quiz.ts`):
  - seed = 24-bit shuffle · 6-bit scope (0 = mixed, i = `REGIONS[i-1]`) · 2-bit level.
  - `?district=` accepts a region id or any district (old spellings too) and maps it to its region.
  - < 5 questions → "প্রশ্ন তৈরি হচ্ছে!", with links to the map and the detective.
  - Tier ids (never rename): beginner/practice/boss/legend. The unfinished round is saved in `localStorage["hottogol:ancholik-quiz:progress:v1"]`.
- **`gameIsPlayable()`** (`lib/activities.ts`) hides a dialect game from activities, moods (moods validate keys!), the sitemap and search while it has no content; `/games` shows a "Coming soon" sticker. Region pages are indexed only with ≥ `REGION_INDEX_MIN` (8) public forms.
- **Personality** (`lib/games/personality.ts`): 8 questions, 7 traits = archetypes; level = points ÷ trait max; ties → raw points → `RESULT_IDS` order. Share link `?a=<letters>&r=<id>`.
- **Language:** dialect words and sentences stay Bangla in English mode (`lang="bn"`); English glosses come from `Concept.en`.

## Testing

- Vitest (`vitest.config.mts`, `tests/**/*.test.ts`, node env) for pure logic only.
  Fixtures in `tests/fixtures/` use obviously fake strings, never dialect claims.
- `scripts/*.ts` run with plain Node type stripping via `scripts/register-ts.mjs` (resolves
  `@/` + extensionless imports; no dependency). Only for pure modules (no JSX/enums).

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
- Action order on every result: challenge first (`ShareActions` challenge card
  + "Challenge a friend"; quiz/excuses/simulators label their main share
  button as a challenge), then `ResultShareKit` with `primary={false}` (Copy
  result + Save image) and **🎲 Play another** (`components/share/play-another.tsx`:
  random *different* activity, list from `ActivitiesProvider` in the root
  layout — slim `listActivities()` items; event `recommendation_click`
  {source: "play_another"}). Cards and images show at most `MAX_CARD_STATS`
  (4) stats; an odd last stat spans the row. Copy result keeps all stats.
- Image: `lib/result-image.ts` draws the card on a 1080×1920 (9:16, stories) canvas with the
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

## Chaos Roulette (homepage hero, next to Surprise Me)

- `lib/activities.ts` → `listActivities(lang)` builds every playable activity from the real registries (experiences, games, quiz, excuses); resolved on the server, passed as plain items. No hand-kept lists.
- `components/experience/chaos-roulette.tsx`: picks with `pickRandom` (crypto, UI-only), spins a slot window through the items (~1.5 s, decelerating), stops on the pick, shows "THE INTERNET HAS DECIDED.", then navigates. Reduced motion: no spin, instant pick. Surprise Me (`SurpriseButton`) is unchanged.

## Mood picker (homepage, after the Daily card, `#mood`)

- "What are you in the mood for?" — `lib/moods.ts` maps 6 moods to activity **keys** from `listActivities()` (no titles/routes duplicated). Unknown keys are skipped at runtime and fail the build/dev server (check in `app/page.tsx`), so a renamed slug can't ship a dead link.
- `components/experience/mood-picker.tsx`: chip row + 🎲 Surprise me; shows 3 picks (weighted random sample favouring the top of each mood list; re-rolls if the same trio repeats), "Show me 3 others" reshuffles. Entrance uses `motion-safe:animate-pop-in` only.
- Events: `mood_selection` {mood, again}, `recommendation_click` {mood, activity, position}; Surprise also sends `surprise_me_click` {source: "mood"}.

## Bored landing page (`/bored`)

- SEO landing page ("Bored?"). Sections built from `listActivities()` — every activity lands in exactly one bucket: ⚡ 30 SECONDS = games with `durationSec` ≤ 45, 😂 1 MINUTE = experiences, 🧠 5 MINUTES = everything else (quiz, excuses, longer games). 🎲 I DON'T KNOW = Chaos Roulette (`label` prop) + link to the homepage mood picker.
- Cards: `components/experience/activity-card.tsx` (server, no JS). `Activity.durationSec` comes from the registries (quiz = 90).
- Canonical/OG/Twitter metadata, CollectionPage + ItemList JSON-LD, in sitemap, footer link ("Just for fun"). Not in the header (kept uncluttered).

## You might also like (every result screen)

- "😂 LIKED THAT?" + 3 related activities: `components/share/you-might-also-like.tsx`, rendered by `ResultShareKit` (games, boss, quiz, excuses) and simulator `ResultActions`. The current activity is found by `ResultCardData.path`. Cards reuse `ActivityCard`.
- Metadata lives in the registries only: `Game.category/mechanic/tags` (`data/games/index.ts`), `Experience.tags` (+ existing `category`; mechanic = "choices"), quiz/excuses entries in `lib/activities.ts`. Moods come from `lib/moods.ts` (`moodsOf`). Tag vocabulary = `ActivityTag` in `lib/experience/types.ts` — add a tag there, not ad hoc.
- Scoring (`lib/recommend.ts`, pure): category +3, mechanic +2, shared tag +2 each, shared mood +1 each; recently played (in the 5-entry history) −5, ever finished (achievement stats) −1; small jitter. Unrelated (0) never shown; < 3 related → section hidden.
- History: shared with Continue playing — see below (`lib/recent-plays.ts`).
- Event: `recommendation_click` {source: "also_like", activity, from, position}.

## Hot right now (homepage, after the Daily card)

- **Hand-picked, not measured.** `data/hot.ts` (`HOT_RIGHT_NOW`) is the one place to change it: 3–5 `{ key, label }` with activity keys from `listActivities()`; labels `hot` ("🔥 Hot pick"), `try`, `quick`, `friend`. Unknown keys fail the dev server/build (check in `app/page.tsx`); < 3 valid → hidden.
- `components/experience/hot-right-now.tsx`: server component, reuses `ActivityCard` + a label sticker; no client JS.
- Never show popularity numbers or say "popular"/"trending" unless real analytics data backs it (owner decision).

## Guide pages (SEO content/discovery)

- Routes: `/funny-websites`, `/games-to-play-when-bored`, `/one-minute-games`, `/random-things-to-do-online`, `/funny-online-games` — each a 5-line `page.tsx` calling `GuidePage` + `guideMetadata` (`components/guides/guide-page.tsx`). No root catch-all route.
- Content: `data/guides.ts` (EN + BN; SEO title/description English): H1, intro, 5–7 curated activity keys each with a page-specific "why", related keys, links to other guides/pages, optional FAQ. Names, emoji, routes, durations and taglines come from `listActivities()` (`Activity.tagline` = registry tagline / quiz & excuse `lead`).
- `lib/guides.ts` validates at build/dev: unknown keys, 5–7 picks, related ≠ picks, valid guide links, and **no paragraph (intro, why, FAQ answer) may appear on two pages**.
- Each page has a distinct angle (games only / by length / simulators & generator / variety / story endings) so they don't compete; `/bored` stays the time-based landing page.
- SEO: canonical, OG/Twitter, CollectionPage + ItemList, BreadcrumbList (+ visible breadcrumb), FAQPage only when the guide has an FAQ; in sitemap; footer group "Lists"; linked from `/bored`.
- Rules: no thin/spun pages — a new guide needs genuinely different picks and hand-written copy. Only claim what the activity actually does.

## Internal links (`<RelatedLinks>`, every activity + content page)

- Server-rendered, deterministic (crawlable) "keep playing" sections under each activity page: `components/related/related-links.tsx`; logic `lib/related.ts`. Client-side, personalised "LIKED THAT?" on result screens is separate.
- Sections: Related games · Related simulators · More from {category} · You might also like · More things to do when bored (`/bored` + 2 fitting guides via `boredGuidesFor`).
- Standard plans (`activityPagePlan`): game → games 3 + sims 2; simulator → category 3 + sims 2 + games 2; quiz/tool → also-like 3. Max 5 activity links per page; each activity at most once per page, never the page itself; a section with < 2 items is dropped.
- Ranking: summed `relatedness()` to the page's anchors, hub-damped (÷ √(degree/avg)) so widely related activities don't top every page, plus a per-page hashed jitter so near-ties rotate.
- Wired into: 11 game pages, `/boss`, `/experiences/[slug]`, `/dhaka-person`, `/excuses`, `/daily` (quick reflex games), `/categories/[slug]` (games in that category), guide pages (related games for the picks, excluding listed ones).
- Every activity gets ≥ 3 inbound links site-wide (re-check after adding activities).

## Continue playing (homepage, under the hero) + play history

- `localStorage["hottogol:recent:v2"]` = `[{ key, at, done, score? }]` newest first, **max 5**, entries > 14 days dropped (`lib/recent-plays.ts`). key = activity key; done = finished vs started; score only when `game_complete` reports one. No personal data. v1 (completions only) is read once as a fallback.
- Filled by `RecentPlaysRecorder` (root layout) from existing events via `onTrack`: `game_start`/`game_retry`/`game_complete` (`game: "dhaka-person"` → `p:dhaka-person`), `experience_start`/`experience_complete`, `quiz_complete`, `excuse_generate`. Every read/write is try/catch; corrupt data reads as [].
- `components/experience/continue-playing.tsx`: client-only (`useSyncExternalStore`, null on the server), renders nothing without history → no clutter for new visitors. Up to 3 `ActivityCard`s + status line ("✅ Finished · last score … · 2 hours ago"), CONTINUE → most recent, ✕ dismiss (`hottogol:continue:dismissed` = time; shows again after a newer play). Entries for removed activities are skipped. Clicks: `recommendation_click` {source: "continue"}.

## Social landing page (`/viral`)

- For TikTok / Reels / Shorts / Facebook / X traffic. Hero "YOU SAW THE VIDEO." / "Now try it yourself. 😏", one featured activity with ▶ PLAY NOW, then the rest as `ActivityCard`s, Surprise me (Chaos Roulette) and links to `/bored` + 2 guides. Server-rendered; one tiny client island.
- Picks: `data/viral.ts` (`VIRAL_PICKS`, activity keys; unknown keys fail dev/build via `lib/viral.ts`). No counts or popularity claims.
- Deep link: `/viral?play=<slug>` (any registered game/simulator/quiz/tool slug) features that activity ("🎬 The one from the video"); garbage is ignored. Canonical `/viral`; **noindex, follow** (owner decision); not in the sitemap.
- OG image: `app/viral/opengraph-image.tsx` (shared `renderOgCard`).
- Tracking (`components/viral/viral-tracker.tsx`): `viral_landing_view` {utm_source, utm_medium, utm_campaign, utm_content (sanitized `[a-z0-9_-]`, ≤ 40), featured, deep_link}; play clicks → `recommendation_click` {source: "viral", utm_source}. **Nothing stored** (no cookies/localStorage/sessionStorage); GA4 reads utm_* from the URL itself.

## UI experiments (`lib/experiments.ts`)

- **UI experimentation only.** Assignment is per browser (client-side), so numbers are rough signals — never report them as statistically significant A/B results.
- `localStorage["hottogol:exp:v1"]` = `{ [experimentId]: variant }`; first visit gets a uniform crypto-random variant, returning visitors keep it; blocked storage → per-page-load assignment. No personal data.
- Running: **`home-cta`** — homepage hero primary CTA (`HomeCtaExperiment` wraps `SurpriseButton`): A "🎲 SURPRISE ME", B "🔥 GIVE ME SOMETHING FUN". Label hidden until the variant is read (no visible swap). Events `homepage_cta_view` / `homepage_cta_click` {experiment, variant}; GA user property `exp_home_cta` (via `setUserProperty`) so later events like `activity_start` carry the variant. The closing "Surprise me" CTA is not part of the test.
- **Remove `home-cta`:** in `app/page.tsx` swap `<HomeCtaExperiment …/>` back to `<SurpriseButton …/>`; delete `components/experience/home-cta-experiment.tsx`, the `home-cta` entry in `EXPERIMENTS`, `homepage_cta_*` in `lib/analytics.ts` + `lib/analytics-taxonomy.ts`, and `expCtaA/B` in the dictionary. (`SurpriseButton`'s optional `label/icon/labelHidden/onRoll` props can stay.)

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
  Motion is only loaded where `<MotionProvider>` wraps it (currently the
  experience player); prefer CSS (`animate-pop-in` etc.) for toasts/entrances.
- Bundle: experience data is code-split per experience
  (`components/experience/experience-players.tsx`); heavy game components
  rendered conditionally are loaded with `next/dynamic`.
- Design language: "sticker zine" — butter-cream dotted paper, loud candy
  accents (cng, marigold, chili, violet, sky, tangerine, lime), thick ink
  borders, offset `shadow-pop`, slight rotations. Light-only on purpose.
  Accents are backgrounds with `text-ink`; coloured text uses `*-deep`
  tokens (AA-safe). Shared class strings live in `components/ui/styles.ts`.
- Owner feedback: the site must feel fun and playful, never bland (inspired
  by the energy of foodnevercomes.com, but 100% original design and copy).
- Analytics: call `track()` from `lib/analytics.ts` only. No personal data in
  params. App must work with GA empty or blocked. GA4 is the only provider.
  **Taxonomy (Phase 40):** call sites keep their internal events (local
  `onTrack` listeners — achievements, recent plays, daily, challenge banner —
  depend on them); `lib/analytics-taxonomy.ts` `normalizeEvent()` maps them at
  the GA boundary to: page_view (GA auto), activity_view (`ActivityViewTracker`
  in the root layout), activity_start/complete/retry, result_view/share,
  challenge_created/opened/started/completed/shared,
  daily_challenge_view/start/complete, recommendation_click, surprise_me_click,
  mood_selection. Not sent to GA (duplicates): daily_complete, daily_share,
  challenge_won, daily_challenge_share{kind:challenge}, viral_landing_view.
  Every GA event gets `activity` (key), `activity_type`, `category` (catalog
  set by `ActivitiesProvider`); other params pass an allowlist (result, score,
  method, context, source, mood, position, surface, day, attempt, target, best,
  viewer, utm_source, referrer host, from, again, retry), strings cleaned to
  `[a-z0-9_:./-]` ≤ 40. Unknown events/params are dropped. GA4 timestamps
  events itself. A new event must be added to the taxonomy or it never
  reaches GA.
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
13. Ideas and builds happen in separate chats. Idea chats write a detailed,
    self-contained plan per feature to `docs/plans/YYYY-MM-DD-phase-NN-<name>.md`
    and list it in `docs/plans/2026-10-25-ideas-backlog.md` (index + idea pool).
    Build chats implement from that plan, ask its open questions first, and
    update the plan's Status line + the backlog index when starting and shipping.

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
- [x] Phase 28 — Chaos Roulette (homepage)
- [x] Phase 29 — "What are you in the mood for?" mood picker (homepage)
- [x] Phase 30 — `/bored` landing page
- [x] Phase 31 — Challenge a Friend upgrade (challenge card, accept button, "you cooked them" outcome, challenge_* events)
- [x] Phase 32 — Result cards: 9:16 share image, ≤ 4 stats, challenge-first actions, 🎲 Play another everywhere
- [x] Phase 33 — "You might also like" (registry category/mechanic/tags, local recent-play history)
- [x] Phase 34 — 🔥 Hot right now (curated, `data/hot.ts`)
- [x] Phase 35 — SEO guide pages (5 hand-written guides, shared template, validation)
- [x] Phase 36 — Internal linking (`<RelatedLinks>` on every activity + content page)
- [x] Phase 37 — Continue playing (local play history v2: starts, finishes, latest score)
- [x] Phase 38 — Daily Challenge upgrade (today's score, personal best, streak, challenge a friend, daily_challenge_* events)
- [x] Phase 39 — `/viral` social landing page (deep links, OG image, UTM tracking without storage)
- [x] Phase 40 — Analytics taxonomy (normalised GA events, param allowlist, activity_view)
- [x] Phase 41 — Client-side UI experiment system + `home-cta` test
- [x] Phase 42 — Regional language games: আঞ্চলিক ভাষার লড়াই quiz engine, তুমি কোন টাইপের বাঙালি?, dialect content layer + validation, Vitest
- [x] Phase 43 — Concept × region dialect model, researched content (282 sourced forms), শব্দের মানচিত্র + region pages, তুমি কোন এলাকার মানুষ? detective, map posters
- [x] Phase 44 — My Bangladesh Map (`/games/my-bangladesh`): districts-visited map, titles, badges, poster, `?v=` friend compare (`docs/plans/2026-10-25-phase-44-my-bangladesh-map.md`)
- [x] Phase 45 — Book Cricket (`/games/book-cricket`): page-flip cricket, defend/slog, teacher alert, `bk` challenges (`docs/plans/2026-10-25-phase-45-book-cricket.md`)
- [x] Phase 46 — Guess the District (`/games/guess-district`): daily + practice district quiz (map, shape, clue), spoiler-free grid, `gd` challenges, homepage card (`docs/plans/2026-10-25-phase-46-guess-the-district.md`)
- [ ] Owner: review district clues (`npm run content:checklist` → `data/district-clues-review/`) → verify/reject → verified clues join rounds
- [ ] Owner: review dialect forms (`npm run content:checklist`) → verify/reject → verified forms unlock the scored quiz
- [ ] Owner: run production Docker image locally (`docker compose up --build`)
