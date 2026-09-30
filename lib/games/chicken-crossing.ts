// Chicken Crossing Dhaka — pure, deterministic rules (no DOM/React).
//
// A 7-column grid of rows. Row kinds (footpath / divider / road) and each
// lane's traffic come from rowPlan(seed, row), so the same seed always builds
// the same city. Traffic moves in a fixed step (STEP_MS) and a lane created
// later is placed where it "would have been" since t = 0, so timing is the
// same on every device. Timed chaos events (U-turn, bus stop, surprise CNG,
// dog, rain, Dhaka mode) come from a seeded schedule. The camera creeps
// forward: fall off the bottom of the screen and the city has moved on
// without you. Never use Math.random() here.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "chicken-crossing";
export const COLS = 7;
/** Visible rows. */
export const VIEW = 11;
export const STEP_MS = 1000 / 60;
export const LEVEL_ROWS = 20;
/** Metres per row, for the "distance" stat. */
export const METRES_PER_ROW = 3;

const DT = STEP_MS / 1000;
const HALF = 0.28; // chicken hitbox half-width
const NEAR = 0.38; // near-miss gap
const MOVE_COOLDOWN = 0.085; // s
const COMBO_WINDOW = 3; // s

export type VehicleKind = "car" | "bus" | "cng" | "rickshaw" | "bike" | "dog" | "pedestrian";
export type RowKind = "footpath" | "divider" | "road";
export type EventId = "u-turn" | "bus-stop" | "cng-surprise" | "dog" | "rain" | "dhaka-mode";
export type CrashKind = VehicleKind | "left-behind";

const VEHICLES: Record<VehicleKind, { w: number; v: number }> = {
  car: { w: 1.4, v: 2.0 },
  bus: { w: 2.6, v: 1.5 },
  cng: { w: 1.1, v: 2.5 },
  rickshaw: { w: 1.0, v: 0.9 },
  bike: { w: 0.85, v: 3.2 },
  dog: { w: 0.7, v: 3.4 },
  pedestrian: { w: 0.6, v: 0.6 },
};

export type Plan = {
  kind: RowKind;
  dir: 1 | -1;
  vehicle: VehicleKind;
  count: number;
  /** Loop length (units) the lane's traffic cycles through. */
  loop: number;
  /** Base speed multiplier for this row (grows with level). */
  mult: number;
  /** Start offset within the loop. */
  offset: number;
};

export function levelOf(row: number): number {
  return Math.max(0, Math.floor(row / LEVEL_ROWS));
}
export function levelMult(level: number): number {
  return Math.min(2.2, 0.8 + level * 0.15);
}

/** Vehicle mix for road lanes by level (buses and bikes arrive later). */
function roadMix(level: number): readonly (readonly [VehicleKind, number])[] {
  return [
    ["rickshaw", level < 2 ? 4 : 2],
    ["car", 4],
    ["cng", 3 + level * 0.5],
    ["bus", level < 1 ? 0.5 : 2 + level * 0.4],
    ["bike", level < 1 ? 0.5 : 2 + level * 0.5],
  ];
}

/**
 * Plan of one row. `prev` = kinds of the rows just below (nearest first) so we
 * never build more than 4 roads in a row. Pure: same (seed, row, prev) → same plan.
 */
