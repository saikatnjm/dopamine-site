# Phase 48: Latim Fight (লাটিম যুদ্ধ)

**Status:** planned · **Written:** 2026-10-26 · **Estimated size:** about 2 days on top of Phase 47's
engine

**Index:** [ideas backlog](2026-10-25-ideas-backlog.md) · **Depends on:** [Phase 47 Kacher Guti](2026-10-26-phase-47-kacher-guti.md)
(`lib/flick/` engine). Build after 47 is merged.

## 1. Goal

The spinning-top battle, **you against the computer**:

- wind the string and throw your লাটিম;
- knock the opponent's latim out of the circle drawn in the dirt;
- finish with a "kop" to crack it.

The owner calls it **লাটিম**. Use that name everywhere, never লাট্টু.

**Why:** school-and-para nostalgia, the owner's pick. It's louder and more chaotic than Kacher Guti:
spinning, wobbling, crashing. The knockout is the moment people share.

## 2. Traditional rules (researched 2026-10-26)

The sources describe two main ways to play: **বেল্লা পার** and **ঘর কোপ**. Played alone, it's just
"how long does it spin". The real contest needs 4–5 players.

- **The circle:** tie one end of the string (লেত্তি) to a latim, hold the other end on the ground and
  swing it. The latim's spike scratches a circle. A great intro animation.
- **Order:** from the circle, players throw their latims. **Whoever lands farthest gets first place**,
  then second, and so on.
- **বেল্লা পার:** the **lower-ranked** players spin first. Higher-ranked players hit those latims
  with theirs. **If you knock another latim out of the circle from inside it, that latim becomes
  yours.** A latim that's hit but can't get out stays stuck in the circle.
- **ঘর কোপ:** a latim that crossed the boundary can be struck (কোপ) with your latim's spike, as
  agreed beforehand. **Cracking it earns praise.**
- **Safety:** older sources note the real game was a bit dangerous, because the spikes hit each
  other. The digital version keeps the drama and none of the danger.

**Sources** (newspapers and blogs; regional differences exist):

