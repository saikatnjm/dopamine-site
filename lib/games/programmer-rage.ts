// Programmer Rage Simulator — pure, deterministic rules (no DOM/React).
// Purely fictional comedy: no real commands, nothing here touches a system.
//
// createIncident(seed) rolls a hidden root cause, the day (Friday is
// possible), the start time and which actions are offered each turn. Every
// action moves "debug progress" by how relevant it is to the hidden cause
// (checking logs reveals the cause and boosts relevant actions). After each
// action a seeded event may pile on a second problem — or everything
// suddenly works. "Deploy again" is a gamble that gets safer with progress.
// Every random decision uses an RNG from (seed, turn, key), so the same seed +
// the same choices = the same night. Never use Math.random() here.
// Copy lives in data/games/programmer-rage.ts under the same ids.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "programmer-rage";
export const TURNS = 8;
export const OFFERED = 4;

export type CauseId = "env-missing" | "port-in-use" | "container-loop" | "ssl" | "db-refused" | "typo";
export const CAUSES: readonly CauseId[] = ["env-missing", "port-in-use", "container-loop", "ssl", "db-refused", "typo"];

export type ActionId =
  | "check-logs"
  | "restart-server"
  | "restart-redis"
  | "check-dns"
  | "clear-cache"
  | "blame-frontend"
  | "blame-backend"
  | "ask-ai"
  | "deploy-again"
  | "works-on-my-machine"
  | "rollback";

/** Actions that can be offered (deploy-again is always there; rollback from turn 4). */
const POOL: readonly ActionId[] = [
  "check-logs",
  "restart-server",
  "restart-redis",
  "check-dns",
  "clear-cache",
  "blame-frontend",
  "blame-backend",
  "ask-ai",
  "works-on-my-machine",
];

/** Debug progress each action gives per hidden cause (before the reveal bonus). */
const RELEVANCE: Record<ActionId, Partial<Record<CauseId, number>> & { base: number }> = {
  "check-logs": { base: 18, typo: 30 },
  "restart-server": { base: 4, "port-in-use": 45, "container-loop": 25 },
  "restart-redis": { base: 0, "db-refused": 12 },
  "check-dns": { base: 0, ssl: 45, "db-refused": 18 },
  "clear-cache": { base: 4, typo: 8, ssl: 10 },
  "blame-frontend": { base: 0 },
  "blame-backend": { base: 0 },
  "ask-ai": { base: 18, "env-missing": 40, "container-loop": 30, "db-refused": 30, typo: 25 },
  "deploy-again": { base: 0 },
  "works-on-my-machine": { base: 0 },
  rollback: { base: 0 },
};

/** Minutes each action takes, and rage it adds (negative = therapeutic). */
const COST: Record<ActionId, { min: number; rage: number }> = {
  "check-logs": { min: 15, rage: 4 },
  "restart-server": { min: 10, rage: 3 },
  "restart-redis": { min: 8, rage: 5 },
  "check-dns": { min: 20, rage: 8 },
  "clear-cache": { min: 6, rage: 2 },
  "blame-frontend": { min: 5, rage: -12 },
  "blame-backend": { min: 5, rage: -12 },
  "ask-ai": { min: 8, rage: 2 },
  "deploy-again": { min: 12, rage: 0 },
  "works-on-my-machine": { min: 2, rage: -5 },
  rollback: { min: 10, rage: -8 },
};

export type Incident = {
  seed: number;
  cause: CauseId;
  friday: boolean;
  /** Minutes after midnight when you start (may exceed 24 h as the night goes on). */
  start: number;
  /** Seeded offer of 3 pool actions per turn (deploy-again is added). */
  offers: ActionId[][];
};

