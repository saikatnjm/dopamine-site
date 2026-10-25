import type { Accent } from "@/components/ui/styles";
import type { Difficulty } from "@/lib/dialects/types";
import type { Text } from "@/lib/i18n/core";
import type { TierId } from "@/lib/games/ancholik-quiz";

// UI copy for আঞ্চলিক ভাষার লড়াই. The questions themselves live in
// data/dialects/ (reviewed content only). Dialect words stay in Bangla in
// both languages; everything around them is translated.
// Score labels are playful, not claims about anyone's background.

export const levelInfo: Record<Difficulty, { emoji: string; label: Text; hint: Text }> = {
  easy: { emoji: "🌱", label: { en: "Easy", bn: "সহজ" }, hint: { en: "Everyday words", bn: "প্রতিদিনের শব্দ" } },
  medium: { emoji: "🔥", label: { en: "Medium", bn: "মাঝারি" }, hint: { en: "Things get local", bn: "এবার একটু লোকাল" } },
  hard: { emoji: "💀", label: { en: "Hard", bn: "কঠিন" }, hint: { en: "Only the locals survive", bn: "শুধু এলাকার লোক টিকবে" } },
};

export const tierInfo: Record<TierId, { emoji: string; accent: Accent; title: Text }> = {
  beginner: { emoji: "😂", accent: "chili", title: { en: "Still a dialect apprentice!", bn: "আঞ্চলিক ভাষায় তুমি এখনো শিক্ষানবিশ!" } },
  practice: { emoji: "🙂", accent: "sky", title: { en: "Not bad — but more practice needed!", bn: "মন্দ না, তবে আরও প্র্যাকটিস চাই!" } },
  boss: { emoji: "😎", accent: "lime", title: { en: "There's a dialect boss inside you!", bn: "তোমার মধ্যে আঞ্চলিক ভাষার বস আছে!" } },
  legend: { emoji: "🏆", accent: "marigold", title: { en: "Language legend! Now go beat your friends!", bn: "ভাষার কিংবদন্তি! এবার বন্ধুদের হারাও!" } },
};

export const quizCopy = {
  title: { en: "Battle of the Dialects", bn: "আঞ্চলিক ভাষার লড়াই" },
  subtitle: {
    en: "How well do you understand Bangladesh's regional dialects?",
    bn: "বাংলার কোন এলাকার ভাষা তুমি কতটা বোঝো?",
  },
  pickRegion: { en: "1. Pick a region", bn: "১. এলাকা বেছে নাও" },
  pickLevel: { en: "2. Pick a level", bn: "২. লেভেল বেছে নাও" },
  mixed: { en: "Mixed Bangladesh", bn: "মিশ্র বাংলাদেশ" },
  mixedHint: { en: "Every district", bn: "সব জেলা মিলিয়ে" },
  questionsReady: { en: "{n} questions", bn: "{n}টা প্রশ্ন" },
  notReady: { en: "Coming soon", bn: "শীঘ্রই" },
  start: { en: "▶ Start ({n} questions)", bn: "▶ শুরু করো ({n}টা প্রশ্ন)" },
  playChallenge: { en: "▶ Play this challenge", bn: "▶ এই চ্যালেঞ্জ খেলো" },
  sharedRound: { en: "🔗 Someone sent you this exact round", bn: "🔗 কেউ তোমাকে ঠিক এই রাউন্ডটা পাঠিয়েছে" },
  resume: { en: "▶ Continue your round ({n}/{total})", bn: "▶ আগের রাউন্ড চালিয়ে যাও ({n}/{total})" },
  progress: { en: "Question {n} of {total}", bn: "প্রশ্ন {n} / {total}" },
  scoreSoFar: { en: "✅ {n} correct", bn: "✅ {n}টা সঠিক" },
  correct: { en: "✅ Correct!", bn: "✅ একদম ঠিক!" },
  wrong: { en: "❌ Not quite.", bn: "❌ হলো না।" },
  answerLabel: { en: "Answer:", bn: "সঠিক উত্তর:" },
  aboutWord: { en: "About this word →", bn: "শব্দটা সম্পর্কে →" },
  next: { en: "Next question →", bn: "পরের প্রশ্ন →" },
  finish: { en: "See my result →", bn: "রেজাল্ট দেখো →" },
  quit: { en: "✕ Quit round", bn: "✕ রাউন্ড ছেড়ে দাও" },
  quitConfirm: { en: "Quit this round? Your answers so far will be lost.", bn: "রাউন্ড ছেড়ে দেবে? এ পর্যন্ত দেওয়া উত্তর মুছে যাবে।" },
  scoreLabel: { en: "Score", bn: "স্কোর" },
  statPercent: { en: "Correct", bn: "সঠিক" },
  statRegion: { en: "Region", bn: "এলাকা" },
  invite: { en: "Think you know the dialects better? Beat my score!", bn: "আঞ্চলিক ভাষা আমার চেয়ে ভালো বোঝো? আমার স্কোর ভাঙো!" },
  shareText: { en: "I scored {score}/{total} in Battle of the Dialects ({region}). Can you beat me? 😏", bn: "আঞ্চলিক ভাষার লড়াইয়ে ({region}) আমি পেয়েছি {score}/{total}। আমাকে হারাতে পারবে? 😏" },
  newRound: { en: "🔁 New questions", bn: "🔁 নতুন প্রশ্নে আবার" },
  changeRegion: { en: "🗺️ Another region", bn: "🗺️ অন্য এলাকা" },
  review: { en: "Your answers", bn: "তোমার উত্তরগুলো" },
  wordsLink: { en: "📖 Browse the dialect word list", bn: "📖 আঞ্চলিক শব্দভান্ডার দেখো" },
  // Not enough reviewed questions yet
  buildingTitle: { en: "প্রশ্ন তৈরি হচ্ছে!", bn: "প্রশ্ন তৈরি হচ্ছে!" },
  buildingBody: {
    en: "We're collecting dialect words and having real speakers check every one before it goes into the quiz. No guessing, no made-up words. Check back soon!",
    bn: "আমরা আঞ্চলিক শব্দ জোগাড় করছি, আর প্রতিটা শব্দ এলাকার মানুষ যাচাই করার পরেই কুইজে যাবে। আন্দাজে কিছু না, বানানো শব্দও না। একটু পরে আবার এসো!",
  },
  buildingRegion: { en: "{region} questions are still being checked. Try another region or Mixed Bangladesh.", bn: "{region}-এর প্রশ্ন এখনো যাচাই হচ্ছে। অন্য এলাকা বা মিশ্র বাংলাদেশ চেষ্টা করো।" },
  buildingCta: { en: "Meanwhile: what type of Bangali are you? →", bn: "ততক্ষণে: তুমি কোন টাইপের বাঙালি? →" },
  note: {
    en: "Dialects change from village to village — every word here was checked by people, but spellings can vary.",
    bn: "গ্রাম থেকে গ্রামে ভাষা বদলায় — এখানের প্রতিটা শব্দ মানুষ যাচাই করেছে, তবে বানান এলাকাভেদে আলাদা হতে পারে।",
  },
} satisfies Record<string, Text>;
