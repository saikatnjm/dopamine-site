# Phase 45: Book Cricket (বই ক্রিকেট)

**Status:** built, PR branch `game/book-cricket` (stacked on `feat/my-bangladesh-map`; rebase onto `main` after Phase 44 merges), waiting for the owner to test and merge · **Written:** 2026-10-25

**Decisions (2026-10-25):** stack on Phase 44 · add `"school"` tag · Hot right now replaces Job Resignation · teacher alert in v1 · not in `DAILY_ROTATION` in this PR · **Estimated size:** about 1.5–2 days

**Index:** [ideas backlog](2026-10-25-ideas-backlog.md)

## 1. Goal

The back-bench classic: open a textbook at a random page, and the page number decides the ball. In
Hottogol's version:

- you pick 🛡️ Defend or 💥 Slog for each ball;
- the book flips;
- you chase the Back Bench XI's score in a 2-over innings, with 3 wickets.

Each innings takes 45–60 s, and the result comes with challenge links.

**Why now:**

- School nostalgia: pen fight went viral.
- Cricket attention is high. Bangladesh plays West Indies at home (Tests Oct 28 to Nov 1 and Nov 5–9,
  2026), then tours South Africa from **Nov 15 to Dec 13** (2 Tests, 3 ODIs, 3 T20Is).
- **Target: PR ready by about Nov 8**, so the owner can test and ship before Nov 15.

**Rules:**

- No real teams, players, logos, board names or textbook (NCTB) covers.
- The opponent is the fictional "Back Bench XI / লাস্ট বেঞ্চ একাদশ".

## 2. Before you start

- Read `AGENTS.md`, especially the Games and Challenge a Friend sections and Standing instructions.
- This phase doesn't need the Phase 43 map, so it can branch from `main`. Suggested branch:
  `game/book-cricket`.
- Ask the owner the **Open questions** (section 11), or use the defaults.

## 3. How a match works

| Thing | Rule |
|---|---|
| Innings | 12 legal balls (2 overs), 3 wickets. Ends at 12 legal balls or 3 wickets. It does **not** end early when the target is passed, so challenge scores stay comparable |
| Target | Back Bench XI's score, seeded: `target = 16 + floor(rng("target") * 21)` (16–36). Tune it, see section 4 |
| Each delivery | The player taps 🛡️ DEFEND or 💥 SLOG, the book flips (~600 ms, instant with reduced motion), then shows the page |
| Page | An even number 2–400 from `rng(seed, "page", deliveryIndex)`. `deliveryIndex` counts every delivery, no-balls included. **The page never depends on the player's choices**, so the same seed gives the same pages for both friends in a challenge |
| Digit | `page % 10` ∈ {0, 2, 4, 6, 8} (left-hand pages are even, as in the real game) |

### Outcome table

| Digit | 💥 Slog | 🛡️ Defend |
|---|---|---|
| 0 | **OUT** (on a free hit: dot ball) | dot ball, **but** `page % 100 === 0` (100, 200, 300, 400) = **OUT** (free hit: dot) |
| 2 | 2 runs | 1 run |
| 4 | FOUR | 1 run |
| 6 | SIX | 2 runs |
| 8 | **No ball**: +1 run, does not count as a legal ball, next delivery is a **free hit** | same |

- After 6 no-balls in one innings, an 8 is a dot ball ("Sir confiscated the extra pages"). This caps
  the innings length and the maximum score.
- Maximum possible: 12 legal balls × 6 plus 6 no-balls = 78. Use `maxScore: 200` in
  `CHALLENGE_GAMES` for headroom.

### "স্যার আসছে!" teacher alert (default: include)

- Once per match, at a seeded legal ball 4–10, a banner slams in before the flip: "🧑‍🏫 স্যার আসছে!
  বই লুকাও!" / "🧑‍🏫 Sir's coming! Hide the book!".
- Tap HIDE (or press Space/Enter) within 1.2 s, or the ball is lost: it counts as a legal dot ball and
  no page is drawn. Draw the page anyway and skip it, so later page indices stay identical.
- Reaction timing is the player's skill and doesn't break seed determinism.
- With reduced motion, the banner appears without the slam animation, and the window is still 1.2 s.

### Endings and ranks (ids are permanent)

**Ending** (title on the result card):

