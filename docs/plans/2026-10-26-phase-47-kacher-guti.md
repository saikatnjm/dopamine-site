# Phase 47: Kacher Guti (কাচের গুটি), plus the shared flick-physics engine

**Status:** shipped (#39) · **Written:** 2026-10-26 · **Estimated size:** about 2–3 days (the engine is
about 1 day of that)

**Index:** [ideas backlog](2026-10-25-ideas-backlog.md) · **Next:** [Phase 48 Latim Fight](2026-10-26-phase-48-latim-fight.md)
reuses the engine built here

## 1. Goal

The village marble game, **you against the computer**:

- throw toward the hole (গর্ত);
- whoever lands closest plays first;
- then flick your marble to hit the marble your opponent picks for you.

**Why:** school-and-para nostalgia, chosen by the owner after pen fight went viral. It's a real
skill game: drag, aim, flick. It's turn-based, so it pauses naturally.

This phase also builds `lib/flick/`, a small deterministic 2D physics engine (rolling circles,
collisions, a hole). Phase 48 (Latim Fight) reuses it.

## 2. Traditional rules (researched 2026-10-26)

Rules vary by area. These points agree across the sources:

- **Setup:** draw a line on flat ground (regional names: **জল্লা**, or **জই** in some places), and dig
  a hole (**কেপ** in some areas) about 4–5 hands away. Banglapedia says "nine to ten feet".
- **Players:** two or more.
- **Who goes first:** everyone throws a marble from behind the line toward the hole. Whoever gets
  it **in the hole, or closest**, plays first.
- **Stakes:** the other players give the first player a fixed number of marbles (2–5, depending on
  the area). He scatters them gently around the hole.
- **Marbles in the hole:** any that roll in during the scatter become his (Banglapedia).
- **The shot:** the others **name one specific marble**. He must hit that marble with his own.
  - **Hit it:** he wins it and goes again (Banglapedia), or wins the whole round (bn Wikipedia).
  - **Miss it, or touch another marble:** he gives up one marble and the turn passes to the next
    player, who plays the same way.
- **Banglapedia history note:** marbles arrived in the British period; before that, children played
  with clay balls.

> **Correction (2026-10-26, Phase 50 blog research):** three of the sources below (bn Wikipedia,
> kishorgonj.com, bdnews24 Kidz) say the marble the others name, the **বাদ**, is the one the shooter
> must **not** touch: touching it costs a fine. Banglapedia doesn't mention naming at all. Our game
> (opponent names the marble you must hit) therefore *inverts* the traditional rule. The blog article
> `kacher-guti-rules` says so. Changing the game, or its "para marble game" intro copy, is an owner
> decision.

**Sources:**

