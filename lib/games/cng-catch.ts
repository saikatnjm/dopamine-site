// CNG Catch — pure, deterministic game rules (no DOM, no React).
// Every round is derived from (seed, roundIndex), so the same seed replays
// the exact same traffic on every device. Never use Math.random() here.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "cng-catch";
export const DURATION_MS = 30_000;
export const MAX_MISSES = 3;
/** Pause between CNGs after a catch or miss. */
export const PAUSE_MS = 450;

/** CNG centre travels from START_X to END_X (fractions of stage width). */
const START_X = -0.12;
const END_X = 1.12;
const TRAVEL = END_X - START_X;

export type Round = {
  /** 1 = left → right, -1 = right → left. */
  dir: 1 | -1;
  /** Stop zone centre and half-width, as fractions of stage width. */
  zoneCenter: number;
  zoneHalf: number;
  /** Time to cross the whole stage at full speed. */
  passMs: number;
  /** Optional "driver thinks about stopping" slow-down (progress 0–1 where it starts). */
  brakeAt: number | null;
  brakeMs: number;
};

/** Deterministic round `index` for `seed`. Difficulty ramps with index. */
export function makeRound(seed: number, index: number): Round {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}:${index}`));
  const jitter = 0.9 + rng() * 0.2;
  const passMs = Math.round(Math.max(750, 2300 * Math.pow(0.9, index)) * jitter);
  const zoneHalf = Math.max(0.05, 0.11 - index * 0.0045);
  const zoneCenter = 0.25 + rng() * 0.5;
  const dir: 1 | -1 = rng() < 0.5 ? 1 : -1;
  const brakes = index >= 4 && rng() < 0.35;
  return {
    dir,
    zoneCenter,
    zoneHalf,
    passMs,
    brakeAt: brakes ? 0.15 + rng() * 0.25 : null,
    brakeMs: brakes ? 250 + Math.round(rng() * 250) : 0,
  };
}

/**
 * CNG centre x (fraction of stage width) after `t` ms, or null once it has
 * left the stage. During a brake the CNG crawls at 25% speed.
 */
export function positionAt(round: Round, t: number): number | null {
  const v = TRAVEL / round.passMs; // fraction per ms
  let dist: number;
  if (round.brakeAt === null) {
    dist = v * t;
  } else {
    const tBrake = (round.brakeAt * TRAVEL) / v;
    if (t <= tBrake) dist = v * t;
    else if (t <= tBrake + round.brakeMs) dist = v * tBrake + v * 0.25 * (t - tBrake);
    else dist = v * tBrake + v * 0.25 * round.brakeMs + v * (t - tBrake - round.brakeMs);
  }
  if (dist > TRAVEL) return null;
  const x = START_X + dist;
  return round.dir === 1 ? x : 1 - x;
}

export type Grade = "perfect" | "good" | "ok" | "early" | "late" | "passed";

export function isHit(grade: Grade): boolean {
  return grade === "perfect" || grade === "good" || grade === "ok";
}

/** Grade a tap with the CNG at x. `offset` is 0 (dead centre) … 1 (zone edge). */
export function gradeTap(round: Round, x: number): { grade: Grade; offset: number } {
  const offset = Math.abs(x - round.zoneCenter) / round.zoneHalf;
  if (offset <= 0.3) return { grade: "perfect", offset };
  if (offset <= 0.65) return { grade: "good", offset };
  if (offset <= 1) return { grade: "ok", offset };
  const before = round.dir === 1 ? x < round.zoneCenter : x > round.zoneCenter;
  return { grade: before ? "early" : "late", offset };
}

/** Combo multiplier: x1, then +1 every 3 consecutive catches, max x5. */
export function multiplier(combo: number): number {
  return Math.min(5, 1 + Math.floor(combo / 3));
}

/** Points for a catch: 30–100 by accuracy, +20 for perfect, times multiplier. */
export function pointsFor(grade: Grade, offset: number, combo: number): number {
  if (!isHit(grade)) return 0;
  const base = 30 + Math.round(70 * (1 - Math.min(1, offset))) + (grade === "perfect" ? 20 : 0);
  return base * multiplier(combo);
}

export type Stats = {
  score: number;
  catches: number;
  perfects: number;
  maxCombo: number;
  misses: number;
  rounds: number;
};

export type RankId = "cng-magnet" | "pro-passenger" | "meter-believer" | "rickshaw-fallback" | "missed-again";

/** Result title is a pure function of score, so shared results are stable. */
export function rankFor(score: number): RankId {
  if (score >= 6000) return "cng-magnet";
  if (score >= 3500) return "pro-passenger";
  if (score >= 1800) return "meter-believer";
  if (score >= 600) return "rickshaw-fallback";
  return "missed-again";
}

// ---------------------------------------------------------------------------
// Share params: ?seed=<base36>&s=<score>
// ---------------------------------------------------------------------------

export function encodeSeed(seed: number): string {
  return (seed >>> 0).toString(36);
}

export function decodeSeed(value: unknown): number | null {
  if (typeof value !== "string" || !/^[0-9a-z]{1,7}$/.test(value)) return null;
  const n = parseInt(value, 36);
  return Number.isSafeInteger(n) && n >= 0 && n <= 0xffffffff ? n : null;
}

export function decodeScore(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d{1,6}$/.test(value)) return null;
  return Number(value);
}

/** Deterministic pick (e.g. which funny line to show) from a list. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  const i = hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length;
  return items[i] as T;
}
