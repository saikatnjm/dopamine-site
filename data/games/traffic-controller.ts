// Copy for Dhaka Traffic Controller (EN + BN). Rules: lib/games/traffic-controller.ts.
// Humor targets traffic situations, never people or groups.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { Approach, EventId, RankId, VehicleKind } from "@/lib/games/traffic-controller";

/** Sprite looks. Emoji face left by default; the game turns them to face their heading. */
export const looks: Record<VehicleKind, { emoji: string; name: Text; className: string }> = {
  car: { emoji: "🚗", name: { en: "a private car", bn: "প্রাইভেট কার" }, className: "bg-sky" },
  bus: { emoji: "🚌", name: { en: "a local bus", bn: "লোকাল বাস" }, className: "bg-tangerine" },
  cng: { emoji: "🛺", name: { en: "a CNG", bn: "সিএনজি" }, className: "bg-cng" },
  taxi: { emoji: "🚕", name: { en: "a taxi", bn: "ট্যাক্সি" }, className: "bg-marigold" },
  bike: { emoji: "🏍️", name: { en: "a motorbike", bn: "মোটরবাইক" }, className: "bg-violet" },
  rickshaw: { emoji: "🚲", name: { en: "a rickshaw", bn: "রিকশা" }, className: "bg-chili" },
  vip: { emoji: "🚘", name: { en: "a VIP car", bn: "ভিআইপি গাড়ি" }, className: "bg-ink text-bg" },
};

export const approachNames: Record<Approach, Text> = {
  n: { en: "North", bn: "উত্তর" },
  e: { en: "East", bn: "পূর্ব" },
  s: { en: "South", bn: "দক্ষিণ" },
  w: { en: "West", bn: "পশ্চিম" },
};

/** {from} = approach name. */
export const eventBanners: Record<EventId, Text> = {
  "u-turn": { en: "🔄 Someone is taking a U-turn in the middle of the junction ({from})!", bn: "🔄 মোড়ের ঠিক মাঝখানে কেউ ইউ-টার্ন নিচ্ছে ({from})!" },
  "bus-stop": { en: "🚌 A bus stopped to pick up passengers ({from}). Right there. In the lane.", bn: "🚌 যাত্রী তুলতে বাস থেমে গেছে ({from})। ঠিক ওখানেই। লেনের মাঝে।" },
  "rickshaw-block": { en: "🚲 A rickshaw is parking at the signal ({from}). Negotiations may take a while.", bn: "🚲 সিগন্যালে রিকশা দাঁড়িয়ে গেছে ({from})। আলোচনা একটু সময় নেবে।" },
  pedestrian: { en: "🚶 Pedestrians crossing ({from})! Everyone waits.", bn: "🚶 পথচারী পার হচ্ছে ({from})! সবাই অপেক্ষা করুন।" },
  rain: { en: "🌧️ Rain! Everything slows down. Everyone gets grumpy.", bn: "🌧️ বৃষ্টি! সব ধীর হয়ে গেছে। সবার মেজাজ খারাপ।" },
  vip: { en: "🚨 VIP car from the {from} — it will NOT stop at red. Clear the way!", bn: "🚨 {from} দিক থেকে ভিআইপি গাড়ি — লালে থামবে না। রাস্তা খালি করুন!" },
  rush: { en: "📢 Everyone arrived at once. From everywhere.", bn: "📢 সবাই একসাথে এসে পড়েছে। সব দিক থেকে।" },
};

export const flowWords: readonly Text[] = [
  { en: "SMOOTH!", bn: "মসৃণ!" },
  { en: "FLOWING!", bn: "চলছে!" },
  { en: "NICE!", bn: "দারুণ!" },
  { en: "WOW, MOVING!", bn: "বাহ, নড়ছে!" },
];

export type ControllerRank = { emoji: string; title: Text; blurb: Text; accent: Accent };

/** Titles by score (lib rankFor). Never rename ids. */
export const ranks: Record<RankId, ControllerRank> = {
  "traffic-god": {
    emoji: "👑",
    title: { en: "Traffic God of Farmgate", bn: "ফার্মগেটের ট্রাফিক দেবতা" },
    blurb: { en: "Buses obey you. CNGs fear you. Nobody honked for almost a minute.", bn: "বাস আপনার কথা শোনে। সিএনজি আপনাকে ভয় পায়। প্রায় এক মিনিট কেউ হর্ন দেয়নি।" },
    accent: "marigold",
  },
  "signal-sensei": {
    emoji: "🚦",
    title: { en: "Signal Sensei", bn: "সিগন্যাল ওস্তাদ" },
    blurb: { en: "Green, red, perfect timing. The junction has never been this calm.", bn: "সবুজ, লাল, নিখুঁত টাইমিং। মোড় কখনো এত শান্ত ছিল না।" },
    accent: "lime",
  },
  "junior-sergeant": {
    emoji: "👮",
    title: { en: "Junior Traffic Sergeant", bn: "জুনিয়র ট্রাফিক সার্জেন্ট" },
    blurb: { en: "Mostly flowing, occasionally shouting. A promising career.", bn: "বেশিরভাগ সময় চলছিল, মাঝে মাঝে চিৎকার। উজ্জ্বল ক্যারিয়ার।" },
    accent: "sky",
  },
  "horn-enthusiast": {
    emoji: "📯",
    title: { en: "Professional Horn Enthusiast", bn: "পেশাদার হর্নপ্রেমী" },
    blurb: { en: "Traffic moved. So did everyone's blood pressure.", bn: "ট্রাফিক নড়েছে। সবার রক্তচাপও।" },
    accent: "tangerine",
  },
  "gridlock-architect": {
    emoji: "🧱",
    title: { en: "Gridlock Architect", bn: "জ্যাম স্থপতি" },
    blurb: { en: "You didn't control traffic. You designed a jam.", bn: "আপনি ট্রাফিক নিয়ন্ত্রণ করেননি। একটা জ্যাম ডিজাইন করেছেন।" },
    accent: "chili",
  },
};

