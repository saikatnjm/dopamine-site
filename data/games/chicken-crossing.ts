// Copy for Chicken Crossing Dhaka (EN + BN). Rules: lib/games/chicken-crossing.ts.
// Humor targets traffic situations, never people or groups.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { CrashKind, EventId, RankId, RowKind, VehicleKind } from "@/lib/games/chicken-crossing";

/** Sprite looks. Emoji face left by default; the game flips right-movers. */
export const looks: Record<VehicleKind, { emoji: string; name: Text; className: string }> = {
  car: { emoji: "🚗", name: { en: "a private car", bn: "প্রাইভেট কার" }, className: "bg-sky rounded-xl border-2 border-ink" },
  bus: { emoji: "🚌", name: { en: "a local bus", bn: "লোকাল বাস" }, className: "bg-tangerine rounded-2xl border-2 border-ink" },
  cng: { emoji: "🚕", name: { en: "a CNG", bn: "সিএনজি" }, className: "bg-cng rounded-xl border-2 border-ink" },
  rickshaw: { emoji: "🛺", name: { en: "a rickshaw", bn: "রিকশা" }, className: "bg-chili rounded-xl border-2 border-ink" },
  bike: { emoji: "🏍️", name: { en: "a motorbike", bn: "মোটরবাইক" }, className: "bg-violet rounded-xl border-2 border-ink" },
  dog: { emoji: "🐕", name: { en: "a street dog", bn: "রাস্তার কুকুর" }, className: "" },
  pedestrian: { emoji: "🚶", name: { en: "a man on his phone", bn: "ফোনে ব্যস্ত এক পথচারী" }, className: "" },
};

export const crashLines: Record<CrashKind, Text> = {
  car: { en: "Bonked by a private car. It didn't even slow down.", bn: "প্রাইভেট কারের ধাক্কা। গতিও কমায়নি।" },
  bus: { en: "Flattened by a local bus. The helper said “ওস্তাদ, আস্তে!” — too late.", bn: "লোকাল বাসে চ্যাপ্টা। হেলপার বলল “ওস্তাদ, আস্তে!” — দেরি হয়ে গেছে।" },
  cng: { en: "A CNG came out of nowhere. As they do.", bn: "কোথা থেকে যেন একটা সিএনজি। যেমনটা সবসময় হয়।" },
  rickshaw: { en: "Hit by a rickshaw going 4 km/h. Embarrassing.", bn: "ঘণ্টায় ৪ কিমি গতির রিকশার ধাক্কা। লজ্জার।" },
  bike: { en: "A motorbike zoomed past. Through you, technically.", bn: "একটা বাইক সাঁই করে চলে গেল। টেকনিক্যালি, আপনার ভেতর দিয়ে।" },
  dog: { en: "The street dog won. It always wins.", bn: "রাস্তার কুকুর জিতে গেছে। সবসময়ই জেতে।" },
  pedestrian: { en: "Walked into a man on his phone. Neither of you looked up.", bn: "ফোনে ব্যস্ত এক পথচারীর সাথে ধাক্কা। দুজনের কেউই তাকাননি।" },
  "left-behind": { en: "You stood still too long. Dhaka moved on without you.", bn: "অনেকক্ষণ দাঁড়িয়ে ছিলেন। ঢাকা আপনাকে ফেলেই এগিয়ে গেছে।" },
};

/** Level names (index = level; the last repeats forever). */
export const levelNames: readonly Text[] = [
  { en: "Gully Warm-up", bn: "গলির ওয়ার্ম-আপ" },
  { en: "Farmgate Rush Hour", bn: "ফার্মগেট রাশ আওয়ার" },
  { en: "Rickshaw Roulette", bn: "রিকশা রুলেট" },
  { en: "Motijheel Madness", bn: "মতিঝিল ম্যাডনেস" },
  { en: "Jatrabari Jam Session", bn: "যাত্রাবাড়ী জ্যাম সেশন" },
  { en: "Airport Road Boss Fight", bn: "এয়ারপোর্ট রোড বস ফাইট" },
  { en: "Pure Hottogol", bn: "খাঁটি হট্টগোল" },
];

export function levelName(level: number): Text {
  return levelNames[Math.min(level, levelNames.length - 1)]!;
}

export const eventBanners: Record<EventId, Text> = {
  "u-turn": { en: "↩️ Surprise U-turn! Rules are suggestions.", bn: "↩️ হঠাৎ ইউ-টার্ন! নিয়ম তো শুধু পরামর্শ।" },
  "bus-stop": { en: "🚌 Bus stopped in the middle of the road. Passengers boarding.", bn: "🚌 রাস্তার মাঝখানে বাস থামল। যাত্রী উঠছে।" },
  "cng-surprise": { en: "🚕 A CNG appeared from nowhere!", bn: "🚕 কোথা থেকে যেন সিএনজি হাজির!" },
  dog: { en: "🐕 Dog crossing! He has somewhere to be.", bn: "🐕 কুকুর পার হচ্ছে! তার জরুরি কাজ আছে।" },
  rain: { en: "🌧️ Rain mode: everyone is in a hurry now.", bn: "🌧️ বৃষ্টি মোড: এখন সবার তাড়া।" },
  "dhaka-mode": { en: "🔥 DHAKA MODE! Traffic has lost its mind.", bn: "🔥 ঢাকা মোড! ট্রাফিকের মাথা খারাপ।" },
};

export const nearMissWords: readonly Text[] = [
  { en: "PHEW!", bn: "উফফ!" },
  { en: "CLOSE!", bn: "অল্পের জন্য!" },
  { en: "BOK BOK!", bn: "কক কক!" },
  { en: "WHOOSH!", bn: "সাঁই!" },
  { en: "NOT TODAY!", bn: "আজ না!" },
];

