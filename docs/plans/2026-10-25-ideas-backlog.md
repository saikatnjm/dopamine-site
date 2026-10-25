# Hottogol ideas backlog + plan index

**Last updated:** 2026-10-25

Ideas are generated in "idea" chats and built in separate "build" chats. Each idea that is ready
to build gets its own detailed plan file in this folder. A build chat should:

1. Read `AGENTS.md`, then the plan file.
2. Build only what the plan says. Ask the owner about anything under **Open questions** before
   starting, unless the plan gives a default.
3. Update the plan's **Status** line and this index when it starts and when it ships.

Status values: `idea` → `planned` (plan file written) → `building` → `shipped` / `dropped`.

## Planned (build in this order)

| # | Plan | Why now | Status |
|---|---|---|---|
| Phase 44 | [My Bangladesh Map](2026-10-25-phase-44-my-bangladesh-map.md): tap the districts you've visited, get a title and a poster | Rides the "Unseen Bangladesh" district-map trend (Facebook, since ~Oct 6–7, 2026). The trend is fading, so ship fast | building (PR open, awaiting merge) |
| Phase 45 | [Book Cricket](2026-10-25-phase-45-book-cricket.md): the classroom page-flip cricket game | School nostalgia (pen fight went viral). Bangladesh plays West Indies at home (Oct 28 to Nov 9) and tours South Africa (Nov 15 to Dec 13, 2026) | planned |
| Phase 46 | [Guess the District](2026-10-25-phase-46-guess-the-district.md): daily 10-question district quiz with a Wordle-style share grid | Same trend as Phase 44. Shape questions need no fact-checking. Food and landmark clues need researched content first | planned |

Phases 44 and 46 reuse the 64-district SVG map from Phase 43 (`data/dialects/map.ts`). At the time
of writing that lives on branch `feat/regional-language-games` and is **not on `main` yet**.
Branch from it, or wait until it's merged, and check with the owner which.

## Why things go viral here (use this to judge new ideas)

- Everyone in Bangladesh already knows the situation or the game (auto-rickshaw on Dhaka roads, pen fight).
- No rules to explain; you get it in 3 seconds.
- A personal result worth comparing: a number, a title, a picture.
- A reason to send it to one specific friend ("you won't beat this", "how many have you been to?").

## Idea pool (not planned yet)

### Fast arcade

| Idea | One line | Notes |
|---|---|---|
| Ammu Is Coming 📱 | Hide the phone, open the textbook or fake sleep when footsteps come; fake-outs; caught = slipper | Relatable across South Asia. Similar to Don't Tap, but with a story |
| Biye Bari Buffet 🍗 | Stack roast, rezala and borhani on a wobbling plate before the food runs out | The result is a funny picture of the plate |
| Bus Helper 🚌 | Bang the bus side, shout "Ostad, baame chapan!", fill the bus, time stop and go | |
| Footpath Ninja 🚶 | Runner game: hawkers, bikes on the footpath, open manholes, deep puddles | Has jumps, so it feels different from Traffic Dodge |
| Seat Grab 💺 | Half a second to grab a bus seat | |
| Mosha Maro 🦟 | Slap mosquitoes at 2 AM before your sleep bar runs out; don't slap your face | |
| Teacher Turns Around 🧑‍🏫 | Chat or eat tiffin while the teacher writes; freeze when they turn; dodge chalk | Top nostalgia pick after Book Cricket |
| Paper Football ⚽ | Flick a folded paper triangle between a friend's fingers | One-touch physics, like pen fight |
| Desk Drummer 🥁 | Rhythm game: drum the bench until the teacher shouts "Silence!" | |
| Button Phone Snake 🐍 | Retro Snake with Dhaka traffic as obstacles | Use a made-up phone, never a real brand |
| Metro Rush 🚇 | Tap the card, get through the gate, find space in a peak-hour coach | Metro videos trend now and then |
| Flag War 🏳️ | Argentina vs Brazil fans racing for the tallest rooftop flag | Bring back for every football tournament |
| Rooftop Cricket 🏏 | One-tap batting; hit the neighbour's roof = out | Could share an engine with Book Cricket |

