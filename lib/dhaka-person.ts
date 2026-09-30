// "What Kind of Dhaka Person Are You?" — pure, deterministic quiz scoring.
//
// Every answer adds points to 8 traits. Each trait total is normalised by the
// most points that trait could get across the quiz, so traits with fewer
// chances aren't disadvantaged. The result is the profile whose trait mix is
// closest (cosine similarity) to yours; a very even spread gives the special
// "Dhaka Final Boss". Same answers → same result, always.
//
// Copy for questions/options/results lives in data/dhaka-person.ts under the
// same ids. Never rename or reuse a question, option or result id: share links
// carry the answer letters and the result id (?a=<letters>&r=<result>). The
// stored result id wins over a recomputation, so tuning never changes a
// result someone already shared.

export const TRAITS = ["haggle", "food", "chill", "chaos", "plan", "budget", "adda", "survive"] as const;
export type Trait = (typeof TRAITS)[number];
type Effect = Partial<Record<Trait, number>>;

export const OPTION_KEYS = ["a", "b", "c", "d"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

export type QuestionRule = { id: string; options: Record<OptionKey, Effect> };

/** Order = quiz order. Effects only; copy is in data/dhaka-person.ts. */
export const QUESTION_RULES: readonly QuestionRule[] = [
  { id: "cng-fare", options: { a: { chill: 2, survive: 1 }, b: { haggle: 3 }, c: { plan: 2, budget: 1 }, d: { budget: 2, survive: 1 } } },
  { id: "jam", options: { a: { chill: 2 }, b: { survive: 3 }, c: { adda: 2, chill: 1 }, d: { chaos: 3 } } },
  { id: "food", options: { a: { food: 3 }, b: { food: 1, adda: 1, chaos: 1 }, c: { budget: 2, plan: 1 }, d: { chaos: 2, adda: 1 } } },
  { id: "boss", options: { a: { plan: 3 }, b: { chill: 3 }, c: { haggle: 2, survive: 1 }, d: { adda: 2, chaos: 1 } } },
  { id: "rain", options: { a: { chill: 2, adda: 1 }, b: { survive: 3 }, c: { plan: 3 }, d: { food: 2, adda: 1 } } },
  { id: "market", options: { a: { haggle: 3 }, b: { chaos: 2, chill: 1 }, c: { budget: 3 }, d: { adda: 2, chaos: 1 } } },
  { id: "late", options: { a: { chill: 2, chaos: 1 }, b: { plan: 2, survive: 1 }, c: { food: 2, chill: 1 }, d: { adda: 3 } } },
  { id: "friday", options: { a: { chill: 3 }, b: { plan: 1, haggle: 2 }, c: { food: 2, adda: 1 }, d: { chaos: 2, adda: 1 } } },
  { id: "salary", options: { a: { budget: 3, plan: 1 }, b: { adda: 2, food: 1 }, c: { chaos: 3 }, d: { food: 3 } } },
  { id: "directions", options: { a: { survive: 2, chaos: 1 }, b: { plan: 2, survive: 1 }, c: { adda: 3 }, d: { food: 2, haggle: 1 } } },
];

export const QUESTION_COUNT = QUESTION_RULES.length;

export const RESULT_IDS = [
  "negotiator",
  "biryani-strategist",
  "traffic-survivor",
  "budget-minister",
  "procrastinator",
  "chaos-agent",
  "excel-human",
  "adda-ambassador",
  "rickshaw-philosopher",
  "final-boss",
] as const;
export type ResultId = (typeof RESULT_IDS)[number];

/** Trait mix each result stands for. final-boss is the balanced fallback. */
const PROFILES: Record<Exclude<ResultId, "final-boss">, Effect> = {
  negotiator: { haggle: 1, budget: 0.3 },
  "biryani-strategist": { food: 1, plan: 0.25 },
  "traffic-survivor": { survive: 1 },
  "budget-minister": { budget: 1, plan: 0.15 },
  procrastinator: { chill: 1, food: 0.15 },
  "chaos-agent": { chaos: 1 },
  "excel-human": { plan: 1, survive: 0.15 },
  "adda-ambassador": { adda: 1, food: 0.2 },
  "rickshaw-philosopher": { chill: 0.75, adda: 0.75 },
};

/** Most points each trait can get (one best option per question). */
const MAX: Record<Trait, number> = Object.fromEntries(
  TRAITS.map((tr) => [tr, QUESTION_RULES.reduce((sum, q) => sum + Math.max(...OPTION_KEYS.map((k) => q.options[k][tr] ?? 0)), 0)]),
) as Record<Trait, number>;

export type Answers = readonly OptionKey[];

export function isOptionKey(v: unknown): v is OptionKey {
  return typeof v === "string" && (OPTION_KEYS as readonly string[]).includes(v);
}
export function isResultId(v: unknown): v is ResultId {
  return typeof v === "string" && (RESULT_IDS as readonly string[]).includes(v);
}

/** Raw trait points for a full or partial answer list. */
export function traitPoints(answers: Answers): Record<Trait, number> {
  const pts = Object.fromEntries(TRAITS.map((tr) => [tr, 0])) as Record<Trait, number>;
  answers.forEach((key, i) => {
    const effect = QUESTION_RULES[i]?.options[key];
    if (!effect) return;
    for (const tr of TRAITS) pts[tr] += effect[tr] ?? 0;
  });
  return pts;
}

/** Trait levels 0–1 (points / most possible). */
function levels(answers: Answers): Record<Trait, number> {
  const pts = traitPoints(answers);
  return Object.fromEntries(TRAITS.map((tr) => [tr, MAX[tr] > 0 ? pts[tr] / MAX[tr] : 0])) as Record<Trait, number>;
}

/** Balanced spread → Final Boss: no trait dominates and most traits show up. */
const BOSS_MAX_SHARE = 0.2;
const BOSS_MIN_TRAITS = 7;

export function resultFor(answers: Answers): ResultId {
  const lv = levels(answers);
  const total = TRAITS.reduce((s, tr) => s + lv[tr], 0);
  if (total === 0) return "procrastinator"; // no answers at all — fitting
  const present = TRAITS.filter((tr) => lv[tr] > 0).length;
  const topShare = Math.max(...TRAITS.map((tr) => lv[tr])) / total;
  if (present >= BOSS_MIN_TRAITS && topShare <= BOSS_MAX_SHARE) return "final-boss";

  const norm = Math.sqrt(TRAITS.reduce((s, tr) => s + lv[tr] ** 2, 0));
  let best: ResultId = "procrastinator";
  let bestScore = -Infinity;
  for (const [id, profile] of Object.entries(PROFILES) as [Exclude<ResultId, "final-boss">, Effect][]) {
    const pNorm = Math.sqrt(TRAITS.reduce((s, tr) => s + (profile[tr] ?? 0) ** 2, 0));
    const dot = TRAITS.reduce((s, tr) => s + lv[tr] * (profile[tr] ?? 0), 0);
    const score = dot / (norm * pNorm);
    // Strictly greater: ties keep the earlier profile (fixed order = deterministic).
    if (score > bestScore + 1e-9) {
      best = id;
      bestScore = score;
    }
  }
  return best;
}

/** Top traits as a share of your answers (percent, sums to ≤ 100). */
export function topTraits(answers: Answers, count = 4): { trait: Trait; percent: number }[] {
  const lv = levels(answers);
  const total = TRAITS.reduce((s, tr) => s + lv[tr], 0);
  if (total === 0) return [];
  return TRAITS.map((trait) => ({ trait, percent: Math.round((lv[trait] / total) * 100) }))
    .filter((x) => x.percent > 0)
    .sort((a, b) => b.percent - a.percent || TRAITS.indexOf(a.trait) - TRAITS.indexOf(b.trait))
    .slice(0, count);
}

/** "abcd…" ⇄ answers. decode returns null unless it is a complete, valid set. */
export function encodeAnswers(answers: Answers): string {
  return answers.join("");
}
export function decodeAnswers(raw: unknown): OptionKey[] | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string" || value.length !== QUESTION_COUNT) return null;
  const keys = value.toLowerCase().split("");
  return keys.every(isOptionKey) ? keys : null;
}
