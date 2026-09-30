import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";

// Registry of quick reflex games (separate from story "experiences").
// Never rename a slug once shipped: share links contain it.

export type Game = {
  slug: string;
  title: Text;
  tagline: Text;
  description: Text;
  emoji: string;
  accent: Accent;
  durationSec: number;
  /** English SEO copy (crawlers have no language cookie). */
  seo: { title: string; description: string };
};

export const games: Game[] = [
  {
    slug: "cng-catch",
    title: { en: "CNG Catch", bn: "সিএনজি ক্যাচ" },
    tagline: { en: "Hail it at the perfect moment. Or walk.", bn: "ঠিক সময়ে থামান। নইলে হাঁটুন।" },
    description: {
      en: "A 30-second reflex game: CNGs zoom past faster and faster. Tap when one is in the stop zone, chain combos, and don't miss three times.",
      bn: "৩০ সেকেন্ডের রিফ্লেক্স গেম: সিএনজি একের পর এক আরও জোরে ছুটে যায়। স্টপ জোনে এলেই ট্যাপ করুন, কম্বো বানান, আর তিনবার মিস করবেন না।",
    },
    emoji: "🛺",
    accent: "cng",
    durationSec: 30,
    seo: {
      title: "CNG Catch — 30-Second Dhaka Reflex Game",
      description: "Tap the speeding CNG at the perfect moment. A free 30-second Dhaka reflex game with combos, funny results and shareable challenges. No sign-up.",
    },
  },
  {
    slug: "traffic-dodge",
    title: { en: "Dhaka Traffic Dodge", bn: "ঢাকা ট্রাফিক ডজ" },
    tagline: { en: "Buses, CNGs, rickshaws and one goat. Don't touch any of them.", bn: "বাস, সিএনজি, রিকশা আর একটা ছাগল। কাউকে ছোঁবেন না।" },
    description: {
      en: "A 30–60 second arcade dodge: weave your motorbike through ever-faster Dhaka traffic, score last-second near-misses, and survive VIP convoys, bus races and goat crossings.",
      bn: "৩০–৬০ সেকেন্ডের আর্কেড গেম: ক্রমশ দ্রুত হওয়া ঢাকার ট্রাফিকের ফাঁক দিয়ে বাইক চালান, শেষ মুহূর্তে পাশ কাটিয়ে বোনাস নিন, আর টিকে থাকুন ভিআইপি মুভমেন্ট, বাস রেস আর ছাগল পারাপারে।",
    },
    emoji: "🛵",
    accent: "violet",
    durationSec: 45,
    seo: {
      title: "Dhaka Traffic Dodge — Free Arcade Dodging Game",
      description: "Weave a motorbike through buses, CNGs, rickshaws and goats in this free 30–60 second Dhaka traffic arcade game. Near-miss combos, funny titles, shareable challenges.",
    },
  },
  {
    slug: "bazar-bargain",
    title: { en: "Bazar Bargain", bn: "বাজার বার্গেইন" },
    tagline: { en: "Five items, one budget, six vendors who all say “last price”.", bn: "পাঁচটা জিনিস, এক বাজেট, আর সব দোকানির “শেষ দাম”।" },
    description: {
      en: "A Bangladeshi bazar negotiation game: haggle for hilsa, eggs and onions, bluff, walk away, get refused — and chase rare legendary endings.",
      bn: "বাংলাদেশি বাজারের দরদামের খেলা: ইলিশ, ডিম, পেঁয়াজ নিয়ে দরদাম করুন, চাপা মারুন, দরকার হলে হেঁটে চলে যান — আর খুঁজুন বিরল কিংবদন্তি এন্ডিং।",
    },
    emoji: "🛒",
    accent: "tangerine",
    durationSec: 90,
    seo: {
      title: "Bazar Bargain — Bangladesh Market Haggling Game",
      description: "Haggle with stubborn, dramatic and sleepy vendors in this free Bangladesh bazar negotiation game. Save money, avoid getting refused, unlock legendary endings. No sign-up.",
    },
  },
  {
    slug: "tea-balance",
    title: { en: "Tea Balance", bn: "টি ব্যালেন্স" },
    tagline: { en: "One full cup of cha. One Dhaka road. Zero chance.", bn: "এক কাপ ভরা চা। এক ঢাকার রাস্তা। কোনো চান্স নেই।" },
    description: {
      en: "A 20–60 second balancing game: push a cha cart up a Dhaka road, dodge potholes, manholes and goats, and keep the tea from sloshing out.",
      bn: "২০–৬০ সেকেন্ডের ব্যালেন্সিং গেম: ঢাকার রাস্তায় চায়ের কার্ট ঠেলুন, গর্ত, ম্যানহোল আর ছাগল এড়ান, আর চা ছলকে পড়তে দেবেন না।",
    },
    emoji: "☕",
    accent: "marigold",
    durationSec: 60,
    seo: {
      title: "Tea Balance — Don't Spill the Cha (Dhaka Balancing Game)",
      description: "Carry a full cup of tea through potholes, manholes and goats in this free 20–60 second Dhaka balancing game. Smooth moves, funny endings, shareable challenges.",
    },
  },
  {
    slug: "dont-tap",
    title: { en: "Don't Tap", bn: "ডোন্ট ট্যাপ" },
    tagline: { en: "It says DON'T TAP. Then it lies. Then it says TAP!", bn: "লেখা “চাপবেন না”। তারপর মিথ্যা বলে। তারপর “চাপুন!”" },
    description: {
      en: "A 5-round reaction test with fake signals: wait for green TAP!, ignore the tricks, and see your real reaction time in milliseconds.",
      bn: "নকল সিগন্যালসহ ৫ রাউন্ডের রিঅ্যাকশন টেস্ট: সবুজ “চাপুন!”-এর অপেক্ষা করুন, কৌশলে পা দেবেন না, আর দেখুন আপনার আসল রিঅ্যাকশন টাইম মিলিসেকেন্ডে।",
    },
    emoji: "🚦",
    accent: "chili",
    durationSec: 30,
    seo: {
      title: "Don't Tap — Free Reaction Time Test With Fake Signals",
      description: "Test your reaction time in milliseconds: 5 rounds, fake-out signals, average and best times, funny titles and shareable challenges. Free, no sign-up.",
    },
  },
];

export function listGames(): Game[] {
  return games;
}

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
