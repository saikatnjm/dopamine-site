import type { Accent } from "@/components/ui/styles";
import type { QuestionType, RankId } from "@/lib/games/guess-district";
import type { Text } from "@/lib/i18n/core";

// Copy for কোন জেলা? / Guess the District (/games/guess-district). Rank ids
// are permanent (lib/games/guess-district.ts); copy can change. Clues
// themselves live in data/district-clues.ts (sourced, owner-verified only).

export const rankInfo: Record<RankId, { accent: Accent; title: Text }> = {
  "lost-tourist": { accent: "chili", title: { en: "🧳 Lost Tourist", bn: "🧳 পথ হারানো পর্যটক" } },
  "bus-window-expert": { accent: "tangerine", title: { en: "🚌 Bus Window Expert", bn: "🚌 বাসের জানালার এক্সপার্ট" } },
  "local-guide": { accent: "sky", title: { en: "🧭 Local Guide", bn: "🧭 লোকাল গাইড" } },
  "human-gps": { accent: "lime", title: { en: "📍 Human GPS", bn: "📍 মানুষ জিপিএস" } },
  "district-legend": { accent: "marigold", title: { en: "👑 64-District Legend", bn: "👑 ৬৪ জেলার কিংবদন্তি" } },
};

export const promptFor: Record<QuestionType, Text> = {
  locate: { en: "Which district is highlighted?", bn: "কোন জেলাটা রং করা?" },
  shape: { en: "Which district is this?", bn: "এটা কোন জেলা?" },
  clue: { en: "Which district is this clue about?", bn: "এই সূত্রটা কোন জেলার?" },
};

/** 3 variants each, picked by question index (seeded via the round). */
export const rightLines: readonly Text[] = [
  { en: "✅ Spot on!", bn: "✅ একদম ঠিক!" },
  { en: "✅ You know your desh!", bn: "✅ দেশ তুমি ভালোই চেনো!" },
  { en: "✅ Bullseye. Local guide energy.", bn: "✅ নিখুঁত। লোকাল গাইডের মতো।" },
];
export const wrongLines: readonly Text[] = [
  { en: "❌ Not quite.", bn: "❌ হলো না।" },
  { en: "❌ Close… on a different map.", bn: "❌ কাছাকাছি… অন্য কোনো ম্যাপে।" },
  { en: "❌ The bus went the other way.", bn: "❌ বাস অন্য দিকে চলে গেছে।" },
];

export const gdCopy = {
  title: { en: "Guess the District", bn: "কোন জেলা?" },
  dailyTitle: { en: "🗺️ Guess the District #{n}", bn: "🗺️ কোন জেলা? #{n}" },
  practiceTitle: { en: "🗺️ Guess the District · Practice", bn: "🗺️ কোন জেলা? · প্র্যাকটিস" },
  intro: { en: "10 questions. Same puzzle for everyone today.", bn: "১০টা প্রশ্ন। আজ সবার জন্য একই ধাঁধা।" },
  introPractice: { en: "10 new questions, just for practice.", bn: "১০টা নতুন প্রশ্ন, শুধু প্র্যাকটিসের জন্য।" },
  how: {
    en: "Spot the district on the map, guess it from its shape, or from a clue. 4 choices each.",
    bn: "ম্যাপে জেলা চেনো, আকৃতি দেখে বলো, বা সূত্র শুনে ধরো। প্রতিটায় ৪টা অপশন।",
  },
  start: { en: "▶ Start", bn: "▶ শুরু করো" },
  practice: { en: "🎯 Practice round", bn: "🎯 প্র্যাকটিস রাউন্ড" },
  todayDone: { en: "Today: {score}/10 · next puzzle in {time}", bn: "আজ: {score}/১০ · পরের ধাঁধা {time} পরে" },
  playToday: { en: "▶ Play #{n}", bn: "▶ #{n} খেলো" },
  newPuzzle: { en: "🌙 A new puzzle is out!", bn: "🌙 নতুন ধাঁধা এসেছে!" },
  loadNew: { en: "Load today's puzzle", bn: "আজকের ধাঁধা খোলো" },
  progress: { en: "{n}/10", bn: "{n}/১০" },
  shapeAria: { en: "District shape, question {n}", bn: "জেলার আকৃতি, প্রশ্ন {n}" },
  mapAria: { en: "Map of Bangladesh with one district highlighted, question {n}", bn: "বাংলাদেশের ম্যাপে একটা জেলা রং করা, প্রশ্ন {n}" },
  revealAria: { en: "Map showing the answer", bn: "উত্তরসহ ম্যাপ" },
  itWas: { en: "It was {district}", bn: "উত্তর: {district}" },
  inDivision: { en: "{district}, {division} division", bn: "{district}, {division} বিভাগ" },
  source: { en: "📚 Source", bn: "📚 সূত্র" },
  next: { en: "Next →", bn: "পরের প্রশ্ন →" },
  finish: { en: "See my score →", bn: "স্কোর দেখো →" },
  keys: { en: "Keys: 1–4 to answer · Enter for next", bn: "কী-বোর্ড: ১–৪ উত্তর · Enter পরের প্রশ্ন" },
  scoreLabel: { en: "Score", bn: "স্কোর" },
  statMap: { en: "Map", bn: "ম্যাপ" },
  statShape: { en: "Shape", bn: "আকৃতি" },
  statClue: { en: "Clues", bn: "সূত্র" },
  newBest: { en: "🎉 New best!", bn: "🎉 নতুন সেরা!" },
  practiceLabel: { en: "Practice", bn: "প্র্যাকটিস" },
  shareText: { en: "Guess the District {label} — {score}/10 🗺️ Can you beat me?", bn: "কোন জেলা? {label} — {score}/১০ 🗺️ আমাকে হারাতে পারবে?" },
  again: { en: "🎯 Another practice round", bn: "🎯 আরেকটা প্র্যাকটিস" },
  myMap: { en: "🗺️ Mark the districts you've visited", bn: "🗺️ যেসব জেলায় গেছো দাগ দাও" },
  cardKicker: { en: "📍 TODAY'S DISTRICT PUZZLE", bn: "📍 আজকের জেলা ধাঁধা" },
  cardLoading: { en: "Loading today's puzzle…", bn: "আজকের ধাঁধা আসছে…" },
  local: { en: "Your scores stay on this device.", bn: "স্কোর শুধু এই ডিভাইসেই থাকে।" },
} satisfies Record<string, Text>;
