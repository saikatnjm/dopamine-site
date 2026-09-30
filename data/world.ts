// Hottogol World: which existing activities live in which world.
// Only ids + a zone tag live here — titles, emoji, accents and durations come
// from the real registries (data/experiences, data/games) so nothing is
// duplicated. Add a node when a new activity ships; never list something that
// isn't playable.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";

export type WorldNodeRef =
  | { kind: "experience"; slug: string; zone: Text }
  | { kind: "game"; slug: string; zone: Text }
  | { kind: "page"; id: "daily" | "dhaka-person" | "excuses"; zone: Text };

export type World = {
  id: "bangladesh" | "life" | "arcade";
  emoji: string;
  accent: Accent;
  name: Text;
  tagline: Text;
  nodes: WorldNodeRef[];
};

export const worlds: readonly World[] = [
  {
    id: "bangladesh",
    emoji: "🇧🇩",
    accent: "cng",
    name: { en: "Bangladesh World", bn: "বাংলাদেশ ওয়ার্ল্ড" },
    tagline: { en: "CNGs, buses, bazars, queues and cha. Daily life, simulated.", bn: "সিএনজি, বাস, বাজার, লাইন আর চা। প্রতিদিনের জীবন, সিমুলেটেড।" },
    nodes: [
      { kind: "page", id: "daily", zone: { en: "📅 Today", bn: "📅 আজ" } },
      { kind: "experience", slug: "dhaka-cng-simulator", zone: { en: "🚕 CNG", bn: "🚕 সিএনজি" } },
      { kind: "experience", slug: "dhaka-bus-simulator", zone: { en: "🚌 Bus", bn: "🚌 বাস" } },
      { kind: "game", slug: "traffic-controller", zone: { en: "🛺 Traffic", bn: "🛺 ট্রাফিক" } },
      { kind: "game", slug: "bazar-bargain", zone: { en: "🛒 Bazar", bn: "🛒 বাজার" } },
      { kind: "game", slug: "queue-sim", zone: { en: "🧍 Queue", bn: "🧍 লাইন" } },
      { kind: "game", slug: "delivery-sim", zone: { en: "🏍️ Delivery", bn: "🏍️ ডেলিভারি" } },
      { kind: "experience", slug: "food-delivery-simulator", zone: { en: "🍛 Food", bn: "🍛 খাবার" } },
      { kind: "game", slug: "chaos-machine", zone: { en: "🔥 Chaos", bn: "🔥 হট্টগোল" } },
      { kind: "page", id: "dhaka-person", zone: { en: "🏙️ You", bn: "🏙️ আপনি" } },
    ],
  },
  {
    id: "life",
    emoji: "😂",
    accent: "violet",
    name: { en: "Life World", bn: "লাইফ ওয়ার্ল্ড" },
    tagline: { en: "Work, rent, shopping and big decisions — the usual disasters.", bn: "অফিস, ভাড়া, শপিং আর বড় সিদ্ধান্ত — চেনা বিপর্যয়।" },
    nodes: [
      { kind: "experience", slug: "job-resignation-simulator", zone: { en: "💼 Work", bn: "💼 অফিস" } },
      { kind: "game", slug: "programmer-rage", zone: { en: "💻 Work", bn: "💻 অফিস" } },
      { kind: "experience", slug: "house-rent-simulator", zone: { en: "🏠 Rent", bn: "🏠 ভাড়া" } },
      { kind: "experience", slug: "fake-shopping-spree", zone: { en: "🛍️ Shopping", bn: "🛍️ শপিং" } },
      { kind: "experience", slug: "random-life-decision", zone: { en: "🎲 Decisions", bn: "🎲 সিদ্ধান্ত" } },
      { kind: "page", id: "excuses", zone: { en: "😅 Excuses", bn: "😅 অজুহাত" } },
    ],
  },
  {
    id: "arcade",
    emoji: "🕹️",
    accent: "tangerine",
    name: { en: "Arcade World", bn: "আর্কেড ওয়ার্ল্ড" },
    tagline: { en: "Fast fingers, faster traffic. Beat your best, then a friend's.", bn: "দ্রুত আঙুল, আরও দ্রুত ট্রাফিক। নিজের রেকর্ড ভাঙুন, তারপর বন্ধুর।" },
    nodes: [
      { kind: "game", slug: "traffic-boss", zone: { en: "👹 Boss", bn: "👹 বস" } },
      { kind: "game", slug: "dont-tap", zone: { en: "🎮 Reaction", bn: "🎮 রিঅ্যাকশন" } },
      { kind: "game", slug: "cng-catch", zone: { en: "🛺 Reflex", bn: "🛺 রিফ্লেক্স" } },
      { kind: "game", slug: "traffic-dodge", zone: { en: "🚗 Dodge", bn: "🚗 ডজ" } },
      { kind: "game", slug: "chicken-crossing", zone: { en: "🐔 Crossing", bn: "🐔 ক্রসিং" } },
      { kind: "game", slug: "tea-balance", zone: { en: "☕ Balance", bn: "☕ ব্যালেন্স" } },
    ],
  },
];

export const worldCopy = {
  title: { en: "Hottogol World", bn: "হট্টগোল ওয়ার্ল্ড" },
  lead: {
    en: "Every Hottogol activity on one map. Pick a world, tap a stop, cause chaos. Your progress is saved on this device only.",
    bn: "সব হট্টগোল এক ম্যাপে। একটা ওয়ার্ল্ড বাছুন, একটা স্টপে ট্যাপ করুন, হট্টগোল শুরু। অগ্রগতি শুধু এই ডিভাইসে সেভ থাকে।",
  },
  jump: { en: "Jump to", bn: "চলুন" },
  played: { en: "{n} of {total} played", bn: "{total}টার মধ্যে {n}টা খেলা হয়েছে" },
  done: { en: "✅ Played", bn: "✅ খেলেছেন" },
  best: { en: "🏆 Best {n}", bn: "🏆 সেরা {n}" },
  fresh: { en: "✨ New to you", bn: "✨ নতুন" },
  todayDone: { en: "✅ Done today", bn: "✅ আজ শেষ" },
  todayOpen: { en: "🔔 Today's challenge", bn: "🔔 আজকের চ্যালেঞ্জ" },
  found: { en: "🔎 {n}/{total} found", bn: "🔎 {n}/{total} পাওয়া" },
  kindGame: { en: "Game", bn: "গেম" },
  kindSim: { en: "Simulator", bn: "সিমুলেটর" },
  kindQuiz: { en: "Quiz", bn: "কুইজ" },
  kindTool: { en: "Generator", bn: "জেনারেটর" },
  kindDaily: { en: "Daily", bn: "ডেইলি" },
  minutes: { en: "~{n} min", bn: "~{n} মিনিট" },
  seconds: { en: "~{n}s", bn: "~{n} সে" },
  localNote: { en: "No accounts, no global stats — just your own progress on this device.", bn: "কোনো অ্যাকাউন্ট নেই, কোনো গ্লোবাল পরিসংখ্যান নেই — শুধু এই ডিভাইসে আপনার নিজের অগ্রগতি।" },
} satisfies Record<string, Text>;
