// Dhaka Traffic Dodge — pure, deterministic simulation (no DOM, no React).
//
// World: 4 lanes wide (x 0..4), WORLD_H tall (y grows downward). Traffic
// spawns above the top edge and moves down toward the player.
// The sim advances in fixed STEP_MS steps, and all randomness comes from
// RNG streams derived from the seed, so the same seed = the same traffic on
// every device. Player input never touches the RNG.
//
// Fairness: every row of traffic leaves a "safe lane" that is the same as, or
// next to, the previous row's safe lane, and rows are spaced so a lane change
// is always possible in time.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "traffic-dodge";
export const LANES = 4;
export const WORLD_H = 6;
export const STEP_MS = 1000 / 60;
const DT = STEP_MS / 1000;

export const PLAYER = { w: 0.5, h: 0.78, y: 4.95 } as const;
/** Lanes per second while switching lanes (~0.11 s per lane). */
const LANE_SPEED = 9;
/** Collision hitboxes are slightly smaller than the stickers (forgiving). */
const FORGIVE = 0.07;

export type ObstacleKind = "rickshaw" | "cng" | "car" | "bus" | "goat" | "cow" | "pothole";

const SIZES: Record<ObstacleKind, { w: number; h: number }> = {
  rickshaw: { w: 0.62, h: 0.9 },
  cng: { w: 0.66, h: 0.82 },
  car: { w: 0.74, h: 0.98 },
  bus: { w: 1.76, h: 1.7 }, // spans two lanes
  goat: { w: 0.52, h: 0.52 },
  cow: { w: 0.62, h: 0.72 },
  pothole: { w: 0.72, h: 0.46 },
};

export type Obstacle = {
  id: number;
  kind: ObstacleKind;
  /** Centre x and top y, world units. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** It was about to hit the player at some point. */
  threat: boolean;
  /** Already passed the player (near-miss evaluated). */
  passed: boolean;
};

export type EventId = "vip" | "goats" | "eid" | "rain" | "bus-race" | "rickshaw-jam";
const EVENTS: readonly EventId[] = ["vip", "goats", "eid", "rain", "bus-race", "rickshaw-jam"];

export type Sim = {
  seed: number;
  rowRng: () => number;
  eventRng: () => number;
  /** Elapsed game time (ms) and distance travelled (world units). */
  t: number;
  dist: number;
  v: number;
  topV: number;
  lane: number;
  x: number;
  obstacles: Obstacle[];
  nextId: number;
  nextRowAt: number;
  safeLane: number;
  // scoring
  nearPoints: number;
  nearMisses: number;
  combo: number;
  maxCombo: number;
  lastNearT: number;
  // events
  event: EventId | null;
  eventRows: number;
  rainUntil: number;
  nextEventAt: number;
  lastEvent: EventId | null;
  crashed: Obstacle | null;
};

export type StepResult = {
  spawned: Obstacle[];
  removed: number[];
  nearMiss: { points: number; combo: number; kind: ObstacleKind } | null;
  comboReset: boolean;
  event: EventId | null;
  rainEnded: boolean;
  crash: Obstacle | null;
};

export function createSim(seed: number): Sim {
  const eventRng = createRng(hashString(`${GAME_SLUG}:${seed}:events`));
  return {
    seed,
    rowRng: createRng(hashString(`${GAME_SLUG}:${seed}:rows`)),
    eventRng,
    t: 0,
    dist: 0,
    v: speedAt(0),
    topV: speedAt(0),
    lane: 1,
    x: 1.5,
    obstacles: [],
    nextId: 1,
    nextRowAt: 2.5, // a moment of calm road first
    safeLane: 1,
    nearPoints: 0,
    nearMisses: 0,
    combo: 0,
    maxCombo: 0,
    lastNearT: -Infinity,
    event: null,
    eventRows: 0,
    rainUntil: 0,
    nextEventAt: 7000 + Math.round(eventRng() * 2000),
    lastEvent: null,
    crashed: null,
  };
}