export function createIncident(seed: number): Incident {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:incident`));
  const cause = CAUSES[Math.floor(rng() * CAUSES.length)]!;
  const friday = rng() < 0.35;
  // Late afternoon push, or a late-night one (3 AM becomes reachable).
  const start = rng() < 0.55 ? 16 * 60 + 30 + Math.floor(rng() * 90) : 23 * 60 + 30 + Math.floor(rng() * 60);
  const offers: ActionId[][] = [];
  for (let turn = 0; turn < TURNS; turn++) {
    const r = createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:offer:${turn}`));
    const pool = POOL.filter((a) => a !== "works-on-my-machine" || turn >= 2);
    const picked: ActionId[] = [];
    // First turn always offers the logs, like a responsible engineer.
    if (turn === 0) picked.push("check-logs");
    while (picked.length < OFFERED - 1) {
      const a = pool[Math.floor(r() * pool.length)]!;
      if (!picked.includes(a)) picked.push(a);
    }
    if (turn >= 4) picked[picked.length - 1] = "rollback";
    offers.push([...picked, "deploy-again"]);
  }
  return { seed: seed >>> 0, cause, friday, start, offers };
}

// ---------------------------------------------------------------------------
// Run state
// ---------------------------------------------------------------------------

export type EventId = "env-missing" | "port-in-use" | "container-loop" | "ssl" | "db-refused" | "typo" | "suddenly-works";

export type EndingId = "success" | "legendary-3am" | "rollback" | "friday-disaster" | "works-on-my-machine" | "rage-quit";
export const LEGENDARY_ENDINGS: readonly EndingId[] = ["legendary-3am"];

export type RunState = {
  turn: number;
  progress: number;
  rage: number;
  minutes: number;
  coffees: number;
  revealed: boolean;
  failedDeploys: number;
  /** Relevant actions (progress > 0) — feeds "debugging skill". */
  relevant: number;
  actions: ActionId[];
  events: (EventId | null)[];
  /** Did a gamble succeed? (index = turn; undefined = no gamble) */
  won: (boolean | undefined)[];
  last: { gain: number; progress: number; rage: number; minutes: number; coffee: number } | null;
  ending: EndingId | null;
};

export function startRun(inc: Incident): RunState {
  return {
    turn: 0,
    progress: 0,
    rage: inc.friday ? 30 : 15,
    minutes: 0,
    coffees: 1,
    revealed: false,
    failedDeploys: 0,
    relevant: 0,
    actions: [],
    events: [],
    won: [],
    last: null,
    ending: null,
  };
}

