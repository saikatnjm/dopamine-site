import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { OptionKey, ResultId, Trait } from "@/lib/games/personality";

// Copy for "তুমি কোন টাইপের বাঙালি?" — same ids as lib/games/personality.ts.
// Humour is about habits and situations, never about people, districts or
// religion. Just for fun: no claim that it measures personality.

export type PersonalityQuestion = { id: string; emoji: string; prompt: Text; options: Record<OptionKey, Text> };

export const questions: readonly PersonalityQuestion[] = [
  {
    id: "trip-plan",
    emoji: "🧳",
    prompt: { en: "Friends are planning a trip. What do you do?", bn: "বন্ধুরা ঘুরতে যাওয়ার প্ল্যান করলে তুমি কী করো?" },
    options: {
      a: { en: "Send 300 messages and keep the group chat awake till 3 AM", bn: "গ্রুপে ৩০০টা মেসেজ দিয়ে রাত ৩টা পর্যন্ত সবাইকে জাগিয়ে রাখি" },
      b: { en: "Make a spreadsheet, a budget and a checklist", bn: "এক্সেল শিট, বাজেট আর চেকলিস্ট বানিয়ে ফেলি" },
      c: { en: "“Just send me the location.” Then silence.", bn: "“আমাকে জাস্ট লোকেশন পাঠাস।” তারপর নীরবতা।" },
      d: { en: "First question: what's the famous food there?", bn: "প্রথম প্রশ্ন: ওখানে বিখ্যাত খাবার কী?" },
    },
  },
  {
    id: "guests",
    emoji: "🫖",
    prompt: { en: "Guests arrive at home. Your reaction?", bn: "বাড়িতে মেহমান এলে তোমার reaction কী?" },
    options: {
      a: { en: "Quietly check what's coming out of the kitchen", bn: "চুপিচুপি রান্নাঘরে দেখি আজ কী কী রান্না হচ্ছে" },
      b: { en: "Sit in the middle and run the conversation", bn: "সবার মাঝখানে বসে গল্পের দায়িত্ব নিয়ে নিই" },
      c: { en: "Go to my room and make a meme: “when the guest says ‘just five more minutes’”", bn: "রুমে গিয়ে মিম বানাই: “মেহমান যখন বলে ‘আর পাঁচ মিনিট বসি’”" },
      d: { en: "Say salam, sit quietly — then one line that makes everyone laugh", bn: "সালাম দিয়ে চুপচাপ বসি — তারপর এক লাইনে সবাইকে হাসিয়ে দিই" },
    },
  },
  {
    id: "village-home",
    emoji: "🏡",
    prompt: { en: "At your village home, what do you look for first?", bn: "গ্রামের বাড়িতে গেলে সবচেয়ে আগে কী খুঁজবে?" },
    options: {
      a: { en: "The pond, the mango tree and a fresh green coconut", bn: "পুকুর, আমগাছ আর একটা কচি ডাব" },
      b: { en: "Grandma's pitha — and seconds", bn: "নানি-দাদির হাতের পিঠা — আর দ্বিতীয় প্লেট" },
      c: { en: "The tea stall at the crossroads", bn: "মোড়ের চায়ের দোকান" },
      d: { en: "One bar of network — how else do I post the story?", bn: "নেটওয়ার্কের এক দাগ — নইলে স্টোরি দেব কীভাবে?" },
    },
  },
  {
    id: "adda-role",
    emoji: "🗣️",
    prompt: { en: "Which character are you in an adda?", bn: "আড্ডায় তুমি কোন চরিত্র?" },
    options: {
      a: { en: "I start every story; others just try to finish it", bn: "গল্প আমি শুরু করি, বাকিরা শুধু শেষ করার চেষ্টা করে" },
      b: { en: "From the economy to the universe — I explain it all", bn: "দেশের অর্থনীতি থেকে মহাবিশ্ব — সব আমি ব্যাখ্যা করি" },
      c: { en: "Corner seat, silent, then one line that ends everyone", bn: "কোণার চেয়ারে চুপ, তারপর এক লাইনে সবাই কাত" },
      d: { en: "I plan the next adda (it never happens)", bn: "পরের আড্ডার প্ল্যান করি (যেটা কখনো হয় না)" },
    },
  },
  {
    id: "rainy-day",
    emoji: "🌧️",
    prompt: { en: "Your perfect rainy day?", bn: "বৃষ্টির দিনে তোমার পারফেক্ট প্ল্যান?" },
    options: {
      a: { en: "Khichuri, fried hilsa, end of discussion", bn: "খিচুড়ি আর ইলিশ ভাজা, আলোচনা শেষ" },
      b: { en: "Tea by the window and deep thoughts about life", bn: "জানালার পাশে চা আর জীবন নিয়ে গভীর চিন্তা" },
      c: { en: "Share the “rain + khichuri” meme before it even rains", bn: "বৃষ্টি নামার আগেই “বৃষ্টি + খিচুড়ি” মিম শেয়ার" },
      d: { en: "Football in the mud in the courtyard", bn: "উঠানে কাদার মধ্যে ফুটবল" },
    },
  },
  {
    id: "eid-holiday",
    emoji: "🌙",
    prompt: { en: "Eid holidays. You…", bn: "ঈদের ছুটিতে তুমি…" },
    options: {
      a: { en: "Bus or launch ticket first — straight to the village", bn: "সবার আগে বাস-লঞ্চের টিকিট — সোজা গ্রামের বাড়ি" },
      b: { en: "Make a list of 12 places to visit, then sleep at home", bn: "১২টা জায়গা ঘোরার লিস্ট বানাই, তারপর বাসায় ঘুমাই" },
      c: { en: "Eat my way from one relative's house to the next", bn: "এক আত্মীয়ের বাসা থেকে আরেক বাসায় দাওয়াত খেয়ে বেড়াই" },
      d: { en: "Run the cousins' group: memes and salami accounts", bn: "কাজিনদের গ্রুপ চালাই: মিম আর সালামির হিসাব" },
    },
  },
  {
    id: "phone",
    emoji: "📱",
    prompt: { en: "What do you do most on your phone?", bn: "ফোনে সবচেয়ে বেশি কী করো?" },
    options: {
      a: { en: "Scroll meme pages, save everything", bn: "মিম পেজ স্ক্রল করি, সব সেভ করি" },
      b: { en: "Reminders, to-do lists, calendar — all of it", bn: "রিমাইন্ডার, টু-ডু লিস্ট, ক্যালেন্ডার — সব" },
      c: { en: "Two-minute voice notes to the group", bn: "গ্রুপে দুই মিনিটের ভয়েস নোট" },
      d: { en: "Read everything, comment on nothing, know it all", bn: "সব পড়ি, কিছুতে কমেন্ট করি না, কিন্তু সব জানি" },
    },
  },
  {
    id: "tea-stall",
    emoji: "☕",
    prompt: { en: "At the tea stall, you are…", bn: "চায়ের দোকানে তুমি…" },
    options: {
      a: { en: "One cup of tea and a three-hour discussion", bn: "এক কাপ চা আর তিন ঘণ্টার আলোচনা" },
      b: { en: "Drinking little, listening to everyone, smiling to myself", bn: "চা খাই কম, সবার কথা শুনি বেশি, মুচকি হাসি" },
      c: { en: "“I'll pay for everyone!” …“Next time, actually.”", bn: "“সবার বিল আমি দেব!” …“আচ্ছা, পরের বার।”" },
      d: { en: "Missing the village tea made with fresh cow's milk", bn: "গ্রামের গরুর খাঁটি দুধের চা মিস করি" },
    },
  },
];