/** Road speed (world units / s) at elapsed ms. */
export function speedAt(ms: number): number {
  return Math.min(15, 5 + (ms / 1000) * 0.18);
}

/** Difficulty 0 → 1 over the first ~50 s. */
function difficulty(ms: number): number {
  return Math.min(1, ms / 50_000);
}

export function score(sim: Sim): number {
  return Math.floor(sim.dist * 3) + sim.nearPoints;
}

/** Combo multiplier for near-misses: x1, x2 at 2, x3 at 4 … max x5. */
export function multiplier(combo: number): number {
  return Math.min(5, 1 + Math.floor(combo / 2));
}

/** Queue a lane change (−1 left, +1 right). Ignored after a crash. */
export function move(sim: Sim, dir: -1 | 1): void {
  if (sim.crashed) return;
  sim.lane = Math.max(0, Math.min(LANES - 1, sim.lane + dir));
}

function pickWeighted<K extends string>(weights: readonly (readonly [K, number])[], rng: () => number): K {
  let total = 0;
  for (const [, w] of weights) total += w;
  let roll = rng() * total;
  for (const [k, w] of weights) {
    roll -= w;
    if (roll < 0) return k;
  }
  return weights[weights.length - 1]![0];
}

function spawnRow(sim: Sim): Obstacle[] {
  const rng = sim.rowRng;
  const d = difficulty(sim.t);
  const ev = sim.eventRows > 0 ? sim.event : null;

  // Safe lane random-walks by at most one lane (VIP convoys keep it fixed).
  if (ev !== "vip") {
    const step = Math.floor(rng() * 3) - 1;
    sim.safeLane = Math.max(0, Math.min(LANES - 1, sim.safeLane + step));
  }

  const open: number[] = [];
  for (let l = 0; l < LANES; l++) if (l !== sim.safeLane) open.push(l);
  const p = ev === "vip" ? 1 : 0.3 + 0.45 * d;
  let chosen = open.filter(() => rng() < p);
  if (chosen.length === 0) chosen = [open[Math.floor(rng() * open.length)]!];

  const weights: (readonly [ObstacleKind, number])[] =
    ev === "goats"
      ? [["goat", 3], ["cow", 2]]
      : ev === "bus-race"
        ? [["bus", 5], ["car", 1]]
        : ev === "rickshaw-jam"
          ? [["rickshaw", 5], ["cng", 1]]
          : [["rickshaw", 3], ["cng", 3], ["car", 3], ["bus", 1.2 + 1.8 * d], ["goat", 0.4], ["cow", 0.25], ["pothole", 0.4]];

  const row: Obstacle[] = [];
  for (let i = 0; i < chosen.length; i++) {
    const lane = chosen[i]!;
    let kind = pickWeighted(weights, rng);
    let lanes = 1;
    if (kind === "bus") {
      // A bus needs two adjacent chosen lanes; otherwise it's a car.
      if (chosen[i + 1] === lane + 1) {
        lanes = 2;
        i++;
      } else kind = "car";
    }
    const size = SIZES[kind];
    // Small deterministic wobble so lanes don't look like a grid.
    const wobble = lanes === 1 ? (rng() - 0.5) * 0.12 : 0;
    row.push({
      id: sim.nextId++,
      kind,
      x: lane + lanes / 2 + wobble,
      y: -size.h,
      w: size.w,
      h: size.h,
      threat: false,
      passed: false,
    });
  }
  if (ev) sim.eventRows -= 1;

  // Next row: after this row's longest vehicle, plus a reaction gap.
  const maxH = Math.max(...row.map((o) => o.h));
  const gapTime = (1.1 - 0.52 * d) * (0.85 + 0.3 * rng());
  sim.nextRowAt = sim.dist + maxH + sim.v * gapTime;
  return row;
}

