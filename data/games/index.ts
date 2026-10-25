import type { Accent } from "@/components/ui/styles";
import type { ActivityTag, CategorySlug, Mechanic } from "@/lib/experience/types";
import type { Text } from "@/lib/i18n/core";

// Registry of quick reflex games (separate from story "experiences").
// Never rename a slug once shipped: share links contain it.

export type Game = {
  slug: string;
  title: Text;
  tagline: Text;
  description: Text;
  emoji: string;
  accent: Accent;
  durationSec: number;
  /** For "You might also like" (same vocabulary as experiences). */
  category: CategorySlug;
  mechanic: Mechanic;
  tags: readonly ActivityTag[];
  /** English SEO copy (crawlers have no language cookie). */
  seo: { title: string; description: string };
};

export const games: Game[] = [
  {
    slug: "cng-catch",
    title: { en: "CNG Catch", bn: "সিএনজি ক্যাচ" },
    tagline: { en: "Hail it at the perfect moment. Or walk.", bn: "ঠিক সময়ে থামান। নইলে হাঁটুন।" },
    description: {
      en: "A 30-second reflex game: CNGs zoom past faster and faster. Tap when one is in the stop zone, chain combos, and don't miss three times.",
      bn: "৩০ সেকেন্ডের রিফ্লেক্স গেম: সিএনজি একের পর এক আরও জোরে ছুটে যায়। স্টপ জোনে এলেই ট্যাপ করুন, কম্বো বানান, আর তিনবার মিস করবেন না।",
    },
    emoji: "🛺",
    accent: "cng",
    durationSec: 30,
    category: "bangladesh",
    mechanic: "reflex",
    tags: ["cng", "traffic"],
    seo: {
      title: "CNG Catch — 30-Second Dhaka Reflex Game",
      description: "Tap the speeding CNG at the perfect moment. A free 30-second Dhaka reflex game with combos, funny results and shareable challenges. No sign-up.",
    },
  },
  {
    slug: "traffic-dodge",
    title: { en: "Dhaka Traffic Dodge", bn: "ঢাকা ট্রাফিক ডজ" },
    tagline: { en: "Buses, CNGs, rickshaws and one goat. Don't touch any of them.", bn: "বাস, সিএনজি, রিকশা আর একটা ছাগল। কাউকে ছোঁবেন না।" },
    description: {
      en: "A 30–60 second arcade dodge: weave your motorbike through ever-faster Dhaka traffic, score last-second near-misses, and survive VIP convoys, bus races and goat crossings.",
      bn: "৩০–৬০ সেকেন্ডের আর্কেড গেম: ক্রমশ দ্রুত হওয়া ঢাকার ট্রাফিকের ফাঁক দিয়ে বাইক চালান, শেষ মুহূর্তে পাশ কাটিয়ে বোনাস নিন, আর টিকে থাকুন ভিআইপি মুভমেন্ট, বাস রেস আর ছাগল পারাপারে।",
    },
    emoji: "🛵",
    accent: "violet",
    durationSec: 45,
    category: "travel",
    mechanic: "reflex",
    tags: ["traffic", "bike"],
    seo: {
      title: "Dhaka Traffic Dodge — Free Arcade Dodging Game",
      description: "Weave a motorbike through buses, CNGs, rickshaws and goats in this free 30–60 second Dhaka traffic arcade game. Near-miss combos, funny titles, shareable challenges.",
    },
  },
  {
    slug: "bazar-bargain",
    title: { en: "Bazar Bargain", bn: "বাজার বার্গেইন" },
    tagline: { en: "Five items, one budget, six vendors who all say “last price”.", bn: "পাঁচটা জিনিস, এক বাজেট, আর সব দোকানির “শেষ দাম”।" },
    description: {
      en: "A Bangladeshi bazar negotiation game: haggle for hilsa, eggs and onions, bluff, walk away, get refused — and chase rare legendary endings.",
      bn: "বাংলাদেশি বাজারের দরদামের খেলা: ইলিশ, ডিম, পেঁয়াজ নিয়ে দরদাম করুন, চাপা মারুন, দরকার হলে হেঁটে চলে যান — আর খুঁজুন বিরল কিংবদন্তি এন্ডিং।",
    },
    emoji: "🛒",
    accent: "tangerine",
    durationSec: 90,
    category: "shopping",
    mechanic: "choices",
    tags: ["haggling", "money", "food"],
    seo: {
      title: "Bazar Bargain — Bangladesh Market Haggling Game",
      description: "Haggle with stubborn, dramatic and sleepy vendors in this free Bangladesh bazar negotiation game. Save money, avoid getting refused, unlock legendary endings. No sign-up.",
    },
  },
  {
    slug: "tea-balance",
    title: { en: "Tea Balance", bn: "টি ব্যালেন্স" },
    tagline: { en: "One full cup of cha. One Dhaka road. Zero chance.", bn: "এক কাপ ভরা চা। এক ঢাকার রাস্তা। কোনো চান্স নেই।" },
    description: {
      en: "A 20–60 second balancing game: push a cha cart up a Dhaka road, dodge potholes, manholes and goats, and keep the tea from sloshing out.",
      bn: "২০–৬০ সেকেন্ডের ব্যালেন্সিং গেম: ঢাকার রাস্তায় চায়ের কার্ট ঠেলুন, গর্ত, ম্যানহোল আর ছাগল এড়ান, আর চা ছলকে পড়তে দেবেন না।",
    },
    emoji: "☕",
    accent: "marigold",
    durationSec: 60,
    category: "food",
    mechanic: "reflex",
    tags: ["food"],
    seo: {
      title: "Tea Balance — Don't Spill the Cha (Dhaka Balancing Game)",
      description: "Carry a full cup of tea through potholes, manholes and goats in this free 20–60 second Dhaka balancing game. Smooth moves, funny endings, shareable challenges.",
    },
  },
  {
    slug: "dont-tap",
    title: { en: "Don't Tap", bn: "ডোন্ট ট্যাপ" },
    tagline: { en: "It says DON'T TAP. Then it lies. Then it says TAP!", bn: "লেখা “চাপবেন না”। তারপর মিথ্যা বলে। তারপর “চাপুন!”" },
    description: {
      en: "A 5-round reaction test with fake signals: wait for green TAP!, ignore the tricks, and see your real reaction time in milliseconds.",
      bn: "নকল সিগন্যালসহ ৫ রাউন্ডের রিঅ্যাকশন টেস্ট: সবুজ “চাপুন!”-এর অপেক্ষা করুন, কৌশলে পা দেবেন না, আর দেখুন আপনার আসল রিঅ্যাকশন টাইম মিলিসেকেন্ডে।",
    },
    emoji: "🚦",
    accent: "chili",
    durationSec: 30,
    category: "random",
    mechanic: "reflex",
    tags: ["reaction"],
    seo: {
      title: "Don't Tap — Free Reaction Time Test With Fake Signals",
      description: "Test your reaction time in milliseconds: 5 rounds, fake-out signals, average and best times, funny titles and shareable challenges. Free, no sign-up.",
    },
  },
  {
    slug: "chaos-machine",
    title: { en: "Chaos Machine", bn: "কেওস মেশিন" },
    tagline: { en: "Press one button. Get a random Dhaka trip. Survive it.", bn: "একটা বোতাম চাপুন। পান র‍্যান্ডম ঢাকা যাত্রা। টিকে থাকুন।" },
    description: {
      en: "Roll a random scenario — vehicle, destination, budget, weather, mood, traffic, mission and a chaos modifier — then make five quick choices to survive it.",
      bn: "র‍্যান্ডম একটা পরিস্থিতি বানান — বাহন, গন্তব্য, বাজেট, আবহাওয়া, মেজাজ, ট্রাফিক, মিশন আর একটা হট্টগোল মডিফায়ার — তারপর পাঁচটা দ্রুত সিদ্ধান্তে টিকে থাকুন।",
    },
    emoji: "🔥",
    accent: "tangerine",
    durationSec: 60,
    category: "bangladesh",
    mechanic: "choices",
    tags: ["traffic", "cng", "money"],
    seo: {
      title: "Chaos Machine — Random Dhaka Trip Generator Game",
      description: "Press one button to roll a random Dhaka trip — vehicle, weather, traffic, mission and chaos — then survive it in five choices. Free, funny, shareable challenges.",
    },
  },
  {
    slug: "delivery-sim",
    title: { en: "Delivery Simulator", bn: "ডেলিভারি সিমুলেটর" },
    tagline: { en: "This time, you're the rider.", bn: "এবার আপনিই রাইডার।" },
    description: {
      en: "A 1–2 minute rider simulation: accept the order, survive the kitchen, the rain, the pin in a lake, the traffic, “ভাই নিচে আসেন” and a broken lift — then see your score, earnings and star rating.",
      bn: "১–২ মিনিটের রাইডার সিমুলেশন: অর্ডার নিন, রেস্টুরেন্টের অপেক্ষা, বৃষ্টি, লেকের মাঝে পিন, জ্যাম, “ভাই নিচে আসেন” আর নষ্ট লিফট পার হোন — তারপর দেখুন স্কোর, আয় আর স্টার রেটিং।",
    },
    emoji: "🏍️",
    accent: "lime",
    durationSec: 90,
    category: "food",
    mechanic: "choices",
    tags: ["delivery", "food", "traffic"],
    seo: {
      title: "Delivery Simulator — Funny Dhaka Delivery Rider Game",
      description: "Be a Dhaka delivery rider for 90 seconds: late kitchens, wrong pins, rain, traffic, broken lifts and vanishing customers. 8 endings, star ratings, shareable challenges. Free.",
    },
  },
  {
    slug: "chicken-crossing",
    title: { en: "Chicken Crossing Dhaka", bn: "চিকেন ক্রসিং ঢাকা" },
    tagline: { en: "Why did the chicken cross the road? Nobody in Dhaka knows either.", bn: "মুরগি রাস্তা পার হলো কেন? ঢাকার কেউই জানে না।" },
    description: {
      en: "Hop a chicken across buses, CNGs, rickshaws, motorbikes, dogs and phone-staring pedestrians. Levels speed up, U-turns happen, and then Dhaka Mode starts.",
      bn: "বাস, সিএনজি, রিকশা, মোটরবাইক, কুকুর আর ফোনে ডুবে থাকা পথচারীদের ফাঁক দিয়ে মুরগিকে লাফিয়ে পার করান। লেভেল বাড়লে গতি বাড়ে, ইউ-টার্ন হয়, তারপর শুরু হয় ঢাকা মোড।",
    },
    emoji: "🐔",
    accent: "marigold",
    durationSec: 60,
    category: "travel",
    mechanic: "reflex",
    tags: ["traffic", "reaction"],
    seo: {
      title: "Chicken Crossing Dhaka — Free Road-Crossing Arcade Game",
      description: "Hop a chicken across chaotic Dhaka traffic: buses, CNGs, rickshaws, dogs, rain and Dhaka Mode. Near-miss combos, funny levels, personal best and friend challenges. Free.",
    },
  },
  {
    slug: "traffic-controller",
    title: { en: "Dhaka Traffic Controller", bn: "ঢাকা ট্রাফিক কন্ট্রোলার" },
    tagline: { en: "You have four traffic lights and one minute. Good luck.", bn: "আপনার হাতে চারটা ট্রাফিক লাইট আর এক মিনিট। শুভকামনা।" },
    description: {
      en: "Run a chaotic Dhaka junction for 60 seconds: tap the lights, keep buses, CNGs, rickshaws and bikes flowing, and survive U-turns, VIP cars, rain and surprise rush hours.",
      bn: "৬০ সেকেন্ড ঢাকার এক এলোমেলো মোড় সামলান: লাইটে ট্যাপ করুন, বাস-সিএনজি-রিকশা-বাইক চালু রাখুন, আর টিকে থাকুন ইউ-টার্ন, ভিআইপি গাড়ি, বৃষ্টি আর হঠাৎ ভিড়ে।",
    },
    emoji: "🚦",
    accent: "lime",
    durationSec: 60,
    category: "travel",
    mechanic: "reflex",
    tags: ["traffic"],
    seo: {
      title: "Dhaka Traffic Controller — Free Traffic Light Game",
      description: "Control the traffic lights at a chaotic Dhaka intersection for 60 seconds. Avoid crashes and gridlock, build flow combos, survive VIP cars and U-turns. Free, no sign-up.",
    },
  },
  {
    slug: "queue-sim",
    title: { en: "Queue Simulator", bn: "লাইন সিমুলেটর" },
    tagline: { en: "“ভাই আমি শুধু একটা জিনিস নিবো।” — 17 items later…", bn: "“ভাই আমি শুধু একটা জিনিস নিবো।” — ১৭টা জিনিস পরে…" },
    description: {
      en: "Stand in a Dhaka queue and reach the counter without losing your place: line-cutters, “just one thing”, friends from outside, closing counters, “আর ২ মিনিট” — every choice moves you forward or back.",
      bn: "ঢাকার এক লাইনে দাঁড়িয়ে জায়গা না হারিয়ে কাউন্টারে পৌঁছান: লাইন-কাটার, “শুধু একটা জিনিস”, বাইরে থেকে বন্ধু, বন্ধ কাউন্টার, “আর ২ মিনিট” — প্রতিটা সিদ্ধান্তে আপনি এগোবেন বা পেছাবেন।",
    },
    emoji: "🧍",
    accent: "sky",
    durationSec: 90,
    category: "bangladesh",
    mechanic: "choices",
    tags: ["queue", "office"],
    seo: {
      title: "Queue Simulator — Funny Dhaka Line-Waiting Game",
      description: "Survive a Dhaka queue: line-cutters, “just one thing” with 17 items, closing counters and “2 more minutes”. 6 endings, funny ranks, shareable challenges. Free, no sign-up.",
    },
  },
  {
    slug: "programmer-rage",
    title: { en: "Programmer Rage Simulator", bn: "প্রোগ্রামার রেজ সিমুলেটর" },
    tagline: { en: "“It works on my machine.” — famous last words before production.", bn: "“আমার মেশিনে তো চলে।” — প্রোডাকশনের আগের বিখ্যাত শেষ কথা।" },
    description: {
      en: "Your deploy just failed. Check logs, restart things, blame frontend, ask AI or deploy again — survive missing env vars, busy ports and SSL drama. A fictional comedy for developers.",
      bn: "ডিপ্লয় মাত্র ফেইল করেছে। লগ দেখুন, রিস্টার্ট দিন, ফ্রন্টএন্ডের দোষ দিন, এআই-কে জিজ্ঞেস করুন বা আবার ডিপ্লয় করুন — টিকে থাকুন হারানো env var, ব্যস্ত পোর্ট আর এসএসএল নাটকে। ডেভেলপারদের জন্য কাল্পনিক কমেডি।",
    },
    emoji: "🧑‍💻",
    accent: "violet",
    durationSec: 90,
    category: "work",
    mechanic: "choices",
    tags: ["office", "tech"],
    seo: {
      title: "Programmer Rage Simulator — Funny Deploy Debugging Game",
      description: "A fictional comedy for developers: your production deploy fails. Check logs, blame frontend, ask AI, deploy again. 6 endings incl. the Legendary 3 AM Fix. Free, no sign-up.",
    },
  },
  {
    slug: "traffic-boss",
    title: { en: "👹 Dhaka Traffic Boss", bn: "👹 ঢাকা ট্রাফিক বস" },
    tagline: { en: "This week's boss fight. 60 seconds. 3 lives. All of Dhaka's traffic.", bn: "এই সপ্তাহের বস-লড়াই। ৬০ সেকেন্ড। ৩টা জীবন। ঢাকার সব ট্রাফিক।" },
    description: {
      en: "The Weekly Boss: a new 60-second challenge every week, the same for everyone. Dodge cars, buses, swerving CNGs, rickshaws, bikes and pedestrians through rain and rush hour — survive to defeat the boss.",
      bn: "সাপ্তাহিক বস: প্রতি সপ্তাহে নতুন ৬০ সেকেন্ডের চ্যালেঞ্জ, সবার জন্য একই। গাড়ি, বাস, লেন বদলানো সিএনজি, রিকশা, বাইক আর পথচারী এড়িয়ে বৃষ্টি আর ভিড়ে টিকে থাকুন — তবেই বস পরাজিত।",
    },
    emoji: "👹",
    accent: "chili",
    durationSec: 60,
    category: "travel",
    mechanic: "reflex",
    tags: ["traffic", "bike"],
    seo: {
      title: "Weekly Boss — Dhaka Traffic Boss Fight (Free 60-Second Game)",
      description: "A new Hottogol boss every week: survive 60 seconds of Dhaka traffic with 3 lives. Same challenge for everyone this week, personal best saved locally. Free, no sign-up.",
    },
  },
  {
    slug: "ancholik-quiz",
    title: { en: "Battle of the Dialects", bn: "আঞ্চলিক ভাষার লড়াই" },
    tagline: { en: "How well do you understand Bangladesh's regional dialects?", bn: "বাংলার কোন এলাকার ভাষা তুমি কতটা বোঝো?" },
    description: {
      en: "A 10-question regional dialect quiz: pick Jashore, Khulna, Barishal, Noakhali, Sylhet, Chattogram or a mixed Bangladesh round, choose a level, and challenge friends to beat your score. Every word is checked by people before it goes live.",
      bn: "১০ প্রশ্নের আঞ্চলিক ভাষার কুইজ: যশোর, খুলনা, বরিশাল, নোয়াখালী, সিলেট, চট্টগ্রাম বা মিশ্র বাংলাদেশ বেছে নাও, লেভেল ঠিক করো, তারপর বন্ধুদের চ্যালেঞ্জ দাও। প্রতিটা শব্দ মানুষ যাচাই করার পরেই কুইজে আসে।",
    },
    emoji: "🗣️",
    accent: "sky",
    durationSec: 120,
    category: "bangladesh",
    mechanic: "quiz",
    tags: ["language", "life"],
    seo: {
      title: "আঞ্চলিক ভাষার লড়াই — Bangladesh Regional Dialect Quiz",
      description: "বাংলার কোন এলাকার ভাষা তুমি কতটা বোঝো? A free 10-question quiz on Bangladeshi regional dialects — Jashore, Sylhet, Chattogram, Noakhali and more. Challenge your friends.",
    },
  },
  {
    slug: "personality",
    title: { en: "What Type of Bangali Are You?", bn: "তুমি কোন টাইপের বাঙালি?" },
    tagline: { en: "Adda emperor, meme lord or tea-stall philosopher? 8 questions.", bn: "আড্ডার সম্রাট, মিমের রাজা নাকি চায়ের দোকানের দার্শনিক? ৮টা প্রশ্ন।" },
    description: {
      en: "A just-for-fun personality test: 8 questions about adda, guests, rain, tea stalls and Eid holidays, 7 types to discover, and a result card made for the group chat.",
      bn: "শুধু মজার পার্সোনালিটি টেস্ট: আড্ডা, মেহমান, বৃষ্টি, চায়ের দোকান আর ঈদের ছুটি নিয়ে ৮টা প্রশ্ন, ৭টা টাইপ, আর গ্রুপ চ্যাটে পাঠানোর মতো রেজাল্ট কার্ড।",
    },
    emoji: "🎭",
    accent: "violet",
    durationSec: 60,
    category: "bangladesh",
    mechanic: "quiz",
    tags: ["life", "food"],
    seo: {
      title: "তুমি কোন টাইপের বাঙালি? — Funny Bangali Personality Test",
      description: "আড্ডার সম্রাট, মিমের রাজা নাকি চায়ের দোকানের দার্শনিক? A free, just-for-fun 8-question Bangali personality test with a shareable result card. No sign-up.",
    },
  },
  {
    slug: "which-region",
    title: { en: "Which Region Are You From?", bn: "তুমি কোন এলাকার মানুষ?" },
    tagline: { en: "Tell us what you call 10 things. We'll guess your region.", bn: "১০টা জিনিসকে কী বলো জানাও — আমরা বলে দেব তুমি কোন এলাকার।" },
    description: {
      en: "A dialect detective: what do you call a cat, a broom, a chicken? Pick your words and Hottogol guesses which part of Bangladesh you're from — then challenge your friends.",
      bn: "ভাষার গোয়েন্দা: বিড়াল, ঝাড়ু, মুরগিকে তুমি কী বলো? শব্দ বেছে নাও, হট্টগোল আন্দাজ করবে তুমি বাংলাদেশের কোন এলাকার — তারপর বন্ধুদের চ্যালেঞ্জ দাও।",
    },
    emoji: "🕵️",
    accent: "violet",
    durationSec: 60,
    category: "bangladesh",
    mechanic: "quiz",
    tags: ["language", "life"],
    seo: {
      title: "তুমি কোন এলাকার মানুষ? — Which Region of Bangladesh Are You From? (Dialect Quiz)",
      description: "বিড়ালকে কী বলো — মেকুর, বিলাই নাকি বিলোই? Answer 10 dialect questions and Hottogol guesses your region of Bangladesh. Free, just for fun, words from cited sources.",
    },
  },
  {
    slug: "word-map",
    title: { en: "Bangladesh Word Map", bn: "শব্দের মানচিত্র" },
    tagline: { en: "Same thing, a different name in every region.", bn: "একই জিনিস, এলাকা বদলালেই নাম বদলায়।" },
    description: {
      en: "Pick a word — cat, chicken, “where are you going?” — and see what each region of Bangladesh calls it on an interactive map, with sources. Make a poster for your friends.",
      bn: "একটা শব্দ বেছে নাও — বিড়াল, মুরগি, “কোথায় যাচ্ছ?” — আর মানচিত্রে দেখো বাংলাদেশের কোন এলাকায় একে কী বলে, সূত্রসহ। বন্ধুদের জন্য পোস্টার বানাও।",
    },
    emoji: "🗺️",
    accent: "sky",
    durationSec: 60,
    category: "bangladesh",
    mechanic: "generator",
    tags: ["language"],
    seo: {
      title: "শব্দের মানচিত্র — Bangladesh Dialect Word Map (আঞ্চলিক শব্দ)",
      description: "বিড়াল, মুরগি, কোথায় — বাংলাদেশের কোন এলাকায় কী বলে? An interactive map of regional Bangla dialect words for Sylhet, Chattogram, Noakhali, Barishal, Rangpur and more, with sources.",
    },
  },
  {
    slug: "my-bangladesh",
    title: { en: "My Bangladesh Map", bn: "আমার বাংলাদেশ" },
    tagline: { en: "Tap every district you've been to. Get judged.", bn: "যত জেলায় গেছো, ট্যাপ করো। তারপর রায় শোনো।" },
    description: {
      en: "Mark the districts of Bangladesh you've visited on a map of all 64, get a funny title and badges, make a poster, and ask friends how many they've been to.",
      bn: "৬৪ জেলার ম্যাপে যেসব জেলায় গেছো দাগ দাও, মজার টাইটেল আর ব্যাজ পাও, পোস্টার বানাও, তারপর বন্ধুদের জিজ্ঞেস করো তারা কয়টায় গেছে।",
    },
    emoji: "🗺️",
    accent: "marigold",
    durationSec: 60,
    category: "travel",
    mechanic: "generator",
    tags: ["geography", "life"],
    seo: {
      title: "My Bangladesh Map: How Many of the 64 Districts Have You Visited?",
      description: "Tap the districts of Bangladesh you've been to and get a funny title, badges and a downloadable poster. Free, no sign-up, saved only on your device.",
    },
  },
  {
    slug: "book-cricket",
    title: { en: "Book Cricket", bn: "বই ক্রিকেট" },
    tagline: { en: "Open the book. Pray for a 6.", bn: "বই খোলো। ছক্কার দোয়া করো।" },
    description: {
      en: "The back-bench classic: flip the textbook, the page number decides the ball. Defend or slog, chase the Back Bench XI in 2 overs with 3 wickets — and hide the book when Sir walks in.",
      bn: "লাস্ট বেঞ্চের সেই খেলা: বই উল্টাও, পাতার নম্বরই বল। ডিফেন্ড না স্লগ? ২ ওভার আর ৩ উইকেটে লাস্ট বেঞ্চ একাদশের রান তাড়া করো — আর স্যার এলে বই লুকাও।",
    },
    emoji: "🏏",
    accent: "lime",
    durationSec: 50,
    category: "random",
    mechanic: "reflex",
    tags: ["reaction", "school"],
    seo: {
      title: "Book Cricket — The Classroom Page-Flip Cricket Game, Online",
      description: "Play book cricket online: flip the page, the last digit is the ball. Defend or slog through 2 overs, chase the target, challenge friends to beat your score. Free, no sign-up.",
    },
  },
];

/**
 * Games whose own route only redirects (the registry entry exists so
 * challenge links work). Sitemaps and link lists should use this href instead.
 */
export const GAME_HREF_OVERRIDES: Readonly<Record<string, string>> = { "traffic-boss": "/boss" };

export function listGames(): Game[] {
  return games;
}

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