export function rowPlan(seed: number, row: number, prev: readonly RowKind[]): Plan {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:row:${row}`));
  const level = levelOf(row);
  const dir: 1 | -1 = rng() < 0.5 ? 1 : -1;
  const mult = levelMult(level) * (0.9 + rng() * 0.25);
  const base = { dir, mult, offset: rng() * 50 };
  if (row <= 1) return { ...base, kind: "footpath", vehicle: "pedestrian", count: 0, loop: COLS + 4 };

  const roadsBelow = prev.findIndex((k) => k !== "road");
  const streak = roadsBelow === -1 ? prev.length : roadsBelow;
  const pRoad = Math.min(0.82, 0.58 + level * 0.05);
  let kind: RowKind = rng() < pRoad ? "road" : rng() < 0.3 ? "divider" : "footpath";
  if (kind === "road" && streak >= 4) kind = "footpath";

  if (kind === "road") {
    const vehicle = weightedPick(roadMix(level), (m) => m[1], rng)![0];
    const w = VEHICLES[vehicle].w;
    const count = 1 + Math.floor(rng() * (vehicle === "bus" ? 2 : 3)) + (level >= 3 && rng() < 0.4 ? 1 : 0);
    const loop = Math.max(COLS + 3, count * (w + 2.8 - Math.min(1, level * 0.2)));
    return { ...base, kind, vehicle, count, loop };
  }
  if (kind === "footpath") {
    const vehicle: VehicleKind = level >= 1 && rng() < 0.25 ? "dog" : "pedestrian";
    const count = vehicle === "dog" ? 1 : Math.floor(rng() * (level === 0 ? 2 : 3));
    return { ...base, kind, vehicle, count, loop: COLS + 5, mult: vehicle === "dog" ? base.mult * 0.7 : 1 };
  }
  return { ...base, kind, vehicle: "pedestrian", count: 0, loop: COLS + 4 };
}

// ---------------------------------------------------------------------------
// Sim state
// ---------------------------------------------------------------------------

export type Vehicle = {
  id: number;
  row: number;
  kind: VehicleKind;
  x: number;
  w: number;
  /** Signed base speed (units/s). */
  v: number;
  /** Temporary (event) vehicle: removed once off-screen. */
  temp: boolean;
  uTurnT: number;
};

export type Lane = { row: number; plan: Plan; vehicles: Vehicle[]; stopT: number };

export type Sim = {
  seed: number;
  /** ms simulated */
  t: number;
  col: number;
  row: number;
  maxRow: number;
  camY: number;
  lanes: Map<number, Lane>;
  kinds: RowKind[];
  nextId: number;
  moveT: number;
  nearMisses: number;
  combo: number;
  maxCombo: number;
  comboT: number;
  bonus: number;
  /** Vehicle ids already counted as a near miss on this row visit. */
  counted: Set<number>;
  rainT: number;
  dhakaT: number;
  nextEventAt: number;
  eventIndex: number;
  crashed: { kind: CrashKind } | null;
};

export type StepResult = {
  lanesAdded: Lane[];
  lanesRemoved: number[];
  spawned: Vehicle[];
  removed: number[];
  nearMiss: { combo: number; points: number } | null;
  comboReset: boolean;
  event: EventId | null;
  levelUp: number | null;
  rainEnded: boolean;
  dhakaEnded: boolean;
  crash: { kind: CrashKind } | null;
};

const emptyResult = (): StepResult => ({
  lanesAdded: [],
  lanesRemoved: [],
  spawned: [],
  removed: [],
  nearMiss: null,
  comboReset: false,
  event: null,
  levelUp: null,
  rainEnded: false,
  dhakaEnded: false,
  crash: null,
});

export function createSim(seed: number): Sim {
  const sim: Sim = {
    seed: seed >>> 0,
    t: 0,
    col: Math.floor(COLS / 2),
    row: 0,
    maxRow: 0,
    camY: -2,
    lanes: new Map(),
    kinds: [],
    nextId: 1,
    moveT: 0,
    nearMisses: 0,
    combo: 0,
    maxCombo: 0,
    comboT: 0,
    bonus: 0,
    counted: new Set(),
    rainT: 0,
    dhakaT: 0,
    nextEventAt: 7000,
    eventIndex: 0,
    crashed: null,
  };
  ensureLanes(sim, emptyResult());
  return sim;
}

function kindAt(sim: Sim, row: number): RowKind {
  if (row < 0) return "footpath";
  while (sim.kinds.length <= row) {
    const r = sim.kinds.length;
    const prev = [1, 2, 3, 4].map((i) => (r - i >= 0 ? sim.kinds[r - i]! : "footpath"));
    sim.kinds.push(rowPlan(sim.seed, r, prev).kind);
  }
  return sim.kinds[row]!;
}

function planAt(sim: Sim, row: number): Plan {
  kindAt(sim, row);
  const prev = [1, 2, 3, 4].map((i) => (row - i >= 0 ? sim.kinds[row - i]! : "footpath"));
  return rowPlan(sim.seed, row, prev);
}

function speedFactor(sim: Sim): number {
  return (sim.rainT > 0 ? 1.12 : 1) * (sim.dhakaT > 0 ? 1.5 : 1);
}

function wrap(x: number, w: number, dir: 1 | -1, loop: number): number {
  // Keep x inside the lane's loop window for its direction of travel.
  if (dir > 0) {
    const hi = COLS + 0.5;
    const lo = hi - loop;
    return lo + ((((x - lo) % loop) + loop) % loop);
  }
  const lo = -0.5 - w;
  return lo + ((((x - lo) % loop) + loop) % loop);
}

function makeLane(sim: Sim, row: number): Lane {
  const plan = planAt(sim, row);
  const lane: Lane = { row, plan, vehicles: [], stopT: 0 };
  const { w, v } = VEHICLES[plan.vehicle];
  const speed = v * plan.mult * plan.dir;
  const travelled = speed * (sim.t / 1000); // where it would be since t = 0
  for (let i = 0; i < plan.count; i++) {
    const x0 = plan.offset + (i * plan.loop) / plan.count;
    lane.vehicles.push({ id: sim.nextId++, row, kind: plan.vehicle, x: wrap(x0 + travelled, w, plan.dir, plan.loop), w, v: speed, temp: false, uTurnT: 0 });
  }
  return lane;
}

function ensureLanes(sim: Sim, out: StepResult) {
  const lo = Math.floor(sim.camY) - 1;
  const hi = Math.floor(sim.camY) + VIEW + 1;
  for (const [row, lane] of sim.lanes) {
    if (row < lo - 1) {
      lane.vehicles.forEach((v) => out.removed.push(v.id));
      sim.lanes.delete(row);
      out.lanesRemoved.push(row);
    }
  }
  for (let row = Math.max(0, lo); row <= hi; row++) {
    if (sim.lanes.has(row)) continue;
    const lane = makeLane(sim, row);
    sim.lanes.set(row, lane);
    out.lanesAdded.push(lane);
    out.spawned.push(...lane.vehicles);
  }
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export type Dir = "up" | "down" | "left" | "right";

/** Hop one cell. Returns true if the chicken moved. */
export function move(sim: Sim, dir: Dir): boolean {
  if (sim.crashed || sim.moveT > 0) return false;
  let { col, row } = sim;
  if (dir === "up") row += 1;
  else if (dir === "down") row -= 1;
  else if (dir === "left") col -= 1;
  else col += 1;
  if (col < 0 || col >= COLS || row < 0 || row < Math.ceil(sim.camY)) return false;
  if (row !== sim.row) sim.counted.clear();
  sim.col = col;
  sim.row = row;
  sim.moveT = MOVE_COOLDOWN;
  if (row > sim.maxRow) sim.maxRow = row;
  return true;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function nextEvent(sim: Sim): EventId {
  const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:event:${sim.eventIndex}`));
  const level = levelOf(sim.maxRow);
  const pool: [EventId, number][] = [
    ["u-turn", 3],
    ["bus-stop", 3],
    ["cng-surprise", 3],
    ["dog", 2],
    ["rain", sim.rainT > 0 ? 0 : 1.5],
    ["dhaka-mode", level >= 2 && sim.dhakaT <= 0 ? 1.2 + level * 0.3 : 0],
  ];
  return weightedPick(pool, (p) => p[1], rng)![0];
}

