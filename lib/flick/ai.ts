// Computer aiming for flick games: the ideal straight shot, then a seeded,
// roughly Gaussian error. No trig: unit vectors and Math.sqrt only.

import { speedFor, type Body, type World } from "@/lib/flick/physics";
import type { Vec } from "@/lib/flick/aim";

/** ≈ N(0, 1) from 4 uniforms (Irwin–Hall). No log/cos, so it's identical everywhere. */
export function gauss(rng: () => number): number {
  return (rng() + rng() + rng() + rng() - 2) * 1.7320508075688772;
}

export type Shot = { dirX: number; dirY: number; speed: number };

/**
 * Shot from `from` that reaches `to` and rolls `beyond` more units.
 * `angleError` is the σ of the sideways error (≈ radians for small angles),
 * `powerError` the σ of the relative speed error.
 */
export function aimAt(
  world: Pick<World, "friction">,
  from: Vec,
  to: Vec,
  opts: { beyond: number; angleError: number; powerError: number; rng: () => number; maxSpeed: number },
): Shot {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const e = gauss(opts.rng) * opts.angleError;
  let dirX = ux - uy * e;
  let dirY = uy + ux * e;
  const dl = Math.sqrt(dirX * dirX + dirY * dirY);
  dirX /= dl;
  dirY /= dl;
  const ideal = speedFor(len + opts.beyond, world.friction);
  const speed = Math.max(0, Math.min(opts.maxSpeed, ideal * (1 + gauss(opts.rng) * opts.powerError)));
  return { dirX, dirY, speed };
}

/** Distance from point p to segment a→b. */
export function distToSegment(p: Vec, a: Vec, b: Vec): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const l2 = abx * abx + aby * aby;
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / l2)) : 0;
  const x = a.x + t * abx - p.x;
  const y = a.y + t * aby - p.y;
  return Math.sqrt(x * x + y * y);
}

/** Bodies (other than shooter/target) in the way of a straight shot. */
export function blockers(bodies: readonly Body[], shooter: Body, target: Body): number {
  let n = 0;
  for (const b of bodies) {
    if (b.holed || b.id === shooter.id || b.id === target.id) continue;
    if (distToSegment(b, shooter, target) < shooter.r + b.r) n++;
  }
  return n;
}
