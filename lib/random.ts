// Deterministic randomness.
// Same (experience, choices, seed) => same sequence of numbers on every device,
// so a shared result replays identically. Never use Math.random() for gameplay.

/** 32-bit FNV-1a hash of a string. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG: tiny, fast, good enough for games. Returns floats in [0, 1). */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fresh unsigned 32-bit seed for a new run. Browser-only (uses Web Crypto). */
export function newSeed(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] ?? 0;
}

/**
 * Pick one item by weight. Items with weight <= 0 are never picked.
 * Returns undefined only when no item has positive weight.
 */
export function weightedPick<T>(
  items: readonly T[],
  weightOf: (item: T) => number,
  rng: () => number,
): T | undefined {
  let total = 0;
  const weights = items.map((item) => {
    const w = Math.max(0, weightOf(item));
    total += w;
    return w;
  });
  if (total <= 0) return undefined;

  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i] ?? 0;
    if (roll < 0) return items[i];
  }
  // Floating-point edge case: fall back to the last positive-weight item.
  for (let i = items.length - 1; i >= 0; i--) {
    if ((weights[i] ?? 0) > 0) return items[i];
  }
  return undefined;
}

/** Non-deterministic pick for UI-only features like "Surprise Me". */
export function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return items[(buf[0] ?? 0) % items.length];
}
