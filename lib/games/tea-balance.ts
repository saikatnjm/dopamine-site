// Tea Balance — pure, deterministic physics (no DOM, no React).
//
// You push a cha cart up a Dhaka road (top-down), carrying one very full cup.
// The tea surface sloshes like a damped spring: cart acceleration and road
// hazards set it swinging; past SPILL_ANGLE it spills. Steer around potholes
// and manholes — but every jerky move sloshes too. Survive DELIVER_MS to
// deliver the tea. Fixed STEP_MS steps + seeded RNG ⇒ the same seed always
// produces the same road. Player input never touches the RNG.
//
// Units: x ∈ [0, 1] across the road; y ∈ [0, 1] top → bottom; angle in radians.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "tea-balance";
export const STEP_MS = 1000 / 60;
const DT = STEP_MS / 1000;

export const DELIVER_MS = 60_000;
export const SPILL_ANGLE = 0.35;
export const CART = { y: 0.82, w: 0.15, h: 0.1 } as const;
const X_MIN = 0.09;
const X_MAX = 0.91;
/** Cart follows the target on a soft, critically damped spring. */
const CART_K = 140;
const CART_C = 2 * Math.sqrt(CART_K);
/** Slosh: natural frequency², sensitivity to cart acceleration. */
const W2 = 30;
const SLOSH_K = 0.25;
/** Hazard kick multiplier (tuning). */
const KICKMUL = 1.9;
/** Keyboard/button speed (road widths per second). */
export const KEY_SPEED = 0.9;

export type HazardKind = "pothole" | "manhole" | "puddle" | "breaker" | "goat";
export type EventId = "wind" | "wasa" | "sip" | "horn";
const SPECIALS: readonly EventId[] = ["wind", "wasa", "sip", "horn"];

const HAZARD: Record<HazardKind, { w: number; h: number; kick: number }> = {
  pothole: { w: 0.16, h: 0.06, kick: 2.2 },
  manhole: { w: 0.14, h: 0.07, kick: 3.4 },
  puddle: { w: 0.22, h: 0.06, kick: 1.1 },
  breaker: { w: 1, h: 0.035, kick: 0.9 }, // full width: can't dodge, only stay calm
  goat: { w: 0.1, h: 0.07, kick: 2.6 },
};

export type Hazard = {
  id: number;
  kind: HazardKind;
  x: number; // centre
  y: number; // top
  w: number;
  h: number;
  vx: number; // goats wander
  hit: boolean;
};

export type Sim = {
  seed: number;
  rng: () => number;
  t: number;
  dist: number;
  x: number;
  v: number;
  a: number;
  target: number;
  angle: number;
  spin: number;
  tea: number;
  hazards: Hazard[];
  nextId: number;
  nextSpawnAt: number;
  nextSpecialAt: number;
  windUntil: number;
  windDir: number;
  lastEvent: EventId | null;
  lastBreakerAt: number;
  hits: number;
  over: boolean;
  delivered: boolean;
};

export type StepResult = {
  spawned: Hazard[];
  removed: number[];
  hit: Hazard | null;
  event: EventId | null;
  spill: number;
  over: boolean;
};

