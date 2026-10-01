// Daily Hottogol — one identical challenge per Bangladesh calendar day.
//
// Everything is derived client-side from the date: same date ⇒ same game and
// same seed for everyone. No server, no clock sync — we trust the device clock.
// Bangladesh is UTC+6 all year (no DST since 2009), so a fixed offset is exact
// and independent of the viewer's own timezone.
//
// To add a game: support the `daily` prop in its component (see DailyMode in
// lib/games/shared.ts), then append its slug to DAILY_ROTATION.
// Future challenge types (a daily quiz, simulator…): add the type to
// DailyChallengeType, give its entries `type`, and register a player for it
// in components/daily/daily-play.tsx. Records/best/streak are type-agnostic.

import { hashString } from "@/lib/random";

export const BD_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Daily #1 = this Bangladesh date. */
const EPOCH_KEY = "2026-09-30";

/** Games that can be the daily challenge, in rotation order. Append only. */
export const DAILY_ROTATION = ["cng-catch", "traffic-dodge"] as const;
export type DailyGameSlug = (typeof DAILY_ROTATION)[number];

/** Kinds of daily challenge. Only reflex games today. */
export type DailyChallengeType = "game";

export type DailyChallenge = {
  type: DailyChallengeType;
  /** Bangladesh date, YYYY-MM-DD. */
  dateKey: string;
  /** Challenge number (#1 on EPOCH_KEY). */
  number: number;
  game: DailyGameSlug;
  seed: number;
};

/** Bangladesh calendar date for an instant, as YYYY-MM-DD. */
export function bdDateKey(nowMs: number): string {
  return new Date(nowMs + BD_OFFSET_MS).toISOString().slice(0, 10);
}

/** Milliseconds until the next Bangladesh midnight. */
export function msUntilNextDay(nowMs: number): number {
  const bd = nowMs + BD_OFFSET_MS;
  return DAY_MS - (((bd % DAY_MS) + DAY_MS) % DAY_MS);
}

/** The Bangladesh date before `dateKey` (YYYY-MM-DD). */
export function prevDateKey(dateKey: string): string {
  return new Date(Date.parse(`${dateKey}T00:00:00Z`) - DAY_MS).toISOString().slice(0, 10);
}

