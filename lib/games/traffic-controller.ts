// Dhaka Traffic Controller — pure, deterministic rules (no DOM/React).
//
// A 4-way intersection (left-hand traffic, like Bangladesh). Each approach
// (n = coming from the north, heading south; s; e; w) has its own light the
// player toggles. Vehicles follow the one ahead, stop at the line on red and
// cross the box on green. Two vehicles from crossing directions overlapping in
// the box = major crash. Too many waiting vehicles for too long = gridlock.
// Spawns and chaos events come from a seeded schedule over a fixed-step
// clock, so the same seed + the same taps replay the same shift.
// Never use Math.random() here.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "traffic-controller";
export const STEP_MS = 1000 / 60;
export const DURATION_MS = 60_000;
/** Half the world size: roads run from -W to W; the box is |x|,|y| < 1. */
export const W = 6;
export const BOX = 1;
/** Front of a vehicle stops here (distance travelled from the spawn edge). */
export const STOP = W - BOX - 0.15;
export const LANE_W = 0.72;
export const APPROACHES = ["n", "e", "s", "w"] as const;
export type Approach = (typeof APPROACHES)[number];

const DT = STEP_MS / 1000;
const GAP = 0.28;
const CAP = 18; // waiting vehicles = 100 % congestion
const GRIDLOCK_S = 2.5;
const HONK_WAIT = 6;

export type VehicleKind = "car" | "bus" | "cng" | "taxi" | "bike" | "rickshaw" | "vip";

export const KINDS: Record<VehicleKind, { len: number; v: number; accel: number }> = {
  car: { len: 1.0, v: 2.6, accel: 4 },
  bus: { len: 1.9, v: 2.0, accel: 2 },
  cng: { len: 0.85, v: 2.4, accel: 4.5 },
  taxi: { len: 1.0, v: 2.7, accel: 4 },
  bike: { len: 0.6, v: 3.2, accel: 6 },
  rickshaw: { len: 0.8, v: 1.3, accel: 3 },
  vip: { len: 1.1, v: 3.2, accel: 5 },
};

export type Vehicle = {
  id: number;
  kind: VehicleKind;
  from: Approach;
  /** Front position along the path (0 = spawn edge, W = centre). */
  f: number;
  len: number;
  v: number;
  /** Seconds waiting (v ≈ 0) so far. */
  wait: number;
  holdT: number;
  /** Event flags */
  uTurn: "pending" | "doing" | null;
  stopAt: number | null;
  blocker: boolean;
  vip: boolean;
};

export type EventId = "u-turn" | "bus-stop" | "rickshaw-block" | "pedestrian" | "rain" | "vip" | "rush";

export type Sim = {
  seed: number;
  t: number;
  green: Record<Approach, boolean>;
  vehicles: Vehicle[];
  backlog: Record<Approach, number>;
  nextId: number;
  nextSpawnAt: number;
  spawnIndex: number;
  nextEventAt: number;
  eventIndex: number;
  events: number;
  pedT: Record<Approach, number>;
  rainT: number;
  handled: number;
  streak: number;
  maxStreak: number;
  points: number;
  congestion: number;
  peakCongestion: number;
  gridlockT: number;
  over: null | { reason: "time" | "crash" | "gridlock"; crash?: [VehicleKind, VehicleKind] };
};

export type StepResult = {
  spawned: Vehicle[];
  removed: number[];
  exited: { id: number; points: number } | null;
  event: { id: EventId; from: Approach | null } | null;
  streakReset: boolean;
  rainEnded: boolean;
  over: Sim["over"];
};

const approachRecord = <T>(v: T): Record<Approach, T> => ({ n: v, e: v, s: v, w: v });

export function createSim(seed: number): Sim {
  return {
    seed: seed >>> 0,
    t: 0,
    green: { n: true, s: true, e: false, w: false },
    vehicles: [],
    backlog: approachRecord(0),
    nextId: 1,
    nextSpawnAt: 400,
    spawnIndex: 0,
    nextEventAt: 8000,
    eventIndex: 0,
    events: 0,
    pedT: approachRecord(0),
    rainT: 0,
    handled: 0,
    streak: 0,
    maxStreak: 0,
    points: 0,
    congestion: 0,
    peakCongestion: 0,
    gridlockT: 0,
    over: null,
  };
}

