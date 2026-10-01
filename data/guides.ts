import type { Text } from "@/lib/i18n/core";

// SEO guide pages ("content/discovery system"). Each guide is hand-written:
// a unique intro, a curated list of activity KEYS (titles, emoji, links,
// durations and taglines come from lib/activities.ts) with a page-specific
// "why it fits" line, related activities, links to other guides and an
// optional FAQ. Rules (enforced by lib/guides.ts at build time):
// - every key must exist in the activity registry;
// - 5–7 picks; related activities must not repeat the picks;
// - no paragraph may appear on two pages (intros, why-lines, FAQ answers).
// SEO title/description are English (crawlers have no language cookie).

export const GUIDE_SLUGS = [
  "funny-websites",
  "games-to-play-when-bored",
  "one-minute-games",
  "random-things-to-do-online",
  "funny-online-games",
] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type Guide = {
  slug: GuideSlug;
  emoji: string;
  /** Short name used in links between guides and in the footer. */
  name: Text;
  h1: Text;
  intro: Text[];
  seo: { title: string; description: string };
  picks: { key: string; why: Text }[];
  /** "More to try" — activity keys not already in picks. */
  related: string[];
  /** Other guides to link to. */
  guides: GuideSlug[];
  /** Other useful site pages. */
  links?: { href: string; label: Text }[];
  faq?: { q: Text; a: Text }[];
};