export const controllerCopy = {
  howTitle: { en: "How to run the junction", bn: "মোড় কীভাবে সামলাবেন" },
  how: [
    { en: "Tap a traffic light to switch it between 🟢 and 🔴. Keyboard: arrow keys for each side, Space flips all.", bn: "ট্রাফিক লাইটে ট্যাপ করে 🟢 আর 🔴 বদলান। কিবোর্ড: প্রতিটা দিকের জন্য অ্যারো কী, Space দিলে সব উল্টে যায়।" },
    { en: "Never let crossing traffic meet in the middle — that's a crash.", bn: "আড়াআড়ি দুই দিকের গাড়ি যেন মাঝখানে না মেলে — তাহলেই ধাক্কা।" },
    { en: "Don't let queues grow too long. Survive 60 seconds, keep the flow combo going.", bn: "লাইন যেন বেশি লম্বা না হয়। ৬০ সেকেন্ড টিকে থাকুন, ফ্লো কম্বো ধরে রাখুন।" },
  ],
  best: { en: "Best", bn: "সেরা" },
  start: { en: "START SHIFT", bn: "ডিউটি শুরু" },
  stageLabel: { en: "Dhaka intersection — tap the lights", bn: "ঢাকার মোড় — লাইটে ট্যাপ করুন" },
  score: { en: "Score", bn: "স্কোর" },
  time: { en: "Time", bn: "সময়" },
  traffic: { en: "Traffic", bn: "গাড়ি" },
  flow: { en: "Flow", bn: "ফ্লো" },
  congestion: { en: "Congestion", bn: "জ্যাম" },
  seconds: { en: "{n}s", bn: "{n}সে" },
  light: { en: "{side} light: {state}. Tap to switch.", bn: "{side} দিকের লাইট: {state}। বদলাতে ট্যাপ করুন।" },
  green: { en: "green", bn: "সবুজ" },
  red: { en: "red", bn: "লাল" },
  flipAll: { en: "⇄ Flip all lights", bn: "⇄ সব লাইট উল্টাও" },
  countdown: [
    { en: "Ready…", bn: "রেডি…" },
    { en: "Whistle…", bn: "বাঁশি…" },
    { en: "GO!", bn: "চলো!" },
  ],
  crashed: { en: "CRASH!", bn: "ধাক্কা!" },
  gridlocked: { en: "GRIDLOCK!", bn: "জ্যাম!" },
  shiftOver: { en: "SHIFT OVER!", bn: "ডিউটি শেষ!" },
  endTime: { en: "You survived the full 60-second shift!", bn: "পুরো ৬০ সেকেন্ডের ডিউটি টিকে গেছেন!" },
  endCrash: { en: "Major crash: {a} vs {b}. Everyone is out of their vehicles, arguing.", bn: "বড় ধাক্কা: {a} বনাম {b}। সবাই গাড়ি থেকে নেমে তর্ক করছে।" },
  endGridlock: { en: "Total gridlock. Horns can be heard from Gazipur.", bn: "পুরো জ্যাম। গাজীপুর থেকেও হর্ন শোনা যাচ্ছে।" },
  scoreLabel: { en: "🚦 TRAFFIC CONTROL SCORE", bn: "🚦 ট্রাফিক কন্ট্রোল স্কোর" },
  statHandled: { en: "🚗 Vehicles handled", bn: "🚗 পার করানো গাড়ি" },
  statFlow: { en: "🌊 Longest flow", bn: "🌊 সবচেয়ে লম্বা ফ্লো" },
  statChaos: { en: "🔥 Chaos level", bn: "🔥 হট্টগোল লেভেল" },
  statTime: { en: "⏱️ On duty", bn: "⏱️ ডিউটিতে" },
  rankLabel: { en: "🎖️ Rank", bn: "🎖️ র‍্যাঙ্ক" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত সেরা!" },
  shiftCode: { en: "Shift code", bn: "ডিউটি কোড" },
  retry: { en: "↺ RETRY", bn: "↺ আবার" },
  replay: { en: "Replay the same shift", bn: "একই ডিউটি আবার" },
  shareResult: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  shareText: {
    en: "I ran a Dhaka junction: {handled} vehicles, {score} pts — “{title}” {emoji}. Same traffic, can you do better?",
    bn: "ঢাকার এক মোড় সামলালাম: {handled}টা গাড়ি, {score} পয়েন্ট — “{title}” {emoji}। একই ট্রাফিক, তুমি পারবে?",
  },
};
