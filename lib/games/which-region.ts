// তুমি কোন এলাকার মানুষ? — pure, deterministic dialect-detective rules (no DOM/React).
//
// Each question is a concept ("তোমাদের এলাকায় 🐈-কে কী বলে?"); the options are
// the sourced regional forms of that concept (same spelling in several regions
// = one option), plus "অন্য কিছু". Picking an option is a vote for every region
// that uses it, worth 1 / (number of those regions) — a word used everywhere
// says little, a word used in one region says a lot.
//
// Region score = votes / (chances + 1), where chances = questions in which that
// region had an option at all. The +1 keeps a region with one lucky match from
// beating one that matched 5 of 6. Ties: more matching answers, then the fixed
// REGIONS order. All-"অন্য কিছু" → no result (the "mystery" ending).
// The result is a playful guess from a handful of words, never a claim about
// anyone — the UI says so.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "which-region";
export const ROUND_LENGTH = 10;
/** A concept needs forms from at least this many regions to make a good question. */
export const MIN_REGIONS = 4;
/** Fewer eligible concepts than this → "coming soon" instead of a round. */
export const MIN_QUESTIONS = 6;
export const MAX_OPTIONS = 7;
export const OTHER = "other";
const SMOOTHING = 1;

export type DetectiveForm = { id: string; conceptId: string; form: string; regions: readonly string[] };
export type DetectiveOption = { id: string; text: string; regions: string[] };
export type DetectiveQuestion = { conceptId: string; options: DetectiveOption[] };

function norm(s: string): string {
  return s.normalize("NFC").trim().replace(/\s+/g, " ");
}

/**
 * Options for one concept: forms with the same spelling merge (their regions
 * union). Above MAX_OPTIONS, keep a set that covers as many regions as possible.
 */
export function optionsFor(conceptId: string, forms: readonly DetectiveForm[], regionOrder: readonly string[]): DetectiveOption[] {
  const rank = (r: string) => {
    const i = regionOrder.indexOf(r);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  const byText = new Map<string, DetectiveOption>();
  for (const f of [...forms].filter((x) => x.conceptId === conceptId).sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const key = norm(f.form);
    const opt = byText.get(key) ?? { id: f.id, text: key, regions: [] };
    for (const r of f.regions) if (!opt.regions.includes(r)) opt.regions.push(r);
    byText.set(key, opt);
  }
  const all = [...byText.values()].map((o) => ({ ...o, regions: [...o.regions].sort((a, b) => rank(a) - rank(b)) }));
  if (all.length <= MAX_OPTIONS) return all;

  // Greedy cover: each step takes the option adding the most uncovered regions.
  const picked: DetectiveOption[] = [];
  const covered = new Set<string>();
  const left = [...all];
  while (picked.length < MAX_OPTIONS && left.length > 0) {
    left.sort((a, b) => {
      const gain = (o: DetectiveOption) => o.regions.filter((r) => !covered.has(r)).length;
      return gain(b) - gain(a) || b.regions.length - a.regions.length || (a.id < b.id ? -1 : 1);
    });
    const next = left.shift()!;
    picked.push(next);
    next.regions.forEach((r) => covered.add(r));
  }
  return picked;
}

/** Concepts whose options reach at least MIN_REGIONS regions, in the given order. */
export function eligibleConcepts(conceptIds: readonly string[], forms: readonly DetectiveForm[], regionOrder: readonly string[]): string[] {
  return conceptIds.filter((id) => {
    const regions = new Set(optionsFor(id, forms, regionOrder).flatMap((o) => o.regions));
    return regions.size >= MIN_REGIONS;
  });
}

function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Up to ROUND_LENGTH distinct concepts in a seeded order, options shuffled. */
export function buildRound(eligible: readonly string[], forms: readonly DetectiveForm[], regionOrder: readonly string[], seed: number): DetectiveQuestion[] {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}`));
  return shuffled([...eligible].sort(), rng)
    .slice(0, ROUND_LENGTH)
    .map((conceptId) => ({ conceptId, options: shuffled(optionsFor(conceptId, forms, regionOrder), rng) }));
}

export type RegionScore = { region: string; hits: number; chances: number; value: number };
export type DetectiveResult = { top: string | null; ranking: RegionScore[]; answered: number };

/** answers[i] = option id for questions[i], OTHER, or null/undefined (skipped). */
export function scoreAnswers(
  questions: readonly DetectiveQuestion[],
  answers: readonly (string | null | undefined)[],
  regionOrder: readonly string[],
): DetectiveResult {
  const hits = new Map<string, number>();
  const votes = new Map<string, number>();
  const chances = new Map<string, number>();
  let answered = 0;
  questions.forEach((q, i) => {
    for (const r of new Set(q.options.flatMap((o) => o.regions))) chances.set(r, (chances.get(r) ?? 0) + 1);
    const picked = q.options.find((o) => o.id === answers[i]);
    if (!picked) return;
    answered++;
    for (const r of picked.regions) {
      hits.set(r, (hits.get(r) ?? 0) + 1);
      votes.set(r, (votes.get(r) ?? 0) + 1 / picked.regions.length);
    }
  });
  const order = (r: string) => {
    const i = regionOrder.indexOf(r);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  const ranking = [...chances.keys()]
    .map((region) => ({
      region,
      hits: hits.get(region) ?? 0,
      chances: chances.get(region) ?? 0,
      value: (votes.get(region) ?? 0) / ((chances.get(region) ?? 0) + SMOOTHING),
    }))
    .sort((a, b) => b.value - a.value || b.hits - a.hits || order(a.region) - order(b.region));
  const top = ranking[0] && ranking[0].hits > 0 ? ranking[0].region : null;
  return { top, ranking, answered };
}

/** ?r=<region> from a shared link; anything unknown → null. */
export function parseSharedRegion(raw: unknown, regionIds: readonly string[]): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return typeof v === "string" && v.length <= 40 && regionIds.includes(v) ? v : null;
}
