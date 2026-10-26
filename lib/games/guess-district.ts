// কোন জেলা? — pure, deterministic rules for Guess the District (no DOM/React).
//
// A round is 10 questions built from (verified clue pool, seed):
//   4 "locate" (the map with one district filled), then up to 4+ "shape"
//   (the district's outline alone), then up to 2 "clue" (a verified text
//   clue). Fewer than 2 verified clues → the gap is filled with shapes.
// No district is the answer twice. Distractors and option order are seeded.
// The clue pool is sorted by id before any pick, so adding clues only changes
// rounds that draw new ones; like ancholik-quiz, an old seed may pick
// different clues once more are verified (the score in a link is still the
// friend's real score on their round).
//
// Daily: one seed per Bangladesh date (lib/daily.ts bdDateKey), numbered from
// EPOCH_KEY = #1. Never use Math.random() here.

import { DISTRICT_SHAPES, MAP_VIEWBOX } from "@/data/dialects/map";
import { DIVISIONS } from "@/data/divisions";
import { GD_SLUG } from "@/lib/games/guess-district-daily";
import { createRng, hashString } from "@/lib/random";

export { dailyNumber, dailySeed, EPOCH_KEY } from "@/lib/games/guess-district-daily";
export const GAME_SLUG = GD_SLUG;
export const ROUND_LENGTH = 10;
export const LOCATE_COUNT = 4;
export const CLUE_MAX = 2;
/** The smallest districts are hard to read as silhouettes: never a shape answer. */
export const SMALL_SHAPES = 6;

export type QuestionType = "locate" | "shape" | "clue";
export type Question = { type: QuestionType; answer: string; options: string[]; clueId?: string };
/** Only what the round builder needs from a clue. */
export type CluePick = { id: string; district: string };

const ALL = Object.keys(DISTRICT_SHAPES).sort();
const DIVISION_OF = new Map(DIVISIONS.flatMap((d) => d.districts.map((id) => [id, d.id] as const)));
/** Readable silhouettes: every district except the SMALL_SHAPES smallest by area. */
export const SHAPE_ELIGIBLE = [...ALL].sort((a, b) => DISTRICT_SHAPES[a]!.area - DISTRICT_SHAPES[b]!.area || (a < b ? -1 : 1)).slice(SMALL_SHAPES).sort();