/** Toggle one approach's light. */
export function toggle(sim: Sim, a: Approach): void {
  if (sim.over) return;
  sim.green[a] = !sim.green[a];
}

/** Flip every light (quick axis swap). */
export function flipAll(sim: Sim): void {
  if (sim.over) return;
  for (const a of APPROACHES) sim.green[a] = !sim.green[a];
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export const isNS = (a: Approach) => a === "n" || a === "s";

/** World rectangle [x0, y0, x1, y1] of a vehicle (screen coords, y down). */
export function rectOf(v: Pick<Vehicle, "from" | "f" | "len">): [number, number, number, number] {
  const a = v.f - v.len; // rear
  const b = v.f; // front
  const hw = LANE_W / 2;
  switch (v.from) {
    case "n": // heading south on x = +0.5
      return [0.5 - hw, -W + a, 0.5 + hw, -W + b];
    case "s": // heading north on x = -0.5
      return [-0.5 - hw, W - b, -0.5 + hw, W - a];
    case "w": // heading east on y = -0.5
      return [-W + a, -0.5 - hw, -W + b, -0.5 + hw];
    case "e": // heading west on y = +0.5
      return [W - b, 0.5 - hw, W - a, 0.5 + hw];
  }
}

const overlap = (p: [number, number, number, number], q: [number, number, number, number]) =>
  p[0] < q[2] - 0.04 && q[0] < p[2] - 0.04 && p[1] < q[3] - 0.04 && q[1] < p[3] - 0.04;

const inBox = (v: Vehicle) => v.f > STOP + 0.15 && v.f - v.len < W + BOX;

// ---------------------------------------------------------------------------
// Spawning and events
// ---------------------------------------------------------------------------

const progress = (t: number) => Math.min(1, t / DURATION_MS);

function spawnKindMix(t: number): readonly (readonly [VehicleKind, number])[] {
  const p = progress(t);
  return [
    ["car", 4],
    ["cng", 4],
    ["taxi", 2],
    ["bike", 3],
    ["rickshaw", 2.5],
    ["bus", 1 + p * 2],
  ];
}

function pickApproach(sim: Sim, rng: () => number): Approach {
  // One approach gets a "rush" that moves every 12 s.
  const rush = APPROACHES[hashString(`${GAME_SLUG}:${sim.seed}:rush:${Math.floor(sim.t / 12000)}`) % 4]!;
  return weightedPick(APPROACHES, (a) => (a === rush ? 2.2 : 1), rng)!;
}

function makeVehicle(sim: Sim, kind: VehicleKind, from: Approach): Vehicle {
  const k = KINDS[kind];
  return { id: sim.nextId++, kind, from, f: 0, len: k.len, v: k.v * 0.8, wait: 0, holdT: 0, uTurn: null, stopAt: null, blocker: false, vip: kind === "vip" };
}

/** Rear of the last vehicle on an approach (∞ if empty). */
function tailRoom(sim: Sim, from: Approach): number {
  let room = Infinity;
  for (const v of sim.vehicles) if (v.from === from) room = Math.min(room, v.f - v.len);
  return room;
}

function trySpawn(sim: Sim, v: Vehicle, out: StepResult): boolean {
  if (tailRoom(sim, v.from) < GAP + 0.05) return false;
  sim.vehicles.push(v);
  out.spawned.push(v);
  return true;
}

function queue(sim: Sim, kind: VehicleKind, from: Approach, out: StepResult, patch: Partial<Vehicle> = {}) {
  const v = { ...makeVehicle(sim, kind, from), ...patch };
  if (!trySpawn(sim, v, out)) sim.backlog[from] += 1;
}

function scheduleSpawns(sim: Sim, out: StepResult) {
  while (sim.t >= sim.nextSpawnAt) {
    const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:spawn:${sim.spawnIndex++}`));
    const kind = weightedPick(spawnKindMix(sim.t), (k) => k[1], rng)![0];
    queue(sim, kind, pickApproach(sim, rng), out);
    const rate = 0.5 + progress(sim.t) * 1.05; // vehicles per second
    const gap = Math.max(0.22, -Math.log(1 - rng() * 0.95) / rate);
    sim.nextSpawnAt += gap * 1000;
  }
  // Release backlog when there is room.
  for (const a of APPROACHES) {
    if (sim.backlog[a] > 0 && tailRoom(sim, a) >= GAP + 0.05) {
      const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:backlog:${sim.nextId}`));
      const kind = weightedPick(spawnKindMix(sim.t), (k) => k[1], rng)![0];
      if (trySpawn(sim, makeVehicle(sim, kind, a), out)) sim.backlog[a] -= 1;
    }
  }
}

