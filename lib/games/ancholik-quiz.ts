// আঞ্চলিক ভাষার লড়াই — pure, deterministic quiz rules (no DOM/React).
//
// A round is a function of (published pool, config). The config — scope
// (a district or "mixed"), level and a 24-bit shuffle — packs into one uint32
// seed, so the existing /c/<token> challenge links (lib/challenge.ts) and
// ?seed= links rebuild the exact same questions and option order:
//
//   seed = shuffle (24 bits) · scope index (6 bits) · level index (2 bits)
//
// Scope index 0 = mixed, i ≥ 1 = DISTRICTS[i - 1] (that list is append-only).
// If reviewed questions are added later, an old seed may pick a different set
// from the bigger pool — the score in a challenge link is still the friend's
// real score on their own round.

import { DISTRICTS } from "@/data/dialects/districts";
import type { Difficulty, QuizOption, QuizQuestion } from "@/lib/dialects/types";
import { decodeSeed } from "@/lib/games/shared";
import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "ancholik-quiz";
export const QUIZ_LENGTH = 10;
/** Fewer published questions than this for a scope → "প্রশ্ন তৈরি হচ্ছে!" instead of a round. */
export const MIN_QUESTIONS = 5;

export const LEVELS = ["easy", "medium", "hard"] as const satisfies readonly Difficulty[];
export const MIXED = "mixed";

/** A published question about a verified word (every one has a /games/words/<id> page). */
export type PoolQuestion = Pick<QuizQuestion, "id" | "question" | "options" | "correctOptionId" | "explanation" | "difficulty" | "districtIds"> & {
  word: { id: string; localWord: string; standardWord: string; meaningBn: string; meaningEn?: string };
};

export type QuizConfig = { scope: string; level: Difficulty; shuffle: number };

// ---------------------------------------------------------------------------
// Config ⇄ seed
// ---------------------------------------------------------------------------

const SCOPE_BITS = 63;

function scopeIndex(scope: string): number {
  if (scope === MIXED) return 0;
  const i = DISTRICTS.findIndex((d) => d.id === scope);
  return i < 0 || i + 1 > SCOPE_BITS ? -1 : i + 1;
}

export function isScope(v: unknown): v is string {
  return typeof v === "string" && scopeIndex(v) >= 0;
}

export function isLevel(v: unknown): v is Difficulty {
  return typeof v === "string" && (LEVELS as readonly string[]).includes(v);
}

/** Pack a config into one uint32 seed (null for an unknown scope/level). */
export function packSeed(c: QuizConfig): number | null {
  const s = scopeIndex(c.scope);
  const l = LEVELS.indexOf(c.level);
  if (s < 0 || l < 0 || !Number.isInteger(c.shuffle)) return null;
  return ((c.shuffle & 0xffffff) * 256 + s * 4 + l) >>> 0;
}

/** Unpack a seed; null when it names a scope or level that doesn't exist. */
export function unpackSeed(seed: number): QuizConfig | null {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) return null;
  const level = LEVELS[seed & 3];
  const s = (seed >>> 2) & SCOPE_BITS;
  const scope = s === 0 ? MIXED : DISTRICTS[s - 1]?.id;
  if (!level || !scope) return null;
  return { scope, level, shuffle: seed >>> 8 };
}

/** A fresh config from any 32-bit random number (the caller supplies it). */
export function freshConfig(scope: string, level: Difficulty, random32: number): QuizConfig {
  return { scope, level, shuffle: (random32 >>> 0) & 0xffffff };
}

// ---------------------------------------------------------------------------
// Rounds
// ---------------------------------------------------------------------------

const RANK: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

/** Questions a scope + level can draw from: that district (or all) and difficulty ≤ level. */
export function poolFor(pool: readonly PoolQuestion[], scope: string, level: Difficulty): PoolQuestion[] {
  return pool
    .filter((q) => (scope === MIXED || q.districtIds.includes(scope)) && RANK[q.difficulty] <= RANK[level])
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); // data-file order never matters
}

export function roundSize(pool: readonly PoolQuestion[], scope: string, level: Difficulty): number {
  return Math.min(QUIZ_LENGTH, poolFor(pool, scope, level).length);
}

