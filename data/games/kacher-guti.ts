import type { Accent } from "@/components/ui/styles";
import type { EndingId, FoulReason, OpponentId, RankId } from "@/lib/games/kacher-guti";
import type { Text } from "@/lib/i18n/core";

// Copy for কাচের গুটি (/games/kacher-guti). Opponents are generic para roles,
// never real people. Marbles are only an in-game count: no betting/gambling
// words. Ids are permanent (lib/games/kacher-guti.ts); copy can change.
// BN is a first draft for the owner to polish.

export const opponentInfo: Record<OpponentId, { emoji: string; name: Text; blurb: Text }> = {
  "choto-bhai": {
    emoji: "🧒",
    name: { en: "Little Brother", bn: "ছোট ভাই" },
    blurb: { en: "Shaky aim, picks any marble. Warm-up.", bn: "নিশানা কাঁপে, যেকোনো গুটি দেখায়। হাত গরম করো।" },
  },
  "boro-bhai": {
    emoji: "🧢",
    name: { en: "Para Boro Bhai", bn: "পাড়ার বড় ভাই" },
    blurb: { en: "Decent shot. Sometimes picks the tricky one.", bn: "হাত ভালো। মাঝে মাঝে কঠিনটা দেখায়।" },
  },
  champion: {
    emoji: "👑",
    name: { en: "Mohollar Champion", bn: "মহল্লার চ্যাম্পিয়ন" },
    blurb: { en: "Rarely misses. Always names the hardest marble.", bn: "মিস কম করে। সবসময় সবচেয়ে কঠিনটা দেখায়।" },
  },
};

export const endingInfo: Record<EndingId, { accent: Accent; title: Text }> = {
  "clean-sweep": { accent: "marigold", title: { en: "🧹 Clean Sweep. Pockets Full.", bn: "🧹 সব গুটি তোমার পকেটে" } },
  won: { accent: "lime", title: { en: "🏆 Para Champion (for today)", bn: "🏆 আজকের পাড়া-চ্যাম্পিয়ন" } },
  draw: { accent: "sky", title: { en: "🤝 Even. Rematch in the evening.", bn: "🤝 সমান সমান। বিকেলে আবার।" } },
  lost: { accent: "tangerine", title: { en: "😮‍💨 Lost a Few Guti", bn: "😮‍💨 কয়েকটা গুটি গেল" } },
  "empty-pocket": { accent: "chili", title: { en: "🫠 Empty Pocket. Go Home.", bn: "🫠 পকেট খালি। বাড়ি যাও।" } },
};

export const rankInfo: Record<RankId, Text> = {
  rookie: { en: "Rookie", bn: "নতুন খেলোয়াড়" },
  "gali-player": { en: "Goli Player", bn: "গলির খেলোয়াড়" },
  sharpshooter: { en: "Sharpshooter", bn: "নিশানাবাজ" },
  "guti-ustad": { en: "Guti Ustad", bn: "গুটি ওস্তাদ" },
  "guti-legend": { en: "Guti Legend", bn: "গুটির কিংবদন্তি" },
};

export const foulInfo: Record<FoulReason, Text> = {
  miss: { en: "Missed everything", bn: "কিছুই লাগেনি" },
  wrong: { en: "Hit the wrong marble first", bn: "আগে অন্য গুটিতে লেগেছে" },
  holed: { en: "Your shooter fell in the hole", bn: "খেলার গুটি গর্তে পড়েছে" },
};

