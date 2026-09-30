// Don't Tap — pure, deterministic round plans and scoring (no DOM, no React).
//
// Rule for players: tap ONLY when the button is green AND says "TAP!".
// Each round waits an unpredictable time, may flash decoys (look-alike
// signals), then shows the real signal. Plans come from (seed, round, attempt),
// so a shared seed replays the same timings and decoys.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "dont-tap";
export const ROUNDS = 5;
/** After the real signal, give up waiting after this long. */
export const TOO_SLOW_MS = 1500;
/** Third false start in one round: the round is scored as this. */
export const PENALTY_MS = 1000;
export const MAX_FALSE_STARTS_PER_ROUND = 3;

/** Look-alike signals. Each breaks the rule in one way (colour or text). */
export type DecoyId = "maybe" | "green-dont" | "red-tap" | "tab" | "almost";

/** Decoys unlock as rounds get harder. */
const DECOYS_BY_ROUND: readonly (readonly DecoyId[])[] = [
  ["maybe"],
  ["maybe", "green-dont"],
  ["maybe", "green-dont", "red-tap"],
  ["green-dont", "red-tap", "tab", "almost"],
  ["green-dont", "red-tap", "tab", "almost"],
];
const DECOY_COUNT: readonly number[] = [0, 1, 1, 2, 2];

export type PlanEvent = { at: number; kind: "decoy"; decoy: DecoyId; ms: number } | { at: number; kind: "go" };

/** Timeline for one attempt at one round: ms offsets from the start of waiting. */
export function roundPlan(seed: number, round: number, attempt: number): PlanEvent[] {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}:${round}:${attempt}`));
  const r = Math.min(round, ROUNDS - 1);
  const wait = 1500 + rng() * (2300 + r * 250);
  const decoys = DECOY_COUNT[r]! + (r >= 3 && rng() < 0.5 ? 1 : 0);
  const pool = DECOYS_BY_ROUND[r]!;
  const events: PlanEvent[] = [];
  // Spread decoys through the wait; each is short and later ones are shorter.
  const slot = wait / (decoys + 1);
  for (let i = 0; i < decoys; i++) {
    const at = slot * (i + 0.55 + rng() * 0.3);
    const ms = Math.round((r >= 3 ? 220 : 320) + rng() * 140);
    events.push({ at: Math.round(at), kind: "decoy", decoy: pool[Math.floor(rng() * pool.length)]!, ms });
  }
  // The real signal never lands right on top of a decoy.
  const lastDecoyEnd = events.reduce((m, e) => (e.kind === "decoy" ? Math.max(m, e.at + e.ms) : m), 0);
  events.push({ at: Math.round(Math.max(wait, lastDecoyEnd + 650)), kind: "go" });
  return events;
}

export type RoundResult = { ms: number; falseStarts: number; slow: boolean; penalty: boolean };

export type Summary = { score: number; avg: number; best: number; falseStarts: number };

/** Points: up to 600 − ms per round (≥ 0), minus 150 per false start. */
export function summarize(rounds: readonly RoundResult[]): Summary {
  const times = rounds.map((r) => r.ms);
  const falseStarts = rounds.reduce((n, r) => n + r.falseStarts, 0);
  const raw = rounds.reduce((sum, r) => sum + Math.max(0, 600 - r.ms), 0) - falseStarts * 150;
  return {
    score: Math.max(0, Math.round(raw)),
    avg: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    best: times.length ? Math.round(Math.min(...times)) : 0,
    falseStarts,
  };
}

export type RankId = "lightning" | "bus-door" | "office-wifi" | "govt-office" | "still-waiting" | "signal-jumper";

/** Title from score and false starts (pure). Never rename ids. */
export function rankFor(score: number, falseStarts = 0): RankId {
  if (falseStarts >= 4) return "signal-jumper";
  if (score >= 1800) return "lightning";
  if (score >= 1550) return "bus-door";
  if (score >= 1250) return "office-wifi";
  if (score >= 700) return "govt-office";
  return "still-waiting";
}

/** Deterministic pick of a funny line. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
