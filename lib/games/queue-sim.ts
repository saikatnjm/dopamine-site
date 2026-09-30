// Queue Simulator — pure, deterministic rules (no DOM/React).
//
// createQueue(seed) rolls the place, how many people are ahead of you, the
// number of open counters and the order of up to ROUNDS events. Each round:
// one event with 3 choices (fixed effects or seeded gambles), then the queue
// moves (people served depends on open counters). Reach the front before your
// patience runs out. Every random decision uses its own RNG from
// (seed, round, key), so the same seed + the same choices = the same story.
// Copy lives in data/games/queue-sim.ts under the same ids.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "queue-sim";
export const ROUNDS = 8;

export type PlaceId = "bank" | "bus-counter" | "bill-office" | "phone-launch" | "cinema";
export const PLACES: readonly PlaceId[] = ["bank", "bus-counter", "bill-office", "phone-launch", "cinema"];

export type EventId =
  | "one-item"
  | "cutter"
  | "friend-call"
  | "counter-closes"
  | "hold-place"
  | "queue-jumps"
  | "argument"
  | "new-counter"
  | "two-minutes";

/**
 * Effect of a choice. ahead = ± people in front of you, time = minutes,
 * patience = ± points (0–100), counters = ± open counters, detect = you caught
 * a line-cutter, wrong = you were in the wrong queue all along.
 */
export type Fx = { ahead?: number; time?: number; patience?: number; counters?: number; detect?: number; wrong?: boolean };
export type ChoiceRule = Fx | { chance: number; win: Fx; lose: Fx };

type EventRule = { weight: number; when?: (s: RunState) => boolean; choices: [ChoiceRule, ChoiceRule, ChoiceRule] };

export const EVENTS: Record<EventId, EventRule> = {
  "one-item": {
    weight: 3,
    choices: [
      { ahead: 1, time: 7, patience: -12 }, // let them in → 17 items
      { patience: -6 },
      { chance: 0.55, win: { detect: 1, patience: 6 }, lose: { ahead: 1, time: 7, patience: -16 } },
    ],
  },
  cutter: {
    weight: 3,
    choices: [
      { chance: 0.6, win: { detect: 1, patience: 4 }, lose: { ahead: 1, time: 3, patience: -15 } },
      { ahead: 1, patience: -10 },
      { chance: 0.8, win: { detect: 1, patience: 10 }, lose: { time: 4, patience: -8 } },
    ],
  },
  "friend-call": {
    weight: 2.5,
    choices: [
      { chance: 0.5, win: { detect: 1, patience: 2 }, lose: { ahead: 2, patience: -12 } },
      { ahead: 2, patience: -8 },
      { chance: 0.45, win: { ahead: -3, patience: 5 }, lose: { ahead: 3, patience: -12, time: 3 } },
    ],
  },
  "counter-closes": {
    weight: 2.5,
    when: (s) => s.counters >= 2,
    choices: [
      { counters: -1, time: 5, patience: -10 },
      { chance: 0.55, win: { counters: -1, ahead: -4, time: 2 }, lose: { counters: -1, ahead: 3, time: 4, patience: -10, wrong: true } },
      { chance: 0.4, win: { time: 4, patience: 5 }, lose: { counters: -1, time: 6, patience: -12 } },
    ],
  },
  "hold-place": {
    weight: 2,
    choices: [
      { ahead: 3, patience: -8 }, // they come back with three cousins
      { patience: -5 },
      { chance: 0.5, win: { ahead: -1, patience: 4 }, lose: { ahead: 1, patience: -15 } },
    ],
  },
  "queue-jumps": {
    weight: 2.5,
    choices: [
      { ahead: 1, patience: -6 },
      { ahead: -2, patience: 3 },
      { chance: 0.5, win: { ahead: -4, patience: 8 }, lose: { ahead: 1, patience: -12, time: 2 } },
    ],
  },
  argument: {
    weight: 2.5,
    choices: [
      { time: 8, patience: -10 },
      { chance: 0.5, win: { time: 2, patience: 8 }, lose: { time: 10, patience: -14 } },
      { time: 7, patience: 4 },
    ],
  },
  "new-counter": {
    weight: 2,
    when: (s) => s.counters <= 2,
    choices: [
      { chance: 0.55, win: { counters: 1, ahead: -6 }, lose: { counters: 1, ahead: 1, patience: -8 } },
      { counters: 1, ahead: -2 },
      { counters: 1, ahead: -1, patience: 4 },
    ],
  },
  "two-minutes": {
    weight: 2.5,
    choices: [
      { time: 11, patience: -8 },
      { time: 8, patience: -4 },
      { chance: 0.6, win: { time: 9, patience: 15 }, lose: { time: 9, ahead: 1, patience: 2 } },
    ],
  },
};

export type Queue = {
  seed: number;
  place: PlaceId;
  /** People ahead of you at the start. */
  start: number;
  counters: number;
  /** Event order (a pool; unavailable ones are skipped at play time). */
  order: EventId[];
};

