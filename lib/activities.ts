// Every playable Hottogol activity, built from the real registries — no
// hand-maintained list. Used by Chaos Roulette (and anything else that needs
// "all activities"). Resolve on the server and pass plain items to the client.

import type { Accent } from "@/components/ui/styles";
import { quizCopy } from "@/data/dhaka-person";
import { excuseCopy } from "@/data/excuses";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { listExperiences } from "@/lib/experience/registry";
import { t, type Lang, type Text } from "@/lib/i18n/core";

export type ActivityKind = "experience" | "game" | "quiz" | "tool";

export type Activity = {
  /** Unique, stable key, e.g. "x:dhaka-cng-simulator" or "g:cng-catch". */
  key: string;
  kind: ActivityKind;
  /** Localized kind, e.g. "Game" / "গেম". */
  kindLabel: string;
  href: string;
  title: string;
  emoji: string;
  accent: Accent;
};

const KIND_LABEL: Record<ActivityKind, Text> = {
  experience: { en: "Simulator", bn: "সিমুলেটর" },
  game: { en: "Game", bn: "গেম" },
  quiz: { en: "Quiz", bn: "কুইজ" },
  tool: { en: "Generator", bn: "জেনারেটর" },
};

export function listActivities(lang: Lang): Activity[] {
  const kl = (k: ActivityKind) => t(KIND_LABEL[k], lang);
  return [
    ...listExperiences().map((e) => ({
      key: `x:${e.slug}`,
      kind: "experience" as const,
      kindLabel: kl("experience"),
      href: `/experiences/${e.slug}`,
      title: t(e.title, lang),
      emoji: e.emoji,
      accent: e.accent,
    })),
    ...listGames().map((g) => ({
      key: `g:${g.slug}`,
      kind: "game" as const,
      kindLabel: kl("game"),
      href: GAME_HREF_OVERRIDES[g.slug] ?? `/games/${g.slug}`,
      title: t(g.title, lang),
      emoji: g.emoji,
      accent: g.accent,
    })),
    { key: "p:dhaka-person", kind: "quiz", kindLabel: kl("quiz"), href: "/dhaka-person", title: t(quizCopy.title, lang), emoji: "🏙️", accent: "sky" },
    { key: "p:excuses", kind: "tool", kindLabel: kl("tool"), href: "/excuses?go=1", title: t(excuseCopy.title, lang), emoji: "😂", accent: "marigold" },
  ];
}
