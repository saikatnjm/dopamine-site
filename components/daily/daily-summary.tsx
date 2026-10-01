"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { fmt, num, t } from "@/lib/i18n/core";
import { DailyCountdown, shareDailyChallenge, shareDailyResult, type DailyState } from "./use-daily";

/** Grouped score (8,420 / ৮,৪২০). */
function big(n: number, lang: "en" | "bn"): string {
  return lang === "bn" ? n.toLocaleString("bn-BD") : n.toLocaleString("en-US");
}

/**
 * Today's challenge block shared by the homepage card and /daily:
 * before playing → "🔥 TODAY'S HOTTOGOL" + PLAY; after → "🏆 TODAY'S SCORE",
 * best today / personal best / streak, "Come back tomorrow." + countdown,
 * Share, Challenge a friend, Retry. Sends daily_challenge_view once per day.
 */
export function DailySummary({ daily, playHref, surface, headingId }: { daily: DailyState; playHref: string; surface: "home" | "page"; headingId: string }) {
  const { lang, d } = useI18n();
  const { challenge, game, record, streak, personalBest } = daily;
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Once per day per surface.
  useEffect(() => {
    track("daily_challenge_view", { surface, game: challenge.game, day: challenge.dateKey });
  }, [surface, challenge.game, challenge.dateKey]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function run(share: typeof shareDailyResult, score: number) {
    if ((await share(daily, score, lang, d)) === "copy") {
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 2000);
    }
  }

  return (
    <div>
      <p className="inline-flex rotate-[-2deg] rounded-pill border-2 border-ink bg-marigold px-3 py-1 text-sm font-extrabold shadow-pop">
        {fmt(d.dailyHot, { n: num(challenge.number, lang) })}
      </p>
      <h2 id={headingId} className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        <span aria-hidden>{game.emoji}</span> {t(game.title, lang)}
      </h2>
      <p className="mt-2 max-w-md font-bold">{d.dailyEveryone}</p>
      {streak >= 2 && (
        <p className="mt-3 inline-flex rounded-pill border-2 border-ink bg-chili px-3 py-0.5 text-sm font-extrabold">{fmt(d.dailyStreak, { n: num(streak, lang) })}</p>
      )}

      {record ? (
        <div className="mt-5 rounded-2xl border-2 border-ink bg-surface-2 p-4">
          <p className="text-sm font-extrabold uppercase tracking-wider">{d.dailyTodayScore}</p>
          <p className="font-display text-5xl font-black tabular-nums leading-tight">{big(record.first, lang)}</p>
          <ul className="mt-1 grid gap-0.5 text-sm font-bold text-ink-muted">
            {record.attempts > 1 && <li>{fmt(d.dailyBest, { score: num(record.best, lang), tries: num(record.attempts, lang) })}</li>}
            {personalBest !== null && <li>{fmt(d.dailyPersonalBest, { score: big(personalBest, lang) })}</li>}
          </ul>
          <p className="mt-3 font-extrabold">
            {d.dailyComeBack} <span className="text-ink-muted">· {d.dailyNext}</span> <DailyCountdown className="font-black" />
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => run(shareDailyResult, record.first)} className={`${btnPrimary} ${accentBg[game.accent]} px-3 text-base`}>
              {d.dailyShare}
            </button>
            <button type="button" onClick={() => run(shareDailyChallenge, record.best)} className={`${btnPrimary} bg-marigold px-3 text-base`}>
              {d.chShare}
            </button>
            <Link href={playHref} className={`${btnPrimary} bg-surface px-3 text-base`}>
              {d.dailyRetryShort}
            </Link>
          </div>
        </div>
      ) : (
        <Link href={playHref} className={`${btnPrimary} ${accentBg[game.accent]} mt-6 w-full sm:w-auto`}>
          {d.dailyPlay}
        </Link>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {d.copied}</p>}
      </div>
    </div>
  );
}
