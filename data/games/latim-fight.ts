import type { Accent } from "@/components/ui/styles";
import type { EndingId, KopGrade, OpponentId, RankId } from "@/lib/games/latim-fight";
import type { Text } from "@/lib/i18n/core";

// Copy for লাটিম যুদ্ধ (/games/latim-fight). Always "লাটিম" (owner: never লাট্টু).
// Opponents are generic para roles (same cast as Kacher Guti), never real
// people. The kop is toy cracking: no violence copy. Ids are permanent
// (lib/games/latim-fight.ts); copy can change. BN is a first draft.

export const opponentInfo: Record<OpponentId, { emoji: string; name: Text; blurb: Text }> = {
  "choto-bhai": {
    emoji: "🧒",
    name: { en: "Little Brother", bn: "ছোট ভাই" },
    blurb: { en: "Can't wind a string yet. Mostly wobbles.", bn: "এখনো লেত্তি পেঁচাতে পারে না। বেশিরভাগ সময় টলমল।" },
  },
  "boro-bhai": {
    emoji: "🧢",
    name: { en: "Para Boro Bhai", bn: "পাড়ার বড় ভাই" },
    blurb: { en: "Good spin, decent aim.", bn: "ঘোরানো ভালো, নিশানাও খারাপ না।" },
  },
  champion: {
    emoji: "👑",
    name: { en: "Mohollar Champion", bn: "মহল্লার চ্যাম্পিয়ন" },
    blurb: { en: "Perfect spin. Aims for the knockout every time.", bn: "নিখুঁত ঘোরানো। প্রতিবার বাইরে ফেলার তাল।" },
  },
};

export const endingInfo: Record<EndingId, { accent: Accent; title: Text }> = {
  flawless: { accent: "marigold", title: { en: "👑 Flawless. The Para Bows.", bn: "👑 ৩-০! পুরো পাড়া সালাম দিচ্ছে" } },
  won: { accent: "lime", title: { en: "🏆 Latim King", bn: "🏆 লাটিম সম্রাট" } },
  draw: { accent: "sky", title: { en: "🤝 Spun Out Even", bn: "🤝 সমানে সমান" } },
  lost: { accent: "tangerine", title: { en: "😮‍💨 Out-Spun", bn: "😮‍💨 ঘোরানোতে হেরে গেলে" } },
  cracked: { accent: "chili", title: { en: "💥 Your Latim Got Cracked", bn: "💥 তোমার লাটিম ফাটা!" } },
};

export const rankInfo: Record<RankId, Text> = {
  wobbly: { en: "Wobbly Beginner", bn: "টলমলে নতুন" },
  "string-winder": { en: "String Winder", bn: "লেত্তি-ওস্তাদ" },
  "circle-boss": { en: "Circle Boss", bn: "বৃত্তের বস" },
  "latim-legend": { en: "Latim Legend", bn: "লাটিমের কিংবদন্তি" },
};

export const kopInfo: Record<KopGrade, Text> = {
  perfect: { en: "ফাটা! 💥 Perfect kop! +50", bn: "ফাটা! 💥 নিখুঁত কোপ! +৫০" },
  good: { en: "Good kop! বাহবা! +20", bn: "ভালো কোপ! বাহবা! +২০" },
  miss: { en: "Missed the kop. The latim is still yours.", bn: "কোপ ফসকে গেল। লাটিম তবু তোমার।" },
};