function applyEvent(sim: Sim, id: EventId, rng: () => number, out: StepResult): Approach | null | false {
  const from = APPROACHES[Math.floor(rng() * 4)]!;
  switch (id) {
    case "rain":
      if (sim.rainT > 0) return false;
      sim.rainT = 10;
      return null;
    case "pedestrian":
      sim.pedT[from] = 3;
      return from;
    case "vip":
      queue(sim, "vip", from, out);
      return from;
    case "rush":
      for (const a of APPROACHES) queue(sim, a === from ? "bus" : rng() < 0.5 ? "cng" : "bike", a, out);
      return null;
    case "bus-stop": {
      const bus = sim.vehicles.find((v) => v.kind === "bus" && v.f < STOP - 1.5 && v.stopAt === null);
      if (bus) {
        bus.stopAt = bus.f + 0.4;
        return bus.from;
      }
      queue(sim, "bus", from, out, { stopAt: STOP - 1.8 - rng() * 1.5 });
      return from;
    }
    case "rickshaw-block":
      queue(sim, "rickshaw", from, out, { blocker: true });
      return from;
    case "u-turn": {
      const cand = sim.vehicles.filter((v) => v.kind !== "bus" && v.uTurn === null && v.f < STOP - 0.3 && v.f > STOP - 3);
      const v = cand.length ? cand[Math.floor(rng() * cand.length)]! : null;
      if (!v) return false;
      v.uTurn = "pending";
      return v.from;
    }
  }
}

function scheduleEvents(sim: Sim, out: StepResult) {
  if (sim.t < sim.nextEventAt) return;
  const rng = createRng(hashString(`${GAME_SLUG}:${sim.seed}:event:${sim.eventIndex}`));
  const p = progress(sim.t);
  const pool: [EventId, number][] = [
    ["u-turn", 3],
    ["bus-stop", 3],
    ["rickshaw-block", 2.5],
    ["pedestrian", 3],
    ["rain", sim.rainT > 0 ? 0 : 1.5],
    ["vip", p > 0.2 ? 2 : 0],
    ["rush", p > 0.3 ? 2 : 0.5],
  ];
  const id = weightedPick(pool, (e) => e[1], rng)![0];
  const res = applyEvent(sim, id, rng, out);
  if (res !== false) {
    out.event = { id, from: res };
    sim.events += 1;
  }
  sim.eventIndex += 1;
  sim.nextEventAt = sim.t + (6.5 + rng() * 3.5) * (1 - p * 0.35) * 1000;
}

// ---------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------

export function multiplier(streak: number): number {
  return streak >= 35 ? 4 : streak >= 20 ? 3 : streak >= 10 ? 2 : streak >= 5 ? 1.5 : 1;
}

export function waitingCount(sim: Sim): number {
  let n = 0;
  for (const v of sim.vehicles) if (v.v < 0.2 && v.f < STOP + 0.2) n += 1;
  return n + APPROACHES.reduce((s, a) => s + sim.backlog[a], 0) * 1.5;
}

