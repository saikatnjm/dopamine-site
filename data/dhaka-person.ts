// Copy for "What Kind of Dhaka Person Are You?" (EN + BN).
// Scoring lives in lib/dhaka-person.ts under the same ids — keep them in sync.
// Humor is about situations, never people or groups. No religion, no claims
// about real populations.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { OptionKey, ResultId, Trait } from "@/lib/dhaka-person";

export type QuestionCopy = { id: string; emoji: string; topic: Text; prompt: Text; options: Record<OptionKey, Text> };

/** Same order and ids as QUESTION_RULES. */
export const questions: readonly QuestionCopy[] = [
  {
    id: "cng-fare",
    emoji: "🛺",
    topic: { en: "Traffic", bn: "যানবাহন" },
    prompt: { en: "Your CNG driver says ৳400 for a ৳200 ride. What do you do?", bn: "২০০ টাকার রাস্তায় সিএনজি মামা বললেন ৪০০ টাকা। আপনি কী করবেন?" },
    options: {
      a: { en: "Pay it. I'm too tired to fight.", bn: "দিয়ে দিই। ঝগড়া করার শক্তি নেই।" },
      b: { en: "“Mama, ৳250, final.” Negotiations begin.", bn: "“মামা, ২৫০, ফাইনাল।” দরদাম শুরু।" },
      c: { en: "Ask for the meter, knowing it's broken since 2015.", bn: "মিটারে যেতে বলি — জানি মিটার ২০১৫ থেকে নষ্ট।" },
      d: { en: "Walk away. Pride over convenience.", bn: "হেঁটে চলে যাই। আত্মসম্মান আগে।" },
    },
  },
  {
    id: "jam",
    emoji: "🚦",
    topic: { en: "Traffic", bn: "জ্যাম" },
    prompt: { en: "You've been stuck at the same signal for 40 minutes.", bn: "একই সিগন্যালে ৪০ মিনিট ধরে আটকে আছেন।" },
    options: {
      a: { en: "Finish a whole drama season on my phone.", bn: "ফোনে একটা পুরো নাটকের সিজন শেষ করি।" },
      b: { en: "Get off and walk. Legs never get stuck.", bn: "নেমে হাঁটা ধরি। পা কখনো জ্যামে পড়ে না।" },
      c: { en: "Video call a friend who is in a different jam.", bn: "আরেক জ্যামে আটকে থাকা বন্ধুকে ভিডিও কল দিই।" },
      d: { en: "Tell the driver about a “shortcut”. It is not a shortcut.", bn: "ড্রাইভারকে একটা “শর্টকাট” দেখাই। ওটা শর্টকাট না।" },
    },
  },
  {
    id: "food",
    emoji: "🍛",
    topic: { en: "Food", bn: "খাবার" },
    prompt: { en: "A friend texts: “Let's eat something.” You say…", bn: "বন্ধু মেসেজ দিল: “চল কিছু খাই।” আপনি বলেন…" },
    options: {
      a: { en: "“Kacchi. Don't even ask.”", bn: "“কাচ্চি। প্রশ্নই আসে না।”" },
      b: { en: "“Fuchka on the street, then we see.”", bn: "“আগে রাস্তার ফুচকা, তারপর দেখা যাবে।”" },
      c: { en: "“Come home, ammu cooked. It's free.”", bn: "“বাসায় আয়, আম্মু রান্না করেছে। ফ্রি।”" },
      d: { en: "“Anything.” Then reject every suggestion.", bn: "“যেকোনো কিছু।” তারপর সব প্রস্তাব বাতিল।" },
    },
  },
  {
    id: "boss",
    emoji: "💼",
    topic: { en: "Office", bn: "অফিস" },
    prompt: { en: "11 PM. Your boss messages: “Small thing, urgent.”", bn: "রাত ১১টা। বস মেসেজ দিলেন: “ছোট একটা কাজ, আর্জেন্ট।”" },
    options: {
      a: { en: "Reply in 30 seconds with a colour-coded spreadsheet.", bn: "৩০ সেকেন্ডে কালার-কোড করা স্প্রেডশিট দিয়ে রিপ্লাই।" },
      b: { en: "Seen. Will reply “sorry, was asleep” tomorrow.", bn: "সিন করি। কাল সকালে বলব “সরি, ঘুমিয়ে ছিলাম”।" },
      c: { en: "“Can this wait till Sunday morning?” Negotiate.", bn: "“রবিবার সকালে করলে হবে?” — দর কষাকষি।" },
      d: { en: "Screenshot it to the friends group for opinions.", bn: "স্ক্রিনশট নিয়ে বন্ধুদের গ্রুপে মতামত চাই।" },
    },
  },
  {
    id: "rain",
    emoji: "🌧️",
    topic: { en: "Rain", bn: "বৃষ্টি" },
    prompt: { en: "Sudden heavy rain. The road is now a river.", bn: "হঠাৎ ঝুম বৃষ্টি। রাস্তা এখন নদী।" },
    options: {
      a: { en: "Wait under a tea stall roof. Second cup.", bn: "চায়ের দোকানের ছাউনিতে দাঁড়াই। দ্বিতীয় কাপ।" },
      b: { en: "Roll up my pants and wade through. Onward.", bn: "প্যান্ট গুটিয়ে পানি ভেঙে এগোই।" },
      c: { en: "I already had an umbrella. And a backup umbrella.", bn: "ছাতা আগেই ছিল। একটা ব্যাকআপ ছাতাও।" },
      d: { en: "Rain means khichuri. Plans cancelled.", bn: "বৃষ্টি মানেই খিচুড়ি। সব প্ল্যান বাতিল।" },
    },
  },
  {
    id: "market",
    emoji: "🛍️",
    topic: { en: "Shopping", bn: "শপিং" },
    prompt: { en: "New Market. A shopkeeper says ৳1,200 for a shirt.", bn: "নিউ মার্কেট। দোকানদার একটা শার্টের দাম বললেন ১,২০০ টাকা।" },
    options: {
      a: { en: "“৳350.” Pretend to leave. Get it for ৳400.", bn: "“৩৫০।” চলে যাওয়ার ভান। ৪০০-তে কিনে ফেলি।" },
      b: { en: "Buy it, plus two things I didn't need.", bn: "কিনে ফেলি, সঙ্গে আরও দুটো অদরকারি জিনিস।" },
      c: { en: "Check my budget list. Shirt was not on it.", bn: "বাজেট লিস্ট দেখি। শার্ট লিস্টে নেই।" },
      d: { en: "Came with six friends. Bought nothing. Great day.", bn: "ছয় বন্ধু নিয়ে গেছি। কিছুই কিনিনি। দারুণ দিন।" },
    },
  },
  {
    id: "late",
    emoji: "⏰",
    topic: { en: "Friends", bn: "বন্ধু" },
    prompt: { en: "Your friend says “5 minutes, on my way.”", bn: "বন্ধু বলল “৫ মিনিট, আসতেছি।”" },
    options: {
      a: { en: "Perfect, I haven't left home either.", bn: "ভালো, আমিও তো এখনো বাসা থেকে বের হইনি।" },
      b: { en: "I arrived 10 minutes early. I am suffering.", bn: "আমি ১০ মিনিট আগে এসে বসে আছি। কষ্ট পাচ্ছি।" },
      c: { en: "Order food while waiting. Maybe two plates.", bn: "অপেক্ষার ফাঁকে খাবার অর্ডার। হয়তো দুই প্লেট।" },
      d: { en: "Start an adda with the tea stall uncle.", bn: "চায়ের দোকানের মামার সাথে আড্ডা শুরু।" },
    },
  },
  {
    id: "friday",
    emoji: "😴",
    topic: { en: "Sleep", bn: "ঘুম" },
    prompt: { en: "It's Friday. No alarm. What's the plan?", bn: "শুক্রবার। অ্যালার্ম নেই। প্ল্যান কী?" },
    options: {
      a: { en: "Sleep till 2 PM. That was the plan.", bn: "দুপুর ২টা পর্যন্ত ঘুম। প্ল্যান এটাই।" },
      b: { en: "Kacha bazar at 7 AM, fresh fish, best prices.", bn: "সকাল ৭টায় কাঁচা বাজার — তাজা মাছ, সেরা দাম।" },
      c: { en: "Hunt for the city's best brunch with friends.", bn: "বন্ধুদের নিয়ে শহরের সেরা ব্রাঞ্চ খুঁজতে বের হই।" },
      d: { en: "Random trip out of the city. Decided at 9 AM.", bn: "হুট করে শহরের বাইরে ট্রিপ। সকাল ৯টায় ঠিক হলো।" },
    },
  },
  {
    id: "salary",
    emoji: "💸",
    topic: { en: "Money", bn: "টাকা" },
    prompt: { en: "Salary just arrived. First move?", bn: "বেতন মাত্র ঢুকলো। প্রথম কাজ?" },
    options: {
      a: { en: "Spreadsheet: savings, bills, emergency fund.", bn: "স্প্রেডশিট: সঞ্চয়, বিল, ইমার্জেন্সি ফান্ড।" },
      b: { en: "Treat everyone. I'm rich for three days.", bn: "সবাইকে খাওয়াই। তিন দিনের জন্য আমি বড়লোক।" },
      c: { en: "It's the 10th and it's gone. No idea where.", bn: "১০ তারিখেই শেষ। কোথায় গেল জানি না।" },
      d: { en: "Biryani first. Financial planning after.", bn: "আগে বিরিয়ানি। আর্থিক পরিকল্পনা পরে।" },
    },
  },
  {
    id: "directions",
    emoji: "🧭",
    topic: { en: "Dhaka life", bn: "ঢাকার জীবন" },
    prompt: { en: "Someone asks you for directions in your area.", bn: "কেউ আপনার এলাকায় রাস্তা জিজ্ঞেস করলো।" },
    options: {
      a: { en: "“Straight, then left, then ask someone.”", bn: "“সোজা যান, তারপর বামে, তারপর কাউকে জিজ্ঞেস করেন।”" },
      b: { en: "Open maps, share the route, mention the one-way.", bn: "ম্যাপ খুলে রুট দিই, ওয়ান-ওয়ের কথাও বলি।" },
      c: { en: "Walk them there. We're friends now.", bn: "সাথে করে পৌঁছে দিই। এখন আমরা বন্ধু।" },
      d: { en: "“Next to the biryani shop. You can't miss the smell.”", bn: "“বিরিয়ানির দোকানের পাশে। ঘ্রাণেই চিনবেন।”" },
    },
  },
];