export const latimCopy = {
  title: { en: "Latim Fight", bn: "লাটিম যুদ্ধ" },
  intro: {
    en: "Wind the string, throw your লাটিম. Whoever lands farthest attacks first. Knock the other latim out of the circle to win it. First to 3.",
    bn: "লেত্তি পেঁচাও, লাটিম ছোড়ো। যার লাটিম সবচেয়ে দূরে যায়, সে আগে আক্রমণ করবে। অন্যের লাটিম বৃত্তের বাইরে ফেললে সেটা তোমার। আগে ৩টা জিতলেই জয়।",
  },
  rules: {
    en: "বেল্লা পার: the defender spins inside the circle, the attacker throws at it. Knock it out = +1 and attack again; no knockout = swap. A fallen latim stuck inside gives one more throw.",
    bn: "বেল্লা পার: ডিফেন্ডারের লাটিম বৃত্তে ঘোরে, আক্রমণকারী ছুড়ে মারে। বাইরে ফেললে +১ আর আবার আক্রমণ; না পারলে পালা বদল। পড়ে যাওয়া লাটিম ভেতরে আটকে থাকলে আরেকবার ছোড়ার সুযোগ।",
  },
  pick: { en: "Pick your opponent", bn: "প্রতিপক্ষ বেছে নাও" },
  start: { en: "🌀 Start", bn: "🌀 শুরু করো" },
  locked: { en: "Your friend played this exact match against:", bn: "তোমার বন্ধু ঠিক এই ম্যাচটা খেলেছে এর সাথে:" },
  how: {
    en: "Press and hold the ground to wind (release in the green), drag back to aim and set power, let go to throw. Keys: hold Space to wind · ←/→ aim · ↑/↓ power · release Space.",
    bn: "মাটিতে চেপে ধরে লেত্তি পেঁচাও (সবুজে ছাড়ো), পেছনে টেনে নিশানা আর শক্তি ঠিক করো, ছেড়ে দিলে ছুড়বে। কী-বোর্ড: Space ধরে পেঁচাও · ←/→ নিশানা · ↑/↓ শক্তি · Space ছাড়ো।",
  },
  you: { en: "You", bn: "তুমি" },
  bout: { en: "Bout {n}/{total}", bn: "দান {n}/{total}" },
  firstTo: { en: "First to {n}", bn: "আগে {n}টা" },
  attack: { en: "⚔️ ATTACK", bn: "⚔️ আক্রমণ" },
  defend: { en: "🛡️ DEFEND", bn: "🛡️ ডিফেন্ড" },
  drawing: { en: "Drawing the circle…", bn: "বৃত্ত আঁকা হচ্ছে…" },
  skip: { en: "Skip ⏩", bn: "স্কিপ ⏩" },
  orderYou: { en: "Throw outward from the middle: farthest attacks first.", bn: "মাঝখান থেকে বাইরের দিকে ছোড়ো: যে বেশি দূরে, সে আগে আক্রমণ করবে।" },
  orderCpu: { en: "{name} throws…", bn: "{name} ছুড়ছে…" },
  youAttack: { en: "You landed farther: you attack first!", bn: "তুমি বেশি দূরে: তুমি আগে আক্রমণ করবে!" },
  cpuAttack: { en: "{name} landed farther and attacks first.", bn: "{name} বেশি দূরে, সে আগে আক্রমণ করবে।" },
  defendYou: { en: "Defend: throw your latim into the circle and keep it spinning.", bn: "ডিফেন্ড: লাটিম বৃত্তের ভেতরে ছোড়ো, ঘুরতে থাকুক।" },
  defendCpu: { en: "{name} spins a latim into the circle…", bn: "{name} বৃত্তে লাটিম ছুড়ছে…" },
  attackYou: { en: "Attack: hit it out of the circle!", bn: "আক্রমণ: মেরে বৃত্তের বাইরে ফেলো!" },
  attackCpu: { en: "{name} attacks…", bn: "{name} আক্রমণ করছে…" },
  placed: { en: "Landed outside, set down inside the circle.", bn: "বাইরে পড়েছিল, বৃত্তের ভেতরে বসানো হলো।" },
  knockoutYou: { en: "বাইরে! You win that latim!", bn: "বাইরে! লাটিমটা তোমার!" },
  knockoutCpu: { en: "বাইরে! {name} wins your latim.", bn: "বাইরে! তোমার লাটিম {name}-এর।" },
  stuck: { en: "It fell and it's stuck inside: one more throw!", bn: "পড়ে গিয়ে ভেতরে আটকে গেছে: আরেকবার ছোড়ো!" },
  swapHit: { en: "Hit, but it stayed in. Swap!", bn: "লেগেছে, তবে ভেতরেই রয়ে গেল। পালা বদল!" },
  swapMiss: { en: "Missed! Swap.", bn: "ফসকে গেছে! পালা বদল।" },
  kopTitle: { en: "ঘর কোপ! Tap when the ring meets the latim.", bn: "ঘর কোপ! রিং লাটিমে মিললেই ট্যাপ করো।" },
  kopBtn: { en: "🔨 KOP!", bn: "🔨 কোপ!" },
  latimsWon: { en: "Latims won", bn: "জেতা লাটিম" },
  bestKop: { en: "Best kop", bn: "সেরা কোপ" },
  kopPerfect: { en: "Perfect", bn: "নিখুঁত" },
  kopGood: { en: "Good", bn: "ভালো" },
  longestSpin: { en: "Longest spin", bn: "সবচেয়ে বেশি ঘোরা" },
  seconds: { en: "{n} s", bn: "{n} সেকেন্ড" },
  opponent: { en: "Opponent", bn: "প্রতিপক্ষ" },
  scoreLabel: { en: "Your score", bn: "তোমার স্কোর" },
  newBest: { en: "🎉 New best!", bn: "🎉 নতুন সেরা!" },
  best: { en: "Best: {n}", bn: "সেরা: {n}" },
  retry: { en: "🔁 Same match again", bn: "🔁 আবার একই ম্যাচ" },
  newMatch: { en: "🆕 New match", bn: "🆕 নতুন ম্যাচ" },
  shareText: {
    en: "I scored {n} in Latim Fight vs {name} 🌀 You won't beat me.",
    bn: "লাটিম যুদ্ধে {name}-এর সাথে {n} স্কোর করেছি 🌀 আমাকে হারাতে পারবে না।",
  },
  soundOn: { en: "🔊 Sound on", bn: "🔊 শব্দ চালু" },
  soundOff: { en: "🔇 Sound off", bn: "🔇 শব্দ বন্ধ" },
  stage: { en: "Latim circle", bn: "লাটিমের বৃত্ত" },
  spin: { en: "Spin", bn: "ঘূর্ণি" },
} satisfies Record<string, Text>;