- [Kishor Alo: লাটিম খেলা](https://www.kishoralo.com/%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE)
- [Protidiner Sangbad: ঐতিহ্যের খেলা লাটিম](https://www.protidinersangbad.com/todays-newspaper/shahitto-shamoiki/477525)
- [Bhorer Kagoj: লাটিম বা লাট্টু](https://www.bhorerkagoj.net/print-edition/2022/01/25/%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%BE-%E0%A6%85%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%BE-%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%AC%E0%A6%BE-%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A7%8D%E0%A6%9F)
- [kishorgonj.com: লাটিম খেলা](https://www.kishorgonj.com/%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE/)

## 3. Hottogol version (you vs the computer)

| Step | Rule |
|---|---|
| Intro | Circle-drawing animation (a latim on a string sweeps the circle). Skip it with reduced motion |
| Order throw | Both throw **outward from the circle's centre**. The latim that **stops farthest away** (still spinning, or where it fell) becomes the **attacker** for bout 1. An exact tie goes to the player |
| Bout (বেল্লা পার) | The **defender** throws their latim into the circle (it must land inside; if it lands outside it's placed at a seeded spot inside, still spinning, so the bout always happens). Then the **attacker** throws to hit it |
| Knockout | The defender's latim centre leaves the circle as a result of the attacker's hit: **the attacker wins that latim** (+1). Then comes the ঘর কোপ finisher (below) |
| No knockout | Missed, or the hit didn't push it out: **the roles swap** for the next bout |
| Spin matters | A latim whose spin reaches 0 falls over. A fallen defender inside the circle is "stuck", so the attacker gets one more throw at it. A higher-spin latim loses less spin and gets pushed less in a hit (gyroscopic stability), so a good throw also defends |
| Match | **First to 3 latims won**, or 8 bouts maximum (then most won; equal = draw) |

### Throw input (one thumb)

1. **Press and hold** your latim. The string winds and a spin meter sweeps between low and max; the
   **sweet spot** moves slightly each throw (seeded).
2. **Drag** while holding to aim (direction) and set power (drag length), like Kacher Guti.
3. **Release** to throw. Spin = meter value at release; landing distance = power. The latim lands
   and then slides with the leftover speed.

**Keyboard:** hold Space to wind, ←/→ to aim, ↑/↓ for power, release Space to throw.

### ঘর কোপ finisher (style bonus; default: include)

- After a knockout, the knocked-out latim sits outside the circle. A timing ring shrinks over it:
  **tap when the ring meets the latim** to "kop" it.
- Perfect = "ফাটা! 💥" with a crack sticker (+50). Good = +20. Miss = 0. The latim you won is never
  lost by missing.
- It's a toy cracking: no violence copy, just "বাহবা!".
- With reduced motion: the same ring, but a static crack sticker instead of the shake.

### Physics (extends `lib/flick/physics.ts`)

- **`spin`** (0–1) on bodies, decaying each step (`spinDecay`, tune). When `spin < WOBBLE_AT`, add a
  small seeded drift (`rng(seed, "drift", bodyId, stepBucket)`) and visual wobble. At 0 the latim
  falls: it becomes static, and is out of the bout if it's outside the circle.
- **Collision:** the existing impulse model, but the **effective mass is scaled by `1 + spin × k`**,
  and both latims lose spin in proportion to the impulse (the lower-spin one loses more).
- **Circle bounds:** the arena is a circle with no wall. Leaving it means out, not a bounce.
- Still only `+ − × ÷ sqrt`. Spin is a number, not an angle. The stripes' rotation on screen is
  visual only, from `transform: rotate()` driven by spin in the rAF loop.

### Computer opponents (ids are permanent; packed into the seed, append-only)

| id | EN | BN | Aim error | Spin release |
|---|---|---|---|---|
| `choto-bhai` | Little Brother | ছোট ভাই | large | often early or late |
| `boro-bhai` | Para Boro Bhai | পাড়ার বড় ভাই | medium | near the sweet spot |
| `champion` | Mohollar Champion | মহল্লার চ্যাম্পিয়ন | small | almost perfect, aims for knockouts |

These ids are shared with Kacher Guti on purpose: it's the same para cast. Each game's opponent list
and seed packing are still separate.

### Score, endings and ranks

**Score:** `latims won × 100 + kop bonuses`. Challenge code **`lt`** (unused as of 2026-10-26),
`maxScore: 1000`. The seed packs `shuffle (30 bits) · opponent (2 bits)`.

**Endings** (ids are permanent; check in this order):

| id | Rule | EN | BN |
|---|---|---|---|
| `flawless` | won 3–0 | 👑 Flawless. The Para Bows. | 👑 ৩-০! পুরো পাড়া সালাম দিচ্ছে |
| `won` | you reached 3 first, or won more after 8 bouts | 🏆 Latim King | 🏆 লাটিম সম্রাট |
| `draw` | equal after 8 bouts | 🤝 Spun Out Even | 🤝 সমানে সমান |
| `lost` | computer won, you won ≥ 1 | 😮‍💨 Out-Spun | 😮‍💨 ঘোরানোতে হেরে গেলে |
| `cracked` | computer won 3–0 | 💥 Your Latim Got Cracked | 💥 তোমার লাটিম ফাটা! |

**Rank pill** from score (`rankFor`):

| Score | id | EN | BN |
|---|---|---|---|
| 0–99 | `wobbly` | Wobbly Beginner | টলমলে নতুন |
| 100–199 | `string-winder` | String Winder | লেত্তি-ওস্তাদ |
| 200–299 | `circle-boss` | Circle Boss | বৃত্তের বস |
| 300+ | `latim-legend` | Latim Legend | লাটিমের কিংবদন্তি |

The BN copy is a first draft for the owner to polish.

## 4. UI (`components/games/latim-fight-game.tsx`, client)

- **Stage:** the same dirt texture as Kacher Guti, with a scratched circle.
- **Latims:** top-down circles with painted stripes in candy accents. The stripes rotate faster with
  more spin; a small offset shadow shows wobble. Each side has its own colour.
- **Bout info:** a spin bar under each latim, the score at the top, and "আক্রমণ / ATTACK" or
  "ডিফেন্ড / DEFEND" stickers.
- **Knockout moment:** a brief **slow motion** (step the sim at half speed for 400 ms after a
  knockout hit; it doesn't change the result) plus a "বাইরে!" sticker. Skip the slow motion with
  reduced motion.
- **Code:** the same rAF loop, input and pause-on-hidden structure as Kacher Guti. Reuse
  `lib/flick/aim.ts`.
- **Fit:** 360–412 px, controls ≥ 44 px, no horizontal scroll, `touch-action: none` on the stage.

## 5. Result, sharing and wiring

- `ResultCardData`: title = ending, rank pill. Stats: Latims won, Best kop (Perfect/Good/—), Longest
  spin (seconds), Opponent.
- `ShareActions` (challenge), then `ResultShareKit primary={false}`, then 🎲 Play another.

| File | Change |
|---|---|
| `lib/flick/physics.ts` | `spin`, decay, drift, gyroscopic mass, circle-out (keep Kacher Guti tests passing) |
| `lib/games/latim-fight.ts` | Pure match rules: order throw, bouts, knockouts, stuck rule, kop scoring, endings, ranks, seed packing |
| `data/games/latim-fight.ts` | Copy, EN + BN |
| `data/games/index.ts` | slug `latim-fight`, emoji 🌀, a free accent (e.g. `tangerine`), `durationSec: 120`, category `random`, mechanic `physics` (if added in Phase 47) or `reflex`, tags `["school"]`, title { en: "Latim Fight", bn: "লাটিম যুদ্ধ" }, tagline { en: "Wind it. Throw it. Knock them out of the circle.", bn: "লেত্তি পেঁচাও, ছুড়ে মারো, বৃত্তের বাইরে ফেলো।" }, seo `{ title: "Latim Fight — Spinning Top Battle Game (Bangladesh)", description }` |
| `lib/challenge.ts`, `app/c/[token]/page.tsx` | `lt` |
| `app/games/latim-fight/page.tsx` + `opengraph-image.tsx` | Route, metadata, JSON-LD, `<RelatedLinks>` |
| `data/world.ts`, `lib/moods.ts` | World node, mood entry |
| `lib/achievements.ts` | `latim-king` (beat `champion`), hidden `perfect-kop` (3 perfect kops in one match). Needs `game_complete` {outcome, opponent, perfectKops} |

## 6. Bot tuning (required)

Run 5,000 seeds with a human-like bot (aim σ = medium, spin release ±15 % around the sweet spot).
Tune the spin decay, gyroscopic `k` and AI error until:

| Opponent | Human-like bot wins |
|---|---|
| `choto-bhai` | ≈ 70–80 % |
| `boro-bhai` | ≈ 45–55 % |
| `champion` | ≈ 20–30 % |

Also check:

- the average match takes 4–7 bouts;
- a knockout happens on about 30–45 % of attack throws;
- a latim spins for about 4–9 s, so a round is quick but readable.

Record the numbers in AGENTS.md.

## 7. Tests (`tests/latim-fight.test.ts`, plus extend `tests/flick-physics.test.ts`)

- **Physics:**
  - spin decays to 0 in the expected number of steps;
  - a higher-spin body is pushed less in a symmetric hit;
  - a body leaving the circle is flagged out;
  - a deterministic replay gives an identical world.
- **Rules:**
  - order throw (farthest wins, tie goes to the player);
  - a defender landing outside gets placed inside;
  - knockout gives +1 and the attacker keeps attacking; no knockout swaps roles;
  - a fallen latim inside the circle is stuck (the attacker throws again);
  - first to 3, and the 8-bout cap;
  - endings, rank boundaries, kop scoring;
  - an `lt` token round trip.

## 8. Acceptance checklist

- [ ] Phase 47 tests still pass after the engine changes. `npm run check` passes in Docker.
- [ ] Hold-wind-drag-release feels natural on a real phone. The page never scrolls while throwing.
- [ ] The knockout slow motion and kop feel satisfying. Reduced motion stays fully playable.
- [ ] Bot numbers are in range and written to AGENTS.md.
- [ ] A challenge link replays the same opponent and seeded choices.
- [ ] EN + BN complete; the name লাটিম is used everywhere.
- [ ] Listed in `/games`, the World map, the sitemap, related links and moods. Every activity still
      has ≥ 3 inbound links.
- [ ] AGENTS.md updated, Phase 48 ticked. This plan and the backlog updated. PR opened, not merged.

## 9. Open questions for the owner (defaults in bold)

1. Include the ঘর কোপ finisher (cracking the won latim)? **Yes**, as a style bonus that never loses a
   latim.
2. First to **3**, max **8** bouts? Or first to 5 for longer matches?
3. Show the circle-drawing intro every match, or only the first time? **First time only**, then a
   quick "skip" sticker on later matches.

## 10. Out of scope

More than 2 players, real multiplayer, 3D, sound, the "pick the spinning latim up on your palm"
trick (a possible v2 bonus).