- [Banglapedia: Folk Games (Gulikhela)](https://en.banglapedia.org/index.php/Folk_Games)
- [bn Wikipedia: মার্বেল খেলা](https://bn.wikipedia.org/wiki/%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A7%87%E0%A6%B2_%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE)
- [kishorgonj.com: মার্বেল খেলা](https://www.kishorgonj.com/%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A7%87%E0%A6%B2-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE/)
- [bdnews24 Kidz: মার্বেল খেলার দিন](https://bangla.bdnews24.com/kidz/article1941165.bdnews)
- [Rising BD: শীতে আর জমে না সেই মার্বেল খেলা](https://www.risingbd.com/feature/news/280428)

**Tone:** marbles were sometimes played for stakes. In Hottogol, marbles are only an in-game count.
Never use betting or gambling words like "bet" or "জুয়া".

## 3. Hottogol version (2 players: you vs the computer)

| Step | Rule |
|---|---|
| Start | Each side has **10 marbles**. A match has **3 rounds (দান)**. It ends early if a side has 0 marbles |
| Opening throw | Each round: both sides throw their **shooter marble (খেলার গুটি)** from the line toward the hole; the player throws first, the computer second. In the hole, or closest to its centre, plays first. An exact tie goes to the player. A shooter in the hole here is good: "সরাসরি গর্তে!" |
| Stake | Both put **3 marbles** in the pot (fewer if they have fewer), so the pot holds ≤ 6 |
| Scatter | The first player's side scatters the pot around the hole. The pattern is seeded (`rng(seed, "scatter", round)`), with one small gesture: **power** decides how widely they spread. Marbles that stop in the hole go straight to the scatterer ("গর্তে পড়েছে, তোমার!") |
| Shot | The **opponent names the target**: the computer picks yours, and you tap to pick the computer's. The shooter flicks from **where their shooter marble currently rests**, so position matters, as in the real game |
| Clean hit | The target is the **first** marble the shooter touches. The shooter wins it and shoots again; the opponent names a new target |
| Foul | Missed everything, hit another marble first, or the shooter marble went in the hole: the shooter **pays 1 marble** to the opponent (if they have any) and the turn passes. The other side continues the **same round** on the remaining pot |
| Round end | The pot is empty: all won or holed. Next round. The last round's loser throws first in the opening, as a tiny catch-up help |
| Match end | After 3 rounds, or when a side has 0. Most marbles wins |

Pot marbles rolling into the hole during a shot go to the **shooter**, whether the shot was clean
or a foul ("ভাগ্য ভালো!"). Keep that, because it makes chaotic shots fun.

### Opponents (ids are permanent; the choice is packed into the seed)

| id | EN | BN | Aim error (σ, tune) | Target picking for you |
|---|---|---|---|---|
| `choto-bhai` | Little Brother | ছোট ভাই | large | random |
| `boro-bhai` | Para Boro Bhai | পাড়ার বড় ভাই | medium | mix: random or hard |
| `champion` | Mohollar Champion | মহল্লার চ্যাম্পিয়ন | small | hardest: far and/or blocked straight line |

These are generic roles, never real people.

### Score, endings and ranks

**Score (for challenges):** your marbles at the end, 0–20. `maxScore: 20`, challenge code **`kg`**
(unused as of 2026-10-26). The same seed gives the same opponent, scatter patterns and computer
decisions for the same board states.

**Endings** (ids are permanent; check in this order):

| id | Rule | EN | BN |
|---|---|---|---|
| `clean-sweep` | computer ended with 0 marbles | 🧹 Clean Sweep. Pockets Full. | 🧹 সব গুটি তোমার পকেটে |
| `won` | you > computer | 🏆 Para Champion (for today) | 🏆 আজকের পাড়া-চ্যাম্পিয়ন |
| `draw` | equal | 🤝 Even. Rematch after Asr. | 🤝 সমান সমান। বিকেলে আবার। |
| `lost` | you < computer, you > 0 | 😮‍💨 Lost a Few Guti | 😮‍💨 কয়েকটা গুটি গেল |
| `empty-pocket` | you ended with 0 | 🫠 Empty Pocket. Go Home. | 🫠 পকেট খালি। বাড়ি যাও। |

**Rank pill** from your marbles (`rankFor`):

| Marbles | id | EN | BN |
|---|---|---|---|
| 0–4 | `rookie` | Rookie | নতুন খেলোয়াড় |
| 5–9 | `gali-player` | Goli Player | গলির খেলোয়াড় |
| 10–14 | `sharpshooter` | Sharpshooter | নিশানাবাজ |
| 15–19 | `guti-ustad` | Guti Ustad | গুটি ওস্তাদ |
| 20 | `guti-legend` | Guti Legend | গুটির কিংবদন্তি |

The BN copy is a first draft for the owner to polish.

## 4. Shared engine: `lib/flick/` (pure, no DOM/React)

| File | Contents |
|---|---|
| `lib/flick/physics.ts` | `World` = bodies (circles: `id, x, y, vx, vy, r, mass`, optional `spin` for Phase 48), `holes` (`x, y, r`), `bounds` (rect or circle). `step(world)` advances one fixed step (`STEP_MS = 1000 / 120`): rolling friction (constant deceleration), circle–circle collisions (impulse, restitution ~0.9; positional correction to avoid overlap), soft bounds (stop with damping), hole capture (centre inside `hole.r − body.r × 0.4` **and** speed below a lip threshold, otherwise it skips over). Records **contact events** per step (`{ a, b, impulse }`, first-contact order) so games can tell "first marble touched". `isSettled(world)` = all speeds below ε |
| `lib/flick/aim.ts` | Turns a drag (start point, end point) into `{ dirX, dirY, power 0–1 }`, with dead zone, clamp and a max drag length in px. Pure, so it's testable |
| `lib/flick/ai.ts` | `aimAt(world, shooter, target, opts)` = ideal straight-line direction + the power needed to reach just past the target (from the friction formula), then seeded Gaussian error (`rng(seed, "ai", turn)`). No trig: use unit vectors and `Math.sqrt` |

### Determinism

- Fixed step, and only `+ − × ÷` and `Math.sqrt`. **No `Math.sin/cos/atan2/exp`** in the simulation:
  their results may differ by browser.
- Never `Math.random()`.
- The same seed and the same player inputs give the same result on a given device. Challenges
  compare scores only, so cross-browser bit-exactness is a bonus, not a requirement.

### Rendering

- One `requestAnimationFrame` loop moves DOM nodes (marbles as `div`s with `transform`) at most
  once per frame. Use an accumulator for fixed steps, and cap steps per frame so a background tab
  doesn't spiral.
- React state changes only on events: turn change, target chosen, round end.
- No canvas game engine; the AGENTS.md conventions apply.

## 5. UI (`components/games/kacher-guti-game.tsx`, client)

- **Stage:** top-down **dirt patch** (মাটি texture with CSS gradients and dots, sticker-zine
  borders), the line (দাগ), the hole (গর্ত). Show the regional names once on the intro: "কোথাও বলে
  জল্লা আর কেপ".
- **Marbles:** glassy circles (radial gradient plus a coloured swirl). Your shooter is marked 🫵,
  the computer's 🤖. Pot marbles are neutral colours.
- **Aiming:** drag back from anywhere on the stage, like a slingshot. A short dotted aim line shows
  the direction only (no full trajectory preview, so skill matters) and a power arc fills. Release
  to flick.
  - Keyboard: ←/→ rotate aim, hold Space for power, release to shoot.
  - Pointer events with `touch-action: none` on the stage.
- **Target naming:**
  - The computer's pick for you pulses with a ring and a speech sticker: "ওইটা মারো!" / "Hit that one!".
  - Your pick for the computer: tap a pot marble, or cycle with Tab and confirm with Enter.
- **Feedback:** "ঠাস!" sticker on a clean hit, "ফাউল!" on a foul, and a marble count for each side
  at the top. Micro-animations use the Web Animations API, skipped with reduced motion.
  `navigator.vibrate(20)` on a hit only if available. Sound off by default (no audio in v1).
- **Opponent choice** on the intro screen (3 sticker cards). A challenge link locks the opponent
  from the seed.
- **Fit:** 360–412 px portrait, the stage fills the width, controls ≥ 44 px, no horizontal scroll.
- **Pausing:** pause the rAF loop on `visibilitychange`. The game is turn-based, so it resumes
  cleanly.

## 6. Result and sharing (follow the AGENTS.md "Action order")

- `ResultCardData`: title = ending, rank pill = `rankFor`. Stats: Marbles x/20, Clean hits, Fouls,
  Opponent.
- `ShareActions` challenge ("😏 I finished with 14 marbles vs Para Boro Bhai. / You won't beat me."),
  then `ResultShareKit primary={false}`, then 🎲 Play another.
- Challenge code `kg`, `maxScore: 20`. Register it in `GAMES` in `app/c/[token]/page.tsx`, and accept
  legacy `?seed=&s=` links via `legacyChallenge()`.
- **Seed layout:** `seed = shuffle (30 bits) · opponent index (2 bits)`, as `ancholik-quiz` packs its
  config. The opponent list is **append-only**.

## 7. Registry and wiring

| File | Change |
|---|---|
| `data/games/index.ts` | slug `kacher-guti`, emoji 🔮, a free accent (e.g. `sky`), `durationSec: 150`, category `random`, mechanic `reflex` (or add `"physics"` to `Mechanic` if the owner agrees), tags `["school"]`, title { en: "Kacher Guti (Marbles)", bn: "কাচের গুটি" }, tagline { en: "Hit the marble they pick. Miss and pay up.", bn: "যেটা বলবে, সেটাই মারো। মিস করলে গুটি দাও।" }, seo `{ title: "Kacher Guti — Bangladeshi Marble Game Online (vs Computer)", description }` |
| `data/games/kacher-guti.ts` | Copy: intro, opponents, feedback stickers, endings, ranks (EN + BN) |
| `lib/games/kacher-guti.ts` | Pure match rules on top of `lib/flick`: `createMatch(seed)`, turn state machine, foul/clean detection from contact events, `endingOf`, `rankFor`, seed pack/unpack |
| `lib/challenge.ts`, `app/c/[token]/page.tsx` | `kg` |
| `app/games/kacher-guti/page.tsx` + `opengraph-image.tsx` | Route, metadata, JSON-LD, `<RelatedLinks>`, English OG |
| `data/world.ts`, `lib/moods.ts` | World node (Arcade or Bangladesh), mood entry |
| `lib/achievements.ts` | `para-champion`: beat `champion`. Hidden `clean-sweeper`: the `clean-sweep` ending. The rules read `game_complete` {outcome, opponent} |

## 8. Analytics

- `game_start`, `game_retry`, `game_complete` {`game`, `score`, `outcome`, `opponent`} and
  `game_share` {`method`}.
- `opponent` is local-only for achievements. Add it to the GA allowlist only if the owner wants it.

## 9. Tests

- **`tests/flick-physics.test.ts`:**
  - a lone body decelerates to a stop at the formula distance (±1 px);
  - momentum is conserved in a head-on equal-mass collision (within restitution);
  - no overlap after a step;
  - hole capture when slow, skip when fast;
  - contact events in first-touch order;
  - the same inputs give an identical world after N steps.
- **`tests/kacher-guti.test.ts`:**
  - opening order: hole beats closest, tie goes to the player;
  - stake with fewer than 3 marbles;
  - clean hit vs foul (another marble touched first; a miss; shooter in the hole);
  - holed pot marbles go to the shooter;
  - match end at 0 marbles and after 3 rounds;
  - endings and rank boundaries;
  - seed pack/unpack;
  - a `kg` token round trip, max 20 accepted, 21 rejected.

## 10. Bot tuning (required)

Run a throwaway simulation over 5,000 seeds, with a "human-like" player bot: perfect aim plus
Gaussian error σ = medium, same power model. Tune the AI error σ and target picking until:

| Opponent | Human-like bot wins |
|---|---|
| `choto-bhai` | ≈ 70–80 % |
| `boro-bhai` | ≈ 45–55 % |
| `champion` | ≈ 20–30 % |

Also check that `clean-sweep` happens in 2–6 % of wins against `boro-bhai`, and that a match takes
about 20–40 shots in total.

Record the final numbers in AGENTS.md ("Bot-tuned: …").

## 11. Acceptance checklist

- [x] `npm run check` passes in Docker. Bot numbers are in range and written to AGENTS.md.
- [x] Drag-flick feels good on a real phone at 360 px: no page scroll while aiming, and the aim
      line is visible under the thumb (offset the line, or show it from the marble, not the finger).
- [x] Keyboard play works end to end. Reduced motion skips decorative animations; physics still runs.
- [x] A challenge link replays the same opponent, scatter and computer choices.
- [x] EN + BN complete, no gambling words.
- [x] Listed in `/games`, the World map, the sitemap, related links and moods. Every activity still
      has ≥ 3 inbound links.
- [x] AGENTS.md: a Kacher Guti bullet and a `lib/flick` note in Layout. Phase 47 ticked. This plan and
      the backlog updated. PR opened, not merged.

## 12. Open questions for the owner (defaults in bold)

1. Stake per round: **3 each** (sources say 2–5 by area)? And **"hit = win that marble and shoot
   again"** (Banglapedia), not "hit = win the whole round" (bn Wikipedia)?
2. Add `"physics"` to `Mechanic` for flick games (Phase 48 too)? **Yes**, so related links group them.
3. Sound effects (glass "ঠক")? **Not in v1** (no audio system yet; people play muted).
4. Hot right now? **Yes**, as `{ label: "try" }` for two weeks after launch.

### Owner answers (2026-10-26)

1. 3 each; a hit wins that marble and shoots again.
2. Yes: `"physics"` added to `Mechanic`.
3. Sounds **yes** after all: small synthesized effects, off by default, with a toggle (`lib/sound.ts`).
4. Hot right now as `try`, replacing CNG Catch for two weeks.

### Build notes

- Bot numbers: see AGENTS.md. All three win rates are in range. The clean-sweep target (2–6 % of wins vs
  `boro-bhai`) is **not** reachable with 3-marble stakes over 3 rounds (≈ 0.6 %): only 9 marbles are ever
  staked, so the computer must also foul to reach 0. Owner decision if it should be more common
  (e.g. stake 4).
- The `draw` copy says "Rematch in the evening" instead of "after Asr" (AGENTS.md keeps religion out of
  the jokes). The BN line is unchanged.
- "Real phone" feel was checked in headless Chrome with touch emulation (no page scroll during drags,
  aim line drawn from the marble). It still needs the owner's thumb on a real phone.

## 13. Out of scope

Real multiplayer, more than 2 players, the regional variants (গরু চোর, বাঘা…), a full trajectory
preview, sound.