| id | Rule | EN | BN |
|---|---|---|---|
| `last-ball-win` | runs pass the target on the last legal ball | 🎉 Last-Ball Hero | 🎉 শেষ বলের নায়ক |
| `won-chase` | runs > target | 🏆 Chased It Down | 🏆 টার্গেট শেষ |
| `tie` | runs = target | 🤝 Tie. Tiffin Shared. | 🤝 টাই। টিফিন ভাগাভাগি। |
| `all-out` | 3 wickets and runs < target | 💀 All Out | 💀 অল আউট |
| `lost-chase` | otherwise | 😮‍💨 Fell Short | 😮‍💨 অল্পের জন্য হলো না |

Check them in that order. The ending is a pure function of the innings.

**Rank pill** from runs, `rankFor`:

| Runs | id | EN | BN |
|---|---|---|---|
| 0 | `duck` | 🦆 Duck | 🦆 শূন্য রানে আউট |
| 1–9 | `tailender` | Tailender | টেইলএন্ডার |
| 10–19 | `tiffin-batter` | Tiffin-Break Batter | টিফিন পিরিয়ডের ব্যাটার |
| 20–29 | `back-bench-hitter` | Back-Bench Hitter | লাস্ট বেঞ্চের হিটার |
| 30–39 | `class-captain` | Class Captain | ক্লাস ক্যাপ্টেন |
| 40+ | `book-legend` | Book Cricket Legend | বই ক্রিকেটের কিংবদন্তি |

**Commentary** (UI flavour): 3 variants per outcome (out, dot, 1, 2, 4, 6, no-ball, free hit, teacher
saved, teacher caught), EN + BN. Pick with `rng(seed, "line", deliveryIndex)`, never `Math.random()`.
Show the page in the line, for example:

- "পৃষ্ঠা ১৪০, বোল্ড! বই বন্ধ করো।"
- "Page 146: SIX! The whole back bench stands up."

## 4. Pure rules module and bot tuning

`lib/games/book-cricket.ts` holds pure functions of `(seed, choices)` with no DOM:

- `createMatch(seed)` → `{ target, teacherBall }`.
- `pageFor(seed, deliveryIndex)`.
- `resolveDelivery(state, choice, page)` → new state + outcome.
- `endingOf(state)`, `rankFor(runs)`.

Use the seeded RNG from `lib/random.ts`, with a separate stream per decision key. New seeds come
from `newSeed()`.

