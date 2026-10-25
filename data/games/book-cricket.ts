import type { Accent } from "@/components/ui/styles";
import type { BallKind, EndingId, RankId } from "@/lib/games/book-cricket";
import type { Text } from "@/lib/i18n/core";

// Copy for বই ক্রিকেট (/games/book-cricket). Fictional opponent only — no
// real teams, players, logos, boards or textbook covers. Ids are permanent
// (lib/games/book-cricket.ts); copy can change. {page} = the page number.

export const endingInfo: Record<EndingId, { accent: Accent; title: Text }> = {
  "last-ball-win": { accent: "marigold", title: { en: "🎉 Last-Ball Hero", bn: "🎉 শেষ বলের নায়ক" } },
  "won-chase": { accent: "lime", title: { en: "🏆 Chased It Down", bn: "🏆 টার্গেট শেষ" } },
  tie: { accent: "sky", title: { en: "🤝 Tie. Tiffin Shared.", bn: "🤝 টাই। টিফিন ভাগাভাগি।" } },
  "all-out": { accent: "chili", title: { en: "💀 All Out", bn: "💀 অল আউট" } },
  "lost-chase": { accent: "tangerine", title: { en: "😮‍💨 Fell Short", bn: "😮‍💨 অল্পের জন্য হলো না" } },
};

export const rankInfo: Record<RankId, Text> = {
  duck: { en: "🦆 Duck", bn: "🦆 শূন্য রানে আউট" },
  tailender: { en: "Tailender", bn: "টেইলএন্ডার" },
  "tiffin-batter": { en: "Tiffin-Break Batter", bn: "টিফিন পিরিয়ডের ব্যাটার" },
  "back-bench-hitter": { en: "Back-Bench Hitter", bn: "লাস্ট বেঞ্চের হিটার" },
  "class-captain": { en: "Class Captain", bn: "ক্লাস ক্যাপ্টেন" },
  "book-legend": { en: "Book Cricket Legend", bn: "বই ক্রিকেটের কিংবদন্তি" },
};

/** 3 variants per outcome, picked with lineVariant(seed, deliveryIndex). */
export const commentary: Record<BallKind | "free-hit" | "teacher-saved", readonly Text[]> = {
  out: [
    { en: "Page {page}: BOWLED! Close the book.", bn: "পৃষ্ঠা {page}, বোল্ড! বই বন্ধ করো।" },
    { en: "Page {page}: caught at the back bench!", bn: "পৃষ্ঠা {page}: লাস্ট বেঞ্চে ক্যাচ!" },
    { en: "Page {page}: OUT! The whole class goes “ooooh”.", bn: "পৃষ্ঠা {page}: আউট! পুরো ক্লাস “উউউহ”!" },
  ],
  dot: [
    { en: "Page {page}: dot ball. Turn the page.", bn: "পৃষ্ঠা {page}: ডট বল। পাতা উল্টাও।" },
    { en: "Page {page}: nothing. The book is shy today.", bn: "পৃষ্ঠা {page}: কিচ্ছু না। বই আজ লাজুক।" },
    { en: "Page {page}: blocked like a seasoned opener.", bn: "পৃষ্ঠা {page}: ওপেনারের মতো ঠেকিয়ে দিলে।" },
  ],
  one: [
    { en: "Page {page}: quick single.", bn: "পৃষ্ঠা {page}: চটপট এক রান।" },
    { en: "Page {page}: one run, keep the strike.", bn: "পৃষ্ঠা {page}: এক রান, স্ট্রাইক তোমারই।" },
    { en: "Page {page}: nudged for one.", bn: "পৃষ্ঠা {page}: ঠেলে এক রান।" },
  ],
  two: [
    { en: "Page {page}: two runs, run like the bell rang.", bn: "পৃষ্ঠা {page}: দুই রান, ছুটির ঘণ্টার মতো দৌড়।" },
    { en: "Page {page}: a couple more.", bn: "পৃষ্ঠা {page}: আরও দুই।" },
    { en: "Page {page}: two! Nice placement.", bn: "পৃষ্ঠা {page}: দুই! সুন্দর প্লেসমেন্ট।" },
  ],
  four: [
    { en: "Page {page}: FOUR! Through the gap between benches.", bn: "পৃষ্ঠা {page}: চার! দুই বেঞ্চের ফাঁক দিয়ে।" },
    { en: "Page {page}: boundary! The front bench turns around.", bn: "পৃষ্ঠা {page}: বাউন্ডারি! ফার্স্ট বেঞ্চ ঘুরে তাকাল।" },
    { en: "Page {page}: FOUR, cracking shot.", bn: "পৃষ্ঠা {page}: চার, দারুণ শট।" },
  ],
  six: [
    { en: "Page {page}: SIX! The whole back bench stands up.", bn: "পৃষ্ঠা {page}: ছক্কা! পুরো লাস্ট বেঞ্চ দাঁড়িয়ে গেল।" },
    { en: "Page {page}: SIX, out of the window!", bn: "পৃষ্ঠা {page}: ছক্কা, জানালার বাইরে!" },
    { en: "Page {page}: massive SIX. Someone fetch the ball.", bn: "পৃষ্ঠা {page}: বিশাল ছক্কা! কেউ বল নিয়ে আসো।" },
  ],
  "no-ball": [
    { en: "Page {page}: NO BALL! +1 and a free hit.", bn: "পৃষ্ঠা {page}: নো বল! +১ আর ফ্রি হিট।" },
    { en: "Page {page}: overstepped! Free hit coming.", bn: "পৃষ্ঠা {page}: দাগের বাইরে পা! ফ্রি হিট আসছে।" },
    { en: "Page {page}: no ball. Free runs, free hit.", bn: "পৃষ্ঠা {page}: নো বল। ফ্রি রান, ফ্রি হিট।" },
  ],
  "free-hit": [
    { en: "FREE HIT: can't get out this ball!", bn: "ফ্রি হিট: এই বলে আউট হবে না!" },
    { en: "Free hit! Swing away.", bn: "ফ্রি হিট! ইচ্ছামতো চালাও।" },
    { en: "Free hit: the book is on your side.", bn: "ফ্রি হিট: বই এখন তোমার দলে।" },
  ],
  "teacher-saved": [
    { en: "Phew! Book hidden in time. Play on.", bn: "উফ! সময়মতো বই লুকিয়েছো। খেলা চলুক।" },
    { en: "Sir walked past. Nobody saw a thing.", bn: "স্যার পাশ দিয়ে চলে গেলেন। কেউ কিছু দেখেনি।" },
    { en: "Smooth. The book is a “maths book” again.", bn: "নিখুঁত। বই আবার “অঙ্ক বই” হয়ে গেল।" },
  ],
  teacher: [
    { en: "Caught by Sir! Ball lost.", bn: "স্যারের হাতে ধরা! বলটা গেল।" },
    { en: "Too slow: Sir saw the book. Dot ball.", bn: "দেরি হয়ে গেল: স্যার বই দেখে ফেলেছেন। ডট বল।" },
    { en: "“Whose book is this?” Ball lost.", bn: "“এই বই কার?” বলটা গেল।" },
  ],
};