export type PersonalityResult = {
  emoji: string;
  accent: Accent;
  title: Text;
  description: Text;
  /** Funny share caption (no URL). */
  caption: Text;
};

export const results: Record<ResultId, PersonalityResult> = {
  "adda-emperor": {
    emoji: "👑",
    accent: "marigold",
    title: { en: "Emperor of Adda", bn: "আড্ডার সম্রাট" },
    description: {
      en: "Where you sit, the adda starts. You remember everyone's stories, you start “just five minutes” chats that end at midnight, and no group trip survives without you.",
      bn: "তুমি যেখানে বসো, আড্ডা সেখানেই শুরু। সবার গল্প তোমার মনে থাকে, “পাঁচ মিনিট” বলে শুরু করা আলাপ শেষ হয় মাঝরাতে, আর তোমাকে ছাড়া কোনো গ্রুপ ট্যুর টেকে না।",
    },
    caption: { en: "I'm the Emperor of Adda 👑 The adda doesn't start without me. What type are you?", bn: "আমি আড্ডার সম্রাট 👑 আমাকে ছাড়া আড্ডা জমে না। তুমি কোন টাইপের?" },
  },
  "village-legend": {
    emoji: "🌾",
    accent: "lime",
    title: { en: "Village Home Legend", bn: "গ্রামের বাড়ির কিংবদন্তি" },
    description: {
      en: "Your heart books the ticket before the holiday is announced. You know which tree has the sweetest mangoes, and the pond still remembers your cannonball.",
      bn: "ছুটি ঘোষণার আগেই তোমার মন টিকিট কেটে ফেলে। কোন গাছের আম সবচেয়ে মিষ্টি তুমি জানো, আর পুকুর এখনো তোমার লাফ মনে রেখেছে।",
    },
    caption: { en: "I'm a Village Home Legend 🌾 The pond and the mango tree are waiting. What type are you?", bn: "আমি গ্রামের বাড়ির কিংবদন্তি 🌾 পুকুর আর আমগাছ আমার অপেক্ষায়। তুমি কোন টাইপের?" },
  },
  "tea-philosopher": {
    emoji: "☕",
    accent: "tangerine",
    title: { en: "Tea Stall Philosopher", bn: "চায়ের দোকানের দার্শনিক" },
    description: {
      en: "One cup of tea, and you've solved the economy, cricket and the meaning of life. The tea goes cold; the theory gets hotter.",
      bn: "এক কাপ চায়ে তুমি অর্থনীতি, ক্রিকেট আর জীবনের মানে — সব সমাধান করে ফেলো। চা ঠান্ডা হয়ে যায়, থিওরি আরও গরম হয়।",
    },
    caption: { en: "I'm a Tea Stall Philosopher ☕ One more cup and I'll explain the universe. What type are you?", bn: "আমি চায়ের দোকানের দার্শনিক ☕ আরেক কাপ দিলে মহাবিশ্ব ব্যাখ্যা করে দেব। তুমি কোন টাইপের?" },
  },
  "quiet-chaos": {
    emoji: "🤫",
    accent: "sky",
    title: { en: "Quiet but Dangerously Funny", bn: "চুপচাপ কিন্তু ভয়ংকর মজার" },
    description: {
      en: "You say nothing for an hour, then one line and the whole room is on the floor. People underestimate you — exactly once.",
      bn: "এক ঘণ্টা কিছুই বলো না, তারপর এক লাইনে পুরো ঘর মাটিতে গড়াগড়ি। মানুষ তোমাকে ছোট করে দেখে — ঠিক একবার।",
    },
    caption: { en: "I'm Quiet but Dangerously Funny 🤫 Watch out for the one-liner. What type are you?", bn: "আমি চুপচাপ কিন্তু ভয়ংকর মজার 🤫 এক লাইনের জন্য সাবধান। তুমি কোন টাইপের?" },
  },
  "plan-no-go": {
    emoji: "📋",
    accent: "violet",
    title: { en: "Plans It, Never Goes", bn: "প্ল্যান করে, কিন্তু যায় না" },
    description: {
      en: "Your trip plans have budgets, maps and backup options. Sadly, they also have a “something came up” on the morning of departure.",
      bn: "তোমার ট্যুর প্ল্যানে বাজেট, ম্যাপ, ব্যাকআপ — সব আছে। দুঃখের বিষয়, যাওয়ার দিন সকালে একটা “হঠাৎ কাজ পড়ে গেছে”-ও থাকে।",
    },
    caption: { en: "I'm “Plans It, Never Goes” 📋 The spreadsheet is ready, though. What type are you?", bn: "আমি “প্ল্যান করে, কিন্তু যায় না” 📋 তবে এক্সেল শিট রেডি। তুমি কোন টাইপের?" },
  },
  "meme-lord": {
    emoji: "😂",
    accent: "chili",
    title: { en: "Meme Lord", bn: "মিমের রাজা" },
    description: {
      en: "Every life event becomes a meme within five minutes. Your gallery is 80 % screenshots, and your friends find out the news from your story.",
      bn: "জীবনের যেকোনো ঘটনা পাঁচ মিনিটের মধ্যে মিম। তোমার গ্যালারির ৮০% স্ক্রিনশট, আর বন্ধুরা খবর পায় তোমার স্টোরি থেকে।",
    },
    caption: { en: "I'm the Meme Lord 😂 This result is already a meme. What type are you?", bn: "আমি মিমের রাজা 😂 এই রেজাল্টও এখন মিম। তুমি কোন টাইপের?" },
  },
  "dawat-champion": {
    emoji: "🍛",
    accent: "cng",
    title: { en: "Dawat Champion", bn: "দাওয়াতের চ্যাম্পিয়ন" },
    description: {
      en: "You judge every event by the menu. You can smell biryani from two lanes away, and “I've already eaten” has never been true.",
      bn: "যেকোনো অনুষ্ঠানের বিচার তুমি করো মেনু দিয়ে। দুই গলি দূর থেকে বিরিয়ানির গন্ধ পাও, আর “খেয়ে এসেছি” কথাটা কখনো সত্যি হয়নি।",
    },
    caption: { en: "I'm the Dawat Champion 🍛 I came for the food. What type are you?", bn: "আমি দাওয়াতের চ্যাম্পিয়ন 🍛 খাবারের জন্যই এসেছি। তুমি কোন টাইপের?" },
  },
};