function startEvent(sim: Sim): EventId {
  let id: EventId;
  do {
    id = EVENTS[Math.floor(sim.eventRng() * EVENTS.length)]!;
  } while (id === sim.lastEvent);
  sim.lastEvent = id;
  sim.event = id;
  sim.eventRows = id === "goats" ? 2 : id === "eid" || id === "rain" ? 0 : 3;
  if (id === "eid") sim.nextRowAt = Math.max(sim.nextRowAt, sim.dist + sim.v * 2.4); // empty roads!
  if (id === "rain") sim.rainUntil = sim.t + 6000;
  sim.nextEventAt = sim.t + 8500 + Math.round(sim.eventRng() * 2500);
  return id;
}

/** Advance one fixed step. */
export function step(sim: Sim): StepResult {
  const res: StepResult = { spawned: [], removed: [], nearMiss: null, comboReset: false, event: null, rainEnded: false, crash: null };
  if (sim.crashed) return res;

  sim.t += STEP_MS;
  const raining = sim.t < sim.rainUntil;
  if (!raining && sim.rainUntil > 0) {
    sim.rainUntil = 0;
    res.rainEnded = true;
  }
  sim.v = speedAt(sim.t) * (raining ? 1.12 : 1);
  sim.topV = Math.max(sim.topV, sim.v);
  const dy = sim.v * DT;
  sim.dist += dy;

  // Player slides toward its lane centre.
  const target = sim.lane + 0.5;
  const maxDx = LANE_SPEED * DT;
  sim.x += Math.max(-maxDx, Math.min(maxDx, target - sim.x));

  if (sim.t >= sim.nextEventAt) res.event = startEvent(sim);
  if (sim.dist >= sim.nextRowAt) {
    res.spawned = spawnRow(sim);
    sim.obstacles.push(...res.spawned);
  }

  if (sim.combo > 0 && sim.t - sim.lastNearT > 4000) {
    sim.combo = 0;
    res.comboReset = true;
  }

  const nearDist = Math.max(0.6, sim.v * 0.25);
  const pTop = PLAYER.y;
  const pBot = PLAYER.y + PLAYER.h;
  const kept: Obstacle[] = [];
  for (const o of sim.obstacles) {
    o.y += dy;
    const dxAbs = Math.abs(o.x - sim.x);
    const halfW = (o.w + PLAYER.w) / 2;

    // Crash: shrunken boxes overlap.
    if (dxAbs < halfW - FORGIVE && o.y + o.h > pTop + FORGIVE && o.y < pBot - FORGIVE) {
      sim.crashed = o;
      res.crash = o;
    }
    // Threat: in the player's path and about to arrive.
    if (!o.passed && dxAbs < halfW && o.y + o.h >= pTop - nearDist && o.y < pBot) o.threat = true;
    // Passed: evaluate near-miss once.
    if (!o.passed && o.y > pBot) {
      o.passed = true;
      if (o.threat && !sim.crashed) {
        sim.combo = sim.t - sim.lastNearT <= 4000 ? sim.combo + 1 : 1;
        sim.lastNearT = sim.t;
        sim.maxCombo = Math.max(sim.maxCombo, sim.combo);
        sim.nearMisses += 1;
        const points = 40 * multiplier(sim.combo);
        sim.nearPoints += points;
        res.nearMiss = { points, combo: sim.combo, kind: o.kind };
      }
    }
    if (o.y > WORLD_H) res.removed.push(o.id);
    else kept.push(o);
  }
  sim.obstacles = kept;
  return res;
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

export type RankId = "road-legend" | "traffic-ninja" | "lane-hopper" | "weekend-driver" | "crashed-early";

/** Title is a pure function of score, so shared results stay stable. Never rename ids. */
export function rankFor(points: number): RankId {
  if (points >= 3000) return "road-legend";
  if (points >= 1800) return "traffic-ninja";
  if (points >= 1000) return "lane-hopper";
  if (points >= 450) return "weekend-driver";
  return "crashed-early";
}

/** Speed shown to players, in pretend km/h. */
export function kmh(v: number): number {
  return Math.round(v * 4);
}

/** Deterministic pick of a funny line. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
