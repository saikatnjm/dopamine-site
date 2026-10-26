// lib/flick — a tiny deterministic 2D physics engine for flick games
// (Kacher Guti, Latim Fight). Pure: no DOM/React. Bodies are circles rolling
// on flat ground seen from above: constant rolling friction, impulse
// collisions with positional correction, holes that catch slow bodies, and
// soft rectangular walls.
//
// Determinism: a fixed step (STEP_MS) and only + − × ÷ and Math.sqrt, so the
// same inputs replay the same world. No Math.sin/cos/atan2/exp here (their
// last bits can differ by browser) and never Math.random().
//
// Worlds are mutated in place by step() for speed; callers that need
// snapshots use cloneWorld(). Units are world units (≈ CSS px at 360 wide)
// and seconds.

export const STEP_MS = 1000 / 120;
export const DT = STEP_MS / 1000;
/** Collision passes per step (1 impulse pass + position-only relaxation). */
const COLLISION_PASSES = 4;
/** Speeds below this count as stopped (world units / s). */
export const SETTLE_SPEED = 2;

export type Body = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
  /** Fell into a hole: no longer moves or collides. */
  holed?: boolean;
};

export type Hole = { x: number; y: number; r: number };
export type Bounds = { x0: number; y0: number; x1: number; y1: number };

export type World = {
  bodies: Body[];
  holes: Hole[];
  bounds: Bounds;
  /** Rolling deceleration (world units / s²). */
  friction: number;
  restitution: number;
  /** A body only drops into a hole below this speed; faster ones skip over the lip. */
  lipSpeed: number;
  /** Fraction of speed kept (reversed) when a body hits a wall. */
  wallBounce: number;
  steps: number;
};

export type Contact = { a: string; b: string; impulse: number; step: number };
export type StepEvents = { contacts: Contact[]; holed: string[] };

export function speedOf(b: Body): number {
  return Math.sqrt(b.vx * b.vx + b.vy * b.vy);
}

export function cloneWorld(w: World): World {
  return { ...w, bodies: w.bodies.map((b) => ({ ...b })), holes: w.holes.map((h) => ({ ...h })), bounds: { ...w.bounds } };
}

export function bodyById(w: World, id: string): Body | undefined {
  return w.bodies.find((b) => b.id === id);
}

/**
 * Distance a body rolls from `speed` before stopping, exactly as step()
 * integrates it (friction first, then move; the last sub-step speed is dropped).
 */
export function stopDistance(speed: number, friction: number): number {
  const s = friction * DT;
  if (speed <= s) return 0;
  const n = Math.ceil(speed / s) - 1;
  return DT * (n * speed - (s * n * (n + 1)) / 2);
}

/** Launch speed that rolls about `distance` before stopping (inverse of stopDistance). */
export function speedFor(distance: number, friction: number): number {
  if (distance <= 0) return 0;
  const s = friction * DT;
  return (s + Math.sqrt(s * s + 8 * friction * distance)) / 2;
}

/** Advance the world by one fixed step. Returns this step's contacts (in order) and newly holed bodies. */
export function step(w: World): StepEvents {
  const contacts: Contact[] = [];
  const holed: string[] = [];
  const decel = w.friction * DT;
  const live = w.bodies.filter((b) => !b.holed);

  // 1. Friction, then move.
  for (const b of live) {
    const v = speedOf(b);
    if (v <= decel) {
      b.vx = 0;
      b.vy = 0;
      continue;
    }
    const k = (v - decel) / v;
    b.vx *= k;
    b.vy *= k;
    b.x += b.vx * DT;
    b.y += b.vy * DT;
  }

  // 2. Collisions (fixed pair order → deterministic). The first pass also
  // exchanges impulses; extra passes only separate chains of touching bodies.
  for (let pass = 0; pass < COLLISION_PASSES; pass++) {
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const a = live[i]!;
        const b = live[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const min = a.r + b.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min) continue;
        const d = Math.sqrt(d2);
        const nx = d > 1e-9 ? dx / d : 1;
        const ny = d > 1e-9 ? dy / d : 0;
        const ia = 1 / a.mass;
        const ib = 1 / b.mass;
        // Push apart by inverse mass so they never stay overlapped.
        const overlap = min - d;
        a.x -= (nx * overlap * ia) / (ia + ib);
        a.y -= (ny * overlap * ia) / (ia + ib);
        b.x += (nx * overlap * ib) / (ia + ib);
        b.y += (ny * overlap * ib) / (ia + ib);
        if (pass > 0) continue;
        const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn >= 0) continue; // already separating
        const impulse = (-(1 + w.restitution) * vn) / (ia + ib);
        a.vx -= impulse * ia * nx;
        a.vy -= impulse * ia * ny;
        b.vx += impulse * ib * nx;
        b.vy += impulse * ib * ny;
        contacts.push({ a: a.id, b: b.id, impulse, step: w.steps });
      }
    }
  }

  // 3. Walls: clamp inside, bounce back softly.
  const { x0, y0, x1, y1 } = w.bounds;
  for (const b of live) {
    if (b.x - b.r < x0 || b.x + b.r > x1) {
      b.x = b.x - b.r < x0 ? x0 + b.r : x1 - b.r;
      b.vx = -b.vx * w.wallBounce;
    }
    if (b.y - b.r < y0 || b.y + b.r > y1) {
      b.y = b.y - b.r < y0 ? y0 + b.r : y1 - b.r;
      b.vy = -b.vy * w.wallBounce;
    }
  }

  // 4. Holes: the centre must be well inside and the body slow, or it skips over.
  for (const b of live) {
    for (const h of w.holes) {
      const dx = b.x - h.x;
      const dy = b.y - h.y;
      const reach = h.r - b.r * 0.4;
      if (reach > 0 && dx * dx + dy * dy < reach * reach && speedOf(b) < w.lipSpeed) {
        b.holed = true;
        b.x = h.x;
        b.y = h.y;
        b.vx = 0;
        b.vy = 0;
        holed.push(b.id);
        break;
      }
    }
  }

  w.steps++;
  return { contacts, holed };
}

export function isSettled(w: World): boolean {
  return w.bodies.every((b) => b.holed || speedOf(b) < SETTLE_SPEED);
}

/** Stop every body (used after settling so tiny residual speeds never carry over). */
export function freeze(w: World): void {
  for (const b of w.bodies) {
    b.vx = 0;
    b.vy = 0;
  }
}

/** Run until settled (or maxSteps). Returns all events in order. Used by rules, tests and bots. */
export function simulate(w: World, maxSteps = 120 * 20): StepEvents {
  const all: StepEvents = { contacts: [], holed: [] };
  for (let i = 0; i < maxSteps && !isSettled(w); i++) {
    const e = step(w);
    all.contacts.push(...e.contacts);
    all.holed.push(...e.holed);
  }
  freeze(w);
  return all;
}

/** Id of the first body `id` touched in these contacts, if any. */
export function firstTouch(contacts: readonly Contact[], id: string): string | undefined {
  for (const c of contacts) {
    if (c.a === id) return c.b;
    if (c.b === id) return c.a;
  }
  return undefined;
}
