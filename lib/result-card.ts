// One data shape for every Hottogol result card (games, simulators, quiz,
// excuses). Each experience maps its *existing* result data into this — no
// invented numbers. The same data drives the on-screen card
// (components/share/result-card.tsx), the downloadable PNG (lib/result-image.ts)
// and the "Copy result" text (resultText below).

import type { Accent } from "@/components/ui/styles";

export type CardStat = { label: string; value: string };

/** Stats shown on the card and the image (extra ones stay in "Copy result"). */
export const MAX_CARD_STATS = 4;

export type ResultCardData = {
  /** Game/experience name, already in the viewer's language. */
  game: string;
  emoji: string;
  accent: Accent;
  /** Small label above the headline, e.g. "CHAOS SCORE". */
  headlineLabel?: string;
  /** Main score/result, e.g. "1,240 pts" or "৳220 saved". */
  headline: string;
  /** Funny title / rank, e.g. "Dhaka Native". */
  title?: string;
  titleEmoji?: string;
  /** Funny rank pill under the title, e.g. "🎖️ Dhaka Native" (games with named endings). */
  rank?: string;
  /** Sticker above the headline, e.g. "✨ LEGENDARY". */
  badge?: string;
  /** One-line outcome message under the title. */
  blurb?: string;
  /** Important stats (2–4 read best). */
  stats: CardStat[];
  /** Funny quote/outcome line, shown in quotes. */
  quote?: string;
  /** Path of the page to play it, e.g. "/games/chaos-machine" (for the footer URL). */
  path: string;
};

/** Plain-text version for "Copy result" (no emoji-only lines, easy to paste anywhere). */
export function resultText(data: ResultCardData, url: string): string {
  const lines = [
    `${data.emoji} ${data.game} — Hottogol`,
    data.badge,
    [data.titleEmoji, data.title].filter(Boolean).join(" ") || undefined,
    data.rank,
    [data.headlineLabel, data.headline].filter(Boolean).join(": "),
    data.stats.length ? data.stats.map((s) => `${s.label}: ${s.value}`).join(" · ") : undefined,
    data.quote ? `“${data.quote}”` : undefined,
    url,
  ];
  return lines.filter((l): l is string => Boolean(l && l.trim())).join("\n");
}

/** Host for the card footer, from a full origin or URL. */
export function hostOf(urlOrOrigin: string): string {
  return urlOrOrigin.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}