export function step(sim: Sim): StepResult {
  const out: StepResult = { spawned: [], removed: [], exited: null, event: null, streakReset: false, rainEnded: false, over: null };
  if (sim.over) return out;
  sim.t += STEP_MS;
  if (sim.rainT > 0 && (sim.rainT -= DT) <= 0) out.rainEnded = true;
  for (const a of APPROACHES) if (sim.pedT[a] > 0) sim.pedT[a] -= DT;

  scheduleSpawns(sim, out);
  scheduleEvents(sim, out);

  const weather = sim.rainT > 0 ? 0.7 : 1;
  // Move each approach front-to-back so followers see their leader's new spot.
  for (const a of APPROACHES) {
    const lane = sim.vehicles.filter((v) => v.from === a).sort((p, q) => q.f - p.f);
    let leaderRear = Infinity;
    for (const v of lane) {
      const k = KINDS[v.kind];
      let room = leaderRear - v.f - GAP;
      const beforeLine = v.f <= STOP + 0.02;
      const mustStop = beforeLine && ((!sim.green[a] && !v.vip) || sim.pedT[a] > 0 || v.blocker);
      if (mustStop) room = Math.min(room, STOP - v.f);
      if (v.stopAt !== null && v.f >= v.stopAt - 0.02 && v.f < v.stopAt + 0.3) {
        v.holdT = 2.5;
        v.stopAt = null;
      }
      if (v.blocker && beforeLine && STOP - v.f < 0.05) {
        // Rickshaw parks at the line for a while, then gives up blocking.
        v.holdT = 3;
        v.blocker = false;
      }
      if (v.uTurn === "pending" && v.f >= W - 0.2) {
        v.uTurn = "doing";
        v.holdT = 1.4;
      }
      if (v.holdT > 0) {
        v.holdT -= DT;
        v.v = 0;
        if (v.holdT <= 0 && v.uTurn === "doing") v.uTurn = null;
      } else {
        const target = k.v * weather * (1 + progress(sim.t) * 0.25);
        v.v = Math.max(0, Math.min(v.v + k.accel * DT, target, Math.max(0, room) * 5));
      }
      v.f += v.v * DT;
      v.wait = v.v < 0.1 ? v.wait + DT : Math.max(0, v.wait - DT * 2);
      leaderRear = v.f - v.len;
    }
  }

  // Crash check: crossing directions overlapping in the box.
  const boxed = sim.vehicles.filter(inBox);
  for (let i = 0; i < boxed.length; i++) {
    for (let j = i + 1; j < boxed.length; j++) {
      const p = boxed[i]!;
      const q = boxed[j]!;
      if (isNS(p.from) === isNS(q.from)) continue;
      if (overlap(rectOf(p), rectOf(q))) {
        sim.over = { reason: "crash", crash: [p.kind, q.kind] };
        out.over = sim.over;
        return out;
      }
    }
  }

  // Exits and scoring.
  for (let i = sim.vehicles.length - 1; i >= 0; i--) {
    const v = sim.vehicles[i]!;
    if (v.f - v.len > 2 * W + 0.5) {
      sim.vehicles.splice(i, 1);
      out.removed.push(v.id);
      sim.handled += 1;
      sim.streak += 1;
      sim.maxStreak = Math.max(sim.maxStreak, sim.streak);
      const pts = Math.round(10 * multiplier(sim.streak));
      sim.points += pts;
      out.exited = { id: v.id, points: pts };
    }
  }

  // Congestion + flow.
  sim.congestion = Math.min(100, Math.round((waitingCount(sim) / CAP) * 100));
  sim.peakCongestion = Math.max(sim.peakCongestion, sim.congestion);
  const honking = sim.vehicles.some((v) => v.wait > HONK_WAIT);
  if ((sim.congestion >= 70 || honking) && sim.streak > 0) {
    sim.streak = 0;
    out.streakReset = true;
  }
  sim.gridlockT = sim.congestion >= 100 ? sim.gridlockT + DT : 0;
  if (sim.gridlockT >= GRIDLOCK_S) {
    sim.over = { reason: "gridlock" };
    out.over = sim.over;
    return out;
  }
  if (sim.t >= DURATION_MS) {
    sim.over = { reason: "time" };
    out.over = sim.over;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

export function chaosLevel(sim: Pick<Sim, "events" | "peakCongestion">): number {
  return Math.min(100, Math.round(sim.events * 5 + sim.peakCongestion * 0.35));
}

export function finalScore(sim: Sim): number {
  const survived = sim.over?.reason === "time";
  return sim.points + (survived ? 300 + Math.round((100 - sim.congestion) * 3) : 0);
}

export type RankId = "traffic-god" | "signal-sensei" | "junior-sergeant" | "horn-enthusiast" | "gridlock-architect";

/** Title from score (pure). Never rename ids. */
export function rankFor(points: number): RankId {
  if (points >= 1400) return "traffic-god";
  if (points >= 1050) return "signal-sensei";
  if (points >= 650) return "junior-sergeant";
  if (points >= 280) return "horn-enthusiast";
  return "gridlock-architect";
}