export const gutiCopy = {
  title: { en: "Kacher Guti", bn: "কাচের গুটি" },
  intro: {
    en: "The para marble game. Throw toward the hole: closest plays first. Then hit the marble your opponent names. Hit it: it's yours, shoot again. Miss: pay one marble.",
    bn: "পাড়ার মার্বেল খেলা। গর্তের দিকে ছোড়ো: যে সবচেয়ে কাছে, সে আগে খেলবে। তারপর প্রতিপক্ষ যেটা দেখাবে, সেটা মারো। লাগলে গুটি তোমার, আবার মারো। মিস করলে একটা গুটি দাও।",
  },
  names: { en: "Some places call the line জল্লা and the hole কেপ.", bn: "কোথাও দাগকে বলে জল্লা, আর গর্তকে কেপ।" },
  pick: { en: "Pick your opponent", bn: "প্রতিপক্ষ বেছে নাও" },
  start: { en: "🔮 Start", bn: "🔮 শুরু করো" },
  locked: { en: "Your friend played this exact match against:", bn: "তোমার বন্ধু ঠিক এই ম্যাচটা খেলেছে এর সাথে:" },
  rules: {
    en: "10 marbles each · 3 rounds · stake 3 per round. Most marbles at the end wins.",
    bn: "প্রত্যেকের ১০টা গুটি · ৩ দান · প্রতি দানে ৩টা করে। শেষে যার বেশি গুটি, সে জিতবে।",
  },
  how: {
    en: "Drag back anywhere on the ground, like a slingshot, and let go. Keys: ←/→ aim · hold Space for power, release to shoot.",
    bn: "মাটির যেকোনো জায়গায় গুলতির মতো পেছনে টেনে ছেড়ে দাও। কী-বোর্ড: ←/→ নিশানা · Space চেপে ধরে শক্তি, ছাড়লে মারবে।",
  },
  you: { en: "You", bn: "তুমি" },
  round: { en: "Round {n}/{total}", bn: "দান {n}/{total}" },
  pot: { en: "Pot", bn: "দানের গুটি" },
  line: { en: "line", bn: "দাগ" },
  hole: { en: "hole", bn: "গর্ত" },
  yourThrow: { en: "Throw toward the hole: closest plays first.", bn: "গর্তের দিকে ছোড়ো: যে কাছে, সে আগে।" },
  cpuThrow: { en: "{name} throws…", bn: "{name} ছুড়ছে…" },
  youFirst: { en: "You're closest: you play first!", bn: "তুমি কাছে: তুমি আগে খেলবে!" },
  cpuFirst: { en: "{name} is closer and plays first.", bn: "{name} কাছে, সে আগে খেলবে।" },
  straightIn: { en: "Straight in the hole!", bn: "সরাসরি গর্তে!" },
  scatterYou: { en: "Scatter the pot around the hole. Stop the meter: low = close together, high = spread out.", bn: "দানের গুটি গর্তের চারপাশে ছিটাও। মিটার থামাও: কম = কাছাকাছি, বেশি = ছড়ানো।" },
  scatterBtn: { en: "🤲 SCATTER!", bn: "🤲 ছিটাও!" },
  scatterCpu: { en: "{name} scatters the pot…", bn: "{name} গুটি ছিটাচ্ছে…" },
  holedYours: { en: "{n} fell in the hole: yours!", bn: "{n}টা গর্তে পড়েছে, তোমার!" },
  holedTheirs: { en: "{n} fell in the hole: {name}'s.", bn: "{n}টা গর্তে পড়েছে, {name}-এর।" },
  hitThat: { en: "Hit that one!", bn: "ওইটা মারো!" },
  yourShot: { en: "{name} says: hit the ringed marble.", bn: "{name} বলছে: দাগ দেওয়া গুটিটা মারো।" },
  nameIt: { en: "Pick the marble {name} must hit. Tap it.", bn: "{name} কোনটা মারবে? ট্যাপ করে দেখাও।" },
  nameLabel: { en: "Marble {n}", bn: "গুটি {n}" },
  cpuAims: { en: "{name} aims…", bn: "{name} নিশানা করছে…" },
  hit: { en: "ঠাস! A clean hit!", bn: "ঠাস! একদম লেগেছে!" },
  cpuHit: { en: "ঠাস! {name} hit it.", bn: "ঠাস! {name} লাগিয়েছে।" },
  foul: { en: "ফাউল! {reason}.", bn: "ফাউল! {reason}।" },
  paid: { en: "You pay 1 marble.", bn: "তুমি ১টা গুটি দিলে।" },
  cpuPaid: { en: "{name} pays you 1 marble.", bn: "{name} তোমাকে ১টা গুটি দিল।" },
  lucky: { en: "ভাগ্য ভালো! +{n} from the hole.", bn: "ভাগ্য ভালো! গর্ত থেকে +{n}।" },
  evening: { en: "Evening already! The pot goes back.", bn: "সন্ধ্যা হয়ে গেল! দানের গুটি ফেরত।" },
  nextRound: { en: "▶ Next round", bn: "▶ পরের দান" },
  marbles: { en: "Marbles", bn: "গুটি" },
  cleanHits: { en: "Clean hits", bn: "ঠিক নিশানা" },
  fouls: { en: "Fouls", bn: "ফাউল" },
  opponent: { en: "Opponent", bn: "প্রতিপক্ষ" },
  scoreLabel: { en: "Your marbles", bn: "তোমার গুটি" },
  newBest: { en: "🎉 New best!", bn: "🎉 নতুন সেরা!" },
  best: { en: "Best: {n}/20", bn: "সেরা: {n}/২০" },
  retry: { en: "🔁 Same match again", bn: "🔁 আবার একই ম্যাচ" },
  newMatch: { en: "🆕 New match", bn: "🆕 নতুন ম্যাচ" },
  shareText: {
    en: "I finished Kacher Guti with {n} marbles vs {name} 🔮 You won't beat me.",
    bn: "কাচের গুটিতে {name}-এর সাথে {n}টা গুটি নিয়ে শেষ করেছি 🔮 আমাকে হারাতে পারবে না।",
  },
  soundOn: { en: "🔊 Sound on", bn: "🔊 শব্দ চালু" },
  soundOff: { en: "🔇 Sound off", bn: "🔇 শব্দ বন্ধ" },
  stage: { en: "Marble ground", bn: "মার্বেল খেলার মাঠ" },
} satisfies Record<string, Text>;
