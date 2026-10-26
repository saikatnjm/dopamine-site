// কাচের গুটি — pure, deterministic Kacher Guti (marbles) rules on top of
// lib/flick. You vs the computer, 3 rounds (দান), 10 marbles each.
//
// Round: both throw their shooter (খেলার গুটি) from the line toward the hole
// (in the hole or closest plays first; exact tie → you) → both stake up to
// STAKE marbles → the first player scatters the pot around the hole (holed
// ones are theirs) → the opponent names a target, the shooter flicks from
// where their shooter rests. Clean hit (the target is the FIRST marble the
// shooter touches, shooter not holed) = win it and shoot again. Foul (miss,
// another marble first, shooter holed) = pay 1 to the opponent, turn passes.
// Pot marbles that drop into the hole during any shot go to the shooter.
// Pot empty → next round (the side with fewer marbles throws first).
// Safety cap: after MAX_SHOTS_PER_ROUND shots "evening falls" and the pot is
// handed back. Match ends after ROUNDS rounds or when a side starts a round
// with 0 marbles. Marbles are conserved: you + cpu + pot = 20.
//
// Determinism: the scatter pattern and every computer decision come from
// seeded streams keyed by (seed, decision, round/shot), so the same seed and
// the same player shots replay the same match. The physics only uses
// + − × ÷ and sqrt (see lib/flick/physics.ts).
// Seed = shuffle (30 bits) · opponent index (2 bits). OPPONENTS is append-only;
// opponent, ending and rank ids are permanent.

import { aimAt, blockers, type Shot } from "@/lib/flick/ai";
import { bodyById, firstTouch, simulate, type Body, type StepEvents, type World } from "@/lib/flick/physics";
import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "kacher-guti";

export const OPPONENTS = ["choto-bhai", "boro-bhai", "champion"] as const;
export type OpponentId = (typeof OPPONENTS)[number];

export const START_MARBLES = 10;
export const TOTAL_MARBLES = START_MARBLES * 2;
export const ROUNDS = 3;
export const STAKE = 3;
export const MAX_SHOTS_PER_ROUND = 16;

// Board (world units; the stage is drawn at W × H and scaled by CSS).
export const W = 360;
export const H = 480;
export const LINE_Y = 430;
export const HOLE = { x: 180, y: 150, r: 13 } as const;
export const R = 8;
export const LINE_X: Record<Side, number> = { you: 150, cpu: 210 };
export const MIN_SPEED = 40;
export const MAX_SPEED = 820;
const FRICTION = 700;
const SCATTER_MIN = 70;
const SCATTER_SPAN = 230;

/** Computer skill (bot-tuned, see AGENTS.md). */
export const SKILL: Record<OpponentId, { angle: number; power: number; hardPick: number }> = {
  "choto-bhai": { angle: 0.068, power: 0.165, hardPick: 0.1 },
  "boro-bhai": { angle: 0.06, power: 0.14, hardPick: 0.5 },
  champion: { angle: 0.034, power: 0.09, hardPick: 0.7 },
};

export type Side = "you" | "cpu";
export type Stage = "opening" | "scatter" | "name" | "shoot" | "over";
export type Pos = { x: number; y: number };
export type PotMarble = { id: string; x: number; y: number; tint: number };

export type FoulReason = "miss" | "wrong" | "holed";
export type LastEvent =
  | { kind: "throw"; side: Side; holed: boolean }
  | { kind: "opening"; winner: Side; holed: boolean }
  | { kind: "scatter"; side: Side; holed: number }
  | { kind: "clean"; side: Side; holed: number }
  | { kind: "foul"; side: Side; reason: FoulReason; paid: boolean; holed: number }
  | { kind: "evening"; back: Record<Side, number> };

export type Stats = { clean: Record<Side, number>; fouls: Record<Side, number>; lucky: Record<Side, number> };