export const traitInfo: Record<Trait, { emoji: string; label: Text }> = {
  adda: { emoji: "🗣️", label: { en: "Adda", bn: "আড্ডা" } },
  village: { emoji: "🌾", label: { en: "Village heart", bn: "গ্রামের টান" } },
  philosopher: { emoji: "☕", label: { en: "Tea-stall theory", bn: "চা-দর্শন" } },
  silent: { emoji: "🤫", label: { en: "Silent humour", bn: "নীরব রসিকতা" } },
  planner: { emoji: "📋", label: { en: "Planning", bn: "প্ল্যানিং" } },
  meme: { emoji: "😂", label: { en: "Meme power", bn: "মিম পাওয়ার" } },
  foodie: { emoji: "🍛", label: { en: "Food radar", bn: "খাবার রাডার" } },
};

export const personalityCopy = {
  title: { en: "What Type of Bangali Are You?", bn: "তুমি কোন টাইপের বাঙালি?" },
  lead: {
    en: "8 quick questions about adda, guests, rain and Eid holidays. Find your type and send it to the group.",
    bn: "আড্ডা, মেহমান, বৃষ্টি আর ঈদের ছুটি নিয়ে ৮টা ঝটপট প্রশ্ন। নিজের টাইপ জেনে গ্রুপে পাঠিয়ে দাও।",
  },
  intro: {
    en: "No right or wrong answers — pick what you'd actually do.",
    bn: "ঠিক-ভুল উত্তর নেই — সত্যি সত্যি যা করো, সেটাই বেছে নাও।",
  },
  start: { en: "▶ Start the test", bn: "▶ টেস্ট শুরু করো" },
  takeIt: { en: "▶ Find my type", bn: "▶ আমার টাইপ বের করো" },
  friendBanner: { en: "👀 Your friend took the test. Their type:", bn: "👀 তোমার বন্ধু টেস্ট দিয়েছে। তার টাইপ:" },
  friendIs: { en: "Your friend is", bn: "তোমার বন্ধু হলো" },
  youAre: { en: "You are", bn: "তুমি হলে" },
  sameAsFriend: { en: "🤝 Same type as your friend!", bn: "🤝 তুমি আর তোমার বন্ধু একই টাইপ!" },
  diffFromFriend: { en: "Your friend got {emoji} {title}.", bn: "তোমার বন্ধু পেয়েছে {emoji} {title}।" },
  progress: { en: "Question {n} of {total}", bn: "প্রশ্ন {n} / {total}" },
  back: { en: "← Previous question", bn: "← আগের প্রশ্ন" },
  share: { en: "📤 Send it to friends", bn: "📤 বন্ধুদের পাঠাও" },
  shareVia: { en: "Share via", bn: "শেয়ার করো" },
  copyLink: { en: "Copy link", bn: "লিংক কপি" },
  linkCopied: { en: "Link copied!", bn: "লিংক কপি হয়েছে!" },
  retake: { en: "🔁 Take it again", bn: "🔁 আবার দাও" },
  invite: { en: "Take the test — which type are you?", bn: "টেস্ট দাও — তুমি কোন টাইপের?" },
  topTraits: { en: "Your mix", bn: "তোমার মিশ্রণ" },
  note: {
    en: "Just for fun — not science, and not about where anyone is from.",
    bn: "শুধু মজার জন্য — এটা বিজ্ঞান না, আর কারো এলাকা নিয়েও না।",
  },
  collected: { en: "Types found on this device: {n}/{total}", bn: "এই ডিভাইসে পাওয়া টাইপ: {n}/{total}" },
} satisfies Record<string, Text>;