export type ResultCopy = { emoji: string; accent: Accent; title: Text; description: Text; quote: Text };

export const results: Record<ResultId, ResultCopy> = {
  negotiator: {
    emoji: "🚕",
    accent: "cng",
    title: { en: "Professional Negotiator", bn: "পেশাদার দরদামবাজ" },
    description: {
      en: "No price is final until you say so. CNG drivers see you coming and quietly lower their number.",
      bn: "আপনি না বলা পর্যন্ত কোনো দামই ফাইনাল না। সিএনজি মামারা আপনাকে দেখেই চুপচাপ ভাড়া কমিয়ে ফেলেন।",
    },
    quote: { en: "“৳400? Mama, I live here.”", bn: "“৪০০? মামা, আমি এই এলাকারই।”" },
  },
  "biryani-strategist": {
    emoji: "🍛",
    accent: "tangerine",
    title: { en: "Biryani Strategist", bn: "বিরিয়ানি স্ট্র্যাটেজিস্ট" },
    description: {
      en: "Every plan is planned around food. You rank kacchi places the way others rank universities.",
      bn: "আপনার সব প্ল্যান খাবার ঘিরে। মানুষ যেভাবে বিশ্ববিদ্যালয়ের র‍্যাঙ্কিং করে, আপনি কাচ্চির দোকান সেভাবে করেন।",
    },
    quote: { en: "“Is there aloo in it? Then I'm in.”", bn: "“আলু আছে? তাহলে আমি আছি।”" },
  },
  "traffic-survivor": {
    emoji: "🚦",
    accent: "chili",
    title: { en: "Traffic Survivor", bn: "ট্রাফিক সারভাইভার" },
    description: {
      en: "Jams, floods, one-ways: you get there anyway. You walk faster than most buses and you know it.",
      bn: "জ্যাম, জলাবদ্ধতা, ওয়ান-ওয়ে — আপনি ঠিকই পৌঁছে যান। বেশিরভাগ বাসের চেয়ে দ্রুত হাঁটেন, এবং সেটা জানেন।",
    },
    quote: { en: "“Google says 25 minutes. I say 1 hour 40.”", bn: "“গুগল বলে ২৫ মিনিট। আমি বলি ১ ঘণ্টা ৪০।”" },
  },
  "budget-minister": {
    emoji: "💸",
    accent: "lime",
    title: { en: "Budget Minister", bn: "বাজেট মন্ত্রী" },
    description: {
      en: "Every taka reports to you. Friends ask you before buying anything, then ignore your advice.",
      bn: "প্রতিটা টাকা আপনার কাছে হিসাব দেয়। বন্ধুরা কিছু কেনার আগে আপনাকে জিজ্ঞেস করে, তারপর কথা শোনে না।",
    },
    quote: { en: "“We can make that at home for ৳40.”", bn: "“এটা বাসায় ৪০ টাকায় বানানো যায়।”" },
  },
  procrastinator: {
    emoji: "😴",
    accent: "sky",
    title: { en: "Professional Procrastinator", bn: "পেশাদার গড়িমসিবাজ" },
    description: {
      en: "Deadlines are suggestions. You do your best work at 3 AM, eleven minutes before it's due.",
      bn: "ডেডলাইন আপনার কাছে শুধু পরামর্শ। আপনার সেরা কাজ হয় রাত ৩টায়, জমা দেওয়ার ১১ মিনিট আগে।",
    },
    quote: { en: "“I'll start after this one reel.”", bn: "“এই রিলটা দেখে শুরু করব।”" },
  },
  "chaos-agent": {
    emoji: "🔥",
    accent: "chili",
    title: { en: "Certified Chaos Agent", bn: "সার্টিফায়েড হট্টগোল এজেন্ট" },
    description: {
      en: "Your “shortcuts” are legendary and always longer. Somehow every outing becomes a story.",
      bn: "আপনার “শর্টকাট” কিংবদন্তি, আর সবসময় লম্বা। কীভাবে যেন প্রতিটা বের হওয়াই একটা গল্প হয়ে যায়।",
    },
    quote: { en: "“Trust me, I know a way.”", bn: "“বিশ্বাস কর, আমি একটা রাস্তা জানি।”" },
  },
  "excel-human": {
    emoji: "📋",
    accent: "violet",
    title: { en: "Walking Excel Sheet", bn: "হাঁটা-চলা এক্সেল শিট" },
    description: {
      en: "You have a plan, a backup plan and a colour code for both. People call you when things fall apart.",
      bn: "আপনার একটা প্ল্যান আছে, একটা ব্যাকআপ প্ল্যান আছে, আর দুটোরই কালার কোড আছে। সব ভেঙে পড়লে সবাই আপনাকে ফোন দেয়।",
    },
    quote: { en: "“I made a shared sheet for the picnic.”", bn: "“পিকনিকের জন্য একটা শেয়ারড শিট বানিয়েছি।”" },
  },
  "adda-ambassador": {
    emoji: "☕",
    accent: "marigold",
    title: { en: "Adda Ambassador", bn: "আড্ডা অ্যাম্বাসেডর" },
    description: {
      en: "“One cup of tea” with you lasts three hours. You know every tea stall owner by first name.",
      bn: "আপনার সাথে “এক কাপ চা” মানে তিন ঘণ্টা। প্রতিটা চায়ের দোকানের মামাকে আপনি নাম ধরে চেনেন।",
    },
    quote: { en: "“Mama, two more cups. We're not leaving.”", bn: "“মামা, আরও দুই কাপ। আমরা উঠছি না।”" },
  },
  "rickshaw-philosopher": {
    emoji: "🚲",
    accent: "sky",
    title: { en: "Rickshaw Philosopher", bn: "রিকশা দার্শনিক" },
    description: {
      en: "Late? Relaxed. Rain? Poetic. You treat the city like a slow rickshaw ride with good company.",
      bn: "দেরি? সমস্যা নেই। বৃষ্টি? কবিতা। শহরটাকে আপনি ধীর রিকশা যাত্রার মতো দেখেন, সাথে ভালো সঙ্গী।",
    },
    quote: { en: "“We'll reach when we reach.”", bn: "“যখন পৌঁছাব, তখন পৌঁছাব।”" },
  },
  "final-boss": {
    emoji: "👑",
    accent: "marigold",
    title: { en: "Dhaka Final Boss", bn: "ঢাকার ফাইনাল বস" },
    description: {
      en: "A bit of everything: you haggle, you plan, you eat, you survive. The city has nothing left to teach you.",
      bn: "সবকিছুর একটু একটু: দরদাম করেন, প্ল্যান করেন, খান, টিকে থাকেন। এই শহরের আর আপনাকে শেখানোর কিছু নেই।",
    },
    quote: { en: "“Traffic, rain, load-shedding… is that all?”", bn: "“জ্যাম, বৃষ্টি, লোডশেডিং… এইটুকুই?”" },
  },
};