export const cricketCopy = {
  title: { en: "Book Cricket", bn: "বই ক্রিকেট" },
  cover: { en: "MATHS · CLASS 8", bn: "অঙ্ক খাতা · অষ্টম শ্রেণি" },
  intro: {
    en: "Open the book at a random page: the last digit decides the ball. Pick 🛡️ Defend or 💥 Slog, chase the Back Bench XI in 2 overs with 3 wickets.",
    bn: "বই খোলো যেকোনো পাতায়: শেষ অঙ্কটাই বল। 🛡️ ডিফেন্ড না 💥 স্লগ বেছে নাও, ২ ওভার আর ৩ উইকেটে লাস্ট বেঞ্চ একাদশের রান তাড়া করো।",
  },
  rules: {
    en: "0 = out if you slog · 2 · 4 · 6 = runs · 8 = no ball + free hit. Defend is safer but slower.",
    bn: "০ = স্লগে আউট · ২ · ৪ · ৬ = রান · ৮ = নো বল + ফ্রি হিট। ডিফেন্ড নিরাপদ, তবে ধীর।",
  },
  opponent: { en: "Back Bench XI", bn: "লাস্ট বেঞ্চ একাদশ" },
  target: { en: "Target", bn: "টার্গেট" },
  toWin: { en: "Need {n} to win", bn: "জিততে {n} রান দরকার" },
  start: { en: "🏏 Start the chase", bn: "🏏 চেজ শুরু করো" },
  defend: { en: "🛡️ DEFEND", bn: "🛡️ ডিফেন্ড" },
  slog: { en: "💥 SLOG", bn: "💥 স্লগ" },
  keys: { en: "Keys: D / ← defend · S / → slog", bn: "কী-বোর্ড: D / ← ডিফেন্ড · S / → স্লগ" },
  flipping: { en: "Flipping…", bn: "পাতা উল্টাচ্ছে…" },
  overs: { en: "Overs", bn: "ওভার" },
  runsWkts: { en: "Runs/Wkts", bn: "রান/উইকেট" },
  sixes: { en: "Sixes", bn: "ছক্কা" },
  strikeRate: { en: "Strike rate", bn: "স্ট্রাইক রেট" },
  teacherAlert: { en: "🧑‍🏫 Sir's coming! Hide the book!", bn: "🧑‍🏫 স্যার আসছে! বই লুকাও!" },
  hide: { en: "📕 HIDE IT!", bn: "📕 লুকাও!" },
  scoreLabel: { en: "Your score", bn: "তোমার স্কোর" },
  newBest: { en: "🎉 New best!", bn: "🎉 নতুন সেরা!" },
  best: { en: "Best: {n}", bn: "সেরা: {n}" },
  retry: { en: "🔁 Bat again", bn: "🔁 আবার ব্যাট করো" },
  newMatch: { en: "🆕 New match", bn: "🆕 নতুন ম্যাচ" },
  shareText: { en: "I scored {score} chasing {target} in Book Cricket 🏏 You won't beat me.", bn: "বই ক্রিকেটে {target} তাড়া করে {score} রান করেছি 🏏 আমাকে হারাতে পারবে না।" },
} satisfies Record<string, Text>;