export function createSim(seed: number): Sim {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}`));
  return {
    seed,
    rng,
    t: 0,
    dist: 0,
    x: 0.5,
    v: 0,
    a: 0,
    target: 0.5,
    angle: 0,
    spin: 0,
    tea: 100,
    hazards: [],
    nextId: 1,
    nextSpawnAt: 1.2,
    nextSpecialAt: 8000 + rng() * 3000,
    windUntil: 0,
    windDir: 1,
    lastEvent: null,
    lastBreakerAt: 0,
    hits: 0,
    over: false,
    delivered: false,
  };
}

/** Road speed in road-heights per second. */
export function speedAt(ms: number): number {
  return Math.min(1.2, 0.45 + (ms / 1000) * 0.014);
}
/** Tea gets wobblier over time (less damping). */
function dampingAt(ms: number): number {
  return Math.max(1.4, 2.6 - (ms / 1000) * 0.022);
}
function difficulty(ms: number): number {
  return Math.min(1, ms / 50_000);
}

export function setTarget(sim: Sim, x: number): void {
  sim.target = Math.max(X_MIN, Math.min(X_MAX, x));
}

/** Keyboard / button movement for one step. dir ∈ {-1, 0, 1}. */
export function nudge(sim: Sim, dir: number): void {
  if (dir !== 0) setTarget(sim, sim.target + dir * KEY_SPEED * DT);
}

function spawn(sim: Sim): Hazard[] {
  const rng = sim.rng;
  const d = difficulty(sim.t);
  const roll = rng();
  const breakerOk = sim.t - sim.lastBreakerAt > 7000;
  const kind: HazardKind =
    breakerOk && roll < 0.05 + 0.04 * d ? "breaker" : roll < 0.12 + 0.1 * d ? "manhole" : roll < 0.22 + 0.1 * d ? "goat" : roll < 0.37 ? "puddle" : "pothole";
  const size = HAZARD[kind];
  const out: Hazard[] = [];
  const make = (x: number): Hazard => ({
    id: sim.nextId++,
    kind,
    x,
    y: -size.h,
    w: size.w,
    h: size.h,
    vx: kind === "goat" ? (rng() < 0.5 ? -1 : 1) * (0.08 + 0.08 * rng()) : 0,
    hit: false,
  });
  if (kind === "breaker") {
    sim.lastBreakerAt = sim.t;
    out.push(make(0.5));
  } else {
    out.push(make(0.12 + rng() * 0.76));
    // Later on, sometimes a pair — always leaving a gap to squeeze through.
    if (d > 0.35 && rng() < 0.35 * d) {
      const first = out[0]!.x;
      const other = first < 0.5 ? first + 0.38 + rng() * 0.12 : first - 0.38 - rng() * 0.12;
      out.push(make(Math.max(0.1, Math.min(0.9, other))));
    }
  }
  // Next spawn after a travel gap (in road-heights), shrinking with difficulty.
  sim.nextSpawnAt = sim.dist + (0.68 - 0.2 * d) * (0.8 + 0.4 * rng());
  return out;
}

export function step(sim: Sim): StepResult {
  const res: StepResult = { spawned: [], removed: [], hit: null, event: null, spill: 0, over: false };
  if (sim.over) return res;
  sim.t += STEP_MS;
  const v = speedAt(sim.t);
  const dy = v * DT;
  sim.dist += dy;

  if (sim.dist >= sim.nextSpawnAt) {
    res.spawned = spawn(sim);
    sim.hazards.push(...res.spawned);
  }

  if (sim.t >= sim.nextSpecialAt) {
    let id: EventId;
    do id = SPECIALS[Math.floor(sim.rng() * SPECIALS.length)]!;
    while (id === sim.lastEvent);
    sim.lastEvent = id;
    res.event = id;
    if (id === "wind") {
      sim.windUntil = sim.t + 2500;
      sim.windDir = sim.rng() < 0.5 ? -1 : 1;
    } else if (id === "wasa") {
      sim.nextSpawnAt = sim.dist + 0.05; // road dug up: hazards come thick and fast
    } else if (id === "sip") {
      sim.tea = Math.max(0, sim.tea - 7);
    } else {
      sim.spin += (sim.rng() < 0.5 ? -1 : 1) * 1.2; // bus horn: you flinch
    }
    sim.nextSpecialAt = sim.t + 9000 + sim.rng() * 3000;
  }

  // Cart.
  const prevV = sim.v;
  sim.v += (CART_K * (sim.target - sim.x) - CART_C * sim.v) * DT;
  sim.x = Math.max(X_MIN, Math.min(X_MAX, sim.x + sim.v * DT));
  sim.a = (sim.v - prevV) / DT;

  // Hazards.
  const cTop = CART.y;
  const cBot = CART.y + CART.h;
  const kept: Hazard[] = [];
  for (const hz of sim.hazards) {
    hz.y += dy;
    if (hz.vx !== 0) {
      hz.x += hz.vx * DT;
      if (hz.x < 0.08 || hz.x > 0.92) hz.vx = -hz.vx;
    }
    if (!hz.hit && hz.y + hz.h > cTop && hz.y < cBot && Math.abs(hz.x - sim.x) < (hz.w + CART.w) / 2 - 0.015) {
      hz.hit = true;
      sim.hits += 1;
      const power = HAZARD[hz.kind].kick * KICKMUL * (1 + difficulty(sim.t) * 0.35) * (0.85 + 0.3 * sim.rng());
      sim.spin += (sim.rng() < 0.5 ? -1 : 1) * power;
      res.hit = hz;
    }
    if (hz.y > 1) res.removed.push(hz.id);
    else kept.push(hz);
  }
  sim.hazards = kept;

  // Slosh: damped spring driven by cart acceleration, wind and kicks.
  const wind = sim.t < sim.windUntil ? sim.windDir * 3.5 : 0;
  const acc = -W2 * sim.angle - dampingAt(sim.t) * sim.spin - SLOSH_K * sim.a + wind;
  sim.spin += acc * DT;
  sim.angle += sim.spin * DT;

  const over = Math.abs(sim.angle) - SPILL_ANGLE;
  if (over > 0) {
    const lost = Math.min(sim.tea, over * 140 * DT);
    sim.tea -= lost;
    res.spill = lost;
  }

  if (sim.tea <= 0.5) {
    sim.tea = 0;
    sim.over = true;
    res.over = true;
  } else if (sim.t >= DELIVER_MS) {
    sim.delivered = true;
    sim.over = true;
    res.over = true;
  }
  return res;
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** 10 per second survived; delivering adds 5 per % of tea left. */
export function score(sim: Sim): number {
  return Math.floor(sim.t / 100) + (sim.delivered ? Math.round(sim.tea * 5) : 0);
}

export type RankId = "ustad" | "steady-hands" | "tea-runner" | "half-cup" | "instant-spill";

/** Title from score (pure, stable for shares). Never rename ids. */
export function rankFor(points: number): RankId {
  if (points >= 900) return "ustad";
  if (points >= 700) return "steady-hands";
  if (points >= 400) return "tea-runner";
  if (points >= 200) return "half-cup";
  return "instant-spill";
}

/** Deterministic pick of a funny line. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