export type KgState = {
  seed: number;
  opponent: OpponentId;
  round: number;
  stage: Stage;
  /** Whose action it is: thrower (opening), scatterer, or shooter (name/shoot). */
  turn: Side;
  /** First thrower of this round's opening. */
  first: Side;
  pockets: Record<Side, number>;
  staked: Record<Side, number>;
  /** Shooter marbles on the board; null = still behind the line this round. */
  shooters: Record<Side, Pos | null>;
  openingHoled: Record<Side, boolean>;
  pot: PotMarble[];
  target: string | null;
  shots: number;
  roundShots: number;
  stats: Stats;
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

/** Opponent named by a seed; null when the 2-bit index names no opponent. */
export function opponentOf(seed: number): OpponentId | null {
  return OPPONENTS[(seed >>> 0) & 3] ?? null;
}

export function shuffleOf(seed: number): number {
  return (seed >>> 0) >>> 2;
}

// ---- match -----------------------------------------------------------------

export function createMatch(seed: number): KgState {
  const opponent = opponentOf(seed) ?? "boro-bhai";
  return {
    seed: seed >>> 0,
    opponent,
    round: 1,
    stage: "opening",
    turn: "you",
    first: "you",
    pockets: { you: START_MARBLES, cpu: START_MARBLES },
    staked: { you: 0, cpu: 0 },
    shooters: { you: null, cpu: null },
    openingHoled: { you: false, cpu: false },
    pot: [],
    target: null,
    shots: 0,
    roundShots: 0,
    stats: { clean: { you: 0, cpu: 0 }, fouls: { you: 0, cpu: 0 }, lucky: { you: 0, cpu: 0 } },
    last: null,
  };
}

/** Where a side's shooter is drawn (behind the line until thrown). */
export function shooterPos(s: KgState, side: Side): Pos {
  return s.shooters[side] ?? { x: LINE_X[side], y: LINE_Y };
}

/** Lip spot next to the hole for a shooter that dropped in. */
const LIP: Pos = { x: HOLE.x, y: HOLE.y + HOLE.r + R + 3 };

function marble(id: string, p: Pos): Body {
  return { id, x: p.x, y: p.y, vx: 0, vy: 0, r: R, mass: 1 };
}

function baseWorld(bodies: Body[]): World {
  return {
    bodies,
    holes: [{ ...HOLE }],
    bounds: { x0: 0, y0: 0, x1: W, y1: H },
    friction: FRICTION,
    restitution: 0.9,
    lipSpeed: 130,
    wallBounce: 0.35,
    steps: 0,
  };
}

/** The board as a physics world (no velocities). */
export function boardWorld(s: KgState): World {
  const bodies: Body[] = [];
  for (const side of ["you", "cpu"] as const) {
    const p = s.shooters[side];
    // Opening: the thrower's marble starts at the line; the other is still in hand.
    if (p) bodies.push(marble(side, p));
    else if (s.stage === "opening" && s.turn === side) bodies.push(marble(side, shooterPos(s, side)));
  }
  for (const m of s.pot) bodies.push(marble(m.id, m));
  return baseWorld(bodies);
}

/** World with the acting shooter launched (opening throw or shot). */
export function launchWorld(s: KgState, shot: Shot): World {
  const w = boardWorld(s);
  const b = bodyById(w, s.turn);
  if (b) {
    const v = Math.max(0, Math.min(MAX_SPEED, shot.speed));
    b.vx = shot.dirX * v;
    b.vy = shot.dirY * v;
  }
  return w;
}

/** World with the pot scattered around the hole. Pattern seeded per round; power 0–1 sets the spread. */
export function scatterWorld(s: KgState, power: number): World {
  const w = boardWorld(s);
  const rng = stream(s.seed, `scatter:${s.round}`);
  const p = Math.max(0, Math.min(1, power));
  const n = s.staked.you + s.staked.cpu;
  for (let i = 0; i < n; i++) {
    // Random direction without trig: rejection-sample the unit disc.
    let ux = 0;
    let uy = 0;
    let l = 0;
    do {
      ux = rng() * 2 - 1;
      uy = rng() * 2 - 1;
      l = Math.sqrt(ux * ux + uy * uy);
    } while (l < 0.2 || l > 1);
    ux /= l;
    uy /= l;
    const start = HOLE.r + R + 2 + rng() * 10;
    const speed = SCATTER_MIN + p * SCATTER_SPAN * (0.6 + rng() * 0.8);
    const b = marble(`r${s.round}m${i}`, { x: HOLE.x + ux * start, y: HOLE.y + uy * start });
    b.vx = ux * speed;
    b.vy = uy * speed;
    w.bodies.push(b);
  }
  return w;
}

/** Tint index (0–5) for a pot marble id, stable per seed. */
export function tintOf(seed: number, id: string): number {
  return hashString(`${seed}:${id}`) % 6;
}

// ---- transitions -----------------------------------------------------------

function holedPot(events: StepEvents): string[] {
  return events.holed.filter((id) => id !== "you" && id !== "cpu");
}

function placeShooters(s: KgState, w: World): KgState["shooters"] {
  const out = { ...s.shooters };
  for (const side of ["you", "cpu"] as const) {
    const b = bodyById(w, side);
    if (b) out[side] = b.holed ? { ...LIP } : { x: b.x, y: b.y };
  }
  return out;
}

function potFrom(s: KgState, w: World): PotMarble[] {
  return w.bodies
    .filter((b) => b.id !== "you" && b.id !== "cpu" && !b.holed)
    .map((b) => ({ id: b.id, x: b.x, y: b.y, tint: s.pot.find((m) => m.id === b.id)?.tint ?? tintOf(s.seed, b.id) }));
}

const dist2 = (p: Pos) => (p.x - HOLE.x) ** 2 + (p.y - HOLE.y) ** 2;

/** Apply a settled world (after simulate or the animated steps) to the match. */
export function resolve(s: KgState, w: World, events: StepEvents): KgState {
  if (s.stage === "opening") return resolveOpening(s, w);
  if (s.stage === "scatter") return resolveScatter(s, w, events);
  if (s.stage === "shoot") return resolveShot(s, w, events);
  return s;
}

function resolveOpening(s: KgState, w: World): KgState {
  const b = bodyById(w, s.turn);
  const holed = !!b?.holed;
  const shooters = placeShooters(s, w);
  const openingHoled = { ...s.openingHoled, [s.turn]: holed };
  if (s.turn === s.first) {
    return { ...s, shooters, openingHoled, turn: other(s.turn), last: { kind: "throw", side: s.turn, holed } };
  }
  // Both thrown: in the hole beats closest; exact tie → you.
  const score = (side: Side) => (openingHoled[side] ? -1 : dist2(shooters[side]!));
  const winner: Side = score("you") <= score("cpu") ? "you" : "cpu";
  const staked = { you: Math.min(STAKE, s.pockets.you), cpu: Math.min(STAKE, s.pockets.cpu) };
  return {
    ...s,
    shooters,
    openingHoled,
    staked,
    pockets: { you: s.pockets.you - staked.you, cpu: s.pockets.cpu - staked.cpu },
    stage: "scatter",
    turn: winner,
    last: { kind: "opening", winner, holed: openingHoled[winner] },
  };
}

function resolveScatter(s: KgState, w: World, events: StepEvents): KgState {
  const holed = holedPot(events).length;
  const pockets = { ...s.pockets, [s.turn]: s.pockets[s.turn] + holed };
  const next: KgState = {
    ...s,
    pockets,
    shooters: placeShooters(s, w),
    pot: potFrom(s, w),
    last: { kind: "scatter", side: s.turn, holed },
  };
  return next.pot.length === 0 ? endRound(next) : toName(next, s.turn);
}

function resolveShot(s: KgState, w: World, events: StepEvents): KgState {
  const shooter = s.turn;
  const opp = other(shooter);
  const holedIds = holedPot(events);
  const shooterHoled = events.holed.includes(shooter);
  const touched = firstTouch(events.contacts, shooter);
  const clean = !shooterHoled && touched !== undefined && touched === s.target;
  const pockets = { ...s.pockets };
  pockets[shooter] += holedIds.length;
  let pot = potFrom(s, w);
  const stats: Stats = {
    clean: { ...s.stats.clean },
    fouls: { ...s.stats.fouls },
    lucky: { ...s.stats.lucky, [shooter]: s.stats.lucky[shooter] + holedIds.length },
  };
  let last: LastEvent;
  if (clean) {
    // The target is won (unless it already dropped into the hole and was counted).
    if (pot.some((m) => m.id === s.target)) {
      pockets[shooter] += 1;
      pot = pot.filter((m) => m.id !== s.target);
    }
    stats.clean[shooter]++;
    last = { kind: "clean", side: shooter, holed: holedIds.length };
  } else {
    const paid = pockets[shooter] > 0;
    if (paid) {
      pockets[shooter] -= 1;
      pockets[opp] += 1;
    }
    stats.fouls[shooter]++;
    const reason: FoulReason = shooterHoled ? "holed" : touched === undefined ? "miss" : "wrong";
    last = { kind: "foul", side: shooter, reason, paid, holed: holedIds.length };
  }
  const next: KgState = {
    ...s,
    pockets,
    pot,
    stats,
    last,
    target: null,
    shooters: placeShooters(s, w),
    shots: s.shots + 1,
    roundShots: s.roundShots + 1,
  };
  if (next.pot.length === 0) return endRound(next);
  if (next.roundShots >= MAX_SHOTS_PER_ROUND) return evening(next);
  return toName(next, clean ? shooter : opp);
}

/** Name step: the computer names your target at once; you name the computer's. */
function toName(s: KgState, shooter: Side): KgState {
  const named: KgState = { ...s, stage: "name", turn: shooter, target: null };
  return shooter === "you" ? { ...named, stage: "shoot", target: cpuTarget(named) } : named;
}

/** You (or a test) name the computer's target. */
export function nameTarget(s: KgState, id: string): KgState {
  if (s.stage !== "name" || !s.pot.some((m) => m.id === id)) return s;
  return { ...s, stage: "shoot", target: id };
}

/** Too many shots: evening falls, the pot is handed back (odd one to whoever has fewer). */
function evening(s: KgState): KgState {
  const n = s.pot.length;
  const half = Math.floor(n / 2);
  const back = { you: half, cpu: half };
  if (n % 2) back[s.pockets.you <= s.pockets.cpu ? "you" : "cpu"]++;
  return endRound({ ...s, pot: [], pockets: { you: s.pockets.you + back.you, cpu: s.pockets.cpu + back.cpu }, last: { kind: "evening", back } });
}

function endRound(s: KgState): KgState {
  if (s.round >= ROUNDS || s.pockets.you === 0 || s.pockets.cpu === 0) return { ...s, stage: "over", target: null };
  const first: Side = s.pockets.you <= s.pockets.cpu ? "you" : "cpu";
  return {
    ...s,
    round: s.round + 1,
    stage: "opening",
    first,
    turn: first,
    target: null,
    staked: { you: 0, cpu: 0 },
    shooters: { you: null, cpu: null },
    openingHoled: { you: false, cpu: false },
    roundShots: 0,
  };
}

/** Run one action headlessly (bots, tests): build the world, simulate to rest, resolve. */
export function play(s: KgState, input: Shot | number): KgState {
  const w = s.stage === "scatter" ? scatterWorld(s, input as number) : launchWorld(s, input as Shot);
  return resolve(s, w, simulate(w));
}

// ---- computer ---------------------------------------------------------------

function aimOpts(s: KgState, key: string, beyond: number) {
  const k = SKILL[s.opponent];
  return { beyond, angleError: k.angle, powerError: k.power, rng: stream(s.seed, key), maxSpeed: MAX_SPEED };
}

/** The computer's opening throw toward the hole. */
export function cpuOpening(s: KgState): Shot {
  return aimAt(boardWorld(s), shooterPos(s, "cpu"), HOLE, aimOpts(s, `cpu-open:${s.round}`, 0));
}

/** How hard the computer scatters (0–1). */
export function cpuScatterPower(s: KgState): number {
  const rng = stream(s.seed, `cpu-scatter:${s.round}`);
  return s.opponent === "champion" ? 0.3 + rng() * 0.15 : 0.15 + rng() * 0.7;
}

/** How hard a pot marble is to hit from `from`: distance plus a penalty per marble in the way. */
export function difficulty(s: KgState, from: Pos, id: string): number {
  const w = boardWorld(s);
  const shooter = marble("_shooter", from);
  const target = bodyById(w, id);
  if (!target) return 0;
  const d = Math.sqrt((target.x - from.x) ** 2 + (target.y - from.y) ** 2);
  return d + 140 * blockers(w.bodies, shooter, target);
}

/** The pot marble the computer names for you. */
export function cpuTarget(s: KgState): string | null {
  if (s.pot.length === 0) return null;
  const rng = stream(s.seed, `cpu-name:${s.shots}`);
  if (rng() >= SKILL[s.opponent].hardPick) return s.pot[Math.floor(rng() * s.pot.length)]!.id;
  const from = shooterPos(s, "you");
  let best = s.pot[0]!;
  for (const m of s.pot) if (difficulty(s, from, m.id) > difficulty(s, from, best.id)) best = m;
  return best.id;
}

/** The computer's shot at its named target. */
export function cpuShot(s: KgState): Shot {
  const target = s.pot.find((m) => m.id === s.target) ?? s.pot[0];
  const from = shooterPos(s, "cpu");
  return aimAt(boardWorld(s), from, target ?? HOLE, aimOpts(s, `cpu-shot:${s.shots}`, 45));
}

// ---- results ---------------------------------------------------------------

export type EndingId = "clean-sweep" | "won" | "draw" | "lost" | "empty-pocket";
export type RankId = "rookie" | "gali-player" | "sharpshooter" | "guti-ustad" | "guti-legend";

export function endingOf(s: Pick<KgState, "pockets">): EndingId {
  const { you, cpu } = s.pockets;
  if (cpu === 0) return "clean-sweep";
  if (you === 0) return "empty-pocket";
  if (you > cpu) return "won";
  if (you === cpu) return "draw";
  return "lost";
}

export function rankFor(marbles: number): RankId {
  if (marbles >= 20) return "guti-legend";
  if (marbles >= 15) return "guti-ustad";
  if (marbles >= 10) return "sharpshooter";
  if (marbles >= 5) return "gali-player";
  return "rookie";
}

/** Did the player beat the computer? */
export const isWin = (e: EndingId) => e === "clean-sweep" || e === "won";
