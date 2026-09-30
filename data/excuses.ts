import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";

// Excuse Generator content (EN + BN). BN is conversational Bangla with the
// English words people actually mix in. Humor targets situations (traffic,
// weather, tech, Dhaka life) — never people or groups. Keep it kind.
//
// An excuse = opener (category) + reason (category or shared) + twist + closer?
// `cred` nudges credibility (−/+), `chaos` adds chaos. Ids must stay unique
// within their list; never reuse an id for a different line (shared links).

export type Category = "office" | "university" | "late" | "friends" | "family" | "dating" | "unfinished";
export type CategoryId = Category | "random";
export type Frag = { id: string; text: Text; cred: number; chaos: number };

export const CATEGORIES: readonly CategoryId[] = ["office", "university", "late", "friends", "family", "dating", "unfinished", "random"];

export const categoryInfo: Record<CategoryId, { emoji: string; label: Text; accent: Accent }> = {
  office: { emoji: "💼", label: { en: "Office", bn: "অফিস" }, accent: "sky" },
  university: { emoji: "🎓", label: { en: "University", bn: "ভার্সিটি" }, accent: "violet" },
  late: { emoji: "⏰", label: { en: "Late", bn: "দেরি" }, accent: "marigold" },
  friends: { emoji: "🧑‍🤝‍🧑", label: { en: "Friends", bn: "বন্ধু" }, accent: "lime" },
  family: { emoji: "🏠", label: { en: "Family", bn: "পরিবার" }, accent: "tangerine" },
  dating: { emoji: "💘", label: { en: "Dating", bn: "ডেটিং" }, accent: "chili" },
  unfinished: { emoji: "📂", label: { en: "Didn't finish work", bn: "কাজ শেষ হয়নি" }, accent: "cng" },
  random: { emoji: "🎲", label: { en: "Random", bn: "র‍্যান্ডম" }, accent: "marigold" },
};

