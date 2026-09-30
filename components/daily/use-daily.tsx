"use client";

import { useSyncExternalStore } from "react";
import { getGame, type Game } from "@/data/games";
import { track } from "@/lib/analytics";
import {
  bdDateKey,
  dailyChallenge,
  formatCountdown,
  getPinnedKey,
  msUntilNextDay,
  nowSecond,
  parseDailyRecord,
  readDailyRaw,
  subscribeDaily,
  subscribePinned,
  subscribeSecond,
  type DailyChallenge,
  type DailyRecord,
} from "@/lib/daily";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";
import { copyText } from "@/lib/sharing";

export type DailyState = {
  challenge: DailyChallenge;
  game: Game;
  record: DailyRecord | null;
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
  if (key === null) return null;
  const challenge = dailyChallenge(key);
  const game = getGame(challenge.game);
  if (!game) return null;
  return { challenge, game, record: parseDailyRecord(raw) };
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
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text, url });
      track("daily_share", { ...base, method: "native" });
      return "native";
    } catch {
      return null; // share sheet dismissed
    }
  }
  if (await copyText(`${text} ${url}`)) {
    track("daily_share", { ...base, method: "copy" });
    return "copy";
  }
  return null;
}
