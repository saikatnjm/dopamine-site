import type { Accent } from "@/components/ui/styles";
import type { EndingId, ItemId, Line, PersonalityId } from "@/lib/games/bazar-bargain";
import type { Text } from "@/lib/i18n/core";

// All copy for Bazar Bargain (EN + BN).
// Vendor quotes are Bangla in both languages (`bn`); `en` is a small English
// gloss shown under the quote in English mode. {price} = current price.
// Humor targets the haggling situation, never people.

export const bazarCopy = {
  howTitle: { en: "How to play", bn: "কীভাবে খেলবেন" },
  how: [
    { en: "Amma gave you a budget and a list of 5 things. Don't come home empty-handed.", bn: "আম্মা বাজেট আর ৫টা জিনিসের লিস্ট দিয়েছেন। খালি হাতে ফেরা যাবে না।" },
    { en: "Every vendor quotes too high. Counter, bluff, walk away — or just pay.", bn: "সব দোকানি বেশি দাম চায়। দরদাম করুন, চাপা মারুন, হেঁটে চলে যান — নয়তো দিয়ে দিন।" },
    { en: "Offer too low and they get offended. Push too hard and they refuse to sell.", bn: "খুব কম বললে রেগে যাবে। বেশি চাপ দিলে বিক্রিই করবে না।" },
    { en: "Score = money saved + items bought + bargaining skill. Some endings are legendary.", bn: "স্কোর = বাঁচানো টাকা + কেনা জিনিস + দরদামের দক্ষতা। কিছু এন্ডিং কিংবদন্তি।" },
  ],
  start: { en: "Go to the bazar", bn: "বাজারে চলুন" },
  best: { en: "Best", bn: "সেরা" },
  budget: { en: "Budget left", bn: "বাজেট বাকি" },
  saved: { en: "Saved", bn: "বাঁচালেন" },
  stall: { en: "Stall {n} of {total}", bn: "দোকান {n} / {total}" },
  asking: { en: "Asking price", bn: "চাইছে" },
  wasPrice: { en: "Started at ৳{price}", bn: "শুরু ছিল ৳{price}" },
  mood: { en: "Vendor mood", bn: "দোকানির মেজাজ" },
  offer: { en: "Offer ৳{price}", bn: "৳{price} বলুন" },
  accept: { en: "🤝 Pay ৳{price}", bn: "🤝 ৳{price} দিন" },
  cantAfford: { en: "Not enough money", bn: "টাকায় কুলাচ্ছে না" },
  walk: { en: "🚶 Walk away", bn: "🚶 চলে যান" },
  regular: { en: "😇 “I'm a regular”", bn: "😇 “আমি তো রোজ আসি”" },
  neighbor: { en: "👉 “Next shop is cheaper”", bn: "👉 “পাশের দোকানে কম”" },
  skip: { en: "Skip this item", bn: "এটা বাদ দিন" },
  next: { en: "Next stall →", bn: "পরের দোকান →" },
  finish: { en: "Go home 🏠", bn: "বাসায় যান 🏠" },
  bought: { en: "✅ Bought for ৳{price}", bn: "✅ কিনলেন ৳{price}-এ" },
  freebieNote: { en: "🍋 + free lemon!", bn: "🍋 + ফ্রি লেবু!" },
  notBought: { en: "❌ Not bought", bn: "❌ কেনা হয়নি" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  legendary: { en: "✨ Legendary ending", bn: "✨ কিংবদন্তি এন্ডিং" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  statSaved: { en: "Saved", bn: "বাঁচানো" },
  statBought: { en: "Bought", bn: "কেনা" },
  statSkill: { en: "Bargain skill", bn: "দরদাম দক্ষতা" },
  statSpent: { en: "Spent", bn: "খরচ" },
  receipt: { en: "Today's bazar", bn: "আজকের বাজার" },
  bazarCode: { en: "Bazar code", bn: "বাজার কোড" },
  challenge: {
    en: "A friend scored {score} at this exact bazar. Same vendors, same prices — beat it.",
    bn: "এই একই বাজারে এক বন্ধু {score} পেয়েছে। একই দোকানি, একই দাম — হারিয়ে দিন।",
  },
  challengeWin: { en: "🏆 You beat your friend's {score}!", bn: "🏆 বন্ধুর {score} হারিয়ে দিলেন!" },
  challengeLose: { en: "😬 Your friend's {score} still stands.", bn: "😬 বন্ধুর {score} এখনো টিকে আছে।" },
  retry: { en: "↺ Retry (new bazar)", bn: "↺ আবার (নতুন বাজার)" },
  replay: { en: "Replay this exact bazar", bn: "একই বাজার আবার খেলুন" },
  share: { en: "📤 Share result", bn: "📤 ফলাফল শেয়ার" },
  copied: { en: "✅ Link copied!", bn: "✅ লিংক কপি হয়েছে!" },
  shareText: {
    en: "My Bazar Bargain ending: “{title}” — saved ৳{saved}, {score} pts 🛒 Same vendors, your turn:",
    bn: "বাজার বার্গেইনে আমার এন্ডিং: “{title}” — বাঁচালাম ৳{saved}, {score} পয়েন্ট 🛒 একই দোকানি, এবার আপনার পালা:",
  },
} satisfies Record<string, Text | Text[]>;

export const items: Record<ItemId, { emoji: string; name: Text }> = {
  hilsa: { emoji: "🐟", name: { en: "Hilsa (1 pc)", bn: "ইলিশ (১টা)" } },
  rui: { emoji: "🐠", name: { en: "Rui fish (1 kg)", bn: "রুই মাছ (১ কেজি)" } },
  chicken: { emoji: "🐔", name: { en: "Broiler chicken (1 kg)", bn: "ব্রয়লার মুরগি (১ কেজি)" } },
  eggs: { emoji: "🥚", name: { en: "Eggs (1 dozen)", bn: "ডিম (১ ডজন)" } },
  potato: { emoji: "🥔", name: { en: "Potatoes (2 kg)", bn: "আলু (২ কেজি)" } },
  onion: { emoji: "🧅", name: { en: "Onions (1 kg)", bn: "পেঁয়াজ (১ কেজি)" } },
  rice: { emoji: "🍚", name: { en: "Rice (5 kg)", bn: "চাল (৫ কেজি)" } },
  dal: { emoji: "🫘", name: { en: "Lentils (1 kg)", bn: "মসুর ডাল (১ কেজি)" } },
  chili: { emoji: "🌶️", name: { en: "Green chili (250 g)", bn: "কাঁচা মরিচ (২৫০ গ্রাম)" } },
  brinjal: { emoji: "🍆", name: { en: "Brinjal (1 kg)", bn: "বেগুন (১ কেজি)" } },
  beef: { emoji: "🥩", name: { en: "Beef (1 kg)", bn: "গরুর মাংস (১ কেজি)" } },
  gourd: { emoji: "🥒", name: { en: "Bottle gourd (1 pc)", bn: "লাউ (১টা)" } },
};

export const vendors: Record<PersonalityId, { emoji: string; name: Text; accent: Accent; greet: Text[] }> = {
  stubborn: {
    emoji: "🪨",
    name: { en: "The Stubborn One", bn: "একরোখা দোকানি" },
    accent: "sky",
    greet: [
      { bn: "“৳{price}। এক দাম। বাজারে জিজ্ঞেস করেন।”", en: "“৳{price}. Fixed price. Ask anyone.”" },
      { bn: "“দাম কমবে না মামা, ৳{price}।”", en: "“Price won't drop, mama. ৳{price}.”" },
    ],
  },
  drama: {
    emoji: "🎭",
    name: { en: "The Drama King", bn: "ড্রামা কিং" },
    accent: "chili",
    greet: [
      { bn: "“৳{price}! এর কমে দিলে আমার সংসার চলবে না!”", en: "“৳{price}! Any less and my family starves!”" },
      { bn: "“আপনার জন্যই ৳{price}, অন্য কেউ হলে বেশি নিতাম!”", en: "“৳{price} only for you — anyone else pays more!”" },
    ],
  },
  friendly: {
    emoji: "🤗",
    name: { en: "The Friendly Mama", bn: "হাসিখুশি মামা" },
    accent: "lime",
    greet: [
      { bn: "“আসেন আসেন! একদম টাটকা, ৳{price}।”", en: "“Come, come! Super fresh, ৳{price}.”" },
      { bn: "“চা খাবেন? আচ্ছা, ৳{price} দিয়েন।”", en: "“Want tea? Okay, ৳{price}.”" },
    ],
  },
  sleepy: {
    emoji: "😴",
    name: { en: "The Sleepy Vendor", bn: "ঘুমকাতুরে দোকানি" },
    accent: "violet",
    greet: [
      { bn: "“হুঁ… ৳{price}… তাড়াতাড়ি বলেন…”", en: "“Hmm… ৳{price}… decide quickly…”" },
      { bn: "“*হাই তুলে* ৳{price}।”", en: "“*yawns* ৳{price}.”" },
    ],
  },
  salesman: {
    emoji: "📣",
    name: { en: "The Salesman", bn: "সেলসম্যান" },
    accent: "tangerine",
    greet: [
      { bn: "“ইমপোর্টেড কোয়ালিটি! মাত্র ৳{price}!”", en: "“Imported quality! Only ৳{price}!”" },
      { bn: "“অফার চলছে! ৳{price}, আজকেই শেষ!”", en: "“Special offer! ৳{price}, today only!”" },
    ],
  },
  philosopher: {
    emoji: "🤔",
    name: { en: "The Philosopher", bn: "দার্শনিক দোকানি" },
    accent: "marigold",
    greet: [
      { bn: "“দাম কী, বাবা? সবই মায়া। তবুও ৳{price}।”", en: "“What is price, son? All illusion. Still, ৳{price}.”" },
      { bn: "“জীবনের মতোই — ৳{price}, ফেরত নেই।”", en: "“Like life itself — ৳{price}, no refunds.”" },
    ],
  },
};

/** Generic vendor lines by reaction (quotes Bangla; `en` = gloss). */
export const lines: Record<Exclude<Line, "greet">, Text[]> = {
  counter: [
    { bn: "“না না, ৳{price} দেন।”", en: "“No no, give ৳{price}.”" },
    { bn: "“আচ্ছা, আপনার জন্য ৳{price}।”", en: "“Fine, for you ৳{price}.”" },
    { bn: "“কেনা দামই তো এর বেশি! ৳{price}।”", en: "“I bought it for more! ৳{price}.”" },
  ],
  offended: [
    { bn: "“এই দামে তো ছবিও পাবেন না! ৳{price}।”", en: "“You can't even buy a photo of it for that! ৳{price}.”" },
    { bn: "“মামা, মজা নেন? ৳{price}।”", en: "“Mama, are you joking? ৳{price}.”" },
  ],
  final: [
    { bn: "“শেষ কথা ৳{price}। এক টাকাও কম না।”", en: "“Final word: ৳{price}. Not one taka less.”" },
    { bn: "“৳{price}, নিলে নেন না নিলে যান।”", en: "“৳{price}. Take it or leave it.”" },
  ],
  deal: [
    { bn: "“আচ্ছা যান, নিয়ে যান। লস দিয়ে দিলাম।”", en: "“Fine, take it. I'm selling at a loss.”" },
    { bn: "“আপনি পাকা খদ্দের, দিলাম।”", en: "“You're a pro customer. Deal.”" },
    { bn: "“বউনি করলাম আপনার সাথে, দেন।”", en: "“First sale of the day, go on.”" },
  ],
  "deal-full": [
    { bn: "“ধন্যবাদ স্যার! আবার আসবেন!” 😁", en: "“Thank you sir! Come again!” 😁" },
    { bn: "“*পাশের দোকানিকে চোখ টিপে* নেন নেন।”", en: "“*winks at next vendor* Here you go.”" },
  ],
  freebie: [
    { bn: "“আপনাকে ভালো লাগছে — একটা লেবু ফ্রি!” 🍋", en: "“I like you — have a free lemon!” 🍋" },
    { bn: "“নেন, ধনেপাতা ফ্রি। আবার আসবেন।” 🌿", en: "“Here, free coriander. Come again.” 🌿" },
  ],
  refuse: [
    { bn: "“যান, অন্য দোকানে যান! বেচব না!”", en: "“Go to another shop! Not selling!”" },
    { bn: "“আপনার কাছে বিক্রি করব না, মাফ করেন।”", en: "“I won't sell to you. Sorry.”" },
  ],
  callback: [
    { bn: "“এই যে! শোনেন শোনেন! আচ্ছা ৳{price} দেন!”", en: "“Hey! Wait wait! Okay, ৳{price}!”" },
    { bn: "“আরে যান কই? ৳{price}, শেষ!”", en: "“Where are you going? ৳{price}, final!”" },
  ],
  letgo: [
    { bn: "“যান, এই দামে কেউ দিবে না।”", en: "“Go. Nobody will give it cheaper.”" },
    { bn: "*দোকানি ফোনে ব্যস্ত হয়ে গেলেন*", en: "*vendor suddenly busy on the phone*" },
  ],
  "regular-yes": [
    { bn: "“ও আচ্ছা, চেনা মানুষ! ৳{price} দেন।”", en: "“Oh, a familiar face! ৳{price} then.”" },
  ],
  "regular-no": [
    { bn: "“আপনাকে তো জীবনে দেখিনি!”", en: "“I've never seen you in my life!”" },
    { bn: "“রোজ আসেন? কই, কিছু তো কেনেন না!”", en: "“Every day? You never buy anything!”" },
  ],
  "neighbor-yes": [
    { bn: "“ওর মাল বাসি! আচ্ছা, আমি ৳{price} দিলাম।”", en: "“His stuff is stale! Fine, ৳{price}.”" },
  ],
  "neighbor-no": [
    { bn: "“তাহলে ওখান থেকেই কেনেন!”", en: "“Then buy from there!”" },
    { bn: "“ওটা তো আমার ভাইয়ের দোকান, একই দাম।”", en: "“That's my brother's shop. Same price.”" },
  ],
  skip: [{ bn: "“আচ্ছা, পরে আসেন।”", en: "“Okay, come later.”" }],
  broke: [
    { bn: "“টাকা কম? পরে আসেন মামা।”", en: "“Short on money? Come back later, mama.”" },
  ],
};

export type BazarEnding = { id: EndingId; emoji: string; title: Text; blurb: Text; accent: Accent };

export const endings: Record<EndingId, BazarEnding> = {
  "amma-approved": {
    id: "amma-approved",
    emoji: "👑",
    title: { en: "Amma-Approved Bazar", bn: "আম্মা-অনুমোদিত বাজার" },
    blurb: { en: "Everything bought, barely anything spent. Amma checked the fish gills and nodded. This happens once in a generation.", bn: "সব কেনা, খরচ প্রায় নেই। আম্মা মাছের কানকো দেখে মাথা নাড়লেন। এমন প্রজন্মে একবার হয়।" },
    accent: "marigold",
  },
  "free-lemon": {
    id: "free-lemon",
    emoji: "🍋",
    title: { en: "The Free Lemon Legend", bn: "ফ্রি লেবুর কিংবদন্তি" },
    blurb: { en: "A Dhaka vendor gave you something for FREE. Scientists are studying you.", bn: "ঢাকার দোকানি আপনাকে কিছু ফ্রি দিয়েছে। বিজ্ঞানীরা আপনাকে নিয়ে গবেষণা করছেন।" },
    accent: "lime",
  },
  banned: {
    id: "banned",
    emoji: "🚫",
    title: { en: "Banned from the Bazar", bn: "বাজারে নিষিদ্ধ" },
    blurb: { en: "Word travels fast. Vendors now hide their prices when you walk in.", bn: "খবর দ্রুত ছড়ায়। আপনি ঢুকলেই দোকানিরা দাম লুকিয়ে ফেলে।" },
    accent: "chili",
  },
  broke: {
    id: "broke",
    emoji: "🪙",
    title: { en: "Budget Died at the Fish Section", bn: "মাছের বাজারেই বাজেট শেষ" },
    blurb: { en: "You ran out of money before the list ran out of items. The rickshaw home is on credit.", bn: "লিস্ট শেষ হওয়ার আগেই টাকা শেষ। বাসায় ফেরার রিকশা বাকিতে।" },
    accent: "tangerine",
  },
  "empty-bag": {
    id: "empty-bag",
    emoji: "🛍️",
    title: { en: "Came Home With Only the Bag", bn: "শুধু ব্যাগ নিয়ে ফিরলেন" },
    blurb: { en: "Two hours at the bazar. One plastic bag. Zero groceries. Amma is typing…", bn: "দুই ঘণ্টা বাজারে। একটা পলিথিন। বাজার শূন্য। আম্মা টাইপ করছেন…" },
    accent: "violet",
  },
  "walking-atm": {
    id: "walking-atm",
    emoji: "🏧",
    title: { en: "The Walking ATM", bn: "চলন্ত এটিএম" },
    blurb: { en: "Vendors saw you coming and raised prices in real time. They'll name a stall after you.", bn: "আপনাকে দেখেই দোকানিরা দাম বাড়িয়েছে। আপনার নামে একটা দোকানের নাম হবে।" },
    accent: "sky",
  },
  "sharp-bargainer": {
    id: "sharp-bargainer",
    emoji: "🦅",
    title: { en: "Sharp-Eyed Bargainer", bn: "তীক্ষ্ণ চোখের দরদামবাজ" },
    blurb: { en: "Fair prices, full bag, no enemies made. Vendors respect you (and fear you a little).", bn: "ন্যায্য দাম, ভরা ব্যাগ, শত্রু নেই। দোকানিরা আপনাকে সম্মান করে (আর একটু ভয়ও পায়)।" },
    accent: "cng",
  },
  "decent-bazar": {
    id: "decent-bazar",
    emoji: "🧺",
    title: { en: "A Perfectly Normal Bazar", bn: "একদম সাধারণ বাজার" },
    blurb: { en: "Some wins, some losses, one suspicious brinjal. Amma says it's “okay”.", bn: "কিছু জিত, কিছু হার, একটা সন্দেহজনক বেগুন। আম্মা বললেন “চলে”।" },
    accent: "marigold",
  },
};
