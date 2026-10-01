"use client";

import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, card } from "@/components/ui/styles";
import { DailySummary } from "./daily-summary";
import { DailyCountdown, useDaily } from "./use-daily";

/** Homepage card: today's daily challenge, countdown, and this device's result. */
export function DailyCard() {
  const { d } = useI18n();
  const daily = useDaily();

  // Reserve the height while the date is resolved on the client (no layout shift).
  if (!daily) {
    return (
      <div className={`${card} min-h-64 animate-pulse bg-surface-2 p-6`} aria-busy="true">
        <p className="font-bold text-ink-muted">{d.dailyLoading}</p>
      </div>
    );
  }

  const { game } = daily;

  return (
    <article className={`${card} relative min-h-64 -rotate-[0.5deg] overflow-hidden`} aria-labelledby="daily-card-title">
      <div className="grid sm:grid-cols-[1fr_auto]">
        <div className="p-6 sm:p-8">
          <DailySummary daily={daily} playHref="/daily" surface="home" headingId="daily-card-title" />
        </div>

        <div className={`${accentBg[game.accent]} flex flex-row items-center justify-between gap-4 border-t-2 border-ink px-6 py-4 sm:flex-col sm:justify-center sm:border-l-2 sm:border-t-0 sm:px-10`}>
          <span aria-hidden className="text-6xl drop-shadow-[3px_3px_0_rgb(26_19_37)] sm:text-8xl">
            {game.emoji}
          </span>
          <p className="text-right sm:text-center">
            <span className="block text-xs font-extrabold uppercase tracking-wider">{d.dailyNext}</span>
            <DailyCountdown className="font-display text-2xl font-black" />
          </p>
        </div>
      </div>
      <p className="border-t-2 border-dashed border-ink/30 px-6 py-2 text-xs text-ink-muted sm:px-8">{d.dailyLocal}</p>
    </article>
  );
}