export const rowNames: Record<RowKind, Text> = {
  footpath: { en: "Footpath", bn: "ফুটপাত" },
  divider: { en: "Divider", bn: "ডিভাইডার" },
  road: { en: "Road", bn: "রাস্তা" },
};

export type ChickenRank = { emoji: string; title: Text; blurb: Text; accent: Accent };

/** Titles by score (lib rankFor). Never rename ids. */
export const ranks: Record<RankId, ChickenRank> = {
  "road-legend": {
    emoji: "👑",
    title: { en: "Legend of the Zebra Crossing", bn: "জেব্রা ক্রসিংয়ের কিংবদন্তি" },
    blurb: { en: "Buses slow down out of respect. Traffic police salute you.", bn: "সম্মানে বাস গতি কমায়। ট্রাফিক পুলিশ আপনাকে স্যালুট দেয়।" },
    accent: "marigold",
  },
  "zebra-master": {
    emoji: "🦓",
    title: { en: "Zebra Crossing Master", bn: "জেব্রা ক্রসিং মাস্টার" },
    blurb: { en: "You read traffic like a newspaper. Dhaka respects that.", bn: "খবরের কাগজের মতো ট্রাফিক পড়েন। ঢাকা এটার দাম দেয়।" },
    accent: "lime",
  },
  "brave-chicken": {
    emoji: "🐔",
    title: { en: "Brave Little Chicken", bn: "সাহসী ছোট্ট মুরগি" },
    blurb: { en: "Several lanes, zero fear, mild panic. Respectable.", bn: "কয়েকটা লেন, ভয় শূন্য, হালকা আতঙ্ক। সম্মানজনক।" },
    accent: "sky",
  },
  "nervous-nugget": {
    emoji: "🍗",
    title: { en: "Nervous Nugget", bn: "নার্ভাস নাগেট" },
    blurb: { en: "You tried. The road tried harder.", bn: "আপনি চেষ্টা করেছেন। রাস্তা আরও বেশি চেষ্টা করেছে।" },
    accent: "tangerine",
  },
  "roadside-snack": {
    emoji: "🥚",
    title: { en: "Still an Egg", bn: "এখনো ডিম" },
    blurb: { en: "Maybe cross tomorrow. Or never. Both valid.", bn: "কাল পার হয়েন। অথবা কখনোই না। দুটোই ঠিক আছে।" },
    accent: "chili",
  },
};

export const chickenCopy = {
  howTitle: { en: "How to cross", bn: "কীভাবে পার হবেন" },
  how: [
    { en: "Tap or swipe up to hop forward. Swipe left/right/down to dodge. Keyboard: arrows or WASD.", bn: "সামনে লাফাতে ট্যাপ বা উপরে সোয়াইপ। বামে/ডানে/নিচে সোয়াইপ করে এড়ান। কিবোর্ড: অ্যারো বা WASD।" },
    { en: "Every row forward = points. Brush past traffic for near-miss combos.", bn: "প্রতি সারি সামনে = পয়েন্ট। গাড়ির একদম পাশ দিয়ে গেলে নিয়ার-মিস কম্বো।" },
    { en: "Don't stand still — the city keeps moving and will leave you behind.", bn: "দাঁড়িয়ে থাকবেন না — শহর এগোতে থাকে, আপনাকে ফেলে যাবে।" },
  ],
  best: { en: "Best", bn: "সেরা" },
  start: { en: "START CROSSING", bn: "পার হওয়া শুরু" },
  stageLabel: { en: "Dhaka road — hop the chicken across", bn: "ঢাকার রাস্তা — মুরগিকে পার করান" },
  score: { en: "Score", bn: "স্কোর" },
  distance: { en: "Distance", bn: "দূরত্ব" },
  combo: { en: "Combo", bn: "কম্বো" },
  level: { en: "Level", bn: "লেভেল" },
  metres: { en: "{n} m", bn: "{n} মি" },
  levelUp: { en: "Level {n}: {name}", bn: "লেভেল {n}: {name}" },
  countdown: [
    { en: "Ready…", bn: "রেডি…" },
    { en: "Set…", bn: "সেট…" },
    { en: "BOK!", bn: "কক!" },
  ],
  splat: { en: "BOK?!", bn: "কক?!" },
  up: { en: "Hop forward", bn: "সামনে লাফ" },
  down: { en: "Hop back", bn: "পেছনে লাফ" },
  left: { en: "Hop left", bn: "বামে লাফ" },
  right: { en: "Hop right", bn: "ডানে লাফ" },
  statScore: { en: "🏆 Score", bn: "🏆 স্কোর" },
  statDistance: { en: "📏 Distance", bn: "📏 দূরত্ব" },
  statNear: { en: "🔥 Near misses", bn: "🔥 নিয়ার মিস" },
  statLevel: { en: "🗺️ Reached", bn: "🗺️ পৌঁছেছেন" },
  rankLabel: { en: "🎖️ Rank", bn: "🎖️ র‍্যাঙ্ক" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত সেরা!" },
  roadCode: { en: "Road code", bn: "রোড কোড" },
  retry: { en: "↺ RETRY", bn: "↺ আবার" },
  replay: { en: "Replay the same road", bn: "একই রাস্তা আবার" },
  shareResult: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  shareText: {
    en: "My chicken crossed {m} m of Dhaka traffic ({score} pts, {near} near misses) — “{title}” {emoji}. Same road, can you beat it?",
    bn: "আমার মুরগি ঢাকার ট্রাফিকে {m} মিটার পার হয়েছে ({score} পয়েন্ট, {near}টা নিয়ার মিস) — “{title}” {emoji}। একই রাস্তা, হারাতে পারবে?",
  },
};