export const openers: Record<Category, Frag[]> = {
  office: [
    { id: "o1", text: { en: "Sir, I was fully ready to leave, but", bn: "Sir, আমি একদম রেডি হয়ে বের হচ্ছিলাম, কিন্তু" }, cred: 5, chaos: 0 },
    { id: "o2", text: { en: "Boss, I know how this sounds, but", bn: "Boss, জানি শুনতে কেমন লাগবে, কিন্তু" }, cred: -3, chaos: 5 },
    { id: "o3", text: { en: "Sir, I was about to join the meeting, but", bn: "Sir, মিটিং-এ join করতে যাচ্ছিলাম, কিন্তু" }, cred: 3, chaos: 0 },
    { id: "o4", text: { en: "Good morning sir. Small update:", bn: "Good morning sir. ছোট একটা update:" }, cred: 0, chaos: 5 },
  ],
  university: [
    { id: "u1", text: { en: "Sir, I was coming to class, but", bn: "Sir, আমি ক্লাসে আসতেছিলাম, কিন্তু" }, cred: 5, chaos: 0 },
    { id: "u2", text: { en: "Ma'am, the assignment was almost done, but", bn: "Ma'am, assignment প্রায় শেষ ছিল, কিন্তু" }, cred: 2, chaos: 3 },
    { id: "u3", text: { en: "Sir, I studied all night, I promise, but", bn: "Sir, সারা রাত পড়ছি, সত্যি, কিন্তু" }, cred: -5, chaos: 5 },
    { id: "u4", text: { en: "Sir, about my attendance…", bn: "Sir, আমার attendance নিয়ে বলতাম…" }, cred: 0, chaos: 3 },
  ],
  late: [
    { id: "l1", text: { en: "Bhai, I left home on time, but", bn: "ভাই, আমি টাইমমতো বের হইছিলাম, কিন্তু" }, cred: 5, chaos: 0 },
    { id: "l2", text: { en: "I'm five minutes away, really, but", bn: "আমি পাঁচ মিনিট দূরে, সত্যি, কিন্তু" }, cred: -8, chaos: 5 },
    { id: "l3", text: { en: "Sorry sorry, I'm late because", bn: "Sorry sorry, দেরি হইলো কারণ" }, cred: 3, chaos: 0 },
    { id: "l4", text: { en: "Don't be angry, listen first:", bn: "রাগ কইরো না, আগে শোনো:" }, cred: 0, chaos: 3 },
  ],
  friends: [
    { id: "f1", text: { en: "Dost, I was coming, 100%, but", bn: "দোস্ত, আসতেছিলাম, ১০০%, কিন্তু" }, cred: 0, chaos: 3 },
    { id: "f2", text: { en: "Bro, you won't believe this, but", bn: "Bro, বিশ্বাস করবি না, কিন্তু" }, cred: -5, chaos: 8 },
    { id: "f3", text: { en: "I saw your message, I swear, but", bn: "তোর message দেখছি, কসম, কিন্তু" }, cred: -3, chaos: 3 },
    { id: "f4", text: { en: "Mama, next time for sure, today", bn: "মামা, next time sure, আজকে" }, cred: 0, chaos: 3 },
  ],
  family: [
    { id: "h1", text: { en: "Ammu, I didn't forget, but", bn: "আম্মু, আমি ভুলি নাই, কিন্তু" }, cred: 3, chaos: 0 },
    { id: "h2", text: { en: "Abbu, before you say anything,", bn: "আব্বু, কিছু বলার আগে শোনো," }, cred: 0, chaos: 5 },
    { id: "h3", text: { en: "Khala, I was just about to call, but", bn: "খালা, আমি এখনই call দিতাম, কিন্তু" }, cred: 2, chaos: 0 },
    { id: "h4", text: { en: "I was going to bring the groceries, but", bn: "বাজার নিয়েই আসতেছিলাম, কিন্তু" }, cred: 3, chaos: 3 },
  ],
  dating: [
    { id: "d1", text: { en: "Listen, I was getting ready for our date, but", bn: "শোনো, আমাদের date-এর জন্য রেডি হচ্ছিলাম, কিন্তু" }, cred: 3, chaos: 3 },
    { id: "d2", text: { en: "Please don't be upset, it's not my fault:", bn: "প্লিজ রাগ কইরো না, আমার দোষ না:" }, cred: -3, chaos: 5 },
    { id: "d3", text: { en: "I didn't “seen-zone” you, I promise,", bn: "আমি তোমাকে seen-zone করি নাই, promise," }, cred: -5, chaos: 5 },
    { id: "d4", text: { en: "I even bought flowers, but", bn: "ফুলও কিনছিলাম, কিন্তু" }, cred: 0, chaos: 3 },
  ],
  unfinished: [
    { id: "w1", text: { en: "Sir, the file is 90% done, but", bn: "Sir, file-টা ৯০% done, কিন্তু" }, cred: 0, chaos: 3 },
    { id: "w2", text: { en: "The report was ready last night, but", bn: "Report কালকে রাতেই রেডি ছিল, কিন্তু" }, cred: 0, chaos: 3 },
    { id: "w3", text: { en: "I was literally on the last slide, but", bn: "আমি literally শেষ slide-এ ছিলাম, কিন্তু" }, cred: -3, chaos: 5 },
    { id: "w4", text: { en: "Technically I did start it —", bn: "Technically শুরু তো করছিলাম —" }, cred: -5, chaos: 5 },
  ],
};

