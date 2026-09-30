import type { ResultCardData } from "@/lib/result-card";
import { resultCardLines, type ResultData } from "@/lib/experience/result-token";
import { t, type Lang } from "@/lib/i18n/core";

/** Simulator result → shared card data (outcome lines first, then your choices). */
export function simulatorCard(result: ResultData, lang: Lang): ResultCardData {
  const { experience, outcome } = result;
  const lines = resultCardLines(result, lang);
  const outcomeCount = outcome.card?.length ?? 0;
  const stats = [...lines.slice(lines.length - outcomeCount), ...lines.slice(0, lines.length - outcomeCount)];
  return {
    game: t(experience.title, lang),
    emoji: experience.emoji,
    accent: experience.accent,
    titleEmoji: outcome.emoji,
    headline: t(outcome.title, lang),
    blurb: t(outcome.message, lang),
    stats,
    quote: outcome.quote ? t(outcome.quote, lang) : undefined,
    path: `/experiences/${experience.slug}`,
  };
}
