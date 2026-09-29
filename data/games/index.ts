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
];

export function listGames(): Game[] {
  return games;
}

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
