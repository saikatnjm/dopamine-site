"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { CngCatchGame } from "@/components/games/cng-catch-game";
import { TrafficDodgeGame } from "@/components/games/traffic-dodge-game";
import { useI18n } from "@/components/providers/lang-provider";
import { btnPrimary, card } from "@/components/ui/styles";
import { onTrack, track } from "@/lib/analytics";
import { recordDailyResult, repinDaily, type DailyGameSlug } from "@/lib/daily";
import type { DailyMode } from "@/lib/games/shared";
import { DailySummary } from "./daily-summary";
import { DailyCountdown, shareDailyResult, useClock, useDaily } from "./use-daily";

/**
 * Players for challenge type "game": components that support `daily` mode.
 * Add new daily games here and in DAILY_ROTATION; a future challenge type
 * gets its own registry and a branch where `Game` is chosen below.
 */
const DAILY_GAMES: Record<DailyGameSlug, ComponentType<{ challenge: null; daily: DailyMode }>> = {
  "cng-catch": CngCatchGame,
  "traffic-dodge": TrafficDodgeGame,
};

export function DailyPlay() {
  const { lang, d } = useI18n();
  const daily = useDaily();
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const dailyGame = daily?.challenge.game;
  const dailyDay = daily?.challenge.dateKey;

  // daily_challenge_start: hear the daily game's own game_start/game_retry.
  useEffect(() => {
    if (!dailyGame || !dailyDay) return;
    return onTrack((event, params) => {
      if ((event === "game_start" || event === "game_retry") && params.game === dailyGame) {
        track("daily_challenge_start", { game: dailyGame, day: dailyDay, retry: event === "game_retry" });
      }
    });
  }, [dailyGame, dailyDay]);

  if (!daily) {
    return (
      <div className={`${card} min-h-80 animate-pulse bg-surface-2 p-6`} aria-busy="true">
        <p className="font-bold text-ink-muted">{d.dailyLoading}</p>
      </div>
    );
  }

  const { challenge } = daily;
  const Game = DAILY_GAMES[challenge.game];

  const mode: DailyMode = {
    seed: challenge.seed,
    retryLabel: d.dailyRetry,
    onComplete: (score) => {
      const next = recordDailyResult(challenge, score);
      track("daily_complete", { game: challenge.game, day: challenge.dateKey, score, attempt: next.attempts });
      track("daily_challenge_complete", { game: challenge.game, day: challenge.dateKey, score, attempt: next.attempts, best: next.best });
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

      <section className={`${card} overflow-hidden p-5 sm:p-6`}>
        <DailySummary daily={daily} playHref="#daily-game" surface="page" headingId="daily-today" />
        {!daily.record && (
          <p className="mt-4 text-sm font-bold text-ink-muted">
            {d.dailyNext} <DailyCountdown className="font-black text-ink" />
          </p>
        )}
      </section>

      {/* Keyed by date so a new day starts a fresh game. */}
      <div id="daily-game" className="scroll-mt-4">
        <Game key={challenge.dateKey} challenge={null} daily={mode} />
      </div>

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
