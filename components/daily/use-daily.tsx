"use client";

import { useSyncExternalStore } from "react";
import { getGame, type Game } from "@/data/games";
import { track } from "@/lib/analytics";
import {
  bdDateKey,
  dailyChallenge,
  dailyStatsSnapshot,
  formatCountdown,
  getPinnedKey,
  msUntilNextDay,
  nowSecond,
  parseDailyRecord,
  parseDailyStats,
  readDailyRaw,
  subscribeDaily,
  subscribePinned,
  subscribeSecond,
  type DailyChallenge,
  type DailyRecord,
} from "@/lib/daily";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";
import { challengePath } from "@/lib/challenge";
import { copyText } from "@/lib/sharing";

export type DailyState = {
  challenge: DailyChallenge;
  game: Game;
  record: DailyRecord | null;
  /** Consecutive days with a finished daily (local). */
  streak: number;
  /** Best daily score ever for this game on this device (includes today). */
  personalBest: number | null;
};

const noop = () => () => {};

/**
 * Today's challenge and this device's record for it. Does not tick, so a game
 * rendered under it never re-renders from the clock (see useClock).
 * Returns null during SSR/hydration (the date is only known on the client).
 */
export function useDaily(): DailyState | null {
  const key = useSyncExternalStore(subscribePinned, getPinnedKey, () => null);
  const raw = useSyncExternalStore(
    key ? subscribeDaily : noop,
    () => (key ? readDailyRaw(key) : null),
    () => null,
  );
  const stats = useSyncExternalStore(
    key ? subscribeDaily : noop,
    () => (key ? dailyStatsSnapshot(key) : null),
    () => null,
  );
  if (key === null) return null;
  const challenge = dailyChallenge(key);
  const game = getGame(challenge.game);
  if (!game) return null;
  const record = parseDailyRecord(raw);
  const { streak, personalBest } = parseDailyStats(stats ?? "0|", challenge.game);
  const best = Math.max(personalBest ?? -1, record?.best ?? -1);
  return { challenge, game, record, streak, personalBest: best >= 0 ? best : null };
}

/**
 * 1 s clock for countdowns. `rolled` = the Bangladesh date has moved past the
 * pinned challenge. Use it only in small leaf components.
 */
export function useClock(): { msLeft: number; rolled: boolean } | null {
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => null);
  const key = useSyncExternalStore(subscribePinned, getPinnedKey, () => null);
  if (now === null || key === null) return null;
  return { msLeft: msUntilNextDay(now), rolled: bdDateKey(now) !== key };
}

/** "HH:MM:SS" until the next challenge; ticks on its own. */
export function DailyCountdown({ className = "" }: { className?: string }) {
  const clock = useClock();
  return <span className={`tabular-nums ${className}`}>{clock ? formatCountdown(clock.msLeft) : "--:--:--"}</span>;
}

/** Native share sheet, else copy. Returns "copy" when the link was copied (show a toast). */
export async function shareDailyResult(
  state: Pick<DailyState, "challenge" | "game">,
  score: number,
  lang: Lang,
  d: Dict,
): Promise<"native" | "copy" | null> {
  const url = `${window.location.origin}/daily`;
  const text = fmt(d.dailyShareText, {
    n: num(state.challenge.number, lang),
    emoji: state.game.emoji,
    game: t(state.game.title, lang),
    score: num(score, lang),
  });
  const base = { game: state.challenge.game, day: state.challenge.dateKey };
  const method = await shareOrCopy(text, url);
  if (method) {
    track("daily_share", { ...base, method });
    track("daily_challenge_share", { ...base, method, kind: "result" });
  }
  return method;
}

/**
 * "Challenge a friend": the existing /c/<token> link replays this exact daily
 * round with your score to beat. Falls back to /daily if no token fits.
 */
export async function shareDailyChallenge(
  state: Pick<DailyState, "challenge" | "game">,
  score: number,
  lang: Lang,
  d: Dict,
): Promise<"native" | "copy" | null> {
  const path = challengePath({ game: state.challenge.game, seed: state.challenge.seed, score }) ?? "/daily";
  const url = `${window.location.origin}${path}`;
  const text = fmt(d.dailyChallengeText, { score: num(score, lang), emoji: state.game.emoji, game: t(state.game.title, lang) });
  const method = await shareOrCopy(text, url);
  if (method) {
    track("daily_challenge_share", { game: state.challenge.game, day: state.challenge.dateKey, method, kind: "challenge" });
    track("challenge_shared", { game: state.challenge.game, method, score });
  }
  return method;
}

async function shareOrCopy(text: string, url: string): Promise<"native" | "copy" | null> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text, url });
      return "native";
    } catch {
      return null; // share sheet dismissed
    }
  }
  return (await copyText(`${text} ${url}`)) ? "copy" : null;
}
