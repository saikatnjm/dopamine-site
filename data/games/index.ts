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
];

export function listGames(): Game[] {
  return games;
}

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