function roadLanesAhead(sim: Sim): Lane[] {
  const out: Lane[] = [];
  for (let r = sim.row + 1; r <= sim.row + 5; r++) {
    const lane = sim.lanes.get(r);
    if (lane && lane.plan.kind === "road") out.push(lane);
  }
  return out;
}

function applyEvent(sim: Sim, id: EventId, out: StepResult): boolean {
  const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:apply:${sim.eventIndex}`));
  const lanes = roadLanesAhead(sim);
  const lane = lanes.length ? lanes[Math.floor(rng() * lanes.length)]! : null;
  switch (id) {
    case "rain":
      sim.rainT = 12;
      return true;
    case "dhaka-mode":
      sim.dhakaT = 9;
      return true;
    case "bus-stop": {
      if (!lane) return false;
      lane.stopT = 1.8;
      return true;
    }
    case "u-turn": {
      const v = lane?.vehicles.find((x) => !x.temp && x.x > 0 && x.x + x.w < COLS);
      if (!v) return false;
      v.uTurnT = 2.2;
      return true;
    }
    case "cng-surprise":
    case "dog": {
      if (!lane) return false;
      const kind: VehicleKind = id === "dog" ? "dog" : "cng";
      const { w, v } = VEHICLES[kind];
      const dir: 1 | -1 = rng() < 0.5 ? 1 : -1;
      const speed = v * 1.6 * dir * levelMult(levelOf(lane.row));
      const veh: Vehicle = { id: sim.nextId++, row: lane.row, kind, x: dir > 0 ? -w - 0.3 : COLS + 0.3, w, v: speed, temp: true, uTurnT: 0 };
      lane.vehicles.push(veh);
      out.spawned.push(veh);
      return true;
    }
  }
}

// ---------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------

export function step(sim: Sim): StepResult {
  const out = emptyResult();
  if (sim.crashed) return out;
  sim.t += STEP_MS;
  sim.moveT = Math.max(0, sim.moveT - DT);
  const levelBefore = levelOf(sim.maxRow);

  // Timers
  if (sim.rainT > 0 && (sim.rainT -= DT) <= 0) out.rainEnded = true;
  if (sim.dhakaT > 0 && (sim.dhakaT -= DT) <= 0) out.dhakaEnded = true;
  if (sim.comboT > 0 && (sim.comboT -= DT) <= 0 && sim.combo > 0) {
    sim.combo = 0;
    out.comboReset = true;
  }

  // Camera: follows the chicken, and creeps forward on its own.
  const level = levelOf(sim.maxRow);
  const creep = sim.t > 5000 ? (0.14 + level * 0.06) * (sim.dhakaT > 0 ? 1.3 : 1) : 0;
  const target = sim.row - 3.5;
  sim.camY += creep * DT;
  if (target > sim.camY) sim.camY += (target - sim.camY) * Math.min(1, DT * 5);
  ensureLanes(sim, out);

  // Events
  if (sim.t >= sim.nextEventAt) {
    const id = nextEvent(sim);
    if (applyEvent(sim, id, out)) out.event = id;
    const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:gap:${sim.eventIndex}`));
    sim.eventIndex += 1;
    const gap = (6 + rng() * 5) * (sim.dhakaT > 0 ? 0.5 : 1) * Math.max(0.6, 1 - level * 0.08);
    sim.nextEventAt = sim.t + gap * 1000;
  }

  // Traffic
  const f = speedFactor(sim);
  for (const lane of sim.lanes.values()) {
    if (lane.stopT > 0) lane.stopT -= DT;
    const stopped = lane.stopT > 0;
    for (let i = lane.vehicles.length - 1; i >= 0; i--) {
      const v = lane.vehicles[i]!;
      if (v.uTurnT > 0) v.uTurnT -= DT;
      const dirMul = v.uTurnT > 0 ? -1 : 1;
      const speed = stopped && !v.temp ? 0 : v.v * f * dirMul;
      v.x += speed * DT;
      if (v.temp) {
        if (v.x > COLS + 1 || v.x + v.w < -1) {
          lane.vehicles.splice(i, 1);
          out.removed.push(v.id);
        }
      } else if (v.uTurnT <= 0) {
        v.x = wrap(v.x, v.w, lane.plan.dir, lane.plan.loop);
      }
    }
  }

  // Collision + near misses on the chicken's row.
  const lane = sim.lanes.get(sim.row);
  const cx = sim.col + 0.5;
  if (lane) {
    for (const v of lane.vehicles) {
      const shrink = v.kind === "pedestrian" ? 0.15 : 0.08;
      const left = v.x + shrink;
      const right = v.x + v.w - shrink;
      if (right > cx - HALF && left < cx + HALF) {
        sim.crashed = { kind: v.kind };
        out.crash = sim.crashed;
        return out;
      }
      if (lane.plan.kind !== "road" || sim.counted.has(v.id)) continue;
      const gap = Math.min(Math.abs(left - (cx + HALF)), Math.abs(cx - HALF - right));
      if (gap < NEAR) {
        sim.counted.add(v.id);
        sim.nearMisses += 1;
        sim.combo = Math.min(9, sim.combo + 1);
        sim.maxCombo = Math.max(sim.maxCombo, sim.combo);
        sim.comboT = COMBO_WINDOW;
        const points = 20 * multiplier(sim.combo);
        sim.bonus += points;
        out.nearMiss = { combo: sim.combo, points };
      }
    }
  }

  // Left behind by the city.
  if (sim.row < sim.camY - 0.35) {
    sim.crashed = { kind: "left-behind" };
    out.crash = sim.crashed;
  }

  const levelAfter = levelOf(sim.maxRow);
  if (levelAfter > levelBefore) out.levelUp = levelAfter;
  return out;
}

// ---------------------------------------------------------------------------
// Score and titles
// ---------------------------------------------------------------------------

export function multiplier(combo: number): number {
  return combo >= 6 ? 4 : combo >= 4 ? 3 : combo >= 2 ? 2 : 1;
}

export function score(sim: Sim): number {
  return sim.maxRow * 10 + sim.bonus;
}

export function distanceMetres(sim: Pick<Sim, "maxRow">): number {
  return sim.maxRow * METRES_PER_ROW;
}

export type RankId = "road-legend" | "zebra-master" | "brave-chicken" | "nervous-nugget" | "roadside-snack";

/** Title from score (pure). Never rename ids. */
export function rankFor(points: number): RankId {
  if (points >= 1400) return "road-legend";
  if (points >= 850) return "zebra-master";
  if (points >= 450) return "brave-chicken";
  if (points >= 180) return "nervous-nugget";
  return "roadside-snack";
}

/** Deterministic pick of a line variant. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
