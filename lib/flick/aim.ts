// Drag → flick. Slingshot style: drag back from anywhere, release to shoot
// the opposite way. Pure (no DOM) so it's testable; shared by flick games.

export type Vec = { x: number; y: number };
export type Aim = { dirX: number; dirY: number; power: number };
export type AimOpts = { deadZone: number; maxDrag: number };

export const DEFAULT_AIM: AimOpts = { deadZone: 12, maxDrag: 140 };

/** Aim from a drag (both points in the same units, e.g. CSS px). null inside the dead zone. */
export function aimFromDrag(start: Vec, end: Vec, opts: AimOpts = DEFAULT_AIM): Aim | null {
  const dx = start.x - end.x;
  const dy = start.y - end.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < opts.deadZone) return null;
  const power = Math.min(1, (len - opts.deadZone) / (opts.maxDrag - opts.deadZone));
  return { dirX: dx / len, dirY: dy / len, power };
}

// Keyboard aiming turns the direction in 3° steps. Constants instead of
// Math.cos/sin so every browser rotates identically.
const COS3 = 0.9986295347545738;
const SIN3 = 0.05233595624294383;

/** Rotate a unit direction by `steps` × 3° (positive = clockwise on screen, y down). */
export function rotateDir(dirX: number, dirY: number, steps: number): { dirX: number; dirY: number } {
  let x = dirX;
  let y = dirY;
  const n = Math.abs(Math.trunc(steps));
  const s = steps > 0 ? SIN3 : -SIN3;
  for (let i = 0; i < n; i++) [x, y] = [x * COS3 - y * s, x * s + y * COS3];
  const len = Math.sqrt(x * x + y * y) || 1;
  return { dirX: x / len, dirY: y / len };
}

/** Power 0–1 → launch speed. */
export function powerToSpeed(power: number, min: number, max: number): number {
  const p = power < 0 ? 0 : power > 1 ? 1 : power;
  return min + p * (max - min);
}

/** Speed → power 0–1 (inverse of powerToSpeed, clamped). */
export function speedToPower(speed: number, min: number, max: number): number {
  const p = (speed - min) / (max - min);
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

/** Ping-pong meter for hold-to-charge: 0 → 1 → 0 over `periodMs`. */
export function pingPong(elapsedMs: number, periodMs: number): number {
  const phase = (elapsedMs % periodMs) / periodMs;
  return phase < 0.5 ? phase * 2 : 2 - phase * 2;
}