/** Reasons any category can use. */
export const sharedReasons: Frag[] = [
  { id: "r-jam", text: { en: "the traffic was so bad that Google Maps resigned", bn: "রাস্তায় এমন জ্যাম ছিল যে Google Maps-ও resign করে দিছে" }, cred: 10, chaos: 25 },
  { id: "r-cng", text: { en: "my CNG driver and I had a philosophical disagreement", bn: "আমার CNG driver-এর সাথে philosophical disagreement হয়ে গেছে" }, cred: -5, chaos: 40 },
  { id: "r-rain", text: { en: "it rained for ten minutes and my road became a river", bn: "দশ মিনিট বৃষ্টি হইছে আর আমার রাস্তা নদী হয়ে গেছে" }, cred: 15, chaos: 25 },
  { id: "r-power", text: { en: "the power went out right as I pressed Save", bn: "ঠিক Save চাপার সময় কারেন্ট চলে গেছে" }, cred: 10, chaos: 20 },
  { id: "r-goat", text: { en: "a goat blocked my gate and refused to negotiate", bn: "একটা ছাগল আমার গেট আটকে দাঁড়াইছিল, কোনো negotiation-এ রাজি না" }, cred: -15, chaos: 55 },
  { id: "r-lift", text: { en: "I got stuck in the lift with a man selling insurance", bn: "lift-এ আটকে গেছিলাম, সাথে একজন insurance বিক্রেতা" }, cred: -5, chaos: 45 },
  { id: "r-wifi", text: { en: "the Wi-Fi went down and took my motivation with it", bn: "Wi-Fi চলে গেছে, সাথে আমার motivation-ও নিয়ে গেছে" }, cred: 0, chaos: 25 },
  { id: "r-bus", text: { en: "the bus decided my stop was “optional”", bn: "বাস ঠিক করছে আমার stop-টা “optional”" }, cred: 5, chaos: 30 },
  { id: "r-phone", text: { en: "my phone updated itself and forgot who I am", bn: "আমার ফোন নিজে নিজে update হয়ে আমাকেই চিনতেছে না" }, cred: 0, chaos: 30 },
  { id: "r-wasa", text: { en: "WASA dug up the road outside my house overnight", bn: "WASA রাতারাতি আমার বাসার সামনের রাস্তা খুঁড়ে ফেলছে" }, cred: 15, chaos: 25 },
  { id: "r-wedding", text: { en: "a wedding procession with a full band took over my lane", bn: "পুরো band নিয়া একটা বরযাত্রী আমার গলি দখল করে নিছে" }, cred: 5, chaos: 35 },
  { id: "r-cha", text: { en: "the tong-shop mama started telling his life story and I couldn't leave", bn: "টং-এর মামা জীবনের গল্প শুরু করছিল, উঠে আসতে পারি নাই" }, cred: 0, chaos: 30 },
  { id: "r-alarm", text: { en: "my alarm rang, but in a dream", bn: "alarm বাজছিল, কিন্তু স্বপ্নের মধ্যে" }, cred: -10, chaos: 30 },
  { id: "r-hilsa", text: { en: "Ammu sent me to buy hilsa and the negotiation took three hours", bn: "আম্মু ইলিশ কিনতে পাঠাইছিল, দরদাম করতেই তিন ঘণ্টা গেছে" }, cred: 5, chaos: 35 },
  { id: "r-crow", text: { en: "a crow stole my pen and I had to chase it", bn: "একটা কাক আমার কলম নিয়ে গেছে, পিছে পিছে দৌড়াইতে হইছে" }, cred: -20, chaos: 60 },
  { id: "r-flyover", text: { en: "I took the flyover and ended up in a different district", bn: "flyover-এ উঠছিলাম, নামছি অন্য জেলায়" }, cred: -10, chaos: 50 },
];

