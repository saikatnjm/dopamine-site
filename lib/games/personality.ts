// তুমি কোন টাইপের বাঙালি? — pure, deterministic trait scoring (no DOM/React).
//
// Each of the 8 answers adds fixed points to one or more of 7 traits; every
// archetype stands for one trait. A trait's level = its points ÷ the most
// points it could get in this quiz, so traits that appear in fewer questions
// aren't disadvantaged.
//
// Result = the archetype with the highest level. Ties, in order:
//   1. higher raw points,
//   2. the earlier archetype in RESULT_IDS (fixed order).
// Same answers → same result, always. Levels are compared as exact integer
// cross-products (a.pts × b.max vs b.pts × a.max), so floating point can't
// flip a tie.
//
// Copy lives in data/games/personality.ts under the same ids. Never rename or
// reuse question, option or result ids: share links carry ?a=<letters>&r=<id>,
// and the stored result id wins over recomputation.

export const GAME_SLUG = "personality";

export const TRAITS = ["adda", "village", "philosopher", "silent", "planner", "meme", "foodie"] as const;
export type Trait = (typeof TRAITS)[number];
type Effect = Partial<Record<Trait, number>>;

export const OPTION_KEYS = ["a", "b", "c", "d"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

export type QuestionRule = { id: string; options: Record<OptionKey, Effect> };

/** Order = quiz order. Effects only; copy is in data/games/personality.ts. */
export const QUESTION_RULES: readonly QuestionRule[] = [
  { id: "trip-plan", options: { a: { adda: 2, meme: 1 }, b: { planner: 3 }, c: { silent: 2, philosopher: 1 }, d: { foodie: 3 } } },
  { id: "guests", options: { a: { foodie: 2, village: 1 }, b: { adda: 3 }, c: { meme: 3 }, d: { silent: 3 } } },
  { id: "village-home", options: { a: { village: 3 }, b: { foodie: 2, village: 1 }, c: { philosopher: 3 }, d: { meme: 3 } } },
  { id: "adda-role", options: { a: { adda: 3 }, b: { philosopher: 3 }, c: { silent: 3 }, d: { planner: 3 } } },
  { id: "rainy-day", options: { a: { foodie: 3 }, b: { philosopher: 2, silent: 1 }, c: { meme: 3 }, d: { village: 3 } } },
  { id: "eid-holiday", options: { a: { village: 3 }, b: { planner: 3 }, c: { foodie: 2, adda: 1 }, d: { meme: 2, adda: 1 } } },
  { id: "phone", options: { a: { meme: 3 }, b: { planner: 3 }, c: { adda: 3 }, d: { silent: 3 } } },
  { id: "tea-stall", options: { a: { philosopher: 3 }, b: { silent: 2, philosopher: 1 }, c: { planner: 2, adda: 1 }, d: { village: 2, foodie: 1 } } },
];

export const QUESTION_COUNT = QUESTION_RULES.length;

/** Fixed order = final tie-breaker. One archetype per trait. */
export const RESULT_IDS = [
  "adda-emperor",
  "village-legend",
  "tea-philosopher",
  "quiet-chaos",
  "plan-no-go",
  "meme-lord",
  "dawat-champion",
] as const;
export type ResultId = (typeof RESULT_IDS)[number];

export const RESULT_TRAIT: Record<ResultId, Trait> = {
  "adda-emperor": "adda",
  "village-legend": "village",
  "tea-philosopher": "philosopher",
  "quiet-chaos": "silent",
  "plan-no-go": "planner",
  "meme-lord": "meme",
  "dawat-champion": "foodie",
};

/** Most points each trait can get (its best option in every question). */
export const MAX: Record<Trait, number> = Object.fromEntries(
  TRAITS.map((tr) => [tr, QUESTION_RULES.reduce((sum, q) => sum + Math.max(...OPTION_KEYS.map((k) => q.options[k][tr] ?? 0)), 0)]),
) as Record<Trait, number>;

export type Answers = readonly OptionKey[];

export function isOptionKey(v: unknown): v is OptionKey {
  return typeof v === "string" && (OPTION_KEYS as readonly string[]).includes(v);
}
export function isResultId(v: unknown): v is ResultId {
  return typeof v === "string" && (RESULT_IDS as readonly string[]).includes(v);
}

/** Raw trait points for a full or partial answer list (unknown answers add nothing). */
export function traitPoints(answers: Answers): Record<Trait, number> {
  const pts = Object.fromEntries(TRAITS.map((tr) => [tr, 0])) as Record<Trait, number>;
  answers.forEach((key, i) => {
    const effect = QUESTION_RULES[i]?.options[key];
    if (!effect) return;
    for (const tr of TRAITS) pts[tr] += effect[tr] ?? 0;
  });
  return pts;
}

/** < 0 when trait a ranks above b (see the rules at the top). */
export function compareTraits(a: Trait, b: Trait, pts: Record<Trait, number>): number {
  const level = pts[b] * MAX[a] - pts[a] * MAX[b];
  if (level !== 0) return level;
  if (pts[a] !== pts[b]) return pts[b] - pts[a];
  return TRAITS.indexOf(a) - TRAITS.indexOf(b);
}

/** Traits best first. */
export function rankedTraits(answers: Answers): Trait[] {
  const pts = traitPoints(answers);
  return [...TRAITS].sort((a, b) => compareTraits(a, b, pts));
}

const BY_TRAIT = Object.fromEntries(RESULT_IDS.map((id) => [RESULT_TRAIT[id], id])) as Record<Trait, ResultId>;

export function resultFor(answers: Answers): ResultId {
  return BY_TRAIT[rankedTraits(answers)[0]!];
}

/** Top traits as % of the most points each could get (real numbers from your answers). */
export function topTraits(answers: Answers, count = 3): { trait: Trait; percent: number }[] {
  const pts = traitPoints(answers);
  return rankedTraits(answers)
    .map((trait) => ({ trait, percent: Math.round((pts[trait] / MAX[trait]) * 100) }))
    .filter((x) => x.percent > 0)
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