**Bot tuning is required.** Write a throwaway script (or a Vitest test file that isn't committed)
that runs 10,000 seeds per bot:

| Bot | Target outcome |
|---|---|
| always-slog | wins ≈ 40–50 % |
| always-defend | wins ≤ 10 % |
| smart (defend when the last wicket is in hand and the target is near, else slog) | wins ≈ 55–65 % |
| any bot | `last-ball-win` ≈ 3–8 % |

Adjust the target range (not the outcome table) until these hold. Record the final numbers in
AGENTS.md, as the other games do ("Bot-tuned: …").

## 5. UI (`components/games/book-cricket-game.tsx`, client)

- **Stage:** a thick-bordered sticker "textbook" with a made-up cover (e.g. "অঙ্ক খাতা · Class 8",
  no real publisher), a scoreboard sticker (Runs/Wickets · Overs x.y · Target), and a ball-by-ball
  strip (`6 4 W 2 • NB`).
- **Two big buttons:** 🛡️ DEFEND and 💥 SLOG, each ≥ 56 px tall, side by side at 360 px.
- **Keyboard:** D/← = defend, S/→ = slog; Space/Enter = HIDE during the teacher alert.
- **Page flip:** a CSS 3D page turn, or a Web Animations API flicker of fast-changing page numbers
  that lands on the real page. Skip it with `prefers-reduced-motion`. Turn-based, so no rAF loop is
  needed.
- **Lifecycle:** intro → playing → result, like the other games. Best runs go in
  `createBestStore("hottogol:book-cricket:best")`.
- **Props:** `challenge: FriendChallenge | null` and an optional `daily?: DailyMode`, the same
  contract as the other games, so it can join Daily later.

## 6. Result and sharing (follow the AGENTS.md "Action order")

**Result card** (`ResultCardData`):

- title = ending, rank pill = `rankFor(runs)`;
- stats (≤ 4): Runs/Wkts, Target, Sixes, Strike rate (`runs / legal balls × 100`, rounded);
- quote = one commentary line from the innings;
- children: `ChallengeOutcome` when playing a friend's link, and "New best!".

**Challenge:**

- `CHALLENGE_GAMES["book-cricket"] = { code: "bk", maxScore: 200 }`. Check that `bk` is unused.
  Never rename it later.
- Register the component in `GAMES` in `app/c/[token]/page.tsx`.
- The friend replays the same seed, so they get the same pages and target, and only the choices
  differ.

**Actions:** `ShareActions` (challenge card "😏 I scored 34. / You won't beat me."), then
`ResultShareKit primary={false}`, then 🎲 Play another.

**Copy result** extra line: the ball strip, e.g. `🏏 34/2 (2 ov) · 6 4 W 2 • 6 NB 4 …`.

## 7. Registry and wiring

| File | Change |
|---|---|
| `data/games/index.ts` | slug `book-cricket`, emoji 🏏, a free accent (e.g. `lime`), `durationSec: 50`, category `random`, mechanic `reflex` (or `choices`; pick the one that gives better related links), tags `["reaction"]` plus a new `"school"` tag in `ActivityTag` if the owner agrees (Phase 47+ nostalgia games would reuse it). EN/BN title, tagline ("Open the book. Pray for a 6." / "বই খোলো। ছক্কার দোয়া করো।"), description, and seo `{ title: "Book Cricket — The Classroom Page-Flip Cricket Game, Online", description }` |
| `data/games/book-cricket.ts` | All copy: endings, ranks, commentary, intro, teacher alert, EN + BN |
| `lib/challenge.ts` | `bk` entry |
| `app/c/[token]/page.tsx` | `GAMES` entry (via `next/dynamic`) |
| `app/games/book-cricket/page.tsx` | Route, metadata, JSON-LD, `<RelatedLinks>`, legacy `?seed=&s=` via `legacyChallenge()` |
| `app/games/book-cricket/opengraph-image.tsx` | `renderOgCard` (English) |
| `lib/i18n/dictionary.ts` | Any shared UI strings (en + bn) |
| `data/world.ts` | Arcade world node |
| `lib/moods.ts` | Add to a fitting mood (quick / nostalgic) |
| `lib/achievements.ts` | `golden-duck` (hidden: out on the very first legal ball) and `book-legend` (40+ runs). Needs `game_complete` params `score`, `outcome` and `firstBallOut: true/false`. Check the rule shape of existing achievements; never rename ids |

## 8. Analytics

- `game_start`, `game_retry`, `game_complete` {`game`, `score`, `outcome`} and `game_share`
  {`method`}. The taxonomy maps them automatically.
- Challenge events come for free through `ShareActions` / `ChallengeBanner` / `ChallengeOutcome`.
- If you add a new param (e.g. `firstBallOut`), it's local-only for achievements unless it's added to
  the taxonomy allowlist. That's fine.

## 9. Tests (`tests/book-cricket.test.ts`)

- The same seed gives the same pages and target, whatever the choices.
- Each outcome-table row, including free hit, the `% 100` defend-out, the no-ball cap, and teacher
  "caught" consuming a page index.
- The innings ends at exactly 12 legal balls or 3 wickets, never early on passing the target.
- Ending order (`last-ball-win` before `won-chase`, etc.) and `rankFor` boundaries.
- A challenge token round trip for `bk`. The max score is accepted, and 201 is rejected.

## 10. Acceptance checklist

- [x] `npm run check` passes in Docker.
- [x] Bot sim numbers written into AGENTS.md. Within range: always-slog 44.4 %, always-defend 0 %, last-ball 6.5–7.7 %. **Not reachable:** smart 55–65 % (exact DP: optimal play ≈ 46 %, only 1–3 points above always-slog with this outcome table; needs an owner decision on the table).
- [x] Works at 360, 390 and 412 px. Buttons are ≥ 44 px. Keyboard play works.
- [x] Reduced motion: no flip animation; the game is still fully playable.
- [x] A `/c/<token>` link replays the same pages and target. The banner, accept and outcome all work.
- [x] EN + BN copy is complete. No real teams, players, logos or textbook covers.
- [x] Listed in `/games`, the World map, the sitemap, related links and moods. Every activity still
      has ≥ 3 inbound links.
- [x] AGENTS.md updated (Book Cricket bullet under Games, Phase 45 ticked). This plan's Status and
      the backlog updated. Branch pushed for a PR, not merged.

## 11. Open questions for the owner (defaults in bold)

1. Add `"school"` to `ActivityTag` now for future nostalgia games? **Yes.**
2. Add `book-cricket` to `DAILY_ROTATION` (`lib/daily.ts`)? **Not in this PR.** Appending changes
   which game falls on every future day (`index % len`), and today's game could swap at deploy time.
   Do it in a separate, owner-approved change.
3. Put it in 🔥 Hot right now during the South Africa tour (Nov 15 to Dec 13)? **Yes**, as
   `{ label: "hot" }`.
4. Teacher-alert twist in v1? **Yes.**

## 12. Out of scope

Bowling or a second innings, multiplayer on one device, real fixtures or live scores, team
selection.
