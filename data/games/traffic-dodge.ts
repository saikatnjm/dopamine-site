import type { Accent } from "@/components/ui/styles";
import type { EventId, ObstacleKind, RankId } from "@/lib/games/traffic-dodge";
import type { Text } from "@/lib/i18n/core";

// All copy for Dhaka Traffic Dodge (EN + BN). Driver/road quotes stay Bangla.
// Humor targets the traffic situation, never people.

export const trafficDodgeCopy = {
  howTitle: { en: "How to play", bn: "কীভাবে খেলবেন" },
  how: [
    { en: "You're on a motorbike. Dhaka traffic is coming at you. Don't touch anything.", bn: "আপনি বাইকে। ঢাকার ট্রাফিক আপনার দিকে ছুটে আসছে। কিছু ছোঁবেন না।" },
    { en: "Swipe or tap left/right on the road, use the ◀ ▶ buttons, or press ← → / A D.", bn: "রাস্তায় বাঁয়ে/ডানে সোয়াইপ বা ট্যাপ করুন, ◀ ▶ বোতাম, অথবা ← → / A D চাপুন।" },
    { en: "Dodge at the last second for a near-miss bonus. Chain them for a combo.", bn: "শেষ মুহূর্তে পাশ কাটালে নিয়ার-মিস বোনাস। টানা করলে কম্বো।" },
    { en: "It only gets faster. One crash and it's over.", bn: "গতি শুধু বাড়বেই। একবার ধাক্কা লাগলেই শেষ।" },
  ],
  start: { en: "Start the engine", bn: "ইঞ্জিন চালু করুন" },
  best: { en: "Best", bn: "সেরা" },
  score: { en: "Score", bn: "স্কোর" },
  combo: { en: "Combo", bn: "কম্বো" },
  speed: { en: "Speed", bn: "গতি" },
  kmh: { en: "{n} km/h", bn: "{n} কিমি/ঘ" },
  time: { en: "Time", bn: "সময়" },
  seconds: { en: "{n}s", bn: "{n} সে." },
  pts: { en: "pts", bn: "পয়েন্ট" },
  left: { en: "Move left", bn: "বাঁয়ে সরুন" },
  right: { en: "Move right", bn: "ডানে সরুন" },
  roadLabel: {
    en: "Traffic Dodge road. Swipe or tap left or right, or use the arrow keys or A and D, to change lanes.",
    bn: "ট্রাফিক ডজের রাস্তা। লেন বদলাতে বাঁয়ে বা ডানে সোয়াইপ/ট্যাপ করুন, অথবা অ্যারো কী বা A ও D চাপুন।",
  },
  countdown: [
    { en: "3…", bn: "৩…" },
    { en: "2…", bn: "২…" },
    { en: "GO!", bn: "চলো!" },
  ],
  nearMiss: { en: "CLOSE!", bn: "অল্পের জন্য!" },
  crashed: { en: "💥 CRASH!", bn: "💥 ধাক্কা!" },
  crashedInto: { en: "Crashed into: {what}", bn: "ধাক্কা খেলেন: {what}" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  statTime: { en: "Survived", bn: "টিকেছেন" },
  statNear: { en: "Near-misses", bn: "নিয়ার-মিস" },
  statCombo: { en: "Best combo", bn: "সেরা কম্বো" },
  statSpeed: { en: "Top speed", bn: "সর্বোচ্চ গতি" },
  trafficCode: { en: "Traffic code", bn: "ট্রাফিক কোড" },
  retry: { en: "↺ Retry (new traffic)", bn: "↺ আবার (নতুন ট্রাফিক)" },
  replay: { en: "Replay this exact traffic", bn: "একই ট্রাফিক আবার খেলুন" },
  share: { en: "📤 Share result", bn: "📤 ফলাফল শেয়ার" },
  shareText: {
    en: "I survived {time}s of Dhaka traffic and got “{title}” ({score} pts) in Traffic Dodge 🛵 Same traffic, your turn:",
    bn: "ট্রাফিক ডজে ঢাকার ট্রাফিকে {time} সেকেন্ড টিকে হলাম “{title}” ({score} পয়েন্ট) 🛵 একই ট্রাফিক, এবার আপনার পালা:",
  },
} satisfies Record<string, Text | Text[]>;

/** Look of each obstacle sticker. Bus route signs are picked per vehicle. */
export const obstacleLooks: Record<ObstacleKind, { emoji: string; name: Text; className: string }> = {
  rickshaw: { emoji: "🚲", name: { en: "a rickshaw", bn: "রিকশা" }, className: "bg-chili rounded-xl border-2 border-ink" },
  cng: { emoji: "🛺", name: { en: "a CNG", bn: "সিএনজি" }, className: "bg-cng rounded-xl border-2 border-ink" },
  car: { emoji: "🚗", name: { en: "a private car", bn: "প্রাইভেট কার" }, className: "bg-sky rounded-xl border-2 border-ink" },
  bus: { emoji: "🚌", name: { en: "a local bus", bn: "লোকাল বাস" }, className: "bg-tangerine rounded-2xl border-2 border-ink" },
  goat: { emoji: "🐐", name: { en: "a goat", bn: "ছাগল" }, className: "" },
  cow: { emoji: "🐄", name: { en: "a cow", bn: "গরু" }, className: "" },
  pothole: { emoji: "🕳️", name: { en: "a pothole", bn: "গর্ত" }, className: "rounded-[50%] bg-ink/60" },
};

export const busRoutes = ["গুলিস্তান", "মিরপুর ১০", "মতিঝিল", "সায়েদাবাদ", "উত্তরা", "যাত্রাবাড়ী"] as const;

export const eventBanners: Record<EventId, Text> = {
  vip: { en: "🚨 VIP movement! Only one lane open", bn: "🚨 ভিআইপি মুভমেন্ট! একটাই লেন খোলা" },
  goats: { en: "🐐 Goat crossing ahead", bn: "🐐 সামনে ছাগল পার হচ্ছে" },
  eid: { en: "🌙 Eid holiday! Dhaka is empty 😍", bn: "🌙 ঈদের ছুটি! ঢাকা ফাঁকা 😍" },
  rain: { en: "🌧️ Sudden rain — everyone speeds up for no reason", bn: "🌧️ হঠাৎ বৃষ্টি — সবাই অকারণে জোরে চালাচ্ছে" },
  "bus-race": { en: "🚌 Two buses are racing for passengers!", bn: "🚌 যাত্রী ধরতে দুই বাসের রেস!" },
  "rickshaw-jam": { en: "🚲 Rickshaw wave incoming", bn: "🚲 রিকশার ঢেউ আসছে" },
};

export const nearMissLines: Text[] = [
  { en: "“মামা, দেখে চালান!” 😱", bn: "“মামা, দেখে চালান!” 😱" },
  { en: "Missed by one paint layer", bn: "এক পরত রঙের জন্য বাঁচলেন" },
  { en: "Your mother felt that from home", bn: "বাসা থেকে আম্মু টের পেয়েছেন" },
  { en: "Side mirror: still attached ✅", bn: "সাইড মিরর: এখনো আছে ✅" },
  { en: "The bus conductor is impressed", bn: "বাসের কন্ডাক্টর মুগ্ধ" },
];

export const honkWords: Text[] = [
  { en: "PEEP!", bn: "প্যাঁ!" },
  { en: "HONK!", bn: "পিঁ-পিঁ!" },
  { en: "WHOOSH!", bn: "সাঁই!" },
];

export type TrafficRank = { id: RankId; emoji: string; title: Text; blurb: Text; accent: Accent };

export const trafficRanks: Record<RankId, TrafficRank> = {
  "road-legend": {
    id: "road-legend",
    emoji: "👑",
    title: { en: "Dhaka Road Legend", bn: "ঢাকার রাস্তার কিংবদন্তি" },
    blurb: { en: "Buses move aside for you. Traffic police salute. You have seen things.", bn: "বাস আপনাকে জায়গা দেয়। ট্রাফিক পুলিশ স্যালুট দেয়। আপনি অনেক কিছু দেখেছেন।" },
    accent: "marigold",
  },
  "traffic-ninja": {
    id: "traffic-ninja",
    emoji: "🥷",
    title: { en: "Traffic Ninja", bn: "ট্রাফিক নিনজা" },
    blurb: { en: "In and out of gaps that didn't exist. Nobody saw you. Not even the goat.", bn: "যে ফাঁক ছিলই না, সেখান দিয়েই বেরিয়ে গেলেন। কেউ দেখেনি। ছাগলটাও না।" },
    accent: "violet",
  },
  "lane-hopper": {
    id: "lane-hopper",
    emoji: "🐸",
    title: { en: "Certified Lane Hopper", bn: "সার্টিফায়েড লেন হপার" },
    blurb: { en: "Lanes are more of a suggestion to you. Respectable chaos.", bn: "লেন আপনার কাছে শুধু একটা পরামর্শ। সম্মানজনক হট্টগোল।" },
    accent: "lime",
  },
  "weekend-driver": {
    id: "weekend-driver",
    emoji: "🐢",
    title: { en: "Friday Morning Driver", bn: "শুক্রবার সকালের ড্রাইভার" },
    blurb: { en: "Great on empty roads. Weekday Dhaka had other plans.", bn: "ফাঁকা রাস্তায় দারুণ। কর্মদিবসের ঢাকার অন্য প্ল্যান ছিল।" },
    accent: "sky",
  },
  "crashed-early": {
    id: "crashed-early",
    emoji: "💥",
    title: { en: "Crashed Before Farmgate", bn: "ফার্মগেটের আগেই ধাক্কা" },
    blurb: { en: "The trip lasted less than the traffic signal. Maybe take the metro?", bn: "যাত্রাটা একটা সিগন্যালের চেয়েও কম টিকলো। মেট্রোতে যাবেন নাকি?" },
    accent: "chili",
  },
};
