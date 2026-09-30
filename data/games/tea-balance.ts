import type { Accent } from "@/components/ui/styles";
import type { EventId, HazardKind, RankId } from "@/lib/games/tea-balance";
import type { Text } from "@/lib/i18n/core";

// All copy for Tea Balance (EN + BN). Humor targets the road, never people.

export const teaCopy = {
  howTitle: { en: "How to play", bn: "কীভাবে খেলবেন" },
  how: [
    { en: "The boss wants cha. You're pushing one very full cup up a Dhaka road.", bn: "বস চা চেয়েছেন। আপনি কানায় কানায় ভরা এক কাপ চা নিয়ে ঢাকার রাস্তা দিয়ে যাচ্ছেন।" },
    { en: "Drag on the road, move your mouse, hold ◀ ▶, or press ← → / A D to steer.", bn: "রাস্তায় টেনে, মাউস নেড়ে, ◀ ▶ চেপে ধরে, অথবা ← → / A D দিয়ে চালান।" },
    { en: "Dodge potholes, manholes, puddles and goats. Jerky moves slosh the tea too.", bn: "গর্ত, ম্যানহোল, পানি আর ছাগল এড়ান। ঝাঁকি দিয়ে সরলেও চা ছলকায়।" },
    { en: "Keep the wobble meter out of the red. Survive 60 s to deliver the tea.", bn: "দোলার মিটার লাল ঘরে যেতে দেবেন না। ৬০ সেকেন্ড টিকলেই চা ডেলিভারি।" },
  ],
  start: { en: "Pour the tea", bn: "চা ঢালুন" },
  best: { en: "Best", bn: "সেরা" },
  time: { en: "Time", bn: "সময়" },
  tea: { en: "Tea left", bn: "চা বাকি" },
  wobble: { en: "Wobble", bn: "দোলা" },
  seconds: { en: "{n}s", bn: "{n} সে." },
  pts: { en: "pts", bn: "পয়েন্ট" },
  left: { en: "Move left", bn: "বাঁয়ে সরুন" },
  right: { en: "Move right", bn: "ডানে সরুন" },
  roadLabel: {
    en: "Tea Balance road. Drag or move the mouse across the road, hold the left and right buttons, or use the arrow keys or A and D to steer the cart.",
    bn: "টি ব্যালেন্সের রাস্তা। কার্ট চালাতে রাস্তায় টানুন বা মাউস নাড়ুন, বাঁ-ডান বোতাম চেপে ধরুন, অথবা অ্যারো কী বা A ও D ব্যবহার করুন।",
  },
  countdown: [
    { en: "3…", bn: "৩…" },
    { en: "2…", bn: "২…" },
    { en: "Careful…", bn: "সাবধানে…" },
  ],
  delivered: { en: "☕ Tea delivered!", bn: "☕ চা পৌঁছে গেছে!" },
  spilledAt: { en: "💦 Spilled at {n}s", bn: "💦 {n} সেকেন্ডে সব পড়ে গেল" },
  spillBanner: { en: "💦 SPLASH!", bn: "💦 ছলাৎ!" },
  statTime: { en: "Survived", bn: "টিকেছেন" },
  statTea: { en: "Tea left", bn: "চা বাকি" },
  statHits: { en: "Bumps hit", bn: "ঝাঁকি খেলেন" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  roadCode: { en: "Road code", bn: "রাস্তা কোড" },
  retry: { en: "↺ Retry (new road)", bn: "↺ আবার (নতুন রাস্তা)" },
  replay: { en: "Replay this exact road", bn: "একই রাস্তা আবার খেলুন" },
  share: { en: "📤 Share result", bn: "📤 ফলাফল শেয়ার" },
  shareText: {
    en: "I carried cha for {time}s and got “{title}” ({score} pts) in Tea Balance ☕ Same road, your turn:",
    bn: "টি ব্যালেন্সে {time} সেকেন্ড চা বয়ে হলাম “{title}” ({score} পয়েন্ট) ☕ একই রাস্তা, এবার আপনার পালা:",
  },
} satisfies Record<string, Text | Text[]>;

export const hazardLooks: Record<HazardKind, { emoji: string; className: string; sound: Text; line: Text }> = {
  pothole: {
    emoji: "🕳️",
    className: "rounded-[50%] bg-ink/70",
    sound: { en: "DHOP!", bn: "ধপ!" },
    line: { en: "Pothole. One of roughly a million.", bn: "গর্ত। আনুমানিক দশ লাখের একটা।" },
  },
  manhole: {
    emoji: "⚠️",
    className: "rounded-[50%] border-2 border-ink bg-[#6b6478]",
    sound: { en: "KHATANG!", bn: "খটাং!" },
    line: { en: "Open manhole. Classic.", bn: "খোলা ম্যানহোল। চিরচেনা।" },
  },
  puddle: {
    emoji: "💧",
    className: "rounded-[50%] bg-sky/70",
    sound: { en: "CHHOP!", bn: "ছপ!" },
    line: { en: "That puddle was deeper than it looked.", bn: "পানিটা যতটা মনে হয়েছিল তার চেয়ে গভীর।" },
  },
  breaker: {
    emoji: "",
    className: "bg-[repeating-linear-gradient(90deg,#ffc53d_0_16px,#1a1325_16px_32px)] border-y-2 border-ink",
    sound: { en: "BUMP!", bn: "ঝাঁকি!" },
    line: { en: "Speed breaker built from pure spite.", bn: "স্পিড ব্রেকারটা শুধু জেদ দিয়ে বানানো।" },
  },
  goat: {
    emoji: "🐐",
    className: "",
    sound: { en: "MEEEH!", bn: "ম্যা-অ্যা!" },
    line: { en: "The goat did not move. The goat never moves.", bn: "ছাগল নড়েনি। ছাগল কখনো নড়ে না।" },
  },
};

export const eventBanners: Record<EventId, Text> = {
  wind: { en: "💨 A bus just blew past — hold steady!", bn: "💨 পাশ দিয়ে বাস চলে গেল — শক্ত করে ধরুন!" },
  wasa: { en: "🚧 WASA dug up the road again", bn: "🚧 ওয়াসা আবার রাস্তা খুঁড়েছে" },
  sip: { en: "🫢 Colleague: “Ek chumuk?” (−7% tea)", bn: "🫢 কলিগ: “এক চুমুক?” (−৭% চা)" },
  horn: { en: "📯 Hydraulic horn! You flinched", bn: "📯 হাইড্রোলিক হর্ন! চমকে উঠলেন" },
};

export type TeaRank = { id: RankId; emoji: string; title: Text; blurb: Text; accent: Accent };

export const teaRanks: Record<RankId, TeaRank> = {
  ustad: {
    id: "ustad",
    emoji: "👑",
    title: { en: "Ustad Cha-wala", bn: "ওস্তাদ চা-ওয়ালা" },
    blurb: { en: "60 seconds, a nearly full cup, zero drama. Tong stalls across Dhaka whisper your name.", bn: "৬০ সেকেন্ড, প্রায় ভরা কাপ, কোনো নাটক নেই। ঢাকার সব টং দোকানে আপনার নাম ফিসফিস।" },
    accent: "marigold",
  },
  "steady-hands": {
    id: "steady-hands",
    emoji: "🫖",
    title: { en: "Steady Hands of the Tong", bn: "টং দোকানের স্থির হাত" },
    blurb: { en: "Delivered with tea to spare. The boss sipped and said nothing — the highest praise.", bn: "চা বাঁচিয়েই পৌঁছে দিলেন। বস চুমুক দিয়ে কিছু বললেন না — এটাই সর্বোচ্চ প্রশংসা।" },
    accent: "cng",
  },
  "tea-runner": {
    id: "tea-runner",
    emoji: "🏃",
    title: { en: "Office Tea Runner", bn: "অফিসের চা-দৌড়বিদ" },
    blurb: { en: "You got far. The tea didn't. The boss received a very expensive cup of air.", bn: "আপনি অনেক দূর গেলেন। চা যায়নি। বস পেলেন এক কাপ দামি বাতাস।" },
    accent: "sky",
  },
  "half-cup": {
    id: "half-cup",
    emoji: "🥤",
    title: { en: "Half-Cup Hero", bn: "আধা-কাপ হিরো" },
    blurb: { en: "Half the tea is on the road, the other half is on your shirt. Perfectly balanced.", bn: "অর্ধেক চা রাস্তায়, বাকি অর্ধেক শার্টে। একদম ব্যালেন্সড।" },
    accent: "tangerine",
  },
  "instant-spill": {
    id: "instant-spill",
    emoji: "💀",
    title: { en: "Spilled Before the First Sip", bn: "প্রথম চুমুকের আগেই শেষ" },
    blurb: { en: "The road won. The road always wins. Maybe order from the tong next door?", bn: "রাস্তা জিতে গেল। রাস্তা সবসময়ই জেতে। পাশের টং থেকে আনিয়ে নেবেন নাকি?" },
    accent: "chili",
  },
};
