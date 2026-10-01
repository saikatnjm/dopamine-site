// Every playable Hottogol activity, built from the real registries — no
// hand-maintained list. Used by Chaos Roulette (and anything else that needs
// "all activities"). Resolve on the server and pass plain items to the client.

import type { Accent } from "@/components/ui/styles";
import { quizCopy } from "@/data/dhaka-person";
import { excuseCopy } from "@/data/excuses";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { listExperiences } from "@/lib/experience/registry";
import type { ActivityTag, CategorySlug, Mechanic } from "@/lib/experience/types";
import { moodsOf, type MoodId } from "@/lib/moods";
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
  /** One-line hook from the registry (localized). */
  tagline: string;
  emoji: string;
  accent: Accent;
  /** Typical run length from the registry, when the activity has one. */
  durationSec?: number;
  /** From the registries — used by "You might also like". */
  category: CategorySlug;
  mechanic: Mechanic;
  tags: readonly ActivityTag[];
  /** Moods this activity is listed under in lib/moods.ts. */
  moods: MoodId[];
};

const KIND_LABEL: Record<ActivityKind, Text> = {
  experience: { en: "Simulator", bn: "সিমুলেটর" },
  game: { en: "Game", bn: "গেম" },
  quiz: { en: "Quiz", bn: "কুইজ" },
  tool: { en: "Generator", bn: "জেনারেটর" },
};

export function listActivities(lang: Lang): Activity[] {
  const kl = (k: ActivityKind) => t(KIND_LABEL[k], lang);
  const list: Omit<Activity, "moods">[] = [
    ...listExperiences().map((e) => ({
      key: `x:${e.slug}`,
      kind: "experience" as const,
      kindLabel: kl("experience"),
      href: `/experiences/${e.slug}`,
      title: t(e.title, lang),
      tagline: t(e.tagline, lang),
      emoji: e.emoji,
      accent: e.accent,
      durationSec: e.durationSec,
      category: e.category,
      mechanic: "choices" as const,
      tags: e.tags,
    })),
    ...listGames().map((g) => ({
      key: `g:${g.slug}`,
      kind: "game" as const,
      kindLabel: kl("game"),
      href: GAME_HREF_OVERRIDES[g.slug] ?? `/games/${g.slug}`,
      title: t(g.title, lang),
      tagline: t(g.tagline, lang),
      emoji: g.emoji,
      accent: g.accent,
      durationSec: g.durationSec,
      category: g.category,
      mechanic: g.mechanic,
      tags: g.tags,
    })),
    { key: "p:dhaka-person", kind: "quiz", kindLabel: kl("quiz"), href: "/dhaka-person", title: t(quizCopy.title, lang), tagline: t(quizCopy.lead, lang), emoji: "🏙️", accent: "sky", durationSec: 90, category: "bangladesh", mechanic: "quiz", tags: ["life", "traffic"] },
    { key: "p:excuses", kind: "tool", kindLabel: kl("tool"), href: "/excuses?go=1", title: t(excuseCopy.title, lang), tagline: t(excuseCopy.lead, lang), emoji: "😂", accent: "marigold", category: "work", mechanic: "generator", tags: ["office", "life"] },
  ];
  return list.map((a) => ({ ...a, moods: moodsOf(a.key) }));
}
