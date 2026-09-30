import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { BossId } from "@/lib/weekly-boss";
import type { EventId, Kind, RankId } from "@/lib/bosses/traffic-boss";

export type BossInfo = {
  id: BossId;
  emoji: string;
  name: Text;
  tagline: Text;
  accent: Accent;
  rules: readonly Text[];
};

export const bosses: Record<BossId, BossInfo> = {
  "traffic-boss": {
    id: "traffic-boss",
    emoji: "👹",
    name: { en: "Dhaka Traffic Boss", bn: "ঢাকা ট্রাফিক বস" },
    tagline: { en: "Survive 60 seconds of pure chaos", bn: "৬০ সেকেন্ডের খাঁটি হট্টগোলে টিকে থাকুন" },
    accent: "chili",
    rules: [
      { en: "Dodge traffic with ◀ ▶ / swipe / arrow keys", bn: "◀ ▶ / সোয়াইপ / অ্যারো কী দিয়ে ট্রাফিক এড়ান" },
      { en: "3 lives ❤️ — each hit costs one life + shield", bn: "৩টা জীবন ❤️ — প্রতি ধাক্কায় একটা যায়, সাথে পাবেন শিল্ড" },
      { en: "Survive 60 seconds to defeat the boss", bn: "বসকে হারাতে ৬০ সেকেন্ড টিকে থাকুন" },
      { en: "Watch for blinking CNGs, crossing pedestrians, fast bikes, rain", bn: "ইন্ডিকেটর জ্বালানো সিএনজি, রাস্তা পার হওয়া পথচারী, দ্রুত বাইক আর বৃষ্টি থেকে সাবধান" },
    ],
  },
};

