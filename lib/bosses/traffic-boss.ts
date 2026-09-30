// 👹 Dhaka Traffic Boss — pure, deterministic 60-second boss fight (no DOM).
//
// Inspired by Traffic Dodge but its own engine (Traffic Dodge is untouched):
// 5 lanes, the player rides a bike at the bottom, traffic comes down.
// You have 3 lives (a hit costs one + a short shield); survive 60 s to defeat
// the boss. Three phases ramp up the chaos. Extra mechanics:
//   - CNGs swerve one lane (they blink first — telegraphed)
//   - motorbikes come down faster than the road
//   - pedestrians cross sideways
//   - rain speeds everything up and makes lane changes slower
//   - sudden events: signal rush, zebra crossing, bike swarm, bus convoy
// Fixed STEP_MS steps + RNG streams from the seed: same seed = same fight.
// Player input never touches the RNG. Never use Math.random() here.

import { createRng, hashString } from "@/lib/random";

export const BOSS_ID = "traffic-boss";
export const LANES = 5;
export const WORLD_H = 7;
export const STEP_MS = 1000 / 60;
export const DURATION_MS = 60_000;
export const LIVES = 3;
const DT = STEP_MS / 1000;

export const PLAYER = { w: 0.5, h: 0.78, y: 6 } as const;
const LANE_SPEED = 9;
const LANE_SPEED_RAIN = 5.5;
const FORGIVE = 0.08;
const SHIELD_MS = 1300;

export type Kind = "car" | "bus" | "cng" | "rickshaw" | "bike" | "pedestrian";
const SIZES: Record<Kind, { w: number; h: number }> = {
  car: { w: 0.74, h: 0.98 },
  bus: { w: 1.76, h: 1.7 },
  cng: { w: 0.66, h: 0.82 },
  rickshaw: { w: 0.62, h: 0.9 },
  bike: { w: 0.42, h: 0.7 },
  pedestrian: { w: 0.4, h: 0.5 },
};

export type Obstacle = {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Extra downward speed on top of the road (bikes). */
  vy: number;
  /** Sideways speed (pedestrians). */
  vx: number;
  /** CNG swerve: target x once `y` passes `swerveAt`. */
  swerveAt: number | null;
  swerveTo: number | null;
  /** Telegraph: CNG blinking before it swerves. */
  blinking: boolean;
  threat: boolean;
  passed: boolean;
  hit: boolean;
};

export type EventId = "rain" | "signal-rush" | "zebra" | "bike-swarm" | "bus-convoy";
const EVENTS: readonly EventId[] = ["rain", "signal-rush", "zebra", "bike-swarm", "bus-convoy"];

export type Sim = {
  seed: number;
  rowRng: () => number;
  eventRng: () => number;
  t: number;
  dist: number;
  v: number;
  lane: number;
  x: number;
  lives: number;
  shieldUntil: number;
  obstacles: Obstacle[];
  nextId: number;
  nextRowAt: number;
  safeLane: number;
  nearPoints: number;
  nearMisses: number;
  combo: number;
  maxCombo: number;
  lastNearT: number;
  hits: number;
  event: EventId | null;
  eventRows: number;
  rainUntil: number;
  nextEventAt: number;
  lastEvent: EventId | null;
  phase: number;
  over: null | "defeated" | "survived";
  lastHit: Kind | null;
};

export type StepResult = {
  spawned: Obstacle[];
  removed: number[];
  nearMiss: { points: number; combo: number } | null;
  comboReset: boolean;
  event: EventId | null;
  rainEnded: boolean;
  hit: Obstacle | null;
  phase: number | null;
  over: Sim["over"];
};

export function createSim(seed: number): Sim {
  const eventRng = createRng(hashString(`${BOSS_ID}:${seed >>> 0}:events`));
  return {
    seed: seed >>> 0,
    rowRng: createRng(hashString(`${BOSS_ID}:${seed >>> 0}:rows`)),
    eventRng,
    t: 0,
    dist: 0,
    v: speedAt(0),
    lane: 2,
    x: 2.5,
    lives: LIVES,
    shieldUntil: 0,
    obstacles: [],
    nextId: 1,
    nextRowAt: 2.5,
    safeLane: 2,
    nearPoints: 0,
    nearMisses: 0,
    combo: 0,
    maxCombo: 0,
    lastNearT: -Infinity,
    hits: 0,
    event: null,
    eventRows: 0,
    rainUntil: 0,
    nextEventAt: 6000 + Math.round(eventRng() * 1500),
    lastEvent: null,
    phase: 1,
    over: null,
    lastHit: null,
  };
}