function rng(seed: number, key: string, index = 0): () => number {
  return createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:${key}:${index}`));
}

function pick<T>(items: readonly T[], r: () => number): T {
  return items[Math.floor(r() * items.length)]!;
}

function shuffled<T>(items: readonly T[], r: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** n distinct items from `pool` not in `taken`, seeded. */
function take(pool: readonly string[], n: number, taken: ReadonlySet<string>, r: () => number): string[] {
  return shuffled(
    pool.filter((x) => !taken.has(x)),
    r,
  ).slice(0, n);
}

function nearest(id: string, k: number): string[] {
  const a = DISTRICT_SHAPES[id]!;
  return ALL.filter((x) => x !== id)
    .map((x) => ({ x, d: (DISTRICT_SHAPES[x]!.cx - a.cx) ** 2 + (DISTRICT_SHAPES[x]!.cy - a.cy) ** 2 }))
    .sort((p, q) => p.d - q.d || (p.x < q.x ? -1 : 1))
    .slice(0, k)
    .map((p) => p.x);
}

function optionsFor(type: QuestionType, answer: string, seed: number, index: number): string[] {
  const r = rng(seed, "opts", index);
  const division = DIVISION_OF.get(answer);
  let wrong: string[];
  if (type === "locate") {
    wrong = take(
      ALL.filter((x) => DIVISION_OF.get(x) !== division),
      3,
      new Set(),
      r,
    );
  } else if (type === "shape") {
    const near = pick(nearest(answer, 4), r);
    wrong = [near, ...take(ALL, 2, new Set([answer, near]), r)];
  } else {
    const same = ALL.filter((x) => x !== answer && DIVISION_OF.get(x) === division);
    const first = same.length ? [pick(same, r)] : [];
    wrong = [...first, ...take(ALL, 3 - first.length, new Set([answer, ...first]), r)];
  }
  return shuffled([answer, ...wrong], r);
}

/** The round for a seed and a (verified) clue pool. Same inputs → same round. */
export function buildRound(clues: readonly CluePick[], seed: number): Question[] {
  const used = new Set<string>();
  const sorted = [...clues].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  // Clue answers first (the scarcest), one clue per district.
  const clueQs: Question[] = [];
  const r = rng(seed, "clues");
  for (const c of shuffled(sorted, r)) {
    if (clueQs.length >= CLUE_MAX) break;
    if (used.has(c.district)) continue;
    used.add(c.district);
    clueQs.push({ type: "clue", answer: c.district, options: [], clueId: c.id });
  }
  const shapeCount = ROUND_LENGTH - LOCATE_COUNT - clueQs.length;
  const shapeAnswers = take(SHAPE_ELIGIBLE, shapeCount, used, rng(seed, "shapes"));
  shapeAnswers.forEach((a) => used.add(a));
  const locateAnswers = take(ALL, LOCATE_COUNT, used, rng(seed, "locate"));

  const round: Question[] = [
    ...locateAnswers.map((answer) => ({ type: "locate" as const, answer, options: [] as string[] })),
    ...shapeAnswers.map((answer) => ({ type: "shape" as const, answer, options: [] as string[] })),
    ...clueQs,
  ];
  return round.map((q, i) => ({ ...q, options: optionsFor(q.type, q.answer, seed, i) }));
}

// ---------------------------------------------------------------------------
// Score, ranks, grid
// ---------------------------------------------------------------------------

export const RANK_IDS = ["lost-tourist", "bus-window-expert", "local-guide", "human-gps", "district-legend"] as const;
export type RankId = (typeof RANK_IDS)[number];

export function rankFor(score: number): RankId {
  if (score >= 10) return "district-legend";
  if (score >= 9) return "human-gps";
  if (score >= 7) return "local-guide";
  if (score >= 4) return "bus-window-expert";
  return "lost-tourist";
}

/** answers[i] = picked district for round[i]. */
export function correctness(round: readonly Question[], answers: readonly (string | null | undefined)[]): boolean[] {
  return round.map((q, i) => answers[i] === q.answer);
}

export function gridOf(results: readonly boolean[]): string {
  return results.map((ok) => (ok ? "🟩" : "🟥")).join("");
}

/** Correct / asked per question type (only types that were played). */
export function typeScores(round: readonly Question[], results: readonly boolean[]): Partial<Record<QuestionType, { correct: number; total: number }>> {
  const out: Partial<Record<QuestionType, { correct: number; total: number }>> = {};
  round.forEach((q, i) => {
    const s = (out[q.type] ??= { correct: 0, total: 0 });
    s.total++;
    if (results[i]) s.correct++;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Silhouette bounding box from an SVG path (M/L/H/V/C/Z, absolute + relative)
// ---------------------------------------------------------------------------

export type BBox = { x: number; y: number; w: number; h: number };

/** Bounding box of a path. Curve control points are included (a safe over-estimate). */
export function bboxOf(d: string): BBox {
  const tokens = d.match(/[MmLlHhVvCcZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let x = 0, y = 0, sx = 0, sy = 0, cmd = "M";
  const see = (px: number, py: number) => {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
  };
  let i = 0;
  const n = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const tok = tokens[i]!;
    if (/[A-Za-z]/.test(tok)) {
      cmd = tok;
      i++;
      if (cmd === "Z" || cmd === "z") {
        x = sx;
        y = sy;
      }
      continue;
    }
    switch (cmd) {
      case "M":
      case "L":
        x = n();
        y = n();
        if (cmd === "M") {
          sx = x;
          sy = y;
          cmd = "L"; // implicit lineto after moveto
        }
        break;
      case "m":
      case "l":
        x += n();
        y += n();
        if (cmd === "m") {
          sx = x;
          sy = y;
          cmd = "l";
        }
        break;
      case "H":
        x = n();
        break;
      case "h":
        x += n();
        break;
      case "V":
        y = n();
        break;
      case "v":
        y += n();
        break;
      case "C": {
        const pts = [n(), n(), n(), n(), n(), n()];
        see(pts[0]!, pts[1]!);
        see(pts[2]!, pts[3]!);
        x = pts[4]!;
        y = pts[5]!;
        break;
      }
      case "c": {
        const pts = [n(), n(), n(), n(), n(), n()];
        see(x + pts[0]!, y + pts[1]!);
        see(x + pts[2]!, y + pts[3]!);
        x += pts[4]!;
        y += pts[5]!;
        break;
      }
      default:
        i++; // unknown command: skip a number rather than loop forever
        continue;
    }
    see(x, y);
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: MAP_VIEWBOX.width, h: MAP_VIEWBOX.height };
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
