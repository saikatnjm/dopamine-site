// Tiny client-side UI experiments (no backend, no personal data).
//
// UI experimentation only: assignment is per browser, so results are rough
// signals — never report them as statistically significant A/B results.
//
// localStorage["hottogol:exp:v1"] = { [experimentId]: variant }. The first
// read assigns a random variant (crypto) and saves it; returning visitors keep
// theirs. Blocked/private storage → a per-page-load assignment (in memory).
// To remove an experiment: delete its entry here and its UI component.

export const EXPERIMENTS = {
  "home-cta": ["a", "b"],
} as const satisfies Record<string, readonly string[]>;

export type ExperimentId = keyof typeof EXPERIMENTS;
export type Variant<E extends ExperimentId> = (typeof EXPERIMENTS)[E][number];

const STORAGE_KEY = "hottogol:exp:v1";
const memory: Partial<Record<ExperimentId, string>> = {};

function isVariant<E extends ExperimentId>(id: E, v: unknown): v is Variant<E> {
  return typeof v === "string" && (EXPERIMENTS[id] as readonly string[]).includes(v);
}

/** Parse the stored map; anything odd is ignored (never throws). */
export function parseAssignments(raw: string | null): Partial<Record<ExperimentId, string>> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return {};
    const out: Partial<Record<ExperimentId, string>> = {};
    for (const id of Object.keys(EXPERIMENTS) as ExperimentId[]) {
      const v = (data as Record<string, unknown>)[id];
      if (isVariant(id, v)) out[id] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Uniform pick from the variants (Web Crypto). `rand` is injectable for tests. */
export function pickVariant<E extends ExperimentId>(id: E, rand: () => number = cryptoRandom): Variant<E> {
  const list = EXPERIMENTS[id];
  return list[Math.min(list.length - 1, Math.floor(rand() * list.length))] as Variant<E>;
}

function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) / 2 ** 32;
}

/** This browser's variant (assigning + saving on first call). Client-only. */
export function getVariant<E extends ExperimentId>(id: E): Variant<E> {
  let stored: Partial<Record<ExperimentId, string>> = {};
  try {
    stored = parseAssignments(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // storage blocked — fall through to memory
  }
  const existing = stored[id] ?? memory[id];
  if (isVariant(id, existing)) return existing;
  const v = pickVariant(id);
  memory[id] = v;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, [id]: v }));
  } catch {
    // private mode / disabled storage: keep the in-memory assignment
  }
  return v;
}