export const traitInfo: Record<Trait, { emoji: string; label: Text; color: string }> = {
  haggle: { emoji: "🤝", label: { en: "Haggling", bn: "দরদাম" }, color: "bg-cng" },
  food: { emoji: "🍛", label: { en: "Food focus", bn: "খাদ্যপ্রেম" }, color: "bg-tangerine" },
  chill: { emoji: "😴", label: { en: "Chill level", bn: "আরামপ্রিয়তা" }, color: "bg-sky" },
  chaos: { emoji: "🔥", label: { en: "Chaos", bn: "হট্টগোল" }, color: "bg-chili" },
  plan: { emoji: "📋", label: { en: "Planning", bn: "পরিকল্পনা" }, color: "bg-violet" },
  budget: { emoji: "💸", label: { en: "Budgeting", bn: "হিসাবি" }, color: "bg-lime" },
  adda: { emoji: "☕", label: { en: "Adda power", bn: "আড্ডা শক্তি" }, color: "bg-marigold" },
  survive: { emoji: "🚦", label: { en: "Survival", bn: "টিকে থাকা" }, color: "bg-cng" },
};

export const quizCopy = {
  title: { en: "What Kind of Dhaka Person Are You?", bn: "আপনি কেমন ঢাকাবাসী?" },
  lead: {
    en: "10 quick questions about traffic, food, rain, money and more. Get your Dhaka personality.",
    bn: "জ্যাম, খাবার, বৃষ্টি, টাকা-পয়সা নিয়ে ১০টা ছোট প্রশ্ন। জেনে নিন আপনার ঢাকা পার্সোনালিটি।",
  },
  start: { en: "START THE QUIZ", bn: "কুইজ শুরু করো" },
  intro: { en: "No wrong answers. Only Dhaka answers.", bn: "ভুল উত্তর নেই। শুধু ঢাকার উত্তর।" },
  progress: { en: "Question {n} of {total}", bn: "প্রশ্ন {n} / {total}" },
  back: { en: "← Previous question", bn: "← আগের প্রশ্ন" },
  youAre: { en: "You are a…", bn: "আপনি একজন…" },
  friendIs: { en: "Your friend is a…", bn: "আপনার বন্ধু একজন…" },
  friendBanner: { en: "👀 A friend shared their result. Take the quiz and compare!", bn: "👀 বন্ধু তার রেজাল্ট শেয়ার করেছে। কুইজ দিয়ে মিলিয়ে দেখুন!" },
  sameAsFriend: { en: "🤝 Same as your friend! Dhaka twins.", bn: "🤝 বন্ধুর সাথে মিলে গেছে! ঢাকার যমজ।" },
  diffFromFriend: { en: "Your friend got {emoji} {title}.", bn: "আপনার বন্ধু পেয়েছে {emoji} {title}।" },
  stats: { en: "Your mix", bn: "আপনার মিশ্রণ" },
  note: { en: "Based on your answers — just for fun, not science.", bn: "আপনার উত্তরের ভিত্তিতে — শুধু মজার জন্য, বিজ্ঞান না।" },
  share: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  shareVia: { en: "Share via", bn: "শেয়ার করুন" },
  copyLink: { en: "Copy link", bn: "লিংক কপি" },
  linkCopied: { en: "Link copied!", bn: "লিংক কপি হয়েছে!" },
  shareText: {
    en: "I'm a {emoji} {title} on Hottogol's “What Kind of Dhaka Person Are You?” — what are you?",
    bn: "হট্টগোলের “আপনি কেমন ঢাকাবাসী?” কুইজে আমি {emoji} {title} — তুমি কী?",
  },
  retake: { en: "RETAKE QUIZ", bn: "আবার কুইজ দাও" },
  takeIt: { en: "TAKE THE QUIZ", bn: "কুইজ দাও" },
  another: { en: "Try another Hottogol →", bn: "আরেকটা হট্টগোল খেলুন →" },
  collected: { en: "Personalities found: {n} / {total}", bn: "পাওয়া পার্সোনালিটি: {n} / {total}" },
  home: { en: "← Home", bn: "← হোম" },
} satisfies Record<string, Text>;
