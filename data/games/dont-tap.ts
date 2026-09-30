import type { Accent } from "@/components/ui/styles";
import type { DecoyId, RankId } from "@/lib/games/dont-tap";
import type { Text } from "@/lib/i18n/core";

// All copy for Don't Tap (EN + BN). Humor targets situations, never people.

export const dontTapCopy = {
  howTitle: { en: "How to play", bn: "কীভাবে খেলবেন" },
  how: [
    { en: "The big button says DON'T TAP. Believe it.", bn: "বড় বোতামে লেখা “চাপবেন না”। বিশ্বাস করুন।" },
    { en: "Tap only when it turns green AND says TAP! — then tap as fast as you can.", bn: "শুধু যখন সবুজ হবে আর লেখা থাকবে “চাপুন!” — তখন যত দ্রুত পারেন চাপুন।" },
    { en: "Fake signals will try to trick you. Tapping early restarts the round.", bn: "নকল সিগন্যাল আপনাকে বোকা বানাতে চাইবে। আগে চাপলে রাউন্ড আবার শুরু।" },
    { en: "5 rounds. Tap the button, or press Space / Enter.", bn: "৫ রাউন্ড। বোতাম চাপুন, অথবা Space / Enter চাপুন।" },
  ],
  rulesTitle: { en: "Only this counts:", bn: "শুধু এটাই গোনা হবে:" },
  ruleOk: { en: "Green + TAP!", bn: "সবুজ + চাপুন!" },
  ruleNo1: { en: "Green + anything else", bn: "সবুজ + অন্য কিছু" },
  ruleNo2: { en: "TAP! on any other colour", bn: "অন্য রঙে চাপুন!" },
  start: { en: "Start (don't tap yet)", bn: "শুরু (এখনই চাপবেন না)" },
  best: { en: "Best", bn: "সেরা" },
  round: { en: "Round {n} of {total}", bn: "রাউন্ড {n} / {total}" },
  wait: { en: "DON'T TAP", bn: "চাপবেন না" },
  waitSub: { en: "Wait for green TAP!", bn: "সবুজ “চাপুন!”-এর অপেক্ষা করুন" },
  go: { en: "TAP!", bn: "চাপুন!" },
  goSub: { en: "NOW NOW NOW", bn: "এখনই এখনই" },
  early: { en: "TOO EARLY!", bn: "খুব আগে!" },
  earlySub: { en: "Round restarts. Patience, bhai.", bn: "রাউন্ড আবার শুরু। ধৈর্য, ভাই।" },
  penaltySub: { en: "Three false starts: +1 s penalty", bn: "তিনবার আগে চাপলেন: +১ সে. পেনাল্টি" },
  slow: { en: "{n} s…", bn: "{n} সে.…" },
  slowSub: { en: "Did you fall asleep?", bn: "ঘুমিয়ে পড়লেন নাকি?" },
  ms: { en: "{n} ms", bn: "{n} মি.সে." },
  ready: { en: "Get ready…", bn: "তৈরি হন…" },
  srGo: { en: "Tap now!", bn: "এখন চাপুন!" },
  srWait: { en: "Wait. Don't tap.", bn: "অপেক্ষা করুন। চাপবেন না।" },
  srDecoy: { en: "Fake signal. Don't tap.", bn: "নকল সিগন্যাল। চাপবেন না।" },
  buttonLabel: { en: "Reaction button", bn: "রিঅ্যাকশন বোতাম" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  avg: { en: "Average", bn: "গড়" },
  bestTime: { en: "Fastest", bn: "সবচেয়ে দ্রুত" },
  falseStarts: { en: "False starts", bn: "আগে চাপা" },
  rounds: { en: "Your rounds", bn: "আপনার রাউন্ড" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  seedCode: { en: "Round code", bn: "রাউন্ড কোড" },
  challenge: {
    en: "A friend scored {score} with these exact signals. Same timings, same tricks — beat it.",
    bn: "এই একই সিগন্যালে এক বন্ধু {score} পেয়েছে। একই টাইমিং, একই কৌশল — হারিয়ে দিন।",
  },
  challengeWin: { en: "🏆 You beat your friend's {score}!", bn: "🏆 বন্ধুর {score} হারিয়ে দিলেন!" },
  challengeLose: { en: "😬 Your friend's {score} still stands.", bn: "😬 বন্ধুর {score} এখনো টিকে আছে।" },
  retry: { en: "↺ Retry (new signals)", bn: "↺ আবার (নতুন সিগন্যাল)" },
  replay: { en: "Replay these exact signals", bn: "একই সিগন্যাল আবার খেলুন" },
  share: { en: "📤 Share result", bn: "📤 ফলাফল শেয়ার" },
  copied: { en: "✅ Link copied!", bn: "✅ লিংক কপি হয়েছে!" },
  shareText: {
    en: "Don't Tap 🚦 avg {avg} ms, fastest {best} ms — “{title}” ({score} pts). Same signals, your turn:",
    bn: "ডোন্ট ট্যাপ 🚦 গড় {avg} মি.সে., সবচেয়ে দ্রুত {best} মি.সে. — “{title}” ({score} পয়েন্ট)। একই সিগন্যাল, এবার আপনার পালা:",
  },
} satisfies Record<string, Text | Text[]>;

/** Decoy looks: `tone` picks the button colour. */
export const decoys: Record<DecoyId, { label: Text; emoji: string; tone: "go" | "wait" | "maybe" }> = {
  maybe: { label: { en: "TAP?", bn: "চাপুন?" }, emoji: "🤔", tone: "maybe" },
  "green-dont": { label: { en: "DON'T TAP", bn: "চাপবেন না" }, emoji: "😏", tone: "go" },
  "red-tap": { label: { en: "TAP!", bn: "চাপুন!" }, emoji: "😈", tone: "wait" },
  tab: { label: { en: "TAB!", bn: "ছাপুন!" }, emoji: "🙃", tone: "go" },
  almost: { label: { en: "TAP… not", bn: "চাপুন… না" }, emoji: "🫢", tone: "go" },
};

/** Comment under each reaction time. */
export function reactionComment(ms: number): Text[] {
  if (ms < 200) return [{ en: "Suspiciously fast 🤨", bn: "সন্দেহজনক রকম দ্রুত 🤨" }, { en: "Faster than a CNG meter jump", bn: "সিএনজি মিটার লাফানোর চেয়েও দ্রুত" }];
  if (ms < 260) return [{ en: "Lightning ⚡", bn: "বিদ্যুৎ ⚡" }, { en: "Bus-door reflexes", bn: "বাসের দরজার রিফ্লেক্স" }];
  if (ms < 330) return [{ en: "Solid!", bn: "দারুণ!" }, { en: "Respectable", bn: "সম্মানজনক" }];
  if (ms < 450) return [{ en: "Office Wi-Fi speed 📶", bn: "অফিসের ওয়াই-ফাই স্পিড 📶" }, { en: "A bit sleepy?", bn: "একটু ঘুম ঘুম?" }];
  return [{ en: "Load-shedding lag 🕯️", bn: "লোডশেডিং ল্যাগ 🕯️" }, { en: "Buffering…", bn: "বাফারিং…" }];
}

export type DontTapRank = { id: RankId; emoji: string; title: Text; blurb: Text; accent: Accent };

export const dontTapRanks: Record<RankId, DontTapRank> = {
  lightning: {
    id: "lightning",
    emoji: "⚡",
    title: { en: "Load-Shedding Lightning", bn: "লোডশেডিংয়ের বিদ্যুৎ" },
    blurb: { en: "Faster than the power going out. Fake signals didn't stand a chance.", bn: "বিদ্যুৎ চলে যাওয়ার চেয়েও দ্রুত। নকল সিগন্যাল কোনো সুযোগই পায়নি।" },
    accent: "marigold",
  },
  "bus-door": {
    id: "bus-door",
    emoji: "🚌",
    title: { en: "Bus-Door Sprinter", bn: "বাসের দরজার স্প্রিন্টার" },
    blurb: { en: "You'd catch a moving bus with one hand holding cha. Elite commuter reflexes.", bn: "এক হাতে চা নিয়েও চলন্ত বাস ধরে ফেলবেন। এলিট যাত্রীর রিফ্লেক্স।" },
    accent: "cng",
  },
  "office-wifi": {
    id: "office-wifi",
    emoji: "📶",
    title: { en: "Office Wi-Fi Speed", bn: "অফিস ওয়াই-ফাই স্পিড" },
    blurb: { en: "Works fine. Occasionally buffers. Nobody complains out loud.", bn: "চলে। মাঝে মাঝে বাফার করে। কেউ জোরে অভিযোগ করে না।" },
    accent: "sky",
  },
  "govt-office": {
    id: "govt-office",
    emoji: "🐢",
    title: { en: "Govt. File Response Time", bn: "সরকারি ফাইলের গতি" },
    blurb: { en: "Your tap is under review. Please come back tomorrow with a photocopy.", bn: "আপনার ট্যাপ বিবেচনাধীন। কাল ফটোকপিসহ আসুন।" },
    accent: "violet",
  },
  "still-waiting": {
    id: "still-waiting",
    emoji: "💤",
    title: { en: "Still Waiting for the Bus", bn: "এখনো বাসের অপেক্ষায়" },
    blurb: { en: "The signal came and went. So did three buses. Maybe some cha first?", bn: "সিগন্যাল এলো, চলেও গেল। তিনটা বাসও। আগে এক কাপ চা খাবেন?" },
    accent: "tangerine",
  },
  "signal-jumper": {
    id: "signal-jumper",
    emoji: "🚦",
    title: { en: "Professional Signal Jumper", bn: "পেশাদার সিগন্যাল জাম্পার" },
    blurb: { en: "The button said DON'T TAP. You took that personally. Traffic police would like a word.", bn: "বোতাম বলেছিল চাপবেন না। আপনি সেটা ব্যক্তিগতভাবে নিলেন। ট্রাফিক পুলিশ কথা বলতে চায়।" },
    accent: "chili",
  },
};
