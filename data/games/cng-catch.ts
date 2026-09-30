import type { Accent } from "@/components/ui/styles";
import type { Grade, RankId } from "@/lib/games/cng-catch";
import type { Text } from "@/lib/i18n/core";

// All copy for CNG Catch (EN + BN). Driver quotes stay Bangla in both languages.
// Humor targets the situation (traffic, hailing), never people.

export const cngCatchCopy = {
  howTitle: { en: "How to play", bn: "কীভাবে খেলবেন" },
  how: [
    { en: "A CNG zooms past. Hail it when it's inside the green stop zone.", bn: "একটা সিএনজি ছুটে যাবে। সবুজ স্টপ জোনের ভেতরে এলেই থামান।" },
    { en: "Tap / click the road, or press Space or Enter.", bn: "রাস্তায় ট্যাপ / ক্লিক করুন, অথবা Space বা Enter চাপুন।" },
    { en: "Dead-centre = more points. Chain catches for a combo multiplier.", bn: "একদম মাঝখানে = বেশি পয়েন্ট। টানা ধরলে কম্বো মাল্টিপ্লায়ার।" },
    { en: "30 seconds. 3 misses and you're walking home.", bn: "৩০ সেকেন্ড। ৩ বার মিস করলে হেঁটে বাড়ি।" },
  ],
  start: { en: "Start hailing", bn: "সিএনজি ডাকা শুরু" },
  best: { en: "Best", bn: "সেরা" },
  score: { en: "Score", bn: "স্কোর" },
  combo: { en: "Combo", bn: "কম্বো" },
  misses: { en: "Misses", bn: "মিস" },
  time: { en: "Time left", bn: "বাকি সময়" },
  seconds: { en: "{n}s", bn: "{n} সে." },
  hail: { en: "HAIL!", bn: "থামান!" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  hailLabel: {
    en: "Hail the CNG. Tap, click, or press Space or Enter when it is in the stop zone.",
    bn: "সিএনজি থামান। স্টপ জোনে এলে ট্যাপ, ক্লিক, বা Space বা Enter চাপুন।",
  },
  countdown: [
    { en: "Ready…", bn: "রেডি…" },
    { en: "Steady…", bn: "স্টেডি…" },
    { en: "Hail!", bn: "থামান!" },
  ],
  stop: { en: "STOP", bn: "স্টপ" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  statCatches: { en: "Catches", bn: "ধরেছেন" },
  statPerfects: { en: "Perfects", bn: "পারফেক্ট" },
  statMaxCombo: { en: "Best combo", bn: "সেরা কম্বো" },
  statMisses: { en: "Misses", bn: "মিস" },
  trafficCode: { en: "Traffic code", bn: "ট্রাফিক কোড" },
  retry: { en: "↺ Retry (new traffic)", bn: "↺ আবার (নতুন ট্রাফিক)" },
  replay: { en: "Replay this exact traffic", bn: "একই ট্রাফিক আবার খেলুন" },
  share: { en: "📤 Share result", bn: "📤 ফলাফল শেয়ার" },
  shareText: {
    en: "I got “{title}” with {score} pts in CNG Catch 🛺 Same traffic, your turn:",
    bn: "সিএনজি ক্যাচে {score} পয়েন্ট পেয়ে হলাম “{title}” 🛺 একই ট্রাফিক, এবার আপনার পালা:",
  },
  timeUp: { en: "⏰ Time's up!", bn: "⏰ সময় শেষ!" },
  outOfLives: { en: "🚶 Three misses. Walking it is.", bn: "🚶 তিনবার মিস। এবার হাঁটাই ভরসা।" },
} satisfies Record<string, Text | Text[]>;

/** Feedback lines by grade. Picked deterministically from the round. */
export const feedbackLines: Record<Grade, Text[]> = {
  perfect: [
    { en: "PERFECT! It stopped right at your feet 🦶", bn: "পারফেক্ট! একদম পায়ের সামনে থামলো 🦶" },
    { en: "“মিটারে যাবো” — historic day 😳", bn: "“মিটারে যাবো” — ঐতিহাসিক দিন 😳" },
    { en: "Uncle-level hailing unlocked 🧓✋", bn: "মামা-লেভেলের ডাক আনলক 🧓✋" },
  ],
  good: [
    { en: "Caught it before the office rush!", bn: "অফিস টাইমের ভিড়ের আগেই ধরলেন!" },
    { en: "Faster than a signal change at Farmgate", bn: "ফার্মগেটের সিগন্যাল বদলের চেয়েও দ্রুত" },
    { en: "Seat secured. Knee space not included.", bn: "সিট পাওয়া গেছে। হাঁটুর জায়গা আলাদা।" },
  ],
  ok: [
    { en: "Made it… with a small sprint 🏃", bn: "পেয়েছেন… একটু দৌড়ে 🏃" },
    { en: "“ওঠেন ওঠেন, তাড়াতাড়ি!”", bn: "“ওঠেন ওঠেন, তাড়াতাড়ি!”" },
    { en: "Close call. The driver sighed audibly.", bn: "অল্পের জন্য। ড্রাইভার জোরে নিঃশ্বাস ফেললেন।" },
  ],
  early: [
    { en: "Too early — you stopped a rickshaw 🚲", bn: "খুব তাড়াতাড়ি — রিকশা থামিয়ে ফেললেন 🚲" },
    { en: "Too early — you waved at an empty road", bn: "খুব তাড়াতাড়ি — ফাঁকা রাস্তায় হাত নাড়লেন" },
  ],
  late: [
    { en: "Too late — someone with a bigger bag got in", bn: "দেরি — বড় ব্যাগওয়ালা কেউ উঠে গেল" },
    { en: "Too late — “যাবো না” 🙅", bn: "দেরি — “যাবো না” 🙅" },
  ],
  passed: [
    { en: "It didn't even slow down. Classic.", bn: "থামলোই না। চিরচেনা দৃশ্য।" },
    { en: "“গ্যারেজে যাই মামা” 🙅", bn: "“গ্যারেজে যাই মামা” 🙅" },
    { en: "Gone. Straight to Gulistan.", bn: "চলে গেল। সোজা গুলিস্তান।" },
  ],
};

/** Onomatopoeia shown as visual "sound" pops. */
export const soundWords: { hit: Text[]; miss: Text[] } = {
  hit: [
    { en: "PEEP PEEP!", bn: "প্যাঁ-পোঁ!" },
    { en: "SKRRT!", bn: "ঘ্যাঁচ!" },
    { en: "BHOT-BHOT!", bn: "ভটভট!" },
  ],
  miss: [
    { en: "VROOOM…", bn: "ভ্রুউউম…" },
    { en: "HONK!", bn: "পিঁ-পিঁ!" },
  ],
};

export type Rank = { id: RankId; emoji: string; title: Text; blurb: Text; accent: Accent };

export const ranks: Record<RankId, Rank> = {
  "cng-magnet": {
    id: "cng-magnet",
    emoji: "🧲",
    title: { en: "CNG Magnet", bn: "সিএনজি চুম্বক" },
    blurb: { en: "CNGs stop for you without being asked. Drivers whisper your name at the garage.", bn: "না ডাকতেই সিএনজি থামে। গ্যারেজে ড্রাইভাররা আপনার নাম ফিসফিস করে বলে।" },
    accent: "cng",
  },
  "pro-passenger": {
    id: "pro-passenger",
    emoji: "🎓",
    title: { en: "Professional Passenger", bn: "পেশাদার যাত্রী" },
    blurb: { en: "Years of commuting have trained your reflexes. You hail with one finger and zero eye contact.", bn: "বছরের পর বছর যাতায়াতে রিফ্লেক্স তৈরি। এক আঙুলে ডাকেন, চোখে চোখ না রেখেই।" },
    accent: "sky",
  },
  "meter-believer": {
    id: "meter-believer",
    emoji: "🧾",
    title: { en: "Still Believes in Meters", bn: "এখনো মিটারে বিশ্বাসী" },
    blurb: { en: "Decent catches, pure heart. You'll get there — probably 15 minutes late.", bn: "মোটামুটি ধরেছেন, মনটা পরিষ্কার। পৌঁছে যাবেন — সম্ভবত ১৫ মিনিট দেরিতে।" },
    accent: "marigold",
  },
  "rickshaw-fallback": {
    id: "rickshaw-fallback",
    emoji: "🚲",
    title: { en: "Rickshaw Is Also Fine", bn: "রিকশাও খারাপ না" },
    blurb: { en: "The CNGs had other plans. The rickshaw uncle has been waiting for you all along.", bn: "সিএনজির অন্য প্ল্যান ছিল। রিকশা মামা সারাক্ষণ আপনার অপেক্ষায় ছিলেন।" },
    accent: "tangerine",
  },
  "missed-again": {
    id: "missed-again",
    emoji: "💀",
    title: { en: "Missed It Again", bn: "আবারও মিস" },
    blurb: { en: "Every CNG in Dhaka saw you. None of them stopped. Walking builds character.", bn: "ঢাকার সব সিএনজি আপনাকে দেখেছে। একটাও থামেনি। হাঁটলে চরিত্র গঠন হয়।" },
    accent: "chili",
  },
};
