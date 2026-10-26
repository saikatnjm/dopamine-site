import type { Accent } from "@/components/ui/styles";
import type { TitleId } from "@/lib/games/my-bangladesh";
import type { Text } from "@/lib/i18n/core";

// Copy for আমার বাংলাদেশ (/games/my-bangladesh). Jokes are about travelling,
// never about any district or its people. Title/badge ids live in
// lib/games/my-bangladesh.ts and are permanent; the copy can change.

export const titleInfo: Record<TitleId, { emoji: string; accent: Accent; title: Text; blurb: Text }> = {
  "never-left": {
    emoji: "🏠",
    accent: "sky",
    title: { en: "Never Left Home", bn: "বাড়ির বাইরে পা রাখোনি" },
    blurb: { en: "One district. Comfort zone: maximum.", bn: "একটাই জেলা। কমফোর্ট জোন: ফুল।" },
  },
  "weekend-tripper": {
    emoji: "🎒",
    accent: "lime",
    title: { en: "Weekend Tripper", bn: "উইকেন্ড ট্রিপার" },
    blurb: { en: "Two days off and you're on a bus.", bn: "দুই দিনের ছুটি মানেই বাসের টিকিট।" },
  },
  "eid-bus-veteran": {
    emoji: "🚌",
    accent: "cng",
    title: { en: "Eid Bus Veteran", bn: "ঈদের বাসের যোদ্ধা" },
    blurb: { en: "You've survived the Eid rush. More than once.", bn: "ঈদের ভিড় পার করেছো। একবার না, বহুবার।" },
  },
  "launch-ghat-regular": {
    emoji: "⛴️",
    accent: "tangerine",
    title: { en: "Launch Ghat Regular", bn: "লঞ্চঘাটের পুরোনো যাত্রী" },
    blurb: { en: "Bus, launch, train. You know every counter.", bn: "বাস, লঞ্চ, ট্রেন: সব কাউন্টার তোমার চেনা।" },
  },
  "desh-explorer": {
    emoji: "🧭",
    accent: "violet",
    title: { en: "Desh Explorer", bn: "দেশ এক্সপ্লোরার" },
    blurb: { en: "Half the map is yours. Your friends ask you for routes.", bn: "অর্ধেক ম্যাপ তোমার। বন্ধুরা রাস্তা তোমাকেই জিজ্ঞেস করে।" },
  },
  "walking-atlas": {
    emoji: "🗺️",
    accent: "chili",
    title: { en: "Walking Atlas", bn: "চলন্ত মানচিত্র" },
    blurb: { en: "You're the map. Google Maps asks you.", bn: "তুমিই ম্যাপ। গুগল ম্যাপ তোমাকে জিজ্ঞেস করে।" },
  },
  "all-64": {
    emoji: "👑",
    accent: "marigold",
    title: { en: "All 64. Legend.", bn: "৬৪-তে ৬৪। কিংবদন্তি।" },
    blurb: { en: "Every single district. Respect.", bn: "একটা জেলাও বাকি নেই। স্যালুট।" },
  },
};

/** Badge labels; `division-<id>` uses `division` with {division}. */
export const badgeCopy = {
  "all-divisions": { en: "🏅 All 8 divisions", bn: "🏅 ৮ বিভাগই ছোঁয়া" },
  division: { en: "✅ Completed {division}", bn: "✅ {division} বিভাগ কমপ্লিট" },
  "hill-tracts": { en: "⛰️ Hill Tracts Trio", bn: "⛰️ পাহাড়ের তিন জেলা" },
  "dhaka-bubble": { en: "🫧 Dhaka Division Bubble", bn: "🫧 ঢাকা বিভাগের বাইরে যাওনি" },
} satisfies Record<string, Text>;

