# Hottogol ideas backlog + plan index

**Last updated:** 2026-10-26

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
| Phase 44 | [My Bangladesh Map](2026-10-25-phase-44-my-bangladesh-map.md): tap the districts you've visited, get a title and a poster | Rides the "Unseen Bangladesh" district-map trend (Facebook, since ~Oct 6–7, 2026). The trend is fading, so ship fast | shipped (#36) |
| Phase 45 | [Book Cricket](2026-10-25-phase-45-book-cricket.md): the classroom page-flip cricket game | School nostalgia (pen fight went viral). Bangladesh plays West Indies at home (Oct 28 to Nov 9) and tours South Africa (Nov 15 to Dec 13, 2026) | shipped (#37) |
| Phase 46 | [Guess the District](2026-10-25-phase-46-guess-the-district.md): daily 10-question district quiz with a Wordle-style share grid | Same trend as Phase 44. Shape questions need no fact-checking. Food and landmark clues need researched content first | shipped (#38) |
| Phase 47 | [Kacher Guti](2026-10-26-phase-47-kacher-guti.md): village marble game vs the computer, plus the shared `lib/flick` physics engine | Owner's pick (school and para nostalgia). Rules researched from Banglapedia, bn Wikipedia and newspapers | building (PR open, awaiting merge) |
| Phase 48 | [Latim Fight](2026-10-26-phase-48-latim-fight.md): লাটিম battle vs the computer (বেল্লা পার + ঘর কোপ) | Owner's pick. Reuses the Phase 47 engine, so build after 47 is merged | building (PR open, stacked on Phase 47; awaiting merge) |

Phases 44 and 46 reuse the 64-district SVG map from Phase 43 (`data/dialects/map.ts`), which is on
`main` since #35. Phase 46 should also reuse Phase 44's district map component, divisions data and
bit order. Branch Phase 46 from `main` after the Phase 44 PR is merged.

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

### Generators, calculators and new picks (added 2026-10-26)

| Idea | One line | Notes |
|---|---|---|
| Relatives' Questions Survival 👵 | At a wedding or Eid dawat, dodge "Biye kobe?", "Result kemon?", "Beton koto?" with quick comebacks before the next aunty arrives | Relatives are a generic role (like vendors), never real people. Peaks in wedding season (Dec–Feb) and every Eid |
| Traffic Life Calculator ⏳ | Enter your daily commute → "You'll spend 3.1 years of your life in Dhaka traffic" + what you could have done instead | Honest math from the user's own inputs, no outside facts. Cheapest idea here |
| Rickshaw-Art Name Plate 🎨 | Type a name → it's painted in rickshaw-art style with flowers and birds → profile-picture image | Name stays in the browser. Needs good art and Bangla lettering on canvas |
| Fuchka Challenge 🥟 | Eat fuchka as fast as you can while the tok (spice) meter climbs; drink water at the right time | |
| Wrong Number Send Money 📱 | You sent money to the wrong number; convince the stranger to return it (choice story) | No real mobile-banking brands |
| Exam Hall: Last 10 Minutes 📝 | Finish the paper while the invigilator patrols; could share an engine with Teacher Turns Around | |

### Idea: a trend template

A quiz or choice-story template that can be filled with new copy and published within a day while
a topic is hot. Keep the AGENTS.md tone rules.

## Popularity ranking (2026-10-26, judgement, not data)

Each idea is scored 1–5 on six things. **Friend trigger counts double**, because share rate is the
primary metric. Max = 35.

- **Rec:** everyone in Bangladesh already knows it.
- **3s:** you understand it in 3 seconds.
- **Brag:** a result worth posting (number, title, picture).
- **Friend:** a reason to send it to one specific person.
- **Return:** a reason to play again.
- **Cheap:** 5 = about 1 day of work, 1 = a week or more.

| Idea | Rec | 3s | Brag | Friend ×2 | Return | Cheap | **Total** | Timing |
|---|---|---|---|---|---|---|---|---|
| Relatives' Questions Survival | 5 | 5 | 4 | 5 | 3 | 4 | **31** | Wedding season Dec–Feb, then Eid |
| FLAMES | 5 | 5 | 3 | 5 | 3 | 5 | **31** | Any time |
| Flag War | 5 | 5 | 4 | 5 | 2 | 3 | **29** | Only during big football tournaments; wait |
| Traffic Life Calculator | 5 | 5 | 4 | 4 | 1 | 5 | **28** | Any time |
| Rickshaw-Art Name Plate | 5 | 5 | 5 | 4 | 2 | 3 | **28** | Any time; Pohela Boishakh (Apr 14) boost |
| Eid Salami Collector | 5 | 4 | 5 | 4 | 2 | 3 | **27** | Only at Eid (next ~Mar 2027) |
| Scam or Not? | 5 | 5 | 3 | 4 | 2 | 4 | **27** | Any time; spreads in family groups |
| Teacher Turns Around | 5 | 5 | 3 | 3 | 4 | 3 | **26** | Any time |
| Biye Bari Buffet | 5 | 5 | 5 | 3 | 3 | 2 | **26** | Wedding season |
| Ammu Is Coming | 5 | 5 | 3 | 3 | 3 | 4 | **26** | Any time |
| Fuchka Challenge | 5 | 5 | 3 | 3 | 3 | 3 | **25** | Any time |
| Wrong Number Send Money | 4 | 4 | 3 | 3 | 2 | 4 | **23** | Any time |
| Shakrain Kite Fight | 3 | 4 | 3 | 3 | 2 | 2 | **20** | Mid-January only |

**Pattern:** the top scorers make the result *about the player or a friend* (their name, their
relatives, their commute). The arcade games score lower on Friend trigger, because "beat my score"
works but "this is so you" spreads further.

**Check against real data before trusting this.** In GA4, compare `result_share ÷ activity_complete`
per activity (share rate per finish). Whichever existing formats (quiz, generator, reflex, story)
share best should break ties here.

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
