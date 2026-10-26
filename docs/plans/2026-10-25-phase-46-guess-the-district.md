# Phase 46: Guess the District (কোন জেলা?)

**Status:** shipped (#38) · **Written:** 2026-10-25

**Decisions (2026-10-26):** owner verifies clues (checklist) · clue research now, in parallel (imported as `needs_review`) · homepage card under the Daily card · not in `DAILY_ROTATION` · `mode` goes to GA · **Estimated size:** about 2 days for code, plus a
separate content research and review step

**Index:** [ideas backlog](2026-10-25-ideas-backlog.md)

## 1. Goal

A 10-question district quiz with:

- one shared **daily puzzle** (#n, the same for everyone that Bangladesh day);
- unlimited **practice rounds**;
- a Wordle-style result grid (`🟩🟩🟥🟩…`) that shares without spoiling answers;
- challenge links.

**Why:** it rides the same "districts of Bangladesh" Facebook trend as Phase 44, and the daily
number brings people back. Phase 44 (My Bangladesh Map) should link to it: "Think you know the
map? → Guess the District".

**Safety rule:** shape and map questions use geometry only, so they need no fact-checking. Clue
questions (food, landmarks) are **facts about places**. They follow the same "never invent, a
person verifies" rule as the dialect content (`data/dialects/README.md`).

## 2. Before you start

- Read `AGENTS.md`, `data/dialects/README.md` (how sourced and reviewed content works here) and the
  Phase 44 plan.
- **Dependencies:**
  - The district map from Phase 43 (`data/dialects/map.ts`).
  - Ideally Phase 44's `DISTRICT_BIT_ORDER`, `data/divisions.ts`, `components/games/district-map.tsx`
    and the `"geography"` tag. If Phase 44 hasn't shipped, build those pieces here exactly as the
    Phase 44 plan describes, so Phase 44 can reuse them.
- Suggested branch: `game/guess-district`.
- Ask the owner the **Open questions** (section 12).

## 3. Question types

| Type | Shows | Needs content? | Difficulty |
|---|---|---|---|
| `locate` | The full Bangladesh map with one district filled in an accent colour | No | Easy |
| `shape` | The district's outline alone, scaled to fill the frame (a silhouette sticker) | No | Medium–hard |
| `clue` | A verified text clue, e.g. "Famous for its doi (yogurt). Which district?" | **Yes**, `verified` only | Medium |

Every question has **4 options** (district names, EN or BN by language) and one correct answer.

### Round composition (10 questions, pure function of `(pool, seed)`)

- **Default mix:** 4 `locate`, 4 `shape`, 2 `clue`. If fewer than 2 verified clues are available,
  fill with `shape`.
- **Order:** locate, then shape, then clue (it gets harder).
- No district is the answer twice in a round.
- **Distractors:** seeded, from `rng(seed, "opts", i)`.
  - `locate`: 3 random districts from **other** divisions (easy).
  - `shape`: 1 of the 4 nearest districts by centroid (`DISTRICT_SHAPES[id].cx/cy`), plus 2 random.
  - `clue`: 1 same-division district, plus 2 random.
- **Shape answers:** skip districts whose shape is too small to read (use `area` below a tuned
  threshold, e.g. the smallest 6), or allow them only as distractors.
- **Option order:** seeded shuffle.

### Silhouette bounding box

`shape` needs each district's bounding box. Add a tiny path parser in the pure module:

- It handles the commands that actually appear in `data/dialects/map.ts`. Check the generator
  `scripts/build-map.mjs`: M/m, L/l, H/h, V/v, Z/z, plus C/c if present, using control points as a
  safe over-estimate.
- It returns `{ x, y, w, h }`.
- A test checks every one of the 64 districts parses, its bbox sits inside `MAP_VIEWBOX`, and
  `(cx, cy)` lies inside its bbox.

Don't edit the generated `map.ts` or the generator. That would overwrite a file and needs the
owner's approval.

**No-cheat rule:** a silhouette or highlighted map must not carry the answer in `aria-label`,
`title` or the DOM. Use a neutral label like "District shape, question 3".

## 4. Daily puzzle and practice

- **Daily seed:** `hashString("hottogol:guess-district:" + bdDateKey(now))`.
  - The puzzle number counts days since an epoch. The default epoch is the ship date, so the first
    day is #1.
  - Reuse `bdDateKey`, `msUntilNextDay` and `formatCountdown` from `lib/daily.ts`.
  - Pin the date when the page loads, like `/daily`, so midnight never swaps a running round.
- **Daily record:** `localStorage["hottogol:guess-district:v1:<dateKey>"]` =
  `{ first, best, attempts, grid }`.
  - `first` is the official score and `grid` the first attempt's 🟩/🟥 string.
  - After a finished daily, the card shows "Today: 8/10 · next puzzle in 05:12:09" and offers
    **Practice round**.
- **Practice:** `newSeed()` from `lib/random.ts`. Doesn't touch the daily record.
- **Best:** `createBestStore("hottogol:guess-district:best")`. Read and write everything in
  try/catch.
- **Seed vs content:** the same seed with a bigger verified clue pool may pick different clue
  questions. That's acceptable, the same caveat as `ancholik-quiz`. Write it in the module header.
  Sort the clue pool by id before any seeded pick, so only additions change it.

## 5. Content: district clues (research step, can run in parallel with the code)

New file `data/district-clues.ts`, with types in the same file or in `lib/district-clues.ts`:

```ts
type DistrictClue = {
  id: string;            // `<district>-<kind>[-n]`, /^[a-z0-9-]{1,60}$/, never rename or reuse
  district: string;      // district id from DISTRICTS
  kind: "food" | "product" | "landmark" | "nature" | "nickname";
  clue: { en: string; bn: string };    // must NOT contain the district's name
  reveal?: { en: string; bn: string }; // one short fun line shown after answering
  sources: readonly string[];          // Source ids (reuse the Source type from lib/dialects/types.ts)
  confidence: "high" | "medium" | "low";
  status: "draft" | "needs_review" | "verified" | "rejected";
};
```

- **Rules:**
  - Never invent a clue. Every clue cites a source the researcher actually opened: Banglapedia,
    the district's government portal (`<district>.gov.bd`, sections like "জেলার ঐতিহ্য" or
    "এক নজরে"), or a national newspaper.
  - New entries are `needs_review`. **Only the owner (a person) sets `verified`.** Code never does.
- **Visibility:** scored rounds use `verified` only. Nothing else is shown.
- **Validation** at import, like `lib/dialects/validate.ts`. Bad data fails the build:
  - unique ids;
  - the district exists;
  - at least one source, and every source id exists;
  - the clue text doesn't contain the district's EN or BN name (case-insensitive) or its common old
    spellings (e.g. Chittagong, Comilla, Jessore, Barisal, Bogra).
- **Review list:** extend `npm run content:checklist` (`scripts/review-checklist.ts`) or add a
  sibling script, so the owner gets a checklist of `needs_review` clues to approve.
- **Research goal:** about 1 clue for at least 40 districts. Ship v1 with whatever is verified;
  0 clues is fine, because rounds then use locate and shape only.
- **Tone:** clues celebrate places (food, crafts, nature). No jokes about a district or its people.
  Nothing tied to tragedies, politics or religion.

Example shapes (illustrative only; **don't add these** without a sourced, owner-verified entry):

- kind `food`: "Famous for its doi (yogurt)."
- kind `product`: "Known for its handloom saris."

## 6. UI (`components/games/guess-district-game.tsx`, client)

1. **Intro card:**
   - "🗺️ Guess the District #12" / "🗺️ কোন জেলা? #১২";
   - "10 questions. Same puzzle for everyone today." / "১০টা প্রশ্ন। আজ সবার জন্য একই ধাঁধা।";
   - START. A Practice link appears once today is finished.
2. **Question:**
   - progress "3/10"; the prompt sticker ("Which district is this?" / "এটা কোন জেলা?");
   - the visual (map, silhouette or clue card);
   - 4 option buttons, ≥ 48 px, in a 2 × 2 grid at 360 px;
   - keys 1–4 or A–D select an option.
3. **Reveal (after each answer):**
   - the map with the answer filled (correct = lime, your wrong pick = chili);
   - "✅ Faridpur, Dhaka division" or "❌ It was Faridpur";
   - the `reveal` line and "📚 source" for clues;
   - NEXT (Enter).
   - Reveal animations use `motion-safe:` or the Web Animations API, skipped with reduced motion.
4. **Result:** described in section 7.

Reuse `components/games/district-map.tsx` from Phase 44 for the map views.

## 7. Result, ranks and sharing

**Rank** from score (ids are permanent):

| Score | id | EN | BN |
|---|---|---|---|
| 0–3 | `lost-tourist` | 🧳 Lost Tourist | 🧳 পথ হারানো পর্যটক |
| 4–6 | `bus-window-expert` | 🚌 Bus Window Expert | 🚌 বাসের জানালার এক্সপার্ট |
| 7–8 | `local-guide` | 🧭 Local Guide | 🧭 লোকাল গাইড |
| 9 | `human-gps` | 📍 Human GPS | 📍 মানুষ জিপিএস |
| 10 | `district-legend` | 👑 64-District Legend | 👑 ৬৪ জেলার কিংবদন্তি |

**Result card:**

- `ResultCardData`: score-only game, so title = rank.
- Stats: Score x/10, Map questions x/4, Shape questions x/4, Clue questions x/2 (only the types that
  were played).
- The grid line appears on the card and in Copy result.

**Share text (no spoilers):**

```
🗺️ Guess the District #12 — 8/10
🟩🟩🟥🟩🟩🟩🟥🟩🟩🟩
hottogol.vercel.app/games/guess-district
```

Practice rounds say "Practice" instead of "#12" and share a `/c/<token>` challenge link.

**Challenge:**

- `CHALLENGE_GAMES["guess-district"] = { code: "gd", maxScore: 10 }`. Check that `gd` is unused.
- Register the component in `GAMES` in `app/c/[token]/page.tsx`.
- A daily round's challenge link uses that day's seed, and the friend plays it as a challenge (not
  as their daily).

**Action order:** `ShareActions` (challenge), then `ResultShareKit primary={false}`, then 🎲 Play
another.

## 8. Registry and wiring

| File | Change |
|---|---|
| `lib/games/guess-district.ts` | Pure rules: `buildRound(pool, seed)`, `bboxOf(path)`, `rankFor(score)`, `gridOf(answers)`, daily seed and number |
| `data/district-clues.ts` + validation | Section 5 |
| `data/games/index.ts` | slug `guess-district`, emoji 🗺️ or 📍, a free accent (e.g. `sky`), `durationSec: 120`, category `bangladesh`, mechanic `quiz`, tags `["geography"]`, EN/BN title ("Guess the District" / "কোন জেলা?"), tagline ("10 districts. How well do you know your desh?" / "১০টা জেলা। দেশ কতটা চেনো?"), seo `{ title: "Guess the District — Daily Bangladesh Map Quiz", description }` |
| `data/games/guess-district.ts` | Copy: prompts, reveal lines (3 seeded variants each for right/wrong), ranks, intro |
| `lib/challenge.ts`, `app/c/[token]/page.tsx` | `gd` |
| `app/games/guess-district/page.tsx` + `opengraph-image.tsx` | Route (metadata, Quiz JSON-LD like `ancholik-quiz`, `<RelatedLinks>`), OG via `renderOgCard` |
| `lib/i18n/dictionary.ts` | Shared UI strings, en + bn |
| `data/world.ts`, `lib/moods.ts` | World node (Bangladesh), mood entry |
| `lib/achievements.ts` | `district-detective`: 10/10 in any round. Rule reads `game_complete` `score === 10` for this game |
| Homepage (optional) | A small "Guess the District #n" card near the Daily card. **Owner decision** (section 12) |

## 9. Analytics

- `game_start`, `game_retry`, `game_complete` {`game`, `score`, `mode`: `daily|practice|challenge`}
  and `game_share` {`method`}.
- `mode` is a new param. Add it to the allowlist in `lib/analytics-taxonomy.ts` only if the owner
  wants it in GA. Locally it's fine.
- Never send the answers or district ids.

## 10. Tests (`tests/guess-district.test.ts`)

- The same seed and pool give an identical round (questions, options and order).
- 10 unique answers; each correct option sits among exactly 4 unique options.
- Mix fallback: 0 verified clues gives 4 locate + 6 shape.
- `bboxOf` works for all 64 districts (inside the viewBox, and the centroid is inside the bbox).
- Clue validation rejects: a missing source, an unknown district, the district name in the clue
  (EN, BN or an old spelling), and duplicate ids. Use fake fixture strings, as in `tests/fixtures/`,
  never real place claims.
- `rankFor` boundaries, `gridOf`, and that the daily number and seed for a date key are stable.
- A `gd` challenge token round trip.

## 11. Acceptance checklist

- [x] `npm run check` passes in Docker. The content validator rejects bad clues.
- [x] Daily: the same puzzle for two browsers on the same BD date. Midnight shows the "new puzzle"
      banner instead of swapping a running round. The countdown is correct.
- [x] Practice and challenge links work. A challenge replays the same questions.
- [x] No answer leaks in the DOM or ARIA before answering. Keyboard play works.
- [x] 360 / 390 / 412 px: no horizontal scroll, the silhouette is readable, options are ≥ 44 px.
- [x] Only `verified` clues appear. The owner has the review checklist (122 researched clues, all `needs_review`, `data/district-clues-review/`).
- [x] EN + BN complete. The map credit line is visible wherever the map shows.
- [x] AGENTS.md updated (a Guess the District section: daily seed, clue content rules, ids), Phase 46
      ticked. This plan and the backlog updated. Branch pushed for a PR, not merged.

## 12. Open questions for the owner (defaults in bold)

1. Who verifies clues? **The owner**, using the checklist script. Until then rounds are locate +
   shape only.
2. Homepage card for the daily puzzle? **Yes, small, under the Daily card.** Or skip it to keep the
   homepage uncluttered.
3. Add it to Daily Hottogol's `DAILY_ROTATION` too? **No.** It has its own daily number, and
   appending changes every future day's game.
4. Should `mode` reach GA? **Yes** (it's useful to see daily vs practice).

## 13. Out of scope

Upazila level, "tap the district on the map" questions (too fiddly on 360 px for v1, maybe v2 with
zoom), global stats ("62% got it right"), timed scoring.