### Seasonal (return every year)

| Idea | When | One line |
|---|---|---|
| Eid Salami Collector 💸 | Every Eid | Visit relatives with personalities; salam, smile or guilt trip; total ৳ is the brag |
| Eid-er Bari Jawa 🚆 | Every Eid | Get home by bus, launch and train; seeded chaos chain, endings like Delivery Sim |
| Shakrain Kite Fight 🪁 | January | Old Dhaka rooftop kite battle; cut the other strings |
| Load Shedding Survivor 🔌 | Summer | Juggle IPS, phone, fan and fridge through power cuts |
| Heatwave Survival 🥵 | Summer | Fan, water, shade, load shedding |

### Story simulators and quizzes

| Idea | One line |
|---|---|
| FLAMES 💘 | Two names → Friends / Lovers / Affectionate / Marriage / Enemies / Sister. Browser-only, no names stored |
| Chor-Police-Dakat-Babu 🃏 | Paper-chit role game against bluffing bot classmates |
| Nam-Desh-Phul-Fol ✍️ | Letter → name, country, flower, fruit before time's up |
| Tiffin Trade 🍱 | Trade your plain ruti for a chicken roll; bluff and bargain endings |
| Group Project Simulator 🎓 | Four teammates, one works, presentation tomorrow |
| AI Homework 🤖 | Student submits an AI essay; teacher spots it |
| Which Dhaka Vehicle Are You? 🛺 | Quiz on the Dhaka Person engine; rides the auto-rickshaw trend |
| Scam or Not? 📩 | Swipe real-looking scam SMS and calls. Never use real company names |
| Price Shock 🧅 | Higher or lower prices vs an earlier year. Needs sourced prices and upkeep |
| 64 District Bingo ✅ | Tick Bangladeshi experiences, get a title (could become a mode of Phase 44) |
| District Food Fight 🍛 | Head-to-head district food votes (local only, no global counts) |
| Take Me to Bangladesh ✈️ | Trip-chaos story, only if the "You Never Take Me to Bangladesh" song meme is still hot |

### Idea: a trend template

A quiz or choice-story template that can be filled with new copy and published within a day while
a topic is hot. Keep the AGENTS.md tone rules.

## Never build (owner rules + judgement)

- Anything political (parties, protests, elections), religious, or about real people.
- Health crises as jokes (for example the 2026 measles outbreak).
- The e-rickshaw "remote shutdown" prank trend: harmful and possibly illegal.
- Global leaderboards or popularity claims without real data.

## Trend research log

**2026-10-25** (web search):

- **Unseen Bangladesh district map**: Facebook feeds full of "districts I've visited" maps since
  about Oct 6–7, 2026. [The Daily Star](https://www.thedailystar.net/news/technology/news/map-has-been-going-viral-theres-more-it-4292301),
  [Asia News Network](https://asianews.network/this-bangladesh-map-has-been-going-viral-but-theres-more-to-it/)
- **Cricket**: West Indies Tests in Bangladesh (Dhaka/Mirpur Oct 28 to Nov 1; Sylhet Nov 5–9).
  Bangladesh in South Africa Nov 15 to Dec 13: 2 Tests, 3 ODIs, 3 T20Is.
  Hong Kong Sixes Oct 30. Sources disagree on some venues.
  [ESPNcricinfo](https://www.espncricinfo.com/team/bangladesh-25/match-schedule-fixtures-and-results),
  [Wikipedia](https://en.wikipedia.org/wiki/Bangladeshi_cricket_team_in_South_Africa_in_2026%E2%80%9327)
- **Unconfirmed timing**: the "You Never Take Me to Bangladesh" song meme
  ([The Daily Star](https://www.thedailystar.net/news/tech-startup/news/49-second-song-about-bangladesh-going-viral-online-why-4203541));
  metro rail videos ([Dhaka Tribune](https://www.dhakatribune.com/topic/viral-video)).