/** Category-flavoured reasons (mixed in with the shared ones). */
export const categoryReasons: Record<Category, Frag[]> = {
  office: [
    { id: "ro-zoom", text: { en: "my laptop chose that exact moment to install 47 updates", bn: "আমার laptop ঠিক তখনই ৪৭টা update install করা শুরু করছে" }, cred: 10, chaos: 20 },
    { id: "ro-id", text: { en: "the office lift only works if you know its secret mood", bn: "অফিসের lift-এর একটা secret mood আছে, ওটা না বুঝলে চলে না" }, cred: -5, chaos: 30 },
    { id: "ro-print", text: { en: "the printer and I are currently not on speaking terms", bn: "printer আর আমার মধ্যে এখন কথা বন্ধ" }, cred: 5, chaos: 25 },
  ],
  university: [
    { id: "ru-bus", text: { en: "the university bus left five minutes early, as a prank", bn: "ভার্সিটির বাস prank হিসেবে পাঁচ মিনিট আগে চলে গেছে" }, cred: 5, chaos: 25 },
    { id: "ru-canteen", text: { en: "the canteen singara line was the longest queue in history", bn: "ক্যান্টিনের সিঙ্গারার line ইতিহাসের সবচেয়ে লম্বা ছিল" }, cred: 0, chaos: 25 },
    { id: "ru-photocopy", text: { en: "the photocopy shop printed my notes upside down", bn: "ফটোকপির দোকান আমার notes উল্টা করে print করছে" }, cred: 5, chaos: 30 },
  ],
  late: [
    { id: "rl-rick", text: { en: "every rickshaw said “যাবো না”", bn: "সব রিকশাওয়ালা বলছে “যাবো না”" }, cred: 15, chaos: 20 },
    { id: "rl-vip", text: { en: "there was VIP movement and they closed my entire road", bn: "VIP movement ছিল, আমার পুরা রাস্তা বন্ধ করে দিছে" }, cred: 15, chaos: 20 },
    { id: "rl-gate", text: { en: "the guard locked the building gate and went for cha… for a long time", bn: "দারোয়ান গেট লাগায়ে চা খাইতে গেছে… অনেকক্ষণের জন্য" }, cred: 5, chaos: 25 },
  ],
  friends: [
    { id: "rf-nap", text: { en: "I lay down for “five minutes” and woke up at sunset", bn: "“পাঁচ মিনিট” শুইছিলাম, উঠছি সন্ধ্যায়" }, cred: 0, chaos: 25 },
    { id: "rf-guest", text: { en: "surprise guests arrived and I was assigned to entertain them", bn: "হঠাৎ মেহমান আসছে, আমার উপর আপ্যায়নের দায়িত্ব পড়ছে" }, cred: 15, chaos: 15 },
    { id: "rf-ludo", text: { en: "the family Ludo match went into extra time", bn: "বাসার লুডু ম্যাচ extra time-এ চলে গেছে" }, cred: 0, chaos: 30 },
  ],
  family: [
    { id: "rh-sale", text: { en: "there was a 70% sale and I got emotionally involved", bn: "৭০% sale চলতেছিল, আমি emotionally জড়ায়ে গেছি" }, cred: 0, chaos: 30 },
    { id: "rh-battery", text: { en: "my phone was at 1% and I was saving it for your call", bn: "ফোনে ১% চার্জ ছিল, তোমার call-এর জন্যই বাঁচায়ে রাখছিলাম" }, cred: 5, chaos: 20 },
    { id: "rh-cousin", text: { en: "my cousin needed help setting up the Wi-Fi — for three hours", bn: "কাজিনের Wi-Fi সেট করে দিতে হইছে — তিন ঘণ্টা ধরে" }, cred: 10, chaos: 20 },
  ],
  dating: [
    { id: "rd-shirt", text: { en: "I couldn't decide between two identical shirts", bn: "দুইটা একই রকম শার্টের মধ্যে কোনটা পরবো ঠিক করতে পারতেছিলাম না" }, cred: 5, chaos: 25 },
    { id: "rd-flowers", text: { en: "the flower seller and I became close friends", bn: "ফুলওয়ালা মামার সাথে ঘনিষ্ঠ বন্ধুত্ব হয়ে গেছে" }, cred: -5, chaos: 35 },
    { id: "rd-restaurant", text: { en: "the restaurant I booked turned into a mobile shop", bn: "যে restaurant book করছিলাম ওটা এখন মোবাইলের দোকান" }, cred: -5, chaos: 40 },
  ],
  unfinished: [
    { id: "rw-backup", text: { en: "my laptop saved the file in a folder that doesn't exist", bn: "laptop file-টা এমন folder-এ save করছে যেটার কোনো অস্তিত্ব নাই" }, cred: 5, chaos: 30 },
    { id: "rw-inspiration", text: { en: "I was waiting for inspiration and it's stuck in traffic", bn: "inspiration-এর অপেক্ষা করতেছিলাম, সে জ্যামে আটকা" }, cred: -10, chaos: 35 },
    { id: "rw-excel", text: { en: "Excel turned all my numbers into dates", bn: "Excel আমার সব number-কে date বানায়ে ফেলছে" }, cred: 10, chaos: 20 },
  ],
};

