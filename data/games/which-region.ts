import type { Text } from "@/lib/i18n/core";

// Copy for তুমি কোন এলাকার মানুষ? (/games/which-region). A playful guess from a
// few words — never a claim about anyone's background, never a judgement of a
// region. Regional words stay in Bangla in both languages.

export const detectiveCopy = {
  title: { en: "Which Region Are You From?", bn: "তুমি কোন এলাকার মানুষ?" },
  lead: {
    en: "Tell us what you call 10 everyday things — Hottogol will guess which part of Bangladesh you're from.",
    bn: "১০টা চেনা জিনিসকে তুমি কী বলো জানাও — হট্টগোল আন্দাজ করবে তুমি বাংলাদেশের কোন এলাকার!",
  },
  intro: {
    en: "Pick what people say where you grew up. Not there? Choose “something else”.",
    bn: "যেখানে বড় হয়েছ, সেখানে যা বলে সেটাই বেছে নাও। না মিললে “অন্য কিছু”।",
  },
  start: { en: "▶ Start guessing", bn: "▶ শুরু করো" },
  friendBanner: { en: "👀 Hottogol guessed your friend is from {region}. And you?", bn: "👀 হট্টগোল বলেছে তোমার বন্ধু {region}-এর মানুষ। আর তুমি?" },
  friendMystery: { en: "👀 Even Hottogol couldn't place your friend. Can it place you?", bn: "👀 তোমার বন্ধুকে হট্টগোলও ধরতে পারেনি। তোমাকে পারবে?" },
  takeIt: { en: "▶ Guess my region", bn: "▶ আমার এলাকা বের করো" },
  progress: { en: "Word {n} of {total}", bn: "শব্দ {n} / {total}" },
  askWord: { en: "Where you grew up, what do people call “{word}”?", bn: "তোমাদের এলাকায় “{word}”-কে কী বলে?" },
  askPhrase: { en: "Where you grew up, how do people say “{word}”?", bn: "তোমাদের এলাকায় “{word}” কীভাবে বলে?" },
  copyLink: { en: "Copy link", bn: "লিংক কপি" },
  linkCopied: { en: "Link copied!", bn: "লিংক কপি হয়েছে!" },
  other: { en: "🤷 Something else / not sure", bn: "🤷 অন্য কিছু / জানি না" },
  back: { en: "← Previous word", bn: "← আগের শব্দ" },
  thinking: [
    { en: "Hmm, interesting… 🤔", bn: "হুম, ইন্টারেস্টিং… 🤔" },
    { en: "Noted! 📝", bn: "নোট করলাম! 📝" },
    { en: "Getting warmer… 🔥", bn: "ধরে ফেলছি প্রায়… 🔥" },
    { en: "Oho! That's a clue 🕵️", bn: "ওহো! এটা তো বড় সূত্র 🕵️" },
  ],
  resultKicker: { en: "Hottogol says…", bn: "হট্টগোল বলছে…" },
  resultTitle: { en: "You're probably from {region}!", bn: "তুমি খুব সম্ভবত {region}-এর মানুষ!" },
  resultMatch: { en: "{hits} of your {answered} words match {region}.", bn: "তোমার {answered}টা শব্দের {hits}টা {region}-এর সাথে মিলেছে।" },
  runnersUp: { en: "Close behind: {regions}", bn: "কাছাকাছি: {regions}" },
  mysteryTitle: { en: "You're a mystery! 🕵️", bn: "তুমি এক রহস্যময় মানুষ! 🕵️" },
  mysteryBody: {
    en: "None of your words matched the ones we know — your region's words are still a secret to us.",
    bn: "তোমার কোনো শব্দই আমাদের জানা শব্দের সাথে মেলেনি — তোমার এলাকার ভাষা এখনো আমাদের অজানা!",
  },
  yourWords: { en: "Your words", bn: "তোমার বলা শব্দ" },
  note: {
    en: "Just for fun — a guess from a few words, not a claim about where you're from. Words come from cited research.",
    bn: "শুধু মজার জন্য — কয়েকটা শব্দ দেখে আন্দাজ, তোমার আসল এলাকা নিয়ে কোনো দাবি না। শব্দগুলো সূত্রসহ গবেষণা থেকে নেওয়া।",
  },
  wrongGuess: { en: "Wrong guess? Send it to friends and see if theirs is right 😏", bn: "ভুল আন্দাজ? বন্ধুদের পাঠাও, দেখো তাদেরটা মেলে কি না 😏" },
  share: { en: "📤 Challenge friends", bn: "📤 বন্ধুদের চ্যালেঞ্জ দাও" },
  shareText: { en: "Hottogol says I'm from {region}! 😳 Right or wrong? Find out where you're from 👇", bn: "হট্টগোল বলছে আমি {region}-এর মানুষ! 😳 ঠিক বলল? তুমি কোন এলাকার দেখো 👇" },
  shareMystery: { en: "Even Hottogol couldn't guess where I'm from 🕵️ Can it guess you? 👇", bn: "হট্টগোলও ধরতে পারল না আমি কোন এলাকার! 🕵️ তোমাকে পারবে? 👇" },
  posterKicker: { en: "🕵️ Which region are you from?", bn: "🕵️ তুমি কোন এলাকার মানুষ?" },
  posterTitle: { en: "I'm probably from {region}!", bn: "আমি খুব সম্ভবত {region}-এর মানুষ!" },
  posterMystery: { en: "Nobody can guess where I'm from 🕵️", bn: "কেউ ধরতে পারবে না আমি কোন এলাকার 🕵️" },
  posterSubtitle: { en: "{hits} of {answered} words matched", bn: "{answered}টা শব্দের {hits}টা মিলেছে" },
  posterCta: { en: "Which region are you from? Play and find out!", bn: "তুমি কোন এলাকার? খেলে দেখো!" },
  retake: { en: "🔁 Play again (new words)", bn: "🔁 আবার খেলো (নতুন শব্দ)" },
  mapLink: { en: "🗺️ See every word on the map", bn: "🗺️ সব শব্দ মানচিত্রে দেখো" },
  buildingTitle: { en: "প্রশ্ন তৈরি হচ্ছে!", bn: "প্রশ্ন তৈরি হচ্ছে!" },
  buildingBody: {
    en: "We need words from more regions before the detective can guess fairly. Check back soon!",
    bn: "ঠিকঠাক আন্দাজ করতে আরও এলাকার শব্দ লাগবে। একটু পরে আবার এসো!",
  },
} satisfies Record<string, Text | Text[]>;
