"use client";

import { useRef, useState, type ComponentType } from "react";
import { CngCatchGame } from "@/components/games/cng-catch-game";
import { TrafficDodgeGame } from "@/components/games/traffic-dodge-game";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary, card } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { recordDailyResult, repinDaily, type DailyGameSlug } from "@/lib/daily";
import type { DailyMode } from "@/lib/games/shared";
import { fmt, num, t } from "@/lib/i18n/core";
import { DailyCountdown, shareDailyResult, useClock, useDaily } from "./use-daily";

/** Game components that support `daily` mode. Add new daily games here and in DAILY_ROTATION. */
const DAILY_GAMES: Record<DailyGameSlug, ComponentType<{ challenge: null; daily: DailyMode }>> = {
  "cng-catch": CngCatchGame,
  "traffic-dodge": TrafficDodgeGame,
};

export function DailyPlay() {
  const { lang, d } = useI18n();
  const daily = useDaily();
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  if (!daily) {
    return (
      <div className={`${card} min-h-80 animate-pulse bg-surface-2 p-6`} aria-busy="true">
        <p className="font-bold text-ink-muted">{d.dailyLoading}</p>
      </div>
    );
  }

  const { challenge, game, record } = daily;
  const Game = DAILY_GAMES[challenge.game];

  const mode: DailyMode = {
    seed: challenge.seed,
    retryLabel: d.dailyRetry,
    onComplete: (score) => {
      const next = recordDailyResult(challenge, score);
      track("daily_complete", { game: challenge.game, day: challenge.dateKey, score, attempt: next.attempts });
    },
    onShare: async (score) => {
      if ((await shareDailyResult(daily, score, lang, d)) === "copy") {
        setToast(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setToast(false), 2000);
      }
    },
  };

  return (
    <div className="grid gap-5">
      <RolledBanner />

      <section className={`${card} overflow-hidden`} aria-labelledby="daily-today">
        <div className={`${accentBg[game.accent]} flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-4`}>
          <div>
            <p className="text-sm font-extrabold">{fmt(d.dailyBadge, { n: num(challenge.number, lang) })}</p>
            <h2 id="daily-today" className="font-display text-2xl font-extrabold leading-tight">
              {fmt(d.dailyToday, { game: t(game.title, lang) })}
            </h2>
          </div>
          <span aria-hidden className="text-5xl drop-shadow-[3px_3px_0_rgb(26_19_37)]">
            {game.emoji}
          </span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{d.dailyNext}</p>
            <DailyCountdown className="block font-display text-3xl font-black" />
          </div>
          {record && (
            <div className="rounded-2xl border-2 border-ink bg-surface-2 p-3">
              <p className="text-sm font-extrabold">{d.dailyDone}</p>
              <p className="font-display text-xl font-extrabold tabular-nums">{fmt(d.dailyScore, { score: num(record.first, lang) })}</p>
              {record.attempts > 1 && (
                <p className="text-xs font-bold text-ink-muted">
                  {fmt(d.dailyBest, { score: num(record.best, lang), tries: num(record.attempts, lang) })}
                </p>
              )}
            </div>
          )}
          <p className="text-sm text-ink-muted sm:col-span-2">{d.dailySub}</p>
        </div>
      </section>

      {/* Keyed by date so a new day starts a fresh game. */}
      <Game key={challenge.dateKey} challenge={null} daily={mode} />

      <p className="text-center text-xs text-ink-muted">{d.dailyLocal}</p>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {d.copied}</p>}
      </div>
    </div>
  );
}

/** Shown after Bangladesh midnight while the old challenge is still on screen. */
function RolledBanner() {
  const { d } = useI18n();
  const clock = useClock();
  if (!clock?.rolled) return null;
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink bg-violet p-4 text-center font-bold shadow-pop sm:flex-row sm:justify-between sm:text-left">
      <p>{d.dailyRolled}</p>
      <button type="button" onClick={repinDaily} className={`${btnPrimary} bg-surface`}>
        {d.dailyLoadNew}
      </button>
    </div>
  );
}