export const twists: Frag[] = [
  { id: "t-maps", text: { en: "and then even Google Maps said “good luck”", bn: "তারপর Google Maps-ও বলছে “good luck”" }, cred: -3, chaos: 10 },
  { id: "t-rain", text: { en: "and then it started raining sideways", bn: "তারপর বৃষ্টি শুরু হইছে, পুরাপুরি আড়াআড়ি" }, cred: 3, chaos: 10 },
  { id: "t-goat", text: { en: "and then a goat got involved", bn: "তারপর একটা ছাগলও জড়ায়ে গেছে" }, cred: -10, chaos: 25 },
  { id: "t-fare", text: { en: "and then the fare doubled “because of the road”", bn: "তারপর ভাড়া ডাবল হয়ে গেছে “রাস্তার জন্য”" }, cred: 5, chaos: 10 },
  { id: "t-phone", text: { en: "and then my phone died at 12%", bn: "তারপর ১২% চার্জে ফোন মারা গেছে" }, cred: 3, chaos: 10 },
  { id: "t-wedding", text: { en: "and then I accidentally joined a wedding and got mishti", bn: "তারপর ভুল করে একটা বিয়েতে ঢুকে মিষ্টিও খাইছি" }, cred: -10, chaos: 25 },
  { id: "t-ammu", text: { en: "and then Ammu called to ask if I had eaten", bn: "তারপর আম্মু call দিয়া জিজ্ঞেস করছে খাইছি কিনা" }, cred: 5, chaos: 5 },
  { id: "t-lost", text: { en: "and then I asked for directions and got three different answers", bn: "তারপর রাস্তা জিজ্ঞেস করলাম, তিনজন তিন দিক দেখাইছে" }, cred: 3, chaos: 15 },
  { id: "t-flood", text: { en: "and then my shoes decided to live in the drain", bn: "তারপর আমার জুতা ড্রেনে থাকার সিদ্ধান্ত নিছে" }, cred: 0, chaos: 20 },
  { id: "t-tea", text: { en: "and then I needed an emergency cha", bn: "তারপর emergency চা খাইতে হইছে" }, cred: 0, chaos: 10 },
  { id: "t-horn", text: { en: "and then a hydraulic horn reset my brain", bn: "তারপর একটা হাইড্রোলিক হর্ন আমার brain reset করে দিছে" }, cred: -3, chaos: 15 },
  { id: "t-cat", text: { en: "and then a cat sat on my keyboard and sent everything to Spam", bn: "তারপর একটা বিড়াল keyboard-এ বসে সব Spam-এ পাঠায়ে দিছে" }, cred: -12, chaos: 25 },
  { id: "t-none", text: { en: "", bn: "" }, cred: 5, chaos: 0 },
  { id: "t-none2", text: { en: "", bn: "" }, cred: 5, chaos: 0 },
];

export const closers: Frag[] = [
  { id: "c-true", text: { en: "I swear this is true.", bn: "আমি সত্যি বলতেছি।" }, cred: -3, chaos: 0 },
  { id: "c-proof", text: { en: "I have screenshots.", bn: "screenshot আছে।" }, cred: 5, chaos: 5 },
  { id: "c-ask", text: { en: "Ask anyone.", bn: "যে কাউকে জিজ্ঞেস করেন।" }, cred: -5, chaos: 5 },
  { id: "c-tomorrow", text: { en: "I'll make it up tomorrow, promise.", bn: "কালকে পুষায়ে দিবো, promise।" }, cred: 5, chaos: 0 },
  { id: "c-dhaka", text: { en: "Dhaka, you know how it is.", bn: "ঢাকা, বোঝেনই তো।" }, cred: 8, chaos: 0 },
  { id: "c-sorry", text: { en: "Really sorry 🙏", bn: "সত্যিই sorry 🙏" }, cred: 5, chaos: 0 },
  { id: "c-none", text: { en: "", bn: "" }, cred: 0, chaos: 0 },
  { id: "c-none2", text: { en: "", bn: "" }, cred: 0, chaos: 0 },
];