/** Phase 1 (0–20 s) → 2 (20–40 s) → 3 (40–60 s). */
export function phaseAt(ms: number): number {
  return ms < 20_000 ? 1 : ms < 40_000 ? 2 : 3;
}

export function speedAt(ms: number): number {
  return 5.5 + (ms / 1000) * 0.12 + (phaseAt(ms) - 1) * 0.8;
}

function difficulty(ms: number): number {
  return Math.min(1, ms / DURATION_MS);
}

/** Boss HP 100 → 0 as the clock runs out (what the player is "damaging"). */
export function bossHp(sim: Pick<Sim, "t">): number {
  return Math.max(0, Math.round(100 - (sim.t / DURATION_MS) * 100));
}

export function multiplier(combo: number): number {
  return Math.min(5, 1 + Math.floor(combo / 2));
}

export function score(sim: Sim): number {
  const survived = Math.floor(Math.min(sim.t, DURATION_MS) / 1000) * 25;
  const bonus = sim.over === "survived" ? 1000 + sim.lives * 300 : 0;
  return survived + sim.nearPoints + bonus;
}

export function move(sim: Sim, dir: -1 | 1): void {
  if (sim.over) return;
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

function make(sim: Sim, kind: Kind, x: number): Obstacle {
  const s = SIZES[kind];
  return { id: sim.nextId++, kind, x, y: -s.h, w: s.w, h: s.h, vy: 0, vx: 0, swerveAt: null, swerveTo: null, blinking: false, threat: false, passed: false, hit: false };
}

function spawnRow(sim: Sim): Obstacle[] {
  const rng = sim.rowRng;
  const d = difficulty(sim.t);
  const ph = sim.phase;
  const ev = sim.eventRows > 0 ? sim.event : null;

  const step = Math.floor(rng() * 3) - 1;
  sim.safeLane = Math.max(0, Math.min(LANES - 1, sim.safeLane + step));
  const open: number[] = [];
  for (let l = 0; l < LANES; l++) if (l !== sim.safeLane) open.push(l);

  const row: Obstacle[] = [];
  if (ev === "zebra") {
    // A line of pedestrians walking across — one gap in the safe lane.
    const dir = rng() < 0.5 ? 1 : -1;
    for (const lane of open) {
      if (rng() < 0.55) continue;
      const o = make(sim, "pedestrian", lane + 0.5);
      o.vx = dir * (0.22 + rng() * 0.15);
      row.push(o);
    }
  } else {
    const p = ev === "signal-rush" ? 0.9 : 0.22 + 0.26 * d + (ph - 1) * 0.06;
    let chosen = open.filter(() => rng() < p);
    if (chosen.length === 0) chosen = [open[Math.floor(rng() * open.length)]!];
    const weights: (readonly [Kind, number])[] =
      ev === "bike-swarm"
        ? [["bike", 5], ["cng", 1]]
        : ev === "bus-convoy"
          ? [["bus", 5], ["car", 1]]
          : [
              ["car", 3],
              ["cng", 2.5 + ph * 0.5],
              ["rickshaw", 2.5],
              ["bus", 0.8 + 1.4 * d],
              ["bike", 0.6 + ph * 0.6],
              ["pedestrian", 0.3 + ph * 0.3],
            ];
    for (let i = 0; i < chosen.length; i++) {
      const lane = chosen[i]!;
      let kind = pickWeighted(weights, rng);
      let lanes = 1;
      if (kind === "bus") {
        if (chosen[i + 1] === lane + 1) {
          lanes = 2;
          i++;
        } else kind = "car";
      }
      const o = make(sim, kind, lane + lanes / 2 + (lanes === 1 ? (rng() - 0.5) * 0.12 : 0));
      if (kind === "bike") o.vy = 2.2 + ph * 0.5;
      if (kind === "pedestrian") o.vx = (rng() < 0.5 ? -1 : 1) * (0.2 + rng() * 0.15);
      if (kind === "cng" && rng() < 0.16 + ph * 0.08) {
        // Swerve into a neighbouring lane that isn't the safe lane.
        const opts = [lane - 1, lane + 1].filter((l) => l >= 0 && l < LANES && l !== sim.safeLane);
        if (opts.length) {
          o.swerveTo = opts[Math.floor(rng() * opts.length)]! + 0.5;
          o.swerveAt = 1.2 + rng() * 1.6;
        }
      }
      row.push(o);
    }
  }
  if (ev) sim.eventRows -= 1;

  const maxH = row.length ? Math.max(...row.map((o) => o.h)) : 0.6;
  const gapTime = (1.25 - 0.45 * d - (ph - 1) * 0.05) * (0.85 + 0.3 * rng());
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
  sim.eventRows = id === "rain" ? 0 : id === "zebra" ? 2 : 3;
  if (id === "rain") sim.rainUntil = sim.t + 8000;
  sim.nextEventAt = sim.t + (8000 - (sim.phase - 1) * 1500) + Math.round(sim.eventRng() * 2000);
  return id;
}

export function step(sim: Sim): StepResult {
  const res: StepResult = { spawned: [], removed: [], nearMiss: null, comboReset: false, event: null, rainEnded: false, hit: null, phase: null, over: null };
  if (sim.over) return res;

  sim.t += STEP_MS;
  const ph = phaseAt(sim.t);
  if (ph !== sim.phase) {
    sim.phase = ph;
    res.phase = ph;
  }
  const raining = sim.t < sim.rainUntil;
  if (!raining && sim.rainUntil > 0) {
    sim.rainUntil = 0;
    res.rainEnded = true;
  }
  sim.v = speedAt(sim.t) * (raining ? 1.12 : 1);
  const dy = sim.v * DT;
  sim.dist += dy;

  const target = sim.lane + 0.5;
  const maxDx = (raining ? LANE_SPEED_RAIN : LANE_SPEED) * DT;
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

  const shielded = sim.t < sim.shieldUntil;
  const nearDist = Math.max(0.6, sim.v * 0.25);
  const pTop = PLAYER.y;
  const pBot = PLAYER.y + PLAYER.h;
  const kept: Obstacle[] = [];
  for (const o of sim.obstacles) {
    o.y += dy + o.vy * DT;
    if (o.vx) {
      o.x += o.vx * DT;
      if (o.x < 0.25 || o.x > LANES - 0.25) o.vx = -o.vx;
    }
    if (o.swerveTo !== null && o.swerveAt !== null) {
      o.blinking = o.y > o.swerveAt - 1.3 && o.y < o.swerveAt;
      if (o.y >= o.swerveAt) {
        const dx = o.swerveTo - o.x;
        const stepX = 2.4 * DT;
        o.x += Math.max(-stepX, Math.min(stepX, dx));
        if (Math.abs(dx) < 0.01) {
          o.swerveTo = null;
          o.blinking = false;
        }
      }
    }
    const dxAbs = Math.abs(o.x - sim.x);
    const halfW = (o.w + PLAYER.w) / 2;
    if (!o.hit && !shielded && !res.hit && dxAbs < halfW - FORGIVE && o.y + o.h > pTop + FORGIVE && o.y < pBot - FORGIVE) {
      o.hit = true;
      sim.lives -= 1;
      sim.hits += 1;
      sim.lastHit = o.kind;
      sim.shieldUntil = sim.t + SHIELD_MS;
      sim.combo = 0;
      res.hit = o;
      if (sim.lives <= 0) {
        sim.over = "defeated";
        res.over = sim.over;
      }
    }
    if (!o.passed && !o.hit && dxAbs < halfW && o.y + o.h >= pTop - nearDist && o.y < pBot) o.threat = true;
    if (!o.passed && o.y > pBot) {
      o.passed = true;
      if (o.threat && !o.hit) {
        sim.combo = sim.t - sim.lastNearT <= 4000 ? sim.combo + 1 : 1;
        sim.lastNearT = sim.t;
        sim.maxCombo = Math.max(sim.maxCombo, sim.combo);
        sim.nearMisses += 1;
        const points = 30 * multiplier(sim.combo);
        sim.nearPoints += points;
        res.nearMiss = { points, combo: sim.combo };
      }
    }
    if (o.y > WORLD_H || o.hit) res.removed.push(o.id);
    else kept.push(o);
  }
  sim.obstacles = kept;

  if (!sim.over && sim.t >= DURATION_MS) {
    sim.over = "survived";
    res.over = sim.over;
  }
  return res;
}

export type RankId = "boss-slayer" | "boss-survivor" | "almost-had-it" | "boss-snack";

/** Title from the run (pure). Never rename ids. */
export function rankFor(s: Pick<Sim, "over" | "lives" | "t">): RankId {
  if (s.over === "survived") return s.lives === LIVES ? "boss-slayer" : "boss-survivor";
  return s.t >= 40_000 ? "almost-had-it" : "boss-snack";
}
