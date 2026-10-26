// This device's daily record for Guess the District (client-only helpers).
// localStorage["hottogol:guess-district:v1:<dateKey>"] = { first, best, attempts, grid }
// `first` is the official score and `grid` the first attempt's 🟩/🟥 line.
// Every read/write is guarded: blocked storage just means nothing is remembered.
// Kept free of the district map so the homepage card stays light.

import { hashString } from "@/lib/random";

export const GD_SLUG = "guess-district";
const GAME_SLUG = GD_SLUG;
/** Day #1 of the daily puzzle (Bangladesh date). */
export const EPOCH_KEY = "2026-10-26";
const DAY_MS = 24 * 60 * 60 * 1000;

export function dailySeed(dateKey: string): number {
  return hashString(`hottogol:${GAME_SLUG}:${dateKey}`);
}

/** #1 on EPOCH_KEY, +1 per Bangladesh day. */
export function dailyNumber(dateKey: string): number {
  return Math.round((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${EPOCH_KEY}T00:00:00Z`)) / DAY_MS) + 1;
}

export type GdRecord = { first: number; best: number; attempts: number; grid: string };

const key = (dateKey: string) => `hottogol:${GAME_SLUG}:v1:${dateKey}`;
const listeners = new Set<() => void>();

export function subscribeGd(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith(`hottogol:${GAME_SLUG}:v1:`)) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function readGdRaw(dateKey: string): string | null {
  try {
    return window.localStorage.getItem(key(dateKey));
  } catch {
    return null;
  }
}

export function parseGdRecord(raw: string | null): GdRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Partial<GdRecord>;
    const ok = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 10;
    if (!ok(r.first) || !ok(r.best) || typeof r.attempts !== "number" || typeof r.grid !== "string") return null;
    return { first: r.first!, best: r.best!, attempts: r.attempts, grid: r.grid };
  } catch {
    return null;
  }
}

/** Saves a finished daily round; the first attempt stays the official one. */
export function recordGd(dateKey: string, score: number, grid: string): GdRecord {
  const prev = parseGdRecord(readGdRaw(dateKey));
  const next: GdRecord = prev
    ? { ...prev, best: Math.max(prev.best, score), attempts: prev.attempts + 1 }
    : { first: score, best: score, attempts: 1, grid };
  try {
    window.localStorage.setItem(key(dateKey), JSON.stringify(next));
  } catch {
    // storage blocked
  }
  listeners.forEach((l) => l());
  return next;
}