export function offered(inc: Incident, st: RunState): ActionId[] {
  return inc.offers[Math.min(st.turn, TURNS - 1)]!;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

/** Clock time (minutes after midnight, 0–1439) at a point in the run. */
export function clockAt(inc: Incident, minutes: number): number {
  return (inc.start + minutes) % (24 * 60);
}
const is3am = (clock: number) => clock >= 2 * 60 + 30 && clock < 4 * 60 + 30;

export function act(inc: Incident, st: RunState, action: ActionId): RunState {
  if (st.ending || !offered(inc, st).includes(action)) return st;
  const rng = createRng(hashString(`${GAME_SLUG}:${inc.seed}:${st.turn}:${action}`));
  const cost = COST[action];
  let gain = 0;
  let rage = cost.rage + 5; // the night wears on
  let minutes = cost.min * 2 + Math.floor(rng() * 12);
  let revealed = st.revealed;
  let won: boolean | undefined;
  let failedDeploys = st.failedDeploys;
  let ending: EndingId | null = null;

  const rel = RELEVANCE[action];
  gain = rel[inc.cause] ?? rel.base;
  if (action === "check-logs") revealed = true;
  if (action === "ask-ai") {
    // Sometimes the AI is brilliant. Sometimes it confidently invents a flag.
    won = rng() < 0.62;
    if (!won) {
      gain = 0;
      rage += 10;
    }
  }
  if (revealed && st.revealed && gain > 0) gain = Math.round(gain * 1.5);

  if (action === "deploy-again") {
    const chance = st.progress >= 100 ? 1 : Math.max(0.04, st.progress / 160);
    won = rng() < chance;
    if (won) ending = "success";
    else {
      failedDeploys += 1;
      rage += 18;
    }
  }
  if (action === "rollback") ending = "rollback";
  if (action === "works-on-my-machine") ending = st.progress >= 100 ? "success" : "works-on-my-machine";

  let progress = clamp(st.progress + gain);
  // Coffee: one per turn, a second one when things are bad.
  const coffee = 1 + (st.rage + rage > 60 ? 1 : 0);
  rage -= coffee * 3;

  // Random event after the action (not when the run already ended).
  let event: EventId | null = null;
  if (!ending) {
    const e = createRng(hashString(`${GAME_SLUG}:${inc.seed}:event:${st.turn}`));
    const roll = e();
    if (roll < 0.07) {
      event = "suddenly-works";
      progress = 100;
    } else if (roll < 0.45) {
      const others = CAUSES.filter((c) => c !== inc.cause);
      event = others[Math.floor(e() * others.length)]!;
      progress = clamp(progress - 18);
      rage += 10;
      minutes += 12;
    }
  }

  const nextRage = clamp(st.rage + rage);
  const nextMinutes = st.minutes + minutes;
  const turn = st.turn + 1;
  if (!ending && nextRage >= 100) ending = inc.friday ? "friday-disaster" : "rage-quit";
  if (!ending && inc.friday && failedDeploys >= 2) ending = "friday-disaster";
  if (!ending && turn >= TURNS) ending = st.progress >= 100 || progress >= 100 ? "success" : inc.friday ? "friday-disaster" : "rollback";
  if (ending === "success" && is3am(clockAt(inc, nextMinutes))) ending = "legendary-3am";

  const events = [...st.events, event];
  const wonArr = [...st.won];
  wonArr[st.turn] = won;
  return {
    turn,
    progress,
    rage: nextRage,
    minutes: nextMinutes,
    coffees: st.coffees + coffee,
    revealed,
    failedDeploys,
    relevant: st.relevant + (gain > 0 ? 1 : 0),
    actions: [...st.actions, action],
    events,
    won: wonArr,
    last: { gain, progress: progress - st.progress, rage: nextRage - st.rage, minutes, coffee },
    ending,
  };
}

// ---------------------------------------------------------------------------
// Stats, score, rank
// ---------------------------------------------------------------------------

/** 0–100: how much of what you did actually helped (+ bonus for reading the logs). */
export function debuggingSkill(st: RunState): number {
  const useful = st.actions.filter((a) => a !== "deploy-again" && a !== "rollback").length;
  const ratio = useful ? st.relevant / useful : 0;
  return clamp(ratio * 80 + (st.revealed ? 15 : 0) + (st.ending === "success" || st.ending === "legendary-3am" ? 5 : 0));
}

export function rageScore(inc: Incident, st: RunState): number {
  const e = st.ending;
  const s =
    200 +
    (e === "success" ? 1100 : e === "legendary-3am" ? 1600 : e === "rollback" ? 450 : e === "works-on-my-machine" ? 250 : 0) +
    debuggingSkill(st) * 6 +
    Math.max(0, 240 - st.minutes) * 1.5 +
    (100 - st.rage) * 4 -
    st.failedDeploys * 60 +
    (inc.friday ? 150 : 0);
  return Math.max(0, Math.round(s));
}

export type RankId = "ten-x" | "senior-firefighter" | "stack-overflow-scholar" | "yaml-survivor" | "intern-with-prod-access";

/** Title from score (pure). Never rename ids. */
export function rankFor(points: number): RankId {
  if (points >= 2500) return "ten-x";
  if (points >= 1900) return "senior-firefighter";
  if (points >= 1300) return "stack-overflow-scholar";
  if (points >= 700) return "yaml-survivor";
  return "intern-with-prod-access";
}
