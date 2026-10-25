# Phase 44: My Bangladesh Map (আমার বাংলাদেশ)

**Status:** built, PR open on `feat/my-bangladesh-map` (from `main` after #35), waiting for the owner to test and merge · **Written:** 2026-10-25

**Decisions (2026-10-25):** branch from `main` (Phase 43 merged as #35) · add to Hot right now (`hot`) · static OG for v1 · one state (visited) · **Estimated size:** about 1–1.5 days

**Index:** [ideas backlog](2026-10-25-ideas-backlog.md)

## 1. Goal

Tap the districts you've visited on a map of all 64 districts. You get:

- a count (23/64);
- a funny title;
- badges;
- a 9:16 poster to post;
- a link that asks friends "how many have you been to?".

**Why now:** "Unseen Bangladesh" district maps have filled Facebook feeds since about Oct 6–7, 2026.
Hottogol's angle is speed and humour (titles, badges, friend comparison), not trip planning.
Never copy their design, name or copy.

**Success metric:** share rate per finished map (the AGENTS.md primary metric).

## 2. Before you start

- Read `AGENTS.md` fully. Follow the standing instructions: plan approval, a task list, Docker only,
  and a PR without merging.
- **Branch base:** the district map (`data/dialects/map.ts`, `DISTRICTS`, `lib/map-poster.ts`)
  comes from Phase 43 on `feat/regional-language-games`. It was **not on `main`** on 2026-10-25.
  Ask the owner whether to branch from it or wait for its merge. Suggested branch:
  `feat/my-bangladesh-map`.
- Ask the owner the **Open questions** (section 12), or use the defaults given there.

## 3. User flow

1. **`/games/my-bangladesh`**:
   - Header: "🗺️ How many of the 64 districts have you been to?" /
     "🗺️ ৬৪ জেলার কয়টায় গেছো?"
   - The map below starts empty, or restores the saved map from this device.
2. **Toggle districts.** Tap a district on the map, or a chip in the division checklist under it.
   Visited districts fill with an accent colour and pop with a Web Animations API scale, skipped
   with reduced motion.
3. **Live counter sticker:**
   - "23/64 districts · 6/8 divisions · 31% of the map"
   - BN: "২৩/৬৪ জেলা · ৬/৮ বিভাগ · ম্যাপের ৩১%"
4. **See my title** (disabled at 0) opens the result card with:
   - title + emoji + blurb;
   - up to 4 stats (districts, divisions, % of map, best badge);
   - up to 3 badges;
   - the action row (section 8).
5. **Friend view** (`?v=<code>`): a read-only map of the friend's districts plus their title.
   - "😏 Your friend has been to 23 districts. How many have you?" and a **Make my map** button.
   - If this device already has a map, also show a comparison: "You 18 · Them 23 · Both 9".
   - **Never** overwrite the visitor's own saved map with the friend's.

### Small districts on a 360 px screen

The map at ~328 px wide makes Dhaka, Narayanganj and Munshiganj ~10–25 px wide, too small to tap.
So:

- **The division checklist is the main accessible input.** It has 8 collapsible groups of district
  chips, each ≥ 44 px tall, with `aria-pressed`. The map shapes are presentational (`aria-hidden`
  paths), like `DialectMap`.
- **Optional, if cheap:** opening a division group zooms the SVG `viewBox` to that division's
  bounding box (computed from its districts' shapes), and "Show all" resets it. Skip it if it takes
  more than an hour.

## 4. Rules (pure module, no DOM/React)

`lib/games/my-bangladesh.ts`:

```ts
export const GAME_SLUG = "my-bangladesh";

/**
 * Bit order for share codes. FROZEN: never reorder, insert or remove,
 * because share links depend on it.
 * Copy the 64 ids from DISTRICTS once; a test checks it matches DISTRICTS as a set.
 */
export const DISTRICT_BIT_ORDER: readonly string[] = [/* 64 ids */];

export function encodeVisited(ids: Iterable<string>): string; // 64-bit mask → BigInt → base36 (≤ 13 chars); unknown ids ignored
export function decodeVisited(code: unknown): string[] | null; // never throws; /^[0-9a-z]{1,13}$/, value < 2^64, else null
export function titleFor(count: number): TitleId;              // pure function of count
export function badgesFor(visited: readonly string[]): BadgeId[]; // ordered by rarity, UI shows ≤ 3
export function mapStats(visited: readonly string[]): { districts: number; divisions: number; mapPercent: number };
```

- `tsconfig` targets ES2022, so `BigInt` is fine.
- `mapPercent` = sum of `DISTRICT_SHAPES[id].area` ÷ total area, rounded. Label it "of the map",
  never "of the country", because the area is projected and approximate.
- `divisions` = how many divisions have at least one visited district.

### Divisions data (new): `data/divisions.ts`

- 8 divisions, each `{ id, name: { en, bn }, districts: string[] }`.
- Ids: `dhaka, chattogram, rajshahi, khulna, barishal, sylhet, rangpur, mymensingh`. Never rename.
- Take the grouping from the division comments in `data/dialects/districts.ts`. Check it against an
  official list (Banglapedia "District" or bangladesh.gov.bd) and note the source in a comment.
- Validate at import, as `lib/dialects/validate.ts` does: every district appears in exactly one
  division, and all 64 are covered. Bad data must fail the build.

### Titles (ids are permanent; copy can change)

| Count | id | Emoji | EN title | BN title | EN blurb | BN blurb |
|---|---|---|---|---|---|---|
| 1 | `never-left` | 🏠 | Never Left Home | বাড়ির বাইরে পা রাখোনি | One district. Comfort zone: maximum. | একটাই জেলা। কমফোর্ট জোন: ফুল। |
| 2–5 | `weekend-tripper` | 🎒 | Weekend Tripper | উইকেন্ড ট্রিপার | Two days off and you're on a bus. | দুই দিনের ছুটি মানেই বাসের টিকিট। |
| 6–12 | `eid-bus-veteran` | 🚌 | Eid Bus Veteran | ঈদের বাসের যোদ্ধা | You've survived the Eid rush. More than once. | ঈদের ভিড় পার করেছো। একবার না, বহুবার। |
| 13–24 | `launch-ghat-regular` | ⛴️ | Launch Ghat Regular | লঞ্চঘাটের পুরোনো যাত্রী | Bus, launch, train. You know every counter. | বাস, লঞ্চ, ট্রেন: সব কাউন্টার তোমার চেনা। |
| 25–40 | `desh-explorer` | 🧭 | Desh Explorer | দেশ এক্সপ্লোরার | Half the map is yours. Your friends ask you for routes. | অর্ধেক ম্যাপ তোমার। বন্ধুরা রাস্তা তোমাকেই জিজ্ঞেস করে। |
| 41–63 | `walking-atlas` | 🗺️ | Walking Atlas | চলন্ত মানচিত্র | You're the map. Google Maps asks you. | তুমিই ম্যাপ। গুগল ম্যাপ তোমাকে জিজ্ঞেস করে। |
| 64 | `all-64` | 👑 | All 64. Legend. | ৬৪-তে ৬৪। কিংবদন্তি। | Every single district. Respect. | একটা জেলাও বাকি নেই। স্যালুট। |

The BN copy is a first draft. The owner may polish it.

### Badges (ids are permanent)

| id | Rule | EN | BN |
|---|---|---|---|
| `all-divisions` | ≥ 1 district in each of the 8 divisions | 🏅 All 8 divisions | 🏅 ৮ বিভাগই ছোঁয়া |
| `division-<id>` | every district of that division visited (one badge per division) | ✅ Completed {division} | ✅ {division} বিভাগ কমপ্লিট |
| `hill-tracts` | rangamati + khagrachhari + bandarban | ⛰️ Hill Tracts Trio | ⛰️ পাহাড়ের তিন জেলা |
| `dhaka-bubble` | count ≥ 3 and all inside Dhaka division | 🫧 Dhaka Division Bubble | 🫧 ঢাকা বিভাগের বাইরে যাওনি |

- Order: `all-divisions`, then completed divisions (fewest districts first), then `hill-tracts`,
  then `dhaka-bubble`.
- Tone: jokes about travelling, never about any district or its people (AGENTS.md).

## 5. Storage (this device only)

- `localStorage["hottogol:my-bangladesh:v1"]` = `{ v: 1, visited: string[], at: number }`.
- Write on every toggle. Every read and write sits in try/catch. Corrupt data reads as empty, and
  unknown ids are dropped.
- Read it with `useSyncExternalStore` (server snapshot = empty), like `createBestStore` in
  `lib/games/shared.ts`.
- No personal data. The map leaves the device only when the user shares the link.

## 6. UI components

- **`components/games/district-map.tsx`** (new): plain SVG per-district map.
  - Props: `visited: ReadonlySet<string>`, optional `compare?: ReadonlySet<string>` (both = a third
    colour), optional `onToggle?(id)`, `title`, optional `viewBox`.
  - Reuse `DISTRICT_SHAPES` / `MAP_VIEWBOX` and the ink-underlay technique from
    `components/dialects/dialect-map.tsx`.
  - Don't change `DialectMap`. It colours by region, so it's a different job.
  - Keep the **CC BY 3.0 IGO credit (`MAP_ATTRIBUTION`) visible** in the figcaption (AGENTS.md
    requires it).
- **`components/games/my-bangladesh-game.tsx`** (new, client): map, checklist, counter, result
  card, friend view.
- **Poster:** add `renderDistrictPoster()` to `lib/map-poster.ts`, or create a sibling
  `lib/district-poster.ts` reusing the helpers exported from `lib/result-image.ts`.
  - 1080×1920; brand bar; kicker "🗺️ আমার বাংলাদেশ / My Bangladesh"; the map with visited fills;
    big "23/64"; the title; badges; the footer URL; the map credit line.
  - Load it lazily and pass it via `ResultShareKit`'s `renderImage` prop.
  - Bangla is shaped by the browser canvas, which is fine.

## 7. Registry and wiring

| File | Change |
|---|---|
| `data/games/index.ts` | New `Game` entry (details below) |
| `lib/experience/types.ts` | Add `"geography"` to `ActivityTag` (Phase 46 reuses it) |
| `app/games/my-bangladesh/page.tsx` | Route: metadata, JSON-LD (WebApplication or Game), `<RelatedLinks>`, reads `?v=` (validated, never trusted) |
| `app/games/my-bangladesh/opengraph-image.tsx` | Static English OG via `renderOgCard` ("How many of the 64 districts have you been to?") |
| `lib/i18n/dictionary.ts` | UI strings (en + bn, keys must match) |
| `data/world.ts` | Node in Bangladesh World (zone "🗺️ Map / ম্যাপ") |
| `lib/moods.ts` | Add the key to a fitting mood (e.g. a nostalgic or chill one); unknown keys fail the build |
| `data/hot.ts` | Owner decision (default: add as `{ key, label: "hot" }` while the trend lasts) |

The `Game` entry:

- slug `my-bangladesh`, emoji 🗺️, accent `marigold` (or another free accent), `durationSec: 60`;
- category `travel`, mechanic `generator`, tags `["geography", "life"]`;
- title { en: "My Bangladesh Map", bn: "আমার বাংলাদেশ" };
- tagline { en: "Tap every district you've been to. Get judged.", bn: "যত জেলায় গেছো, ট্যাপ করো। তারপর রায় শোনো।" };
- seo.title "My Bangladesh Map: How Many of the 64 Districts Have You Visited?";
- seo.description: one honest sentence (free, no sign-up, poster download).

It is **not** in `CHALLENGE_GAMES`. The count is self-reported, not a score to beat, so the share is a
`?v=` link and not `/c/<token>`.

Check after adding: activities, `/bored` buckets, sitemap, related links, and that every activity
still has ≥ 3 inbound links.

## 8. Result actions (follow the AGENTS.md "Action order")

1. **Main share** (it plays the challenge role): "📤 Ask a friend: how many have you been to?" /
   "📤 বন্ধুকে জিজ্ঞেস করো: তুমি কয়টায় গেছো?". It shares `/games/my-bangladesh?v=<code>`
   (Web Share, with a copy fallback).
2. `ResultShareKit` with `primary={false}`: Copy result (`resultText()`) and Save image (the poster).
3. 🎲 Play another, and "😂 LIKED THAT?" (already part of `ResultShareKit`).

Map the result into `ResultCardData` (`lib/result-card.ts`) using only real numbers: districts,
divisions, % of map, top badge.

## 9. Analytics (`track()` only; check the GA taxonomy)

| Internal event | When | Params |
|---|---|---|
| `game_start` | first toggle in a page session | `game` |
| `game_complete` | "See my title", once per distinct count per session | `game`, `score` (= count), `result` (= title id) |
| `game_share` | main share or copy | `game`, `method` |

- These map automatically to `activity_start`, `activity_complete` and `result_share`
  (`lib/analytics-taxonomy.ts`), and they feed recent plays and Continue playing.
- Never send district ids (location history is personal data).
- Friend view open: send `game_start` only when they begin their own map.

## 10. Tests (Vitest, `tests/my-bangladesh.test.ts`)

- `DISTRICT_BIT_ORDER` has 64 unique ids, the same set as `DISTRICTS`.
- `data/divisions.ts` covers all 64 exactly once, with 8 divisions.
- encode → decode round trip for: empty, all 64, a random subset, and the first and last bit.
- `decodeVisited` returns null for: a bad charset, a too-long string, a value ≥ 2^64, and non-strings.
- `titleFor` at every boundary (1, 2, 5, 6, 12, 13, 24, 25, 40, 41, 63, 64).
- `badgesFor`: all-divisions, one completed division, hill-tracts, dhaka-bubble, and the order.
- `mapStats`: 0 % for empty, 100 % for all, divisions counted correctly.

## 11. Acceptance checklist

- [x] `docker compose run --rm dev sh -c "npm install && npm run check"` passes.
- [x] Works at 360, 390 and 412 px: no horizontal scroll, every checklist chip is ≥ 44 px.
- [x] A reload restores the map. Blocked storage still works for the session.
- [x] A `?v=` link shows the friend's map read-only. A bad code shows the normal empty page. The
      visitor's own map is never overwritten.
- [x] The poster downloads with correct Bangla and the map credit line.
- [x] EN and BN both complete. Dialect-style Bangla isn't needed here.
- [x] Listed in `/games`, the World map, the sitemap, related links and the mood picker.
- [x] AGENTS.md updated: a "My Bangladesh Map" section under Games, Phase 44 ticked, the layout
      lists new files.
- [x] This plan's Status and the backlog index updated. Branch pushed for a PR, not merged (standing
      instruction 12).

## 12. Open questions for the owner (defaults in bold)

1. Branch from `feat/regional-language-games`, or wait for its merge? **Ask; don't guess.**
2. Add it to 🔥 Hot right now while the trend lasts? **Yes.**
3. Dynamic OG image per `?v=` link (the friend's map in the preview)? **No for v1.** Satori and SVG
   paths need testing; do it later if shares take off.
4. Add a "Been there / Lived there / Want to go" 3-state toggle? **No for v1**; one state keeps it
   3-second simple.

## 13. Out of scope

Trip planning, any server or global count ("X people visited Sylhet"), upazila-level maps,
achievements (the count is self-reported, so it's not a fair unlock).