export function createQueue(seed: number): Queue {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:queue`));
  const place = PLACES[Math.floor(rng() * PLACES.length)]!;
  const start = 12 + Math.floor(rng() * 7); // 12–18
  const counters = 1 + (rng() < 0.6 ? 1 : 0);
  // Weighted shuffle without repeats.
  const pool = (Object.keys(EVENTS) as EventId[]).map((id) => ({ id, w: EVENTS[id].weight }));
  const order: EventId[] = [];
  while (pool.length) {
    const pick = weightedPick(pool, (p) => p.w, rng)!;
    order.push(pick.id);
    pool.splice(pool.indexOf(pick), 1);
  }
  return { seed: seed >>> 0, place, start, counters, order };
}

// ---------------------------------------------------------------------------
// Run state
// ---------------------------------------------------------------------------

export type RunState = {
  round: number;
  ahead: number;
  time: number;
  patience: number;
  counters: number;
  /** People you outlasted (served or gone ahead of you). */
  outlasted: number;
  detected: number;
  wrong: boolean;
  /** Event ids already used, in order. */
  events: EventId[];
  choices: number[];
  won: (boolean | undefined)[];
  /** Last round: applied effect + people served after it. */
  last: { ahead: number; time: number; patience: number; served: number } | null;
  done: boolean;
};

export function startRun(q: Queue): RunState {
  const st: RunState = {
    round: 0,
    ahead: q.start,
    time: 0,
    patience: 80,
    counters: q.counters,
    outlasted: 0,
    detected: 0,
    wrong: false,
    events: [],
    choices: [],
    won: [],
    last: null,
    done: false,
  };
  st.events.push(nextEvent(q, st));
  return st;
}

/** Next event: first unused in the seeded order whose condition holds. */
function nextEvent(q: Queue, st: RunState): EventId {
  for (const id of q.order) {
    if (st.events.includes(id)) continue;
    const when = EVENTS[id].when;
    if (!when || when(st)) return id;
  }
  // Everything used: repeat the least disruptive one.
  return "argument";
}

export function currentEvent(st: RunState): EventId {
  return st.events[st.events.length - 1]!;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

export function resolve(q: Queue, st: RunState, choice: number): { fx: Fx; won?: boolean } {
  const rule = EVENTS[currentEvent(st)].choices[choice as 0 | 1 | 2];
  const rng = createRng(hashString(`${GAME_SLUG}:${q.seed}:${st.round}:${choice}`));
  if ("chance" in rule) {
    const won = rng() < rule.chance;
    return { fx: { ...(won ? rule.win : rule.lose) }, won };
  }
  return { fx: { ...rule } };
}

export function choose(q: Queue, st: RunState, choice: number): RunState {
  if (st.done || choice < 0 || choice > 2) return st;
  const { fx, won } = resolve(q, st, choice);
  const rng = createRng(hashString(`${GAME_SLUG}:${q.seed}:${st.round}:serve`));

  let ahead = Math.max(0, st.ahead + (fx.ahead ?? 0));
  const counters = Math.max(1, Math.min(3, st.counters + (fx.counters ?? 0)));
  // The queue moves: each open counter serves 1–2 people this round.
  let served = 0;
  for (let c = 0; c < counters; c++) served += 1 + Math.floor(rng() * 1.8);
  served = Math.min(ahead, served);
  ahead -= served;
  const gone = Math.max(0, -(fx.ahead ?? 0)); // people you got past thanks to your choice

  const time = st.time + Math.max(0, fx.time ?? 0) + 4 + Math.floor(rng() * 3);
  const patience = clamp(st.patience + (fx.patience ?? 0) - 4);
  const won_ = [...st.won];
  won_[st.round] = won;
  const round = st.round + 1;
  const done = ahead === 0 || patience === 0 || round >= ROUNDS;
  const next: RunState = {
    round,
    ahead,
    time,
    patience,
    counters,
    outlasted: st.outlasted + served + gone,
    detected: st.detected + (fx.detect ?? 0),
    wrong: st.wrong || fx.wrong === true,
    events: [...st.events],
    choices: [...st.choices, choice],
    won: won_,
    last: { ahead: fx.ahead ?? 0, time: time - st.time, patience: patience - st.patience, served },
    done,
  };
  if (!done) next.events.push(nextEvent(q, next));
  return next;
}

// ---------------------------------------------------------------------------
// Endings, score, titles
// ---------------------------------------------------------------------------

export type EndingId = "front-legend" | "front" | "front-closed" | "wrong-queue" | "gave-up" | "still-waiting";
export const LEGENDARY_ENDINGS: readonly EndingId[] = ["front-legend"];
/** Counters "close for lunch" after this many minutes. */
export const CLOSING_MIN = 58;

export function endingOf(st: RunState): EndingId {
  if (st.patience === 0) return "gave-up";
  if (st.wrong && st.ahead === 0) return "wrong-queue";
  if (st.ahead > 0) return "still-waiting";
  if (st.time > CLOSING_MIN) return "front-closed";
  if (st.patience >= 55 && st.detected >= 2 && st.time <= 45) return "front-legend";
  return "front";
}

export function queueScore(q: Queue, st: RunState): number {
  const e = endingOf(st);
  const front = e === "front" || e === "front-legend";
  const s =
    200 +
    (front ? 900 : e === "front-closed" ? 400 : e === "wrong-queue" ? 250 : 0) +
    Math.max(0, 80 - st.time) * 8 +
    st.patience * 6 +
    st.outlasted * 12 +
    st.detected * 120 -
    st.ahead * 35 +
    (e === "front-legend" ? 500 : 0) +
    Math.round((q.start - 12) * 10); // longer starting queue is worth a bit more
  return Math.max(0, Math.round(s));
}

export type RankId = "queue-legend" | "cutter-detector" | "queue-veteran" | "queue-survivor" | "patience-destroyed";

/** Final title (pure function of the run). Never rename ids. */
export function rankOf(q: Queue, st: RunState): RankId {
  const e = endingOf(st);
  if (e === "gave-up") return "patience-destroyed";
  if (e === "front-legend") return "queue-legend";
  if (st.detected >= 2 && e !== "still-waiting") return "cutter-detector";
  if (queueScore(q, st) >= 1900) return "queue-veteran";
  return e === "still-waiting" ? "patience-destroyed" : "queue-survivor";
}