export function canPlay(pool: readonly PoolQuestion[], scope: string, level: Difficulty): boolean {
  return poolFor(pool, scope, level).length >= MIN_QUESTIONS;
}

function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * The round for a config: up to QUIZ_LENGTH distinct questions (questions at
 * the chosen level first, then easier ones), in a seeded order, each with its
 * options shuffled. Same pool + config → same round on every device.
 */
export function buildRound(pool: readonly PoolQuestion[], config: QuizConfig): PoolQuestion[] {
  const seed = packSeed(config);
  if (seed === null) return [];
  const rng = createRng(hashString(`${GAME_SLUG}:round:${seed}`));
  const mixed = shuffled(poolFor(pool, config.scope, config.level), rng);
  const preferred = [...mixed.filter((q) => q.difficulty === config.level), ...mixed.filter((q) => q.difficulty !== config.level)];
  const picked = shuffled(preferred.slice(0, QUIZ_LENGTH), rng);
  return picked.map((q) => ({
    ...q,
    options: shuffled(q.options, createRng(hashString(`${GAME_SLUG}:options:${seed}:${q.id}`))) as QuizOption[],
  }));
}

// ---------------------------------------------------------------------------
// Answers and score
// ---------------------------------------------------------------------------

/** Unknown/missing option ids are simply wrong, never an error. */
export function isCorrect(q: Pick<QuizQuestion, "options" | "correctOptionId">, optionId: unknown): boolean {
  return typeof optionId === "string" && optionId === q.correctOptionId && q.options.some((o) => o.id === optionId);
}

export type RoundScore = { correct: number; total: number; percent: number };

/** answers[i] = option id picked for round[i] (null/undefined = not answered). */
export function scoreRound(round: readonly PoolQuestion[], answers: readonly (string | null | undefined)[]): RoundScore {
  const correct = round.reduce((n, q, i) => n + (isCorrect(q, answers[i]) ? 1 : 0), 0);
  const total = round.length;
  return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

/** Never rename tier ids (analytics + share text). */
export const TIER_IDS = ["beginner", "practice", "boss", "legend"] as const;
export type TierId = (typeof TIER_IDS)[number];

/** 0–3 / 4–6 / 7–8 / 9–10 out of 10, scaled for shorter rounds. */
export function tierFor(correct: number, total: number): TierId {
  if (total <= 0) return "beginner";
  const tenths = (correct * 10) / total;
  if (tenths < 4) return "beginner";
  if (tenths < 7) return "practice";
  if (tenths < 9) return "boss";
  return "legend";
}

// ---------------------------------------------------------------------------
// URLs: /games/ancholik-quiz?district=jashore&level=easy&seed=<base36>
// ---------------------------------------------------------------------------

export type QuizParams = { scope: string | null; level: Difficulty | null; config: QuizConfig | null };

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}

/** "Jessore" → "jashore"; "mixed" stays; anything else → null. */
export function resolveScope(raw: unknown): string | null {
  const v = first(raw);
  if (typeof v !== "string" || v.length > 40) return null;
  const key = v.trim().toLowerCase();
  if (key === MIXED) return MIXED;
  return DISTRICTS.find((d) => d.id === key || d.aliases.includes(key))?.id ?? null;
}

/**
 * Validate ?district=&level=&seed= (never throws). A valid seed is a complete
 * round and wins over district/level; bad values are ignored, not trusted.
 */
export function parseQuizParams(params: { district?: unknown; level?: unknown; seed?: unknown }): QuizParams {
  const seed = decodeSeed(first(params.seed));
  const config = seed === null ? null : unpackSeed(seed);
  if (config) return { scope: config.scope, level: config.level, config };
  const level = first(params.level);
  return { scope: resolveScope(params.district), level: isLevel(level) ? level : null, config: null };
}

export function roundPath(config: QuizConfig): string {
  const seed = packSeed(config);
  return seed === null
    ? `/games/${GAME_SLUG}`
    : `/games/${GAME_SLUG}?district=${config.scope}&level=${config.level}&seed=${seed.toString(36)}`;
}
