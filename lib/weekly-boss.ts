// Weekly Boss — one special challenge per Bangladesh week, same for everyone.
//
// Pure date math, like lib/daily.ts: the week key (the Saturday that starts
// the Bangladesh week, UTC+6, no DST) picks the boss from BOSS_ROTATION and
// hashes to the seed. No server, no global leaderboard — records live in this
// browser only.
//
// Framework: a boss is an id in BOSS_ROTATION (append-only) + copy in
// data/bosses.ts + a component registered in components/boss/boss-games.tsx
// that implements BossGameProps (components/boss/types.ts). The shared shell
// (components/boss/boss-arena.tsx) handles intro, countdown, attempts,
// records, results, sharing and challenge links for every boss.

import { hashString } from "@/lib/random";
import { BD_OFFSET_MS } from "@/lib/daily";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
/** Weekly Boss #1 = the week starting on this Saturday (Bangladesh date). */
const EPOCH_WEEK = "2026-09-26";

/** Bosses in rotation order. Append only; never rename or reuse an id. */
export const BOSS_ROTATION = ["traffic-boss"] as const;
export type BossId = (typeof BOSS_ROTATION)[number];

export function isBossId(v: unknown): v is BossId {
  return typeof v === "string" && (BOSS_ROTATION as readonly string[]).includes(v);
}

export type WeeklyBoss = {
  /** Saturday that starts the week, YYYY-MM-DD (Bangladesh date). */
  weekKey: string;
  /** Boss number (#1 = EPOCH_WEEK). */
  number: number;
  boss: BossId;
  seed: number;
};

/** Bangladesh-local ms since epoch (so UTC date math gives BD dates). */
const bd = (nowMs: number) => nowMs + BD_OFFSET_MS;

/** The Saturday (BD date) starting the week that contains `nowMs`. 1970-01-03 was a Saturday. */
export function bdWeekKey(nowMs: number): string {
  const days = Math.floor(bd(nowMs) / DAY_MS);
  const saturday = days - ((((days - 2) % 7) + 7) % 7);
  return new Date(saturday * DAY_MS).toISOString().slice(0, 10);
}

/** Milliseconds until the next boss (next Saturday 00:00 Bangladesh time). */
export function msUntilNextBoss(nowMs: number): number {
  const start = Date.parse(`${bdWeekKey(nowMs)}T00:00:00Z`);
  return start + WEEK_MS - bd(nowMs);
}

/** The boss for a week. Pure: same key ⇒ same boss and seed. */
export function weeklyBoss(weekKey: string): WeeklyBoss {
  const index = Math.round((Date.parse(`${weekKey}T00:00:00Z`) - Date.parse(`${EPOCH_WEEK}T00:00:00Z`)) / WEEK_MS);
  const len = BOSS_ROTATION.length;
  return {
    weekKey,
    number: index + 1,
    boss: BOSS_ROTATION[((index % len) + len) % len]!,
    seed: hashString(`hottogol:boss:${weekKey}`),
  };
}

/** "2d 05:07:09" countdown text. */
export function formatBossCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}

// ---------------------------------------------------------------------------
// This device's record for a week: localStorage["hottogol:boss:v1:<weekKey>"]
// ---------------------------------------------------------------------------

export type BossRecord = {
  boss: BossId;
  /** Best score this week. */
  best: number;
  /** Runs started this week (the current one included). */
  attempts: number;
  /** Beat the boss at least once this week. */
  defeated: boolean;
};

const recordKey = (weekKey: string) => `hottogol:boss:v1:${weekKey}`;
const listeners = new Set<() => void>();

export function subscribeBoss(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Raw JSON (stable string for useSyncExternalStore), or null. */
export function readBossRaw(weekKey: string): string | null {
  try {
    return window.localStorage.getItem(recordKey(weekKey));
  } catch {
    return null;
  }
}

export function parseBossRecord(raw: string | null): BossRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Partial<BossRecord>;
    if (!isBossId(r.boss) || typeof r.best !== "number" || typeof r.attempts !== "number") return null;
    return { boss: r.boss, best: Math.max(0, Math.floor(r.best)), attempts: Math.max(0, Math.floor(r.attempts)), defeated: r.defeated === true };
  } catch {
    return null;
  }
}

function save(weekKey: string, rec: BossRecord) {
  try {
    window.localStorage.setItem(recordKey(weekKey), JSON.stringify(rec));
  } catch {
    // storage blocked: the run still shows for this session
  }
  listeners.forEach((l) => l());
}

/** A run is starting: bump attempts. Returns the attempt number. */
export function startBossAttempt(week: WeeklyBoss): number {
  const prev = parseBossRecord(readBossRaw(week.weekKey));
  const rec: BossRecord = prev ?? { boss: week.boss, best: 0, attempts: 0, defeated: false };
  rec.attempts += 1;
  save(week.weekKey, rec);
  return rec.attempts;
}

/** A run finished. Returns the updated record and whether it's a new weekly best. */
export function recordBossResult(week: WeeklyBoss, score: number, defeated: boolean): { record: BossRecord; newBest: boolean } {
  const prev = parseBossRecord(readBossRaw(week.weekKey)) ?? { boss: week.boss, best: 0, attempts: 1, defeated: false };
  const newBest = score > prev.best;
  const record: BossRecord = { ...prev, best: Math.max(prev.best, score), defeated: prev.defeated || defeated };
  save(week.weekKey, record);
  return { record, newBest };
}

// Pin the week for this page view so a Saturday-midnight rollover never swaps
// the boss mid-run (the page offers "load the new boss" instead).
let pinnedWeek: string | null = null;
const pinListeners = new Set<() => void>();
export function subscribePinnedWeek(cb: () => void) {
  pinListeners.add(cb);
  return () => {
    pinListeners.delete(cb);
  };
}
export function getPinnedWeek(): string {
  pinnedWeek ??= bdWeekKey(Date.now());
  return pinnedWeek;
}
export function repinWeek(): void {
  pinnedWeek = bdWeekKey(Date.now());
  pinListeners.forEach((l) => l());
}
