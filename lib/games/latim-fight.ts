// লাটিম যুদ্ধ — pure, deterministic Latim Fight rules on top of lib/flick
// (spin model + circular arena). You vs the computer.
//
// Order throw: both throw outward from the circle's centre; the latim that
// ends farthest away attacks first (exact tie → you).
// Bout (বেল্লা পার): the defender throws into the circle (landing outside →
// placed at a seeded spot inside, still spinning), then the attacker throws
// to hit it. Knockout = the attacker touched it and its centre ended outside
// the circle → attacker wins that latim (+1) and attacks again (after the
// ঘর কোপ finisher when you knocked it out). No knockout → roles swap, except
// a fallen defender still inside is "stuck": the attacker gets one more throw.
// Match: first to WIN_AT latims, or MAX_BOUTS bouts (then most won; equal = draw).
//
// A throw = direction + power (landing distance; the latim then slides with
// leftover speed) + spin (0–1, from the wind meter vs a seeded sweet spot).
// Spin only decays during simulated steps plus a fixed AIM_DECAY per attack —
// never with wall-clock thinking time — so the same seed and the same throws
// replay the same match. Score = latims won × 100 + kop bonuses.
// Seed = shuffle (30 bits) · opponent (2 bits). OPPONENTS is append-only
// (same para cast as Kacher Guti, separate list); all ids are permanent.

import { gauss } from "@/lib/flick/ai";
import { bodyById, simulate, type Body, type StepEvents, type World } from "@/lib/flick/physics";
import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "latim-fight";

export const OPPONENTS = ["choto-bhai", "boro-bhai", "champion"] as const;
export type OpponentId = (typeof OPPONENTS)[number];
export type Side = "you" | "cpu";

export const WIN_AT = 3;
export const MAX_BOUTS = 8;
export const KNOCKOUT_POINTS = 100;
export const KOP_POINTS = { perfect: 50, good: 20, miss: 0 } as const;
export type KopGrade = keyof typeof KOP_POINTS;

// Board (world units; drawn W × H and scaled by CSS).
export const W = 360;
export const H = 480;
export const CIRCLE = { x: 180, y: 205, r: 105 } as const;
export const LR = 13;
/** Where bout throws start (outside the circle, bottom of the ground). */
export const ORIGIN = { x: 180, y: 440 } as const;
export const MAX_AIR = 360;
/** Order throws stay on the ground: shorter, and a badly wound latim lands shorter still. */
export const ORDER_AIR = 175;
const SLIDE_MIN = 80;
const SLIDE_SPAN = 340;
const FRICTION = 180;
export const SPIN_DECAY = 0.12;
/** Spin the defender loses while the attacker winds up (fixed, not wall-clock). */
export const AIM_DECAY = 0.12;
const SWEET_HALF = 0.06;

/** Computer skill (bot-tuned, see AGENTS.md): aim σ (rad), power σ, wind-meter error (± uniform), and how deep it lands on the defender (0 = short, slide through it — the strongest; 1 = on top). */
export const SKILL: Record<OpponentId, { angle: number; power: number; meter: number; through: number }> = {
  "choto-bhai": { angle: 0.13, power: 0.32, meter: 0.45, through: 1 },
  "boro-bhai": { angle: 0.066, power: 0.11, meter: 0.15, through: 0.5 },
  champion: { angle: 0.05, power: 0.07, meter: 0.07, through: 0.3 },
};

export type Throw = { dirX: number; dirY: number; power: number; spin: number };
export type Latim = { x: number; y: number; spin: number; fallen: boolean };
export type Stage = "order" | "defend" | "attack" | "kop" | "over";

export type LastEvent =
  | { kind: "order"; side: Side; dist: number }
  | { kind: "attacker"; side: Side }
  | { kind: "placed"; side: Side }
  | { kind: "landed"; side: Side }
  | { kind: "knockout"; side: Side }
  | { kind: "stuck"; side: Side }
  | { kind: "swap"; side: Side; hit: boolean }
  | { kind: "kop"; grade: KopGrade };

