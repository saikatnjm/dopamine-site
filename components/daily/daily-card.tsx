"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary, card } from "@/components/ui/styles";
import { fmt, num, t } from "@/lib/i18n/core";
import { DailyCountdown, shareDailyResult, useDaily } from "./use-daily";

/** Homepage card: today's daily challenge, countdown, and this device's result. */
export function DailyCard() {
  const { lang, d } = useI18n();
  const daily = useDaily();
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Reserve the height while the date is resolved on the client (no layout shift).
  if (!daily) {
    return (
      <div className={`${card} min-h-64 animate-pulse bg-surface-2 p-6`} aria-busy="true">
        <p className="font-bold text-ink-muted">{d.dailyLoading}</p>
      </div>
    );
  }

  const { challenge, game, record } = daily;

  async function share(score: number) {
    if (!daily) return;
    if ((await shareDailyResult(daily, score, lang, d)) === "copy") {
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 2000);
    }
  }

  return (
    <article className={`${card} relative min-h-64 -rotate-[0.5deg] overflow-hidden`} aria-labelledby="daily-card-title">
      <div className="grid sm:grid-cols-[1fr_auto]">
        <div className="p-6 sm:p-8">
          <p className="inline-flex rotate-[-2deg] rounded-pill border-2 border-ink bg-marigold px-3 py-1 text-sm font-extrabold shadow-pop">
            {fmt(d.dailyBadge, { n: num(challenge.number, lang) })}
          </p>
          <h2 id="daily-card-title" className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {fmt(d.dailyToday, { game: t(game.title, lang) })} <span aria-hidden>{game.emoji}</span>
          </h2>
          <p className="mt-2 max-w-md text-ink-muted">{d.dailySub}</p>

          {record ? (
            <div className="mt-5 rounded-2xl border-2 border-ink bg-surface-2 p-4">
              <p className="font-extrabold">{d.dailyDone}</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                {fmt(d.dailyScore, { score: num(record.first, lang) })}
              </p>
              {record.attempts > 1 && (
                <p className="text-sm font-bold text-ink-muted">
                  {fmt(d.dailyBest, { score: num(record.best, lang), tries: num(record.attempts, lang) })}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => share(record.first)} className={`${btnPrimary} ${accentBg[game.accent]}`}>
                  {d.dailyShare}
                </button>
                <Link href="/daily" className={`${btnPrimary} bg-surface`}>
                  {d.dailyRetry}
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/daily" className={`${btnPrimary} ${accentBg[game.accent]} mt-6 w-full sm:w-auto`}>
              {d.dailyPlay}
            </Link>
          )}
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

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {d.copied}</p>}
      </div>
    </article>
  );
}