export const guides: Record<GuideSlug, Guide> = {
  "funny-websites": {
    slug: "funny-websites",
    emoji: "😂",
    name: { en: "Funny websites", bn: "মজার ওয়েবসাইট" },
    h1: { en: "Funny websites for when you need a laugh", bn: "হাসি দরকার? এই মজার ওয়েবসাইটগুলো দেখো" },
    intro: [
      {
        en: "Hottogol is a small site full of jokes you can play. Each page below is a tiny interactive bit about everyday life — hailing a CNG, quitting a job, renting a flat — and each one ends on a different punchline.",
        bn: "হট্টগোল হলো খেলা যায় এমন জোকসে ভরা একটা ছোট্ট সাইট। নিচের প্রতিটা পেজ রোজকার জীবনের একটা ছোট ইন্টারঅ্যাক্টিভ মজা — সিএনজি ধরা, চাকরি ছাড়া, বাসা ভাড়া — আর প্রতিটার শেষটা আলাদা।",
      },
      {
        en: "Nothing to install and no account. Most of these take about a minute, which is roughly how long a good laugh should take.",
        bn: "কিছু ইনস্টল করতে হবে না, অ্যাকাউন্টও লাগবে না। বেশিরভাগ এক মিনিটের মতো — একটা ভালো হাসির জন্য ঠিক যতটুকু সময় লাগে।",
      },
    ],
    seo: {
      title: "Funny Websites for When You Need a Laugh",
      description:
        "Funny little websites you can actually play: haggle with a CNG driver, write a doomed resignation, survive a landlord interview. Free, about a minute each.",
    },
    picks: [
      {
        key: "x:dhaka-cng-simulator",
        why: {
          en: "Pick a destination and haggle with the driver. Most rides end somewhere you never asked to go, and the endings read like tiny sitcom scenes.",
          bn: "গন্তব্য বেছে ড্রাইভারের সাথে দরদাম করো। বেশিরভাগ যাত্রা শেষ হয় এমন জায়গায় যেখানে তুমি যেতেই চাওনি — আর শেষগুলো যেন ছোট্ট সিটকমের দৃশ্য।",
        },
      },
      {
        key: "x:job-resignation-simulator",
        why: {
          en: "Write the resignation you would never actually send. Your boss's replies are the joke, and there are a dozen ways it can go wrong.",
          bn: "এমন রিজাইন লেটার লেখো যেটা আসলে কখনো পাঠাতে না। বসের উত্তরগুলোই আসল মজা, আর ভুল হওয়ার রাস্তা ডজনখানেক।",
        },
      },
      {
        key: "x:house-rent-simulator",
        why: {
          en: "A landlord interview that gets stranger with every answer. Anyone who has rented in a big city will recognise at least one question.",
          bn: "বাড়িওয়ালার এমন ইন্টারভিউ যেটা প্রতিটা উত্তরে আরও অদ্ভুত হয়। বড় শহরে বাসা ভাড়া নিয়েছে এমন যে কেউ অন্তত একটা প্রশ্ন চিনবে।",
        },
      },
      {
        key: "p:excuses",
        why: {
          en: "Choose a situation and get an excuse with a credibility score. Press again until you find one ridiculous enough to actually use.",
          bn: "একটা পরিস্থিতি বেছে নাও, credibility স্কোরসহ একটা অজুহাত পাও। এমন হাস্যকর একটা না পাওয়া পর্যন্ত আবার চাপো যেটা সত্যিই ব্যবহার করা যায়।",
        },
      },
      {
        key: "x:fake-shopping-spree",
        why: {
          en: "Fill a cart with things you will never buy and watch checkout fall apart. All the fun of online shopping, none of the bill.",
          bn: "যেসব জিনিস কখনো কিনবে না সেগুলো দিয়ে কার্ট ভরো, তারপর দেখো চেকআউট কীভাবে ভেঙে পড়ে। অনলাইন শপিংয়ের সব মজা, বিল ছাড়া।",
        },
      },
      {
        key: "p:dhaka-person",
        why: {
          en: "Ten questions about traffic, food and rain decide what kind of Dhaka person you are. The result card is made to be screenshotted.",
          bn: "জ্যাম, খাবার আর বৃষ্টি নিয়ে দশটা প্রশ্নে ঠিক হবে তুমি কেমন ঢাকাবাসী। রেজাল্ট কার্ডটা স্ক্রিনশট নেওয়ার জন্যই বানানো।",
        },
      },
    ],
    related: ["x:food-delivery-simulator", "x:random-life-decision", "g:programmer-rage"],
    guides: ["funny-online-games", "random-things-to-do-online"],
    links: [{ href: "/bored", label: { en: "Bored? Start here", bn: "বোর? এখান থেকে শুরু" } }],
    faq: [
      {
        q: { en: "Do I need to sign up?", bn: "সাইন আপ করতে হবে?" },
        a: {
          en: "No. There are no accounts on Hottogol. Your best scores and achievements are saved in your own browser, and nothing about you is sent to a server.",
          bn: "না। হট্টগোলে কোনো অ্যাকাউন্ট নেই। তোমার সেরা স্কোর আর অ্যাচিভমেন্ট তোমার নিজের ব্রাউজারেই সেভ থাকে, তোমার কোনো তথ্য সার্ভারে যায় না।",
        },
      },
      {
        q: { en: "Is it only funny if I live in Dhaka?", bn: "ঢাকায় না থাকলে কি মজা লাগবে না?" },
        a: {
          en: "The jokes come from everyday Dhaka life — CNGs, bazars, landlords — but the situations are familiar to anyone who has fought traffic or a landlord. Every page works in English and Bangla.",
          bn: "জোকসগুলো ঢাকার রোজকার জীবন থেকে — সিএনজি, বাজার, বাড়িওয়ালা — তবে জ্যাম বা বাড়িওয়ালার সাথে যুদ্ধ করা যে কেউ পরিস্থিতিগুলো চিনবে। প্রতিটা পেজ ইংরেজি আর বাংলা দুই ভাষাতেই চলে।",
        },
      },
    ],
  },

  "games-to-play-when-bored": {
    slug: "games-to-play-when-bored",
    emoji: "🎮",
    name: { en: "Games for when you're bored", bn: "বোর লাগলে খেলার গেম" },
    h1: { en: "Games to play when you're bored", bn: "বোর লাগলে খেলার মতো গেম" },
    intro: [
      {
        en: "Boredom is best fixed by something you can start in two seconds and lose in thirty. These are Hottogol's browser games: quick to learn, hard to put down, and built around a score you will want to beat.",
        bn: "বোরডম কাটানোর সেরা উপায় এমন কিছু যা দুই সেকেন্ডে শুরু হয় আর ত্রিশ সেকেন্ডে হারা যায়। এগুলো হট্টগোলের ব্রাউজার গেম: শিখতে সহজ, ছাড়তে কঠিন, আর এমন স্কোর যেটা হারাতে ইচ্ছা করবে।",
      },
      {
        en: "When you finish a round you can send a friend a link to the exact same round, so the argument about who is better gets settled properly.",
        bn: "রাউন্ড শেষ হলে বন্ধুকে হুবহু সেই রাউন্ডের লিংক পাঠাতে পারো — তাহলে কে ভালো সেই তর্কটা ঠিকঠাক মিটে যায়।",
      },
    ],
    seo: {
      title: "Games to Play When You're Bored — Free Browser Games",
      description:
        "Free browser games for when you're bored: dodge Dhaka traffic, balance a cup of tea, run a junction, haggle at the bazar. No download, works on phones.",
    },
    picks: [
      {
        key: "g:traffic-dodge",
        why: {
          en: "Steer a motorbike through buses, CNGs and the occasional goat. The traffic speeds up as you survive, and near-misses earn bonus points.",
          bn: "বাস, সিএনজি আর মাঝেমধ্যে ছাগলের ফাঁক দিয়ে বাইক চালাও। যত টিকে থাকবে ট্রাফিক তত দ্রুত হবে, আর একদম গা ঘেঁষে পার হলে বোনাস।",
        },
      },
      {
        key: "g:chicken-crossing",
        why: {
          en: "Hop a chicken across lanes of traffic before the camera catches up with you. Easy to start, surprisingly tense by level three.",
          bn: "ক্যামেরা ধরে ফেলার আগে মুরগিকে লেনের পর লেন পার করাও। শুরু করা সহজ, কিন্তু লেভেল তিনে গিয়ে অবাক করা টেনশন।",
        },
      },
      {
        key: "g:tea-balance",
        why: {
          en: "Carry a full cup of tea down a bumpy road for sixty seconds without spilling it. Harder than it sounds, which is the whole point.",
          bn: "এক কাপ ভরা চা নিয়ে ঝাঁকুনির রাস্তায় ষাট সেকেন্ড চলো, এক ফোঁটাও না ফেলে। শুনতে যত সহজ, আসলে ততটা না — মজাটা ওখানেই।",
        },
      },
      {
        key: "g:bazar-bargain",
        why: {
          en: "Haggle for five items on one budget against vendors who all claim it is the last price. It is turn-based, so you can play it slowly.",
          bn: "এক বাজেটে পাঁচটা জিনিস কেনো, আর প্রত্যেক দোকানি বলবে “এটাই শেষ দাম”। টার্ন-বেসড, তাই ধীরেসুস্থে খেলা যায়।",
        },
      },
      {
        key: "g:traffic-controller",
        why: {
          en: "Run a four-way junction for one minute. Keep cars moving, avoid crashes, and try not to cause total gridlock.",
          bn: "এক মিনিট একটা চার রাস্তার মোড় সামলাও। গাড়ি চালু রাখো, দুর্ঘটনা এড়াও, আর পুরো জ্যাম লাগিয়ে ফেলো না।",
        },
      },
      {
        key: "g:traffic-boss",
        why: {
          en: "A weekly boss fight: three lives, sixty seconds, and the same boss for everyone until the week ends.",
          bn: "সাপ্তাহিক বস-ফাইট: তিনটা লাইফ, ষাট সেকেন্ড, আর সপ্তাহ শেষ না হওয়া পর্যন্ত সবার জন্য একই বস।",
        },
      },
    ],
    related: ["g:dont-tap", "g:cng-catch", "g:queue-sim"],
    guides: ["one-minute-games", "funny-online-games"],
    links: [
      { href: "/games", label: { en: "All games", bn: "সব গেম" } },
      { href: "/daily", label: { en: "Today's daily challenge", bn: "আজকের ডেইলি চ্যালেঞ্জ" } },
    ],
    faq: [
      {
        q: { en: "Can I play these on my phone?", bn: "ফোনে খেলা যাবে?" },
        a: {
          en: "Yes. Every game is designed for phone screens first and is played with taps. On a computer you can use the keyboard as well.",
          bn: "হ্যাঁ। প্রতিটা গেম আগে ফোনের স্ক্রিনের কথা ভেবে বানানো, ট্যাপ করে খেলা যায়। কম্পিউটারে কিবোর্ডও ব্যবহার করা যায়।",
        },
      },
      {
        q: { en: "How do I challenge a friend?", bn: "বন্ধুকে কীভাবে চ্যালেঞ্জ করব?" },
        a: {
          en: "Finish a round and tap Challenge a friend. The link replays your exact round, so your friend faces the same traffic with your score to beat.",
          bn: "একটা রাউন্ড শেষ করে “বন্ধুকে চ্যালেঞ্জ করুন” চাপো। লিংকটা তোমার হুবহু রাউন্ডটাই আবার চালায়, তাই বন্ধু একই ট্রাফিকে তোমার স্কোর হারানোর চেষ্টা করবে।",
        },
      },
    ],
  },

  "one-minute-games": {
    slug: "one-minute-games",
    emoji: "⏱️",
    name: { en: "One-minute games", bn: "এক মিনিটের গেম" },
    h1: { en: "One-minute games you can finish right now", bn: "এক মিনিটের গেম — এখনই শেষ করা যায়" },
    intro: [
      {
        en: "Sometimes you only have a minute: a lift ride, a loading screen, the wait before a meeting starts. Everything on this page finishes in roughly thirty to sixty seconds, so you can play a round, see your score and get back to whatever you were avoiding.",
        bn: "কখনো হাতে থাকে মাত্র এক মিনিট: লিফটে ওঠা, লোডিং স্ক্রিন, মিটিং শুরুর আগের অপেক্ষা। এই পেজের সবকিছু মোটামুটি ত্রিশ থেকে ষাট সেকেন্ডে শেষ — একটা রাউন্ড খেলো, স্কোর দেখো, তারপর যে কাজটা এড়াচ্ছিলে সেখানে ফিরে যাও।",
      },
      {
        en: "The time on each card is a typical round, not a limit — a bad round is usually shorter.",
        bn: "প্রতিটা কার্ডের সময়টা সাধারণ একটা রাউন্ডের, কোনো সীমা না — খারাপ রাউন্ড সাধারণত আরও ছোট হয়।",
      },
    ],
    seo: {
      title: "One-Minute Games — Quick Free Games You Can Finish Now",
      description:
        "Quick games that finish in 30–60 seconds: catch a CNG, test your reaction time, dodge traffic, carry a cup of tea. Free in your browser, perfect for short breaks.",
    },
    picks: [
      {
        key: "g:cng-catch",
        why: {
          en: "Tap when a speeding CNG reaches the stop zone. Thirty seconds, three misses allowed, and combos for perfect timing.",
          bn: "দ্রুতগামী সিএনজি স্টপ জোনে এলেই ট্যাপ। ত্রিশ সেকেন্ড, তিনবার মিস করার সুযোগ, আর নিখুঁত টাইমিংয়ে কম্বো।",
        },
      },
      {
        key: "g:dont-tap",
        why: {
          en: "A reaction test with a twist: the screen tries to trick you into tapping too early. A good way to find out how fast you really are.",
          bn: "একটু প্যাঁচানো রিঅ্যাকশন টেস্ট: স্ক্রিন তোমাকে আগেভাগে ট্যাপ করাতে ধোঁকা দেবে। তুমি আসলে কত দ্রুত, জানার ভালো উপায়।",
        },
      },
      {
        key: "g:traffic-dodge",
        why: {
          en: "Weave through traffic for as long as you last; most rounds end well inside a minute. Last-second dodges pay best.",
          bn: "যতক্ষণ পারো ট্রাফিকের ফাঁক দিয়ে চলো; বেশিরভাগ রাউন্ড এক মিনিটের অনেক আগেই শেষ। শেষ মুহূর্তে পাশ কাটালে সবচেয়ে বেশি পয়েন্ট।",
        },
      },
      {
        key: "g:chicken-crossing",
        why: {
          en: "Short hops, quick decisions and a camera that will not wait for you. A decent run takes under a minute.",
          bn: "ছোট ছোট লাফ, দ্রুত সিদ্ধান্ত, আর এমন ক্যামেরা যা তোমার জন্য অপেক্ষা করবে না। মোটামুটি ভালো একটা রান এক মিনিটের কম।",
        },
      },
      {
        key: "g:tea-balance",
        why: {
          en: "Exactly sixty seconds if you never spill — a lot fewer if you do.",
          bn: "একদম না ফেললে ঠিক ষাট সেকেন্ড — ফেললে অনেক কম।",
        },
      },
      {
        key: "x:random-life-decision",
        why: {
          en: "Not a reflex game: roll the dice on a career and see where life lands. It takes under a minute and needs no skill at all.",
          bn: "রিফ্লেক্স গেম না: ছক্কা ফেলে ক্যারিয়ার বেছে নাও, দেখো জীবন কোথায় গিয়ে দাঁড়ায়। এক মিনিটের কম, কোনো দক্ষতাই লাগে না।",
        },
      },
    ],
    related: ["g:traffic-controller", "g:traffic-boss", "x:dhaka-cng-simulator"],
    guides: ["games-to-play-when-bored", "random-things-to-do-online"],
    links: [{ href: "/daily", label: { en: "A new one-minute challenge every day", bn: "প্রতিদিন নতুন এক মিনিটের চ্যালেঞ্জ" } }],
    faq: [
      {
        q: { en: "Is there a new game every day?", bn: "প্রতিদিন কি নতুন গেম আসে?" },
        a: {
          en: "There is a Daily Hottogol: one short challenge per day with the same round for everyone. Your result is saved on your device so you can compare with yesterday.",
          bn: "ডেইলি হট্টগোল আছে: প্রতিদিন একটা ছোট চ্যালেঞ্জ, সবার জন্য একই রাউন্ড। তোমার ফলাফল তোমার ডিভাইসে সেভ থাকে, তাই গতকালের সাথে মিলিয়ে দেখতে পারো।",
        },
      },
    ],
  },

  "random-things-to-do-online": {
    slug: "random-things-to-do-online",
    emoji: "🎲",
    name: { en: "Random things to do online", bn: "অনলাইনে র‍্যান্ডম কিছু করার" },
    h1: { en: "Random things to do online (that aren't scrolling)", bn: "অনলাইনে র‍্যান্ডম কিছু করো (স্ক্রল করা বাদে)" },
    intro: [
      {
        en: "If you have refreshed every app twice and still feel restless, try doing something instead of watching something. This list mixes a quiz, a generator, a simulator and a few games, so whatever mood you are in, one of them should fit.",
        bn: "সব অ্যাপ দুবার রিফ্রেশ করেও যদি অস্থির লাগে, কিছু দেখার বদলে কিছু করে দেখো। এই তালিকায় আছে একটা কুইজ, একটা জেনারেটর, একটা সিমুলেটর আর কয়েকটা গেম — মুড যেমনই হোক, একটা না একটা মিলবে।",
      },
      {
        en: "Still can't choose? The Chaos Roulette on the homepage spins through everything and picks for you.",
        bn: "তবুও বাছতে পারছ না? হোমপেজের হট্টগোল রুলেট সবকিছুর মধ্যে ঘুরে তোমার জন্য বেছে দেবে।",
      },
    ],
    seo: {
      title: "Random Things to Do Online (That Aren't Scrolling)",
      description:
        "Random things to do online when you're restless: take a Dhaka personality quiz, generate an excuse, roll a random trip, fight a weekly boss. Free, no sign-up.",
    },
    picks: [
      {
        key: "p:dhaka-person",
        why: {
          en: "Answer ten questions and get a Dhaka personality type. It is more fun with friends — take it together and compare results.",
          bn: "দশটা প্রশ্নের উত্তর দিয়ে তোমার ঢাকা পার্সোনালিটি জেনে নাও। বন্ধুদের সাথে আরও মজা — একসাথে দাও, তারপর ফল মিলিয়ে দেখো।",
        },
      },
      {
        key: "p:excuses",
        why: {
          en: "Generate an excuse for being late, skipping a party or missing a deadline, then send the worst one to the group chat.",
          bn: "দেরি, দাওয়াত এড়ানো বা ডেডলাইন মিস করার অজুহাত বানাও, তারপর সবচেয়ে বাজেটা গ্রুপ চ্যাটে পাঠিয়ে দাও।",
        },
      },
      {
        key: "x:random-life-decision",
        why: {
          en: "Let dice choose your career, then live with the consequences for about a minute.",
          bn: "ছক্কাকে তোমার ক্যারিয়ার বাছতে দাও, তারপর মিনিটখানেক সেই ফলাফল নিয়ে বাঁচো।",
        },
      },
      {
        key: "g:chaos-machine",
        why: {
          en: "One button rolls a random Dhaka trip — vehicle, weather, budget, mission — and you make five choices to survive it. No two rolls are alike.",
          bn: "একটা বোতাম চাপলেই র‍্যান্ডম ঢাকা ট্রিপ — বাহন, আবহাওয়া, বাজেট, মিশন — আর টিকে থাকতে পাঁচটা সিদ্ধান্ত। দুটো রোল কখনো এক রকম না।",
        },
      },
      {
        key: "x:food-delivery-simulator",
        why: {
          en: "Order dinner and follow a rider who is permanently two minutes away. A gentle comedy about waiting.",
          bn: "রাতের খাবার অর্ডার দাও আর এমন রাইডারকে অনুসরণ করো যে সবসময় দুই মিনিট দূরে। অপেক্ষা নিয়ে একটা নরম কমেডি।",
        },
      },
      {
        key: "g:traffic-boss",
        why: {
          en: "Take on this week's boss: a sixty-second traffic gauntlet that is replaced by a new fight every week.",
          bn: "এই সপ্তাহের বসের মুখোমুখি হও: ষাট সেকেন্ডের ট্রাফিক-যুদ্ধ, প্রতি সপ্তাহে নতুন লড়াই।",
        },
      },
    ],
    related: ["g:queue-sim", "x:fake-shopping-spree", "g:dont-tap"],
    guides: ["funny-websites", "games-to-play-when-bored"],
    links: [
      { href: "/world", label: { en: "See everything on one map", bn: "সবকিছু এক ম্যাপে দেখো" } },
      { href: "/bored", label: { en: "Bored? Start here", bn: "বোর? এখান থেকে শুরু" } },
    ],
    faq: [
      {
        q: { en: "What is the Chaos Roulette?", bn: "হট্টগোল রুলেট কী?" },
        a: {
          en: "A button on the Hottogol homepage that spins through every activity and drops you into a random one. Handy when you genuinely don't mind what you play.",
          bn: "হট্টগোল হোমপেজের একটা বোতাম যা সব অ্যাক্টিভিটির মধ্যে ঘুরে তোমাকে র‍্যান্ডম একটায় নিয়ে যায়। কী খেলবে তাতে সত্যিই কিছু যায় আসে না এমন সময় কাজে লাগে।",
        },
      },
    ],
  },

  "funny-online-games": {
    slug: "funny-online-games",
    emoji: "🤣",
    name: { en: "Funny online games", bn: "মজার অনলাইন গেম" },
    h1: { en: "Funny online games with ridiculous endings", bn: "হাস্যকর এন্ডিংসহ মজার অনলাইন গেম" },
    intro: [
      {
        en: "Most games reward you for winning. These are funnier when things go wrong. Each is a short game where your choices — or your timing — lead to an ending written as a joke.",
        bn: "বেশিরভাগ গেম জিতলে পুরস্কার দেয়। এগুলো বরং গোলমাল হলেই বেশি মজার। প্রতিটা ছোট গেমে তোমার সিদ্ধান্ত — বা টাইমিং — তোমাকে নিয়ে যায় জোকের মতো লেখা একটা এন্ডিংয়ে।",
      },
      {
        en: "Several have rare endings that only appear with the right mix of choices and luck, which is a good excuse to play them twice.",
        bn: "কয়েকটায় বিরল এন্ডিং আছে যা শুধু ঠিকঠাক সিদ্ধান্ত আর ভাগ্য মিললেই আসে — আরেকবার খেলার ভালো অজুহাত।",
      },
    ],
    seo: {
      title: "Funny Online Games with Ridiculous Endings",
      description:
        "Funny online games where losing is the best part: deliver food as a rider, fix a deploy at 3 AM, survive a Dhaka queue, haggle at the bazar. Free in your browser.",
    },
    picks: [
      {
        key: "g:delivery-sim",
        why: {
          en: "Play the delivery rider for once: pick up the order, find the address, survive the traffic and the customer. Eight endings, one of them legendary.",
          bn: "এবার তুমিই ডেলিভারি রাইডার: অর্ডার তোলো, ঠিকানা খোঁজো, জ্যাম আর কাস্টমার দুটোই সামলাও। আটটা এন্ডিং, একটা কিংবদন্তি।",
        },
      },
      {
        key: "g:programmer-rage",
        why: {
          en: "Fix a broken deploy before morning: read the logs, ask the chatbot, or just deploy again and hope. Developers will laugh; everyone else will laugh at developers.",
          bn: "সকালের আগে ভাঙা ডিপ্লয় ঠিক করো: লগ পড়ো, চ্যাটবটকে জিজ্ঞেস করো, অথবা আবার ডিপ্লয় করে আশা রাখো। ডেভেলপাররা হাসবে; বাকিরা হাসবে ডেভেলপারদের দেখে।",
        },
      },
      {
        key: "g:queue-sim",
        why: {
          en: "Wait in a Dhaka queue and decide how to handle line-cutters, closing counters and the lunch break. Reaching the front counts as winning.",
          bn: "ঢাকার লাইনে দাঁড়াও আর ঠিক করো লাইন ভাঙা লোক, বন্ধ হয়ে যাওয়া কাউন্টার আর লাঞ্চ ব্রেক কীভাবে সামলাবে। সামনে পৌঁছানোই জয়।",
        },
      },
      {
        key: "g:chaos-machine",
        why: {
          en: "Random scenarios lead to ten different outcomes, from a smooth arrival to total disaster. Re-roll until you get a story worth sharing.",
          bn: "র‍্যান্ডম পরিস্থিতি থেকে দশ রকম ফলাফল — নির্ঝঞ্ঝাট পৌঁছানো থেকে পুরো বিপর্যয়। শেয়ার করার মতো গল্প না পাওয়া পর্যন্ত আবার রোল করো।",
        },
      },
      {
        key: "g:bazar-bargain",
        why: {
          en: "Bluff, walk away and come back. Every vendor has a personality and a hidden lowest price, and two rare endings are very hard to reach.",
          bn: "চাপা মারো, হেঁটে চলে যাও, আবার ফেরো। প্রত্যেক দোকানির নিজস্ব মেজাজ আর গোপন সর্বনিম্ন দাম আছে, আর দুটো বিরল এন্ডিং পাওয়া খুব কঠিন।",
        },
      },
      {
        key: "x:job-resignation-simulator",
        why: {
          en: "Technically a simulator, but it plays like a choose-your-own-disaster game — every choice pushes your resignation further off the rails.",
          bn: "আসলে সিমুলেটর, কিন্তু খেলতে লাগে নিজের বিপর্যয় নিজে বেছে নেওয়ার গেমের মতো — প্রতিটা সিদ্ধান্ত তোমার রিজাইনকে আরও লাইনচ্যুত করে।",
        },
      },
    ],
    related: ["x:house-rent-simulator", "g:tea-balance", "p:excuses"],
    guides: ["funny-websites", "games-to-play-when-bored"],
    links: [{ href: "/bored", label: { en: "Bored? Start here", bn: "বোর? এখান থেকে শুরু" } }],
    faq: [
      {
        q: { en: "What are legendary endings?", bn: "কিংবদন্তি এন্ডিং কী?" },
        a: {
          en: "Some games have rare outcomes that only happen with the right mix of choices and luck. The result card marks them as legendary, so you will know when you have found one.",
          bn: "কিছু গেমে বিরল ফলাফল আছে যা শুধু সঠিক সিদ্ধান্ত আর ভাগ্যের মিশেলে ঘটে। রেজাল্ট কার্ডে সেগুলো কিংবদন্তি হিসেবে চিহ্নিত থাকে, তাই পেলে বুঝে যাবে।",
        },
      },
    ],
  },
};