function dayIndex(dateKey: string): number {
  return Math.round((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${EPOCH_KEY}T00:00:00Z`)) / DAY_MS);
}

/** The challenge for a Bangladesh date. Pure: same key ⇒ same challenge. */
export function dailyChallenge(dateKey: string): DailyChallenge {
  const index = dayIndex(dateKey);
  const len = DAILY_ROTATION.length;
  return {
    type: "game",
    dateKey,
    number: index + 1,
    game: DAILY_ROTATION[((index % len) + len) % len]!,
    seed: hashString(`hottogol:daily:${dateKey}`),
  };
}

/** "05:07:09" countdown text. */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// ---------------------------------------------------------------------------
// Local record of today's attempt (this device only).
// ---------------------------------------------------------------------------

export type DailyRecord = {
  game: DailyGameSlug;
  /** First completed attempt — the "official" daily score. */
  first: number;
  best: number;
  attempts: number;
};

const recordKey = (dateKey: string) => `hottogol:daily:v1:${dateKey}`;
const listeners = new Set<() => void>();

export function subscribeDaily(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Raw stored JSON (a stable string for useSyncExternalStore), or null. */
export function readDailyRaw(dateKey: string): string | null {
  try {
    return window.localStorage.getItem(recordKey(dateKey));
  } catch {
    return null;
  }
}

export function parseDailyRecord(raw: string | null): DailyRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Partial<DailyRecord>;
    if (typeof r.first !== "number" || typeof r.best !== "number" || typeof r.attempts !== "number") return null;
    if (!DAILY_ROTATION.includes(r.game as DailyGameSlug)) return null;
    return r as DailyRecord;
  } catch {
    return null;
  }
}

/** Save a finished attempt. Returns the updated record. */
export function recordDailyResult(challenge: DailyChallenge, score: number): DailyRecord {
  const prev = parseDailyRecord(readDailyRaw(challenge.dateKey));
  const next: DailyRecord = prev
    ? { ...prev, best: Math.max(prev.best, score), attempts: prev.attempts + 1 }
    : { game: challenge.game, first: score, best: score, attempts: 1 };
  try {
    window.localStorage.setItem(recordKey(challenge.dateKey), JSON.stringify(next));
  } catch {
    // storage blocked: result still shows for this session
  }
  const bests = parseBests(readBestsRaw());
  if (score > (bests[challenge.game] ?? -1)) {
    try {
      window.localStorage.setItem(BESTS_KEY, JSON.stringify({ ...bests, [challenge.game]: score }));
    } catch {
      // personal best is a nice-to-have
    }
  }
  listeners.forEach((l) => l());
  return next;
}

// ---------------------------------------------------------------------------
// Personal best (all daily rounds, per game) and day streak — local only.
// ---------------------------------------------------------------------------

const BESTS_KEY = "hottogol:daily:best:v1";
const MAX_STREAK_SCAN = 366;

function readBestsRaw(): string | null {
  try {
    return window.localStorage.getItem(BESTS_KEY);
  } catch {
    return null;
  }
}

/** { [game]: best daily score } — corrupt/odd values are dropped. */
export function parseBests(raw: string | null): Partial<Record<DailyGameSlug, number>> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return {};
    const out: Partial<Record<DailyGameSlug, number>> = {};
    for (const slug of DAILY_ROTATION) {
      const v = (data as Record<string, unknown>)[slug];
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) out[slug] = Math.floor(v);
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Consecutive Bangladesh days with a finished daily, ending today (or
 * yesterday, if today isn't played yet — the streak is still alive).
 * `hasRecord` is injectable for tests.
 */
export function dailyStreak(todayKey: string, hasRecord: (dateKey: string) => boolean = (k) => parseDailyRecord(readDailyRaw(k)) !== null): number {
  let key = hasRecord(todayKey) ? todayKey : prevDateKey(todayKey);
  let n = 0;
  while (n < MAX_STREAK_SCAN && hasRecord(key)) {
    n += 1;
    key = prevDateKey(key);
  }
  return n;
}

/**
 * Stable snapshot "streak|bestsJSON" for useSyncExternalStore (re-read when
 * a result is recorded; see subscribeDaily).
 */
export function dailyStatsSnapshot(todayKey: string): string {
  return `${dailyStreak(todayKey)}|${readBestsRaw() ?? ""}`;
}

export function parseDailyStats(snapshot: string, game: DailyGameSlug): { streak: number; personalBest: number | null } {
  const bar = snapshot.indexOf("|");
  const streak = Number(snapshot.slice(0, bar)) || 0;
  const best = parseBests(snapshot.slice(bar + 1) || null)[game];
  return { streak, personalBest: best ?? null };
}

// ---------------------------------------------------------------------------
// Clock for React (useSyncExternalStore): ticks once per second.
// ---------------------------------------------------------------------------

export function subscribeSecond(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}

/** Current time rounded to the second (stable between ticks). */
export function nowSecond(): number {
  return Math.floor(Date.now() / 1000) * 1000;
}

// ---------------------------------------------------------------------------
// The date this page view is playing. Pinned on first read so a midnight
// rollover never swaps the game mid-run; repinDaily() moves to the new day.
// ---------------------------------------------------------------------------

let pinnedKey: string | null = null;
const pinListeners = new Set<() => void>();

export function subscribePinned(cb: () => void) {
  pinListeners.add(cb);
  return () => {
    pinListeners.delete(cb);
  };
}

export function getPinnedKey(): string {
  pinnedKey ??= bdDateKey(Date.now());
  return pinnedKey;
}

export function repinDaily(): void {
  pinnedKey = bdDateKey(Date.now());
  pinListeners.forEach((l) => l());
}
