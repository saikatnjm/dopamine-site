// Lightweight "recently finished" history for recommendations.
// localStorage["hottogol:recent:v1"] = [{ key, at }] newest first, max 20.
// Keys are activity keys from lib/activities.ts ("g:cng-catch", "x:…", "p:…").
// Filled from events already sent through track() (see RecentPlaysRecorder),
// so games need no extra wiring. Blocked/corrupt storage never throws.

import type { AnalyticsEvent, AnalyticsParams } from "@/lib/analytics";

const STORAGE_KEY = "hottogol:recent:v1";
const MAX = 20;
const KEY_RE = /^[gxp]:[a-z0-9-]{1,40}$/;

export type RecentPlay = { key: string; at: number };

/** Activity key for a completion event, or null if the event isn't one. */
export function activityKeyForEvent(event: AnalyticsEvent, params: AnalyticsParams): string | null {
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  let key: string | null = null;
  if (event === "game_complete") key = str(params.game) && `g:${params.game}`;
  else if (event === "experience_complete") key = str(params.experience) && `x:${params.experience}`;
  else if (event === "quiz_complete") key = str(params.quiz) && `p:${params.quiz}`;
  else if (event === "excuse_generate") key = "p:excuses";
  return key && KEY_RE.test(key) ? key : null;
}

export function parseRecent(raw: string | null): RecentPlay[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((r): r is RecentPlay => typeof r?.key === "string" && KEY_RE.test(r.key) && Number.isFinite(r?.at))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function readRecent(): RecentPlay[] {
  try {
    return parseRecent(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function recordPlay(key: string, now = Date.now()): void {
  if (!KEY_RE.test(key)) return;
  const next = [{ key, at: now }, ...readRecent().filter((r) => r.key !== key)].slice(0, MAX);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // history is a nice-to-have
  }
}
