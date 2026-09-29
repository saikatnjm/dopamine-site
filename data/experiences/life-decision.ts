import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.

const question = (c: RunContext) => c.choices.question ?? "";
const method = (c: RunContext) => c.choices.method ?? "";
const listen = (c: RunContext) => c.choices.listen ?? "";
const roll = (c: RunContext) => c.beats.roll ?? "";
const fate = (c: RunContext) => c.beats.fate ?? "";

const DECIDED = { en: "Decision made", bn: "সিদ্ধান্ত হলো" };
const REGRET = { en: "Regret level", bn: "আফসোসের মাত্রা" };

export const lifeDecision: Experience = {
  slug: "random-life-decision",
  title: { en: "Random Life Decision", bn: "র‍্যান্ডম লাইফ ডিসিশন" },
  tagline: { en: "Let the dice pick your career. What could go wrong?", bn: "ক্যারিয়ার ছক্কা দিয়ে ঠিক করুন। কী আর খারাপ হবে?" },
  description: {
    en: "Ask a big life question, pick a very scientific way to decide, and let fate do the rest. Not financial, career or relationship advice.",
    bn: "জীবনের একটা বড় প্রশ্ন করুন, সিদ্ধান্তের একটা খুবই বৈজ্ঞানিক উপায় বেছে নিন, বাকিটা নিয়তির হাতে। এটা কোনো আর্থিক, ক্যারিয়ার বা সম্পর্কের পরামর্শ নয়।",
  },
  startLabel: { en: "Roll the dice of fate 🎲", bn: "ভাগ্যের ছক্কা ঘোরান 🎲" },
  category: "random",
  emoji: "🎲",
  durationSec: 45,
  accent: "marigold",
  seo: {
    title: "Random Life Decision — Let Fate Decide (Badly)",
    description:
      "A free, funny one-minute decision maker. Ask a big life question, choose how to decide and get a gloriously wrong answer to share.",
  },
  steps: [
    {
      kind: "choice",
      id: "question",
      prompt: { en: "What's the big question?", bn: "বড় প্রশ্নটা কী?" },
      cardLabel: { en: "Question", bn: "প্রশ্ন" },
      options: [
        { id: "career", emoji: "💼", label: { en: "What should my career be?", bn: "আমার ক্যারিয়ার কী হওয়া উচিত?" } },
        { id: "abroad", emoji: "✈️", label: { en: "Should I move abroad?", bn: "বিদেশ চলে যাব?" } },
        { id: "dinner", emoji: "🍽️", label: { en: "What should I eat tonight?", bn: "আজ রাতে কী খাব?" }, hint: { en: "The hardest question of all.", bn: "সবচেয়ে কঠিন প্রশ্ন।" } },
        { id: "text", emoji: "💬", label: { en: "Should I text them back?", bn: "ওকে কি রিপ্লাই দেব?" } },
      ],
    },
    {
      kind: "choice",
      id: "method",
      prompt: { en: "How will you decide?", bn: "কীভাবে সিদ্ধান্ত নেবেন?" },
      cardLabel: { en: "Method", bn: "পদ্ধতি" },
      options: [
        { id: "dice", emoji: "🎲", label: { en: "Roll a dice", bn: "ছক্কা মারুন" }, hint: { en: "Six options. Life has more.", bn: "ছয়টা অপশন। জীবনে আরও বেশি।" } },
        { id: "coin", emoji: "🪙", label: { en: "Flip a coin", bn: "টস করুন" }, hint: { en: "Binary thinking. Efficient.", bn: "হ্যাঁ-না চিন্তা। কার্যকর।" } },
        { id: "mom", emoji: "👩", label: { en: "Ask your mom", bn: "আম্মুকে জিজ্ঞেস করুন" }, hint: { en: "She already knows.", bn: "উনি আগেই জানেন।" } },
        { id: "internet", emoji: "🌐", label: { en: "Ask the internet", bn: "ইন্টারনেটে জিজ্ঞেস করুন" }, hint: { en: "40 answers, all confident.", bn: "৪০টা উত্তর, সবাই নিশ্চিত।" } },
      ],
    },
    {
      kind: "beat",
      id: "roll",
      title: { en: "The universe answers", bn: "মহাবিশ্বের উত্তর" },
      beats: [
        { id: "under-fridge", emoji: "🧊", weight: (c) => (method(c) === "dice" || method(c) === "coin" ? 3 : 0), text: { en: "It rolls under the fridge. It's gone. So is your answer.", bn: "গড়িয়ে ফ্রিজের নিচে চলে গেল। হারিয়ে গেল। আপনার উত্তরও।" } },
        { id: "impossible", emoji: "❓", weight: (c) => (method(c) === "dice" ? 3 : method(c) === "coin" ? 2 : 0), text: { en: "It lands on its edge. Physicists are being called.", bn: "কিনারায় দাঁড়িয়ে পড়ল। পদার্থবিদদের ডাকা হচ্ছে।" } },
        { id: "mom-knew", emoji: "📿", weight: (c) => (method(c) === "mom" ? 6 : 0), text: { en: "Your mom answered before you finished the question. She's been planning this since you were born.", bn: "প্রশ্ন শেষ করার আগেই আম্মু উত্তর দিলেন। আপনার জন্মের পর থেকেই উনি এটা প্ল্যান করছেন।" } },
        { id: "forty-answers", emoji: "🌐", weight: (c) => (method(c) === "internet" ? 6 : 0), text: { en: "The internet gave you 40 answers. 20 say yes, 19 say no, one is selling a course.", bn: "ইন্টারনেট ৪০টা উত্তর দিল। ২০টা হ্যাঁ, ১৯টা না, একটা কোর্স বিক্রি করছে।" } },
        { id: "clear", emoji: "✨", weight: 2, text: { en: "A clear answer. Crisp. Certain. You immediately don't trust it.", bn: "পরিষ্কার উত্তর। নিশ্চিত। আপনি সাথে সাথে অবিশ্বাস করলেন।" } },
      ],
    },
    {
      kind: "choice",
      id: "listen",
      prompt: { en: "Do you follow it?", bn: "মেনে নেবেন?" },
      cardLabel: { en: "You", bn: "আপনি" },
      options: [
        { id: "follow", emoji: "✅", label: { en: "Follow it, no questions", bn: "মেনে নিন, কোনো প্রশ্ন নেই" }, hint: { en: "Trust the process.", bn: "প্রসেসে বিশ্বাস রাখুন।" } },
        { id: "again", emoji: "🔁", label: { en: "Ask again until you like the answer", bn: "পছন্দ না হওয়া পর্যন্ত আবার জিজ্ঞেস" }, hint: { en: "The scientific method.", bn: "বৈজ্ঞানিক পদ্ধতি।" } },
        { id: "opposite", emoji: "🔄", label: { en: "Do the exact opposite", bn: "ঠিক উল্টোটা করুন" }, hint: { en: "Reverse psychology on the universe.", bn: "মহাবিশ্বের উপর উল্টো মনস্তত্ত্ব।" } },
      ],
    },
    {
      kind: "beat",
      id: "fate",
      title: { en: "A sign appears", bn: "একটা সংকেত এলো" },
      beats: [
        { id: "crow", emoji: "🐦‍⬛", weight: 3, text: { en: "A crow lands on your window and stares at you. You take it as a sign. The crow takes your biscuit.", bn: "একটা কাক জানালায় বসে আপনার দিকে তাকিয়ে আছে। আপনি সংকেত ধরে নিলেন। কাক আপনার বিস্কুট নিয়ে গেল।" } },
        { id: "autocorrect", emoji: "⌨️", weight: 3, text: { en: "You type your decision to a friend. Autocorrect changes it. You go with the autocorrect.", bn: "বন্ধুকে সিদ্ধান্ত টাইপ করলেন। অটোকারেক্ট বদলে দিল। আপনি অটোকারেক্টের কথাই মানলেন।" } },
        { id: "uncle", emoji: "🧓", weight: 3, text: { en: "A random uncle at the tea stall gives you 30 minutes of advice. None of it is about your question.", bn: "চায়ের দোকানে এক অচেনা আঙ্কেল ৩০ মিনিট উপদেশ দিলেন। একটাও আপনার প্রশ্ন নিয়ে না।" } },
        { id: "nothing", emoji: "🌙", weight: 1, text: { en: "Nothing happens. The universe is quiet. Suspiciously quiet.", bn: "কিছুই ঘটল না। মহাবিশ্ব চুপ। সন্দেহজনক রকম চুপ।" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "mango-farmer",
      emoji: "🥭",
      title: { en: "Mango Farmer in Rajshahi", bn: "রাজশাহীর আমচাষি" },
      quote: "এবার ফলন ভালো।",
      message: { en: "The answer was clear: mangoes. You now own 40 mango trees. You've never been happier or stickier.", bn: "উত্তর পরিষ্কার: আম। এখন আপনার ৪০টা আমগাছ। এত খুশি আর এত আঠালো আগে কখনো ছিলেন না।" },
      card: [{ label: DECIDED, value: "✅" }, { label: { en: "Mango trees", bn: "আমগাছ" }, value: { en: "🥭 40", bn: "🥭 ৪০" } }],
      shareText: { en: "Let fate choose my career. I'm a mango farmer now 🥭", bn: "ক্যারিয়ার নিয়তির হাতে ছাড়লাম। এখন আমি আমচাষি 🥭" },
      weight: (c) => (question(c) === "career" ? 4 : 0),
    },
    {
      id: "youtuber",
      emoji: "📹",
      title: { en: "Full-Time YouTuber (12 Subscribers)", bn: "ফুল-টাইম ইউটিউবার (১২ সাবস্ক্রাইবার)" },
      quote: "লাইক, কমেন্ট, শেয়ার!",
      message: { en: "You quit everything to make videos. You have 12 subscribers. Nine are relatives. One is you on another account.", bn: "সব ছেড়ে ভিডিও বানাচ্ছেন। ১২ জন সাবস্ক্রাইবার। ৯ জন আত্মীয়। একজন আপনি, অন্য অ্যাকাউন্টে।" },
      card: [{ label: DECIDED, value: "✅" }, { label: { en: "Subscribers", bn: "সাবস্ক্রাইবার" }, value: { en: "12", bn: "১২" } }],
      shareText: { en: "Let fate pick my career. I'm a YouTuber with 12 subscribers 📹", bn: "ক্যারিয়ার ছক্কায় ঠিক করলাম। এখন ১২ সাবস্ক্রাইবারের ইউটিউবার 📹" },
      weight: (c) => (question(c) === "career" ? 3 + (method(c) === "internet" ? 2 : 0) : 0),
    },
    {
      id: "back-for-biryani",
      emoji: "✈️",
      title: { en: "Moved Abroad, Came Back for Biryani", bn: "বিদেশ গেলেন, বিরিয়ানির টানে ফিরলেন" },
      quote: "ওখানে আসল কাচ্চি পাওয়া যায় না।",
      message: { en: "You moved abroad. Three months later you flew back because no one there makes proper kacchi. Worth it.", bn: "বিদেশ গেলেন। তিন মাস পর ফিরে এলেন কারণ ওখানে কেউ ঠিকমতো কাচ্চি বানাতে পারে না। পুরোপুরি যৌক্তিক।" },
      card: [{ label: DECIDED, value: "✅ → ↩️" }, { label: { en: "Kacchi satisfaction", bn: "কাচ্চি সন্তুষ্টি" }, value: "💯" }],
      shareText: { en: "Moved abroad, came back 3 months later for biryani ✈️🍛", bn: "বিদেশ গেলাম, ৩ মাস পর বিরিয়ানির টানে ফিরে এলাম ✈️🍛" },
      weight: (c) => (question(c) === "abroad" ? 6 : 0),
    },
    {
      id: "khichuri",
      emoji: "🍲",
      title: { en: "Khichuri. Again.", bn: "আবার খিচুড়ি" },
      quote: "বৃষ্টির দিন তো, খিচুড়িই হোক।",
      message: { en: "After an hour of deciding, you ate khichuri. You always eat khichuri. The decision was never yours.", bn: "এক ঘণ্টা ভাবার পর খিচুড়ি খেলেন। আপনি সবসময় খিচুড়িই খান। সিদ্ধান্তটা কখনোই আপনার ছিল না।" },
      card: [{ label: DECIDED, value: { en: "✅ (after 1 hour)", bn: "✅ (১ ঘণ্টা পর)" } }, { label: { en: "Menu", bn: "মেনু" }, value: "🍲" }],
      shareText: { en: "Spent an hour deciding dinner. Ate khichuri. Again 🍲", bn: "রাতের খাবার ঠিক করতে এক ঘণ্টা গেল। খেলাম খিচুড়ি। আবার 🍲" },
      weight: (c) => (question(c) === "dinner" ? 6 : 0),
    },
    {
      id: "left-on-read",
      emoji: "💬",
      title: { en: "You Typed for 3 Hours", bn: "৩ ঘণ্টা ধরে টাইপিং" },
      quote: "typing…",
      message: { en: "You wrote, deleted and rewrote the reply 41 times. You finally sent \"haha ok\". They replied \"👍\". Peace.", bn: "রিপ্লাই ৪১ বার লিখলেন, মুছলেন, আবার লিখলেন। শেষে পাঠালেন \"haha ok\"। উত্তর এলো \"👍\"। শান্তি।" },
      card: [{ label: DECIDED, value: "✅" }, { label: { en: "Drafts deleted", bn: "মুছে ফেলা ড্রাফট" }, value: { en: "41", bn: "৪১" } }],
      shareText: { en: "Took 3 hours to reply to a text. Sent 'haha ok' 💬", bn: "একটা মেসেজের রিপ্লাই দিতে ৩ ঘণ্টা লাগল। পাঠালাম 'haha ok' 💬" },
      weight: (c) => (question(c) === "text" ? 6 : 0),
    },
    {
      id: "mom-decided",
      emoji: "🩺",
      title: { en: "Mom Already Decided", bn: "আম্মু আগেই ঠিক করে রেখেছেন" },
      quote: "আমি তো আগেই বলছিলাম।",
      message: { en: "Your mom's answer was ready before your question. It's what she planned. It usually involves a stable job and being home by 9.", bn: "প্রশ্নের আগেই আম্মুর উত্তর রেডি ছিল। উনি যা প্ল্যান করেছিলেন তা-ই। সাধারণত এতে থাকে ভালো চাকরি আর রাত ৯টার মধ্যে বাসায় ফেরা।" },
      card: [{ label: DECIDED, value: { en: "✅ (by mom)", bn: "✅ (আম্মু)" } }, { label: { en: "Arguing", bn: "তর্ক" }, value: { en: "pointless", bn: "অর্থহীন" } }],
      shareText: { en: "Asked my mom a big life question. She'd decided 20 years ago 🩺", bn: "আম্মুকে জীবনের বড় প্রশ্ন করলাম। উনি ২০ বছর আগেই ঠিক করে রেখেছেন 🩺" },
      weight: (c) => (method(c) === "mom" ? 4 + (roll(c) === "mom-knew" ? 2 : 0) : 0),
    },
    {
      id: "asked-47",
      emoji: "🔁",
      title: { en: "Asked 47 Times", bn: "৪৭ বার জিজ্ঞেস" },
      quote: "আর একবার, শেষবার।",
      message: { en: "You asked until you got the answer you wanted. It took 47 tries. The answer was what you wanted all along.", bn: "যে উত্তর চাইছিলেন সেটা না পাওয়া পর্যন্ত জিজ্ঞেস করলেন। ৪৭ বার লাগল। উত্তরটা আসলে শুরু থেকেই আপনি জানতেন।" },
      card: [{ label: { en: "Attempts", bn: "চেষ্টা" }, value: { en: "47", bn: "৪৭" } }, { label: DECIDED, value: { en: "✅ (yours)", bn: "✅ (আপনারটাই)" } }],
      shareText: { en: "Asked fate 47 times until it agreed with me 🔁", bn: "নিয়তিকে ৪৭ বার জিজ্ঞেস করলাম যতক্ষণ না আমার সাথে একমত হলো 🔁" },
      weight: (c) => (listen(c) === "again" ? 5 : 0),
    },
    {
      id: "opposite-worked",
      emoji: "🔄",
      title: { en: "The Opposite Worked", bn: "উল্টোটাই কাজ করল" },
      quote: "যা বলছে, তার উল্টা।",
      message: { en: "You did the exact opposite of what fate said. It worked perfectly. Fate is now asking you for advice.", bn: "নিয়তি যা বলল তার ঠিক উল্টোটা করলেন। দারুণ কাজ করল। এখন নিয়তি আপনার কাছে পরামর্শ চায়।" },
      card: [{ label: DECIDED, value: "🔄 ✅" }, { label: REGRET, value: "0%" }],
      shareText: { en: "Did the opposite of what fate told me. It worked 🔄", bn: "নিয়তি যা বলল তার উল্টোটা করলাম। কাজ হয়ে গেল 🔄" },
      weight: (c) => (listen(c) === "opposite" ? 5 : 0),
    },
    {
      id: "crow-guided",
      emoji: "🐦‍⬛",
      title: { en: "Guided by a Crow", bn: "কাকের নির্দেশনায়" },
      quote: "কা! কা!",
      message: { en: "You now make every decision by watching which way the crow flies. It's been right twice. You feed it daily.", bn: "এখন কাক কোন দিকে উড়ে যায় দেখে সব সিদ্ধান্ত নেন। দুইবার মিলেছে। রোজ খাওয়ান।" },
      card: [{ label: DECIDED, value: "✅" }, { label: { en: "Advisor", bn: "উপদেষ্টা" }, value: "🐦‍⬛" }],
      shareText: { en: "A crow is now my life coach 🐦‍⬛", bn: "একটা কাক এখন আমার লাইফ কোচ 🐦‍⬛" },
      weight: (c) => (fate(c) === "crow" ? 4 : 0),
    },
    {
      id: "under-the-fridge",
      emoji: "🧊",
      title: { en: "The Answer Is Under the Fridge", bn: "উত্তর ফ্রিজের নিচে" },
      quote: "লাঠি দিয়ে বের করো তো।",
      message: { en: "Your decision is under the fridge. You tried a broom, a ruler and a phone torch. You've decided to live with uncertainty.", bn: "আপনার সিদ্ধান্ত এখন ফ্রিজের নিচে। ঝাড়ু, স্কেল আর ফোনের টর্চ দিয়ে চেষ্টা করলেন। ঠিক করলেন অনিশ্চয়তা নিয়েই বাঁচবেন।" },
      card: [{ label: DECIDED, value: "❌" }, { label: { en: "Fridge moved", bn: "ফ্রিজ সরানো" }, value: "❌" }],
      shareText: { en: "Let a dice decide my future. It rolled under the fridge 🧊", bn: "ভবিষ্যৎ ঠিক করতে ছক্কা মারলাম। ফ্রিজের নিচে চলে গেল 🧊" },
      weight: (c) => (roll(c) === "under-fridge" ? 6 : 0),
    },
    {
      id: "internet-chaos",
      emoji: "🌐",
      title: { en: "The Internet Chose Chaos", bn: "ইন্টারনেট বিশৃঙ্খলা বেছে নিল" },
      quote: "১০টা সিক্রেট যা কেউ বলে না…",
      message: { en: "You followed a video titled \"10 Life Decisions Nobody Tells You\". You bought a course. The course was the decision.", bn: "\"১০টা লাইফ ডিসিশন যা কেউ বলে না\" নামের ভিডিও দেখে সিদ্ধান্ত নিলেন। একটা কোর্স কিনলেন। কোর্সটাই ছিল সিদ্ধান্ত।" },
      card: [{ label: DECIDED, value: "🤡" }, { label: { en: "Courses bought", bn: "কেনা কোর্স" }, value: { en: "1", bn: "১" } }],
      shareText: { en: "Asked the internet a life question. Ended up buying a course 🌐", bn: "ইন্টারনেটকে জীবনের প্রশ্ন করলাম। শেষে একটা কোর্স কিনে ফেললাম 🌐" },
      weight: (c) => (roll(c) === "forty-answers" ? 5 : 0),
    },
    {
      id: "best-decision",
      emoji: "🏆",
      title: { en: "Best Decision of Your Life", bn: "জীবনের সেরা সিদ্ধান্ত" },
      quote: "এইটাই তো চাইছিলাম।",
      message: { en: "It was clear, it felt right and it worked. Nobody will believe fate got it right. Screenshot this.", bn: "পরিষ্কার ছিল, ঠিক লাগল, আর কাজও করল। কেউ বিশ্বাস করবে না নিয়তি ঠিক বলেছে। স্ক্রিনশট নিন।" },
      card: [{ label: DECIDED, value: "✅" }, { label: REGRET, value: "0% (?!)" }],
      shareText: { en: "Let fate make a life decision for me. It was actually right 🏆", bn: "জীবনের সিদ্ধান্ত নিয়তির হাতে দিলাম। আসলেই ঠিক হলো 🏆" },
      weight: (c) => 0.4 + (roll(c) === "clear" && listen(c) === "follow" ? 1.5 : 0) + (fate(c) === "nothing" ? 1 : 0),
    },
  ],
};
