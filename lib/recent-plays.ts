// Lightweight local play history — powers "Continue playing" (homepage) and
// "LIKED THAT?" (result screens).
//
// localStorage["hottogol:recent:v2"] = [{ key, at, done, score? }] newest
// first, at most 5, entries older than 14 days dropped. `key` is an activity
// key from lib/activities.ts ("g:cng-catch", "x:…", "p:…"); `done` = finished
// (vs only started); `score` = the latest score when the game reports one.
// Nothing personal is stored. Filled from events already sent through
// track() (RecentPlaysRecorder), so games need no wiring. Blocked, private or
// corrupt storage never throws — it just reads as empty.

import type { AnalyticsEvent, AnalyticsParams } from "@/lib/analytics";

const STORAGE_KEY = "hottogol:recent:v2";
const LEGACY_KEY = "hottogol:recent:v1";
const DISMISS_KEY = "hottogol:continue:dismissed";

export const MAX_RECENT = 5;
export const STALE_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_SCORE = 10_000_000;
const KEY_RE = /^[gxp]:[a-z0-9-]{1,40}$/;

export type RecentPlay = { key: string; at: number; done: boolean; score?: number };
export type PlayEvent = { key: string; done: boolean; score?: number };

/** Activities whose start is reported as a game event but aren't games. */
const NOT_GAMES: Record<string, string> = { "dhaka-person": "p:dhaka-person" };

const str = (v: unknown) => (typeof v === "string" ? v : null);
const gameKey = (slug: string) => NOT_GAMES[slug] ?? `g:${slug}`;

/** Start/finish of an activity from an analytics event, or null. */
export function playEventFor(event: AnalyticsEvent, params: AnalyticsParams): PlayEvent | null {
  let ev: PlayEvent | null = null;
  const game = str(params.game);
  const exp = str(params.experience);
  if ((event === "game_start" || event === "game_retry") && game) ev = { key: gameKey(game), done: false };
  else if (event === "game_complete" && game) {
    const s = params.score;
    const score = typeof s === "number" && Number.isInteger(s) && s >= 0 && s <= MAX_SCORE ? s : undefined;
    ev = { key: gameKey(game), done: true, score };
  } else if (event === "experience_start" && exp) ev = { key: `x:${exp}`, done: false };
  else if (event === "experience_complete" && exp) ev = { key: `x:${exp}`, done: true };
  else if (event === "quiz_complete" && str(params.quiz)) ev = { key: `p:${params.quiz}`, done: true };
  else if (event === "excuse_generate") ev = { key: "p:excuses", done: true };
  return ev && KEY_RE.test(ev.key) ? ev : null;
}

function clean(list: unknown, now: number): RecentPlay[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: RecentPlay[] = [];
  for (const r of list as unknown[]) {
    if (typeof r !== "object" || r === null) continue;
    const { key, at, done, score } = r as Record<string, unknown>;
    if (typeof key !== "string" || !KEY_RE.test(key) || seen.has(key)) continue;
    if (typeof at !== "number" || !Number.isFinite(at) || at < now - STALE_MS || at > now + 60_000) continue;
    seen.add(key);
    out.push({
      key,
      at,
      done: done !== false, // v1 entries were completions
      ...(typeof score === "number" && Number.isInteger(score) && score >= 0 && score <= MAX_SCORE ? { score } : {}),
    });
  }
  return out.sort((a, b) => b.at - a.at).slice(0, MAX_RECENT);
}

/** Parse a stored value (v2 or legacy v1). Never throws. */
export function parseRecent(raw: string | null, now = Date.now()): RecentPlay[] {
  if (!raw) return [];
  try {
    return clean(JSON.parse(raw), now);
  } catch {
    return [];
  }
}

function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // history is a nice-to-have (private mode, quota, disabled storage)
  }
}

/** Raw stored history (v2, else legacy v1) — a stable snapshot for useSyncExternalStore. */
export function recentSnapshot(): string {
  return getItem(STORAGE_KEY) ?? getItem(LEGACY_KEY) ?? "";
}

export function readRecent(now = Date.now()): RecentPlay[] {
  return parseRecent(recentSnapshot(), now);
}

const listeners = new Set<() => void>();
export function subscribeRecent(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const notify = () => listeners.forEach((l) => l());

export function recordPlay(ev: PlayEvent, now = Date.now()): void {
  if (!KEY_RE.test(ev.key)) return;
  const prev = readRecent(now);
  const old = prev.find((r) => r.key === ev.key);
  const score = ev.score ?? old?.score;
  const entry: RecentPlay = { key: ev.key, at: now, done: ev.done, ...(score !== undefined ? { score } : {}) };
  setItem(STORAGE_KEY, JSON.stringify([entry, ...prev.filter((r) => r.key !== ev.key)].slice(0, MAX_RECENT)));
  notify();
}

/** "Continue playing" dismissal: hidden until something newer is played. */
export function dismissedSnapshot(): string {
  return getItem(DISMISS_KEY) ?? "";
}

export function dismissContinue(now = Date.now()): void {
  setItem(DISMISS_KEY, String(now));
  notify();
}