/** Verdicts by credibility band (low → high). */
export const verdicts: { maxCred: number; lines: Text[] }[] = [
  {
    maxCred: 19,
    lines: [
      { en: "Nobody will believe this. But everyone will remember it forever.", bn: "কেউ বিশ্বাস করবে না। কিন্তু সবাই সারাজীবন মনে রাখবে।" },
      { en: "This isn't an excuse, it's a Netflix pilot.", bn: "এটা excuse না, এটা একটা Netflix-এর pilot episode।" },
    ],
  },
  {
    maxCred: 39,
    lines: [
      { en: "This will be hard to sell. But you can try.", bn: "এই excuse বিশ্বাস করানো কঠিন হবে। কিন্তু চেষ্টা করতে পারেন।" },
      { en: "Say it fast and walk away confidently.", bn: "দ্রুত বলেন, তারপর আত্মবিশ্বাস নিয়া হেঁটে চলে যান।" },
    ],
  },
  {
    maxCred: 64,
    lines: [
      { en: "Believable — if you keep a straight face.", bn: "বিশ্বাসযোগ্য — যদি হাসি চেপে রাখতে পারেন।" },
      { en: "Risky, but it has a real Dhaka feel to it.", bn: "একটু রিস্কি, তবে এতে খাঁটি ঢাকার ফ্লেভার আছে।" },
    ],
  },
  {
    maxCred: 100,
    lines: [
      { en: "Airtight. This is basically a documentary.", bn: "একদম পাকা। এটা প্রায় documentary।" },
      { en: "So believable they might apologise to you.", bn: "এত বিশ্বাসযোগ্য যে উল্টা আপনাকেই sorry বলতে পারে।" },
    ],
  },
];

export const excuseCopy = {
  title: { en: "Excuse Generator", bn: "অজুহাত জেনারেটর" },
  lead: {
    en: "Pick a situation, press the button, get an excuse with a credibility rating. Use responsibly (or don't).",
    bn: "একটা পরিস্থিতি বাছুন, বোতাম চাপুন, credibility rating-সহ একটা excuse নিন। দায়িত্ব নিয়ে ব্যবহার করুন (বা না)।",
  },
  pick: { en: "What do you need an excuse for?", bn: "কীসের জন্য excuse লাগবে?" },
  generate: { en: "😂 GENERATE EXCUSE", bn: "😂 EXCUSE বানাও" },
  another: { en: "🔁 Another excuse", bn: "🔁 আরেকটা excuse" },
  copy: { en: "📋 Copy", bn: "📋 কপি" },
  copied: { en: "Excuse copied!", bn: "Excuse কপি হয়েছে!" },
  linkCopied: { en: "Link copied!", bn: "লিংক কপি হয়েছে!" },
  share: { en: "📤 Share", bn: "📤 শেয়ার" },
  shareVia: { en: "Or send it via", bn: "অথবা পাঠান" },
  copyLink: { en: "Copy link", bn: "লিংক কপি" },
  back: { en: "← Back to Hottogol", bn: "← হট্টগোলে ফিরুন" },
  credibility: { en: "Credibility", bn: "বিশ্বাসযোগ্যতা" },
  chaos: { en: "Chaos", bn: "হট্টগোল" },
  verdict: { en: "Verdict", bn: "রায়" },
  sharedBanner: { en: "👀 Someone sent you this excuse", bn: "👀 কেউ আপনাকে এই excuse পাঠিয়েছে" },
  shareText: {
    en: "My excuse ({cred}% credible, {chaos}% chaos): “{excuse}” 😂 Get yours:",
    bn: "আমার excuse ({cred}% বিশ্বাসযোগ্য, {chaos}% হট্টগোল): “{excuse}” 😂 নিজেরটা বানান:",
  },
  empty: { en: "Your excuse will appear here.", bn: "আপনার excuse এখানে আসবে।" },
} satisfies Record<string, Text>;