export const myBdCopy = {
  title: { en: "My Bangladesh Map", bn: "আমার বাংলাদেশ" },
  question: { en: "🗺️ How many of the 64 districts have you been to?", bn: "🗺️ ৬৪ জেলার কয়টায় গেছো?" },
  hint: {
    en: "Tap a district on the map or in the list below. Saved on this device only.",
    bn: "ম্যাপে বা নিচের তালিকায় জেলায় ট্যাপ করো। শুধু এই ডিভাইসেই সেভ থাকে।",
  },
  counter: { en: "{n}/64 districts · {d}/8 divisions · {p}% of the map", bn: "{n}/৬৪ জেলা · {d}/৮ বিভাগ · ম্যাপের {p}%" },
  mapAria: { en: "Map of Bangladesh's 64 districts, {n} marked as visited", bn: "বাংলাদেশের ৬৪ জেলার ম্যাপ, {n}টা ঘোরা হয়েছে" },
  divisionCount: { en: "{n}/{total}", bn: "{n}/{total}" },
  allOfDivision: { en: "All", bn: "সব" },
  noneOfDivision: { en: "None", bn: "কোনোটা না" },
  seeTitle: { en: "🏆 See my title", bn: "🏆 আমার টাইটেল দেখাও" },
  seeTitleEmpty: { en: "Tap at least one district first", bn: "আগে অন্তত একটা জেলা বাছো" },
  editMap: { en: "✏️ Edit my map", bn: "✏️ ম্যাপ এডিট করো" },
  guessLink: { en: "📍 Think you know the map? Guess the District →", bn: "📍 ম্যাপ চেনো ভাবছো? কোন জেলা? খেলো →" },
  clear: { en: "Clear map", bn: "ম্যাপ মুছে দাও" },
  clearConfirm: { en: "Clear every district you've marked?", bn: "সব জেলার দাগ মুছে দেবে?" },
  resultKicker: { en: "You've been to", bn: "তুমি ঘুরেছো" },
  statDistricts: { en: "Districts", bn: "জেলা" },
  statDivisions: { en: "Divisions", bn: "বিভাগ" },
  statMap: { en: "Of the map", bn: "ম্যাপের" },
  statBadge: { en: "Best badge", bn: "সেরা ব্যাজ" },
  badges: { en: "Badges", bn: "ব্যাজ" },
  ask: { en: "📤 Ask a friend: how many have you been to?", bn: "📤 বন্ধুকে জিজ্ঞেস করো: তুমি কয়টায় গেছো?" },
  shareText: { en: "I've been to {n} of Bangladesh's 64 districts: {title} {emoji} How many have you been to? 👇", bn: "বাংলাদেশের ৬৪ জেলার {n}টায় গেছি: {title} {emoji} তুমি কয়টায় গেছো? 👇" },
  linkCopied: { en: "Link copied!", bn: "লিংক কপি হয়েছে!" },
  friendBanner: { en: "😏 Your friend has been to {n} districts. How many have you?", bn: "😏 তোমার বন্ধু {n}টা জেলায় গেছে। তুমি কয়টায়?" },
  friendBannerOne: { en: "😏 Your friend has been to 1 district. How many have you?", bn: "😏 তোমার বন্ধু ১টা জেলায় গেছে। তুমি কয়টায়?" },
  friendTitle: { en: "Their title: {emoji} {title}", bn: "তার টাইটেল: {emoji} {title}" },
  makeMine: { en: "▶ Make my map", bn: "▶ আমার ম্যাপ বানাও" },
  compare: { en: "You {me} · Them {them} · Both {both}", bn: "তুমি {me} · বন্ধু {them} · দুজনেই {both}" },
  compareLegend: { en: "🟨 you · 🟦 them · 🟩 both", bn: "🟨 তুমি · 🟦 বন্ধু · 🟩 দুজনেই" },
  posterKicker: { en: "🗺️ My Bangladesh", bn: "🗺️ আমার বাংলাদেশ" },
  posterCta: { en: "How many have you been to?", bn: "তুমি কয়টায় গেছো?" },
  note: {
    en: "Just for fun: you mark the districts yourself, and nothing leaves this device unless you share the link.",
    bn: "শুধু মজার জন্য: জেলাগুলো তুমি নিজেই বাছো, আর লিংক শেয়ার না করলে কিছুই এই ডিভাইসের বাইরে যায় না।",
  },
} satisfies Record<string, Text>;