export type LtState = {
  seed: number;
  opponent: OpponentId;
  stage: Stage;
  /** Who throws now (order thrower, defender, attacker; you during kop). */
  turn: Side;
  attacker: Side;
  won: Record<Side, number>;
  bouts: number;
  /** The one extra throw at a stuck latim was used this bout. */
  extraUsed: boolean;
  order: Partial<Record<Side, number>>;
  latims: Record<Side, Latim | null>;
  /** Index of the next throw (keys the sweet spot and computer decisions). */
  throws: number;
  kops: KopGrade[];
  /** Your best release spin, in seconds of spinning (spin ÷ decay). */
  longestSpin: number;
  knockouts: Record<Side, number>;
  attacks: number;
  last: LastEvent | null;
};

export const other = (s: Side): Side => (s === "you" ? "cpu" : "you");

function stream(seed: number, key: string): () => number {
  return createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:${key}`));
}

// ---- seed packing ----------------------------------------------------------

export function packSeed(shuffle: number, opponent: OpponentId): number {
  return ((shuffle & 0x3fffffff) * 4 + OPPONENTS.indexOf(opponent)) >>> 0;
}

export function opponentOf(seed: number): OpponentId | null {
  return OPPONENTS[(seed >>> 0) & 3] ?? null;
}

// ---- match -----------------------------------------------------------------

export function createMatch(seed: number): LtState {
  return {
    seed: seed >>> 0,
    opponent: opponentOf(seed) ?? "boro-bhai",
    stage: "order",
    turn: "you",
    attacker: "you",
    won: { you: 0, cpu: 0 },
    bouts: 0,
    extraUsed: false,
    order: {},
    latims: { you: null, cpu: null },
    throws: 0,
    kops: [],
    longestSpin: 0,
    knockouts: { you: 0, cpu: 0 },
    attacks: 0,
    last: null,
  };
}

/** Centre of the wind meter's sweet spot (0–1) for the next throw. */
export function sweetSpot(s: Pick<LtState, "seed" | "throws">): number {
  return 0.5 + stream(s.seed, `sweet:${s.throws}`)() * 0.38;
}

/** Spin from where the wind meter was released: 1 in the sweet spot, less the further off. */
export function spinFor(meter: number, sweet: number): number {
  const d = Math.abs(meter - sweet);
  return d <= SWEET_HALF ? 1 : Math.max(0.3, 1 - (d - SWEET_HALF) * 1.8);
}

export const SWEET_WIDTH = SWEET_HALF * 2;

/** Where a throw starts: the circle's centre for the order throw, else the throwing spot. */
export function throwOrigin(s: Pick<LtState, "stage">): { x: number; y: number } {
  return s.stage === "order" ? { x: CIRCLE.x, y: CIRCLE.y } : { ...ORIGIN };
}

function latimBody(id: string, l: Latim): Body {
  return { id, x: l.x, y: l.y, vx: 0, vy: 0, r: LR, mass: 1, spin: l.spin, fallen: l.fallen };
}

function arenaWorld(seed: number, bodies: Body[]): World {
  return {
    bodies,
    holes: [],
    bounds: { x0: 0, y0: 0, x1: W, y1: H },
    friction: FRICTION,
    restitution: 0.85,
    lipSpeed: 0,
    wallBounce: 0.3,
    steps: 0,
    spin: { decay: SPIN_DECAY, gyro: 1.6, loss: 0.0009, wobbleAt: 0.25, drift: 10, fallenFriction: 2400, seed },
    arena: { ...CIRCLE },
  };
}

/** Landing point of a throw (clamped to the ground). */
export function landingOf(s: Pick<LtState, "stage">, t: Throw): { x: number; y: number } {
  const o = throwOrigin(s);
  const p = Math.max(0, Math.min(1, t.power));
  const air = s.stage === "order" ? p * ORDER_AIR * (0.55 + 0.45 * Math.max(0, Math.min(1, t.spin))) : p * MAX_AIR;
  return { x: Math.max(LR, Math.min(W - LR, o.x + t.dirX * air)), y: Math.max(LR, Math.min(H - LR, o.y + t.dirY * air)) };
}

/** The ground as a world: the defender's latim (during an attack, after AIM_DECAY) plus the thrown one. */
export function throwWorld(s: LtState, t: Throw): World {
  const bodies: Body[] = [];
  if (s.stage === "attack") {
    const d = s.latims[other(s.attacker)];
    if (d) {
      const spin = d.fallen ? 0 : Math.max(0, d.spin - AIM_DECAY);
      bodies.push(latimBody(other(s.attacker), { ...d, spin, fallen: d.fallen || spin <= 0 }));
    }
  }
  const p = Math.max(0, Math.min(1, t.power));
  const land = landingOf(s, t);
  const slide = s.stage === "order" ? SLIDE_MIN + p * 60 : SLIDE_MIN + p * SLIDE_SPAN;
  const spin = Math.max(0, Math.min(1, t.spin));
  bodies.push({ id: s.turn, x: land.x, y: land.y, vx: t.dirX * slide, vy: t.dirY * slide, r: LR, mass: 1, spin, fallen: spin <= 0 });
  return arenaWorld(s.seed, bodies);
}

const restOf = (b: Body): Latim => ({ x: b.x, y: b.y, spin: b.spin ?? 0, fallen: !!b.fallen });
const distFromCentre = (p: { x: number; y: number }) => Math.sqrt((p.x - CIRCLE.x) ** 2 + (p.y - CIRCLE.y) ** 2);
const inside = (p: { x: number; y: number }) => distFromCentre(p) <= CIRCLE.r;

/** Apply a settled world (thrown with `t`) to the match. */
export function resolve(s: LtState, w: World, events: StepEvents, t: Throw): LtState {
  const me = bodyById(w, s.turn)!;
  const throws = s.throws + 1;
  const longestSpin = s.turn === "you" ? Math.max(s.longestSpin, t.spin / SPIN_DECAY) : s.longestSpin;
  const base = { ...s, throws, longestSpin };

  if (s.stage === "order") {
    const order = { ...s.order, [s.turn]: distFromCentre(me) };
    const latims = { ...s.latims, [s.turn]: restOf(me) };
    if (order.you === undefined || order.cpu === undefined) {
      return { ...base, order, latims, turn: other(s.turn), last: { kind: "order", side: s.turn, dist: order[s.turn]! } };
    }
    const attacker: Side = order.you >= order.cpu ? "you" : "cpu";
    return startBout({ ...base, order, latims, attacker, last: { kind: "attacker", side: attacker } });
  }

  if (s.stage === "defend") {
    let l = restOf(me);
    let last: LastEvent = { kind: "landed", side: s.turn };
    if (!inside(l)) {
      // Always a bout: a latim that missed the circle is set down inside, still spinning.
      const rng = stream(s.seed, `place:${s.bouts}`);
      let x = 0;
      let y = 0;
      do {
        x = rng() * 2 - 1;
        y = rng() * 2 - 1;
      } while (x * x + y * y > 1);
      l = { ...l, x: CIRCLE.x + x * CIRCLE.r * 0.6, y: CIRCLE.y + y * CIRCLE.r * 0.6 };
      last = { kind: "placed", side: s.turn };
    }
    return { ...base, latims: { ...s.latims, [s.turn]: l }, stage: "attack", turn: s.attacker, extraUsed: false, last };
  }

  if (s.stage === "attack") {
    const defender = other(s.attacker);
    const d = bodyById(w, defender);
    const hit = events.contacts.some((c) => (c.a === s.attacker && c.b === defender) || (c.b === s.attacker && c.a === defender));
    const latims = { you: s.latims.you, cpu: s.latims.cpu, [s.attacker]: restOf(me), ...(d ? { [defender]: restOf(d) } : {}) } as Record<Side, Latim | null>;
    const next = { ...base, latims, attacks: s.attacks + 1 };
    if (d && hit && d.out) {
      const won = { ...s.won, [s.attacker]: s.won[s.attacker] + 1 };
      const knockouts = { ...s.knockouts, [s.attacker]: s.knockouts[s.attacker] + 1 };
      const ko: LtState = { ...next, won, knockouts, last: { kind: "knockout", side: s.attacker } };
      // Your knockout → the ঘর কোপ finisher first.
      return s.attacker === "you" ? { ...ko, stage: "kop", turn: "you" } : endBout(ko, s.attacker);
    }
    if (d && d.fallen && !d.out && !s.extraUsed) {
      return { ...next, extraUsed: true, last: { kind: "stuck", side: defender } };
    }
    return endBout({ ...next, last: { kind: "swap", side: defender, hit } }, defender);
  }
  return s;
}

function startBout(s: LtState): LtState {
  return { ...s, stage: "defend", turn: other(s.attacker), bouts: s.bouts + 1, extraUsed: false, latims: { you: null, cpu: null } };
}

function endBout(s: LtState, nextAttacker: Side): LtState {
  if (s.won.you >= WIN_AT || s.won.cpu >= WIN_AT || s.bouts >= MAX_BOUTS) return { ...s, stage: "over", attacker: nextAttacker };
  return startBout({ ...s, attacker: nextAttacker });
}

/** Grade a kop tap: how far (ms) from the moment the ring meets the latim. */
export function kopGrade(errorMs: number | null): KopGrade {
  if (errorMs === null) return "miss";
  const e = Math.abs(errorMs);
  return e <= 70 ? "perfect" : e <= 170 ? "good" : "miss";
}

export function applyKop(s: LtState, grade: KopGrade): LtState {
  if (s.stage !== "kop") return s;
  return endBout({ ...s, kops: [...s.kops, grade], last: { kind: "kop", grade } }, s.attacker);
}

/** Headless: run one throw to rest and resolve it (bots, tests). */
export function play(s: LtState, t: Throw): LtState {
  const w = throwWorld(s, t);
  return resolve(s, w, simulate(w), t);
}

// ---- computer ---------------------------------------------------------------

/** Throw aimed so the latim lands at `to` (power from the distance), with seeded error. */
export function throwAt(s: LtState, to: { x: number; y: number }, err: { angle: number; power: number; meter: number }, rng: () => number): Throw {
  const o = throwOrigin(s);
  const dx = to.x - o.x;
  const dy = to.y - o.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const e = gauss(rng) * err.angle;
  let dirX = dx / len - (dy / len) * e;
  let dirY = dy / len + (dx / len) * e;
  const l = Math.sqrt(dirX * dirX + dirY * dirY);
  dirX /= l;
  dirY /= l;
  const power = Math.max(0, Math.min(1, (len / (s.stage === "order" ? ORDER_AIR : MAX_AIR)) * (1 + gauss(rng) * err.power)));
  const meter = sweetSpot(s) + (rng() * 2 - 1) * err.meter;
  return { dirX, dirY, power, spin: spinFor(meter, sweetSpot(s)) };
}

/** Where a side wants to land: far out (order), the circle's middle (defend), or at/before the defender (attack). */
export function idealTarget(s: LtState, through: number): { x: number; y: number } {
  if (s.stage === "order") return { x: CIRCLE.x - ORDER_AIR * 0.25, y: CIRCLE.y + ORDER_AIR * 0.97 }; // as far as it goes, down-left
  if (s.stage === "defend") return { x: CIRCLE.x, y: CIRCLE.y + CIRCLE.r * 0.15 };
  const d = s.latims[other(s.attacker)];
  if (!d) return { x: CIRCLE.x, y: CIRCLE.y };
  // Land short of the defender so the slide carries through it; `through` lands deeper (harder hit).
  const dx = d.x - ORIGIN.x;
  const dy = d.y - ORIGIN.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const short = LR * (2.2 - through * 1.6);
  return { x: d.x - (dx / len) * short, y: d.y - (dy / len) * short };
}

export function cpuThrow(s: LtState): Throw {
  const k = SKILL[s.opponent];
  return throwAt(s, idealTarget(s, k.through), k, stream(s.seed, `cpu:${s.throws}`));
}

// ---- results ---------------------------------------------------------------

export type EndingId = "flawless" | "won" | "draw" | "lost" | "cracked";
export type RankId = "wobbly" | "string-winder" | "circle-boss" | "latim-legend";

export function scoreOf(s: Pick<LtState, "won" | "kops">): number {
  return s.won.you * KNOCKOUT_POINTS + s.kops.reduce((a, g) => a + KOP_POINTS[g], 0);
}

export function endingOf(s: Pick<LtState, "won">): EndingId {
  const { you, cpu } = s.won;
  if (you >= WIN_AT && cpu === 0) return "flawless";
  if (you > cpu) return "won";
  if (you === cpu) return "draw";
  if (cpu >= WIN_AT && you === 0) return "cracked";
  return "lost";
}

export function rankFor(score: number): RankId {
  if (score >= 300) return "latim-legend";
  if (score >= 200) return "circle-boss";
  if (score >= 100) return "string-winder";
  return "wobbly";
}

export const isWin = (e: EndingId) => e === "flawless" || e === "won";
export const perfectKops = (s: Pick<LtState, "kops">) => s.kops.filter((g) => g === "perfect").length;