export const bossCopy = {
  weeklyBoss: { en: "👹 WEEKLY BOSS", bn: "👹 সাপ্তাহিক বস" },
  bossNumber: { en: "Boss #{n}", bn: "বস #{n}" },
  nextBoss: { en: "Next boss in", bn: "পরের বস আসছে" },
  bestWeek: { en: "Your best this week", bn: "এই সপ্তাহে আপনার সেরা" },
  attempt: { en: "Attempt #{n}", bn: "প্রচেষ্টা #{n}" },
  attempts: { en: "{n} attempts this week", bn: "এই সপ্তাহে {n} প্রচেষ্টা" },
  noAttempts: { en: "No attempts yet", bn: "এখনো কোনো প্রচেষ্টা নেই" },
  beatenBadge: { en: "✅ Beaten this week", bn: "✅ এই সপ্তাহে বসকে হারিয়েছেন" },
  fight: { en: "⚔️ FIGHT THE BOSS", bn: "⚔️ বসের সাথে লড়ুন" },
  retry: { en: "↺ TRY AGAIN", bn: "↺ আবার চেষ্টা করুন" },
  bossDefeated: { en: "BOSS DEFEATED", bn: "বস পরাজিত" },
  bossWon: { en: "BOSS DEFEATED YOU 💀", bn: "বস আপনাকে পরাজিত করেছে 💀" },
  newWeek: { en: "A new boss has arrived!", bn: "একটি নতুন বস এসেছে!" },
  loadNew: { en: "Load the new boss", bn: "নতুন বস লোড করুন" },
  localNote: { en: "Scores stay on this device only — there's no global leaderboard.", bn: "স্কোর শুধু এই ডিভাইসে থাকে — কোনো গ্লোবাল লিডারবোর্ড নেই।" },
  score: { en: "Boss score", bn: "বস স্কোর" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  newBest: { en: "🎉 New best this week!", bn: "🎉 এই সপ্তাহে নতুন সেরা!" },
  rankLabel: { en: "Rank", bn: "র‍্যাঙ্ক" },
  challengeFrom: { en: "A friend challenged you to their boss fight", bn: "এক বন্ধু তার বস-লড়াইয়ে আপনাকে চ্যালেঞ্জ করেছে" },
  challengeWeek: { en: "Boss from the week of {date}", bn: "{date}-এর সপ্তাহের বস" },
  playThisWeek: { en: "Play this week's boss →", bn: "এই সপ্তাহের বস খেলুন →" },
  resultWin: { en: "I won", bn: "আমি জিতেছি" },
  resultLose: { en: "it won", bn: "বস জিতেছে" },
  shareText: { en: "I fought the {boss} {emoji} on Hottogol: {result} — {score} pts. Same boss, same traffic. Your turn?", bn: "হট্টগোলে {boss} {emoji}-এর সাথে লড়লাম: {result} — {score} পয়েন্ট। একই বস, একই ট্রাফিক। এবার তোমার পালা?" },
  home: { en: "← Home", bn: "← হোম" },
  loading: { en: "Summoning the boss…", bn: "বসকে ডাকা হচ্ছে…" },
} as const satisfies Record<string, Text>;

export const trafficBossCopy = {
  lives: { en: "Lives", bn: "জীবন" },
  bossHp: { en: "Boss HP", bn: "বসের এইচপি" },
  score: { en: "Score", bn: "স্কোর" },
  time: { en: "Time", bn: "সময়" },
  seconds: { en: "{n}s", bn: "{n} সে." },
  countdown: [
    { en: "Ready…", bn: "প্রস্তুত…" },
    { en: "Horns up…", bn: "হর্ন রেডি…" },
    { en: "GO!", bn: "চলো!" },
  ] as const,
  phase: { en: "Phase {n}: {name}", bn: "পর্যায় {n}: {name}" },
  phaseNames: [
    { en: "Morning Jam", bn: "সকালের যানজট" },
    { en: "Rush Hour", bn: "অফিস ছুটির ভিড়" },
    { en: "Total Hottogol", bn: "সম্পূর্ণ হট্টগোল" },
  ] as const,
  events: {
    rain: { en: "🌧️ Rain incoming — everyone panics and speeds up", bn: "🌧️ বৃষ্টি নামল — সবাই হঠাৎ তাড়াহুড়োয়" },
    "signal-rush": { en: "🚦 Signal rush! All lanes packed at once", bn: "🚦 সিগন্যাল ছাড়ল! সব লেনে একসাথে গাড়ি" },
    zebra: { en: "🚶 Zebra crossing — pedestrians everywhere", bn: "🚶 জেব্রা ক্রসিং — রাস্তা ভর্তি মানুষ" },
    "bike-swarm": { en: "🏍️ Bike swarm incoming", bn: "🏍️ বাইকের ঝাঁক আসছে" },
    "bus-convoy": { en: "🚌 Bus convoy — synchronized chaos", bn: "🚌 বাসের মিছিল — সুশৃঙ্খল বিশৃঙ্খলা" },
  } as const satisfies Record<EventId, Text>,
  hitLines: {
    car: { en: "A private car didn't see you. Or didn't care.", bn: "প্রাইভেট কার আপনাকে দেখেনি। অথবা পাত্তা দেয়নি।" },
    bus: { en: "Bus: 1, You: 0.", bn: "বাস: ১, আপনি: ০।" },
    cng: { en: "The CNG changed lanes. You didn't.", bn: "সিএনজি লেন বদলাল। আপনি বদলাননি।" },
    rickshaw: { en: "Beaten by a rickshaw. Slowly.", bn: "রিকশার কাছে হার। ধীরে ধীরে।" },
    bike: { en: "A bike appeared from nowhere at full speed.", bn: "কোথা থেকে যেন ফুল স্পিডে একটা বাইক।" },
    pedestrian: { en: "Bumped into someone crossing on their phone.", bn: "ফোনে ব্যস্ত পথচারীর সাথে ধাক্কা।" },
  } as const satisfies Record<Kind, Text>,
  nearWords: [
    { en: "PHEW!", bn: "উফফ!" },
    { en: "WHOA!", bn: "সাঁই!" },
    { en: "CLOSE!", bn: "অল্পের জন্য!" },
    { en: "MISSED!", bn: "বেঁচে গেলেন!" },
    { en: "LUCKY!", bn: "কপাল ভালো!" },
  ] as const,
  shield: { en: "🛡️ Shield!", bn: "🛡️ শিল্ড!" },
  left: { en: "Move left", bn: "বাঁয়ে সরুন" },
  right: { en: "Move right", bn: "ডানে সরুন" },
  stageLabel: { en: "Boss road — dodge the traffic", bn: "বসের রাস্তা — ট্রাফিক এড়ান" },
  statTime: { en: "⏱️ Survived", bn: "⏱️ টিকেছেন" },
  statNear: { en: "🔥 Near misses", bn: "🔥 নিয়ার-মিস" },
  statCombo: { en: "⚡ Best combo", bn: "⚡ সেরা কম্বো" },
  statHits: { en: "💥 Hits", bn: "💥 ধাক্কা" },
  survivedLine: { en: "You defeated the traffic boss! The road trembles.", bn: "আপনি ট্রাফিক বসকে হারিয়ে দিলেন! রাস্তা কাঁপছে।" },
  knockedLine: { en: "The boss knocked you off the bike. Retry — it's the same traffic all week.", bn: "বস আপনাকে বাইক থেকে ফেলে দিয়েছে। আবার চেষ্টা করুন — পুরো সপ্তাহ একই ট্রাফিক।" },
} as const;

export const trafficBossRanks: Record<RankId, { emoji: string; title: Text; accent: Accent }> = {
  "boss-slayer": {
    emoji: "🎯",
    title: { en: "Boss Slayer", bn: "বস শিকারি" },
    accent: "lime",
  },
  "boss-survivor": {
    emoji: "🛡️",
    title: { en: "Boss Survivor", bn: "বস সারভাইভার" },
    accent: "violet",
  },
  "almost-had-it": {
    emoji: "😤",
    title: { en: "Almost Had It", bn: "প্রায় হয়ে গিয়েছিল" },
    accent: "marigold",
  },
  "boss-snack": {
    emoji: "😵",
    title: { en: "Boss Snack", bn: "বসের নাস্তা" },
    accent: "sky",
  },
};
