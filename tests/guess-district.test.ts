import { describe, expect, it } from "vitest";
import { DISTRICTS } from "@/data/dialects/districts";
import { DISTRICT_SHAPES, MAP_VIEWBOX } from "@/data/dialects/map";
import { clueContent } from "@/data/district-clues";
import { divisionOf } from "@/data/divisions";
import { decodeChallenge, encodeChallenge } from "@/lib/challenge";
import type { Source } from "@/lib/dialects/types";
import { validateClues, verifiedClues, type DistrictClue } from "@/lib/district-clues";
import {
  bboxOf,
  buildRound,
  CLUE_MAX,
  correctness,
  dailyNumber,
  dailySeed,
  EPOCH_KEY,
  gridOf,
  LOCATE_COUNT,
  rankFor,
  ROUND_LENGTH,
  SHAPE_ELIGIBLE,
  typeScores,
} from "@/lib/games/guess-district";

// TEST-ONLY placeholder clues: fake strings, never real place claims.
const src: Source = { id: "test-src", title: "Test source", type: "owner" };
const clue = (id: string, district: string, extra: Partial<DistrictClue> = {}): DistrictClue => ({
  id,
  district,
  kind: "food",
  clue: { en: `Test clue ${id}`, bn: `পরীক্ষা সূত্র ${id}` },
  sources: ["test-src"],
  confidence: "high",
  status: "verified",
  ...extra,
});
const content = (clues: DistrictClue[]) => ({ districts: DISTRICTS, sources: [src], clues });

describe("rounds", () => {
  const pool = verifiedClues(content([clue("a-1", "sylhet"), clue("b-1", "khulna"), clue("c-1", "rangpur")]));

  it("same seed + pool → identical round", () => {
    expect(buildRound(pool, 123)).toEqual(buildRound(pool, 123));
    expect(buildRound(pool, 123)).toEqual(buildRound([...pool].reverse(), 123)); // pool order doesn't matter
  });

  it("10 unique answers, each among exactly 4 unique options", () => {
    for (let seed = 1; seed < 300; seed++) {
      const r = buildRound(pool, seed * 7919);
      expect(r).toHaveLength(ROUND_LENGTH);
      expect(new Set(r.map((q) => q.answer)).size).toBe(ROUND_LENGTH);
      for (const q of r) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.options).toContain(q.answer);
      }
    }
  });

  it("mix: 4 locate, then shapes, then ≤ 2 clues; shapes never use tiny districts", () => {
    const r = buildRound(pool, 42);
    expect(r.map((q) => q.type)).toEqual([...Array(LOCATE_COUNT).fill("locate"), ...Array(ROUND_LENGTH - LOCATE_COUNT - CLUE_MAX).fill("shape"), ...Array(CLUE_MAX).fill("clue")]);
    for (const q of r.filter((x) => x.type === "shape")) expect(SHAPE_ELIGIBLE).toContain(q.answer);
    for (const q of r.filter((x) => x.type === "clue")) expect(pool.find((c) => c.id === q.clueId)?.district).toBe(q.answer);
  });

  it("falls back to shapes: 0 verified clues → 4 locate + 6 shape; 1 clue → 1 clue", () => {
    expect(buildRound([], 9).map((q) => q.type)).toEqual([...Array(4).fill("locate"), ...Array(6).fill("shape")]);
    const one = verifiedClues(content([clue("x-1", "bhola")]));
    expect(buildRound(one, 9).filter((q) => q.type === "clue")).toHaveLength(1);
  });

  it("locate distractors come from other divisions", () => {
    const r = buildRound([], 5);
    for (const q of r.filter((x) => x.type === "locate")) {
      const answerDiv = divisionOf(q.answer)!.id;
      for (const o of q.options.filter((o) => o !== q.answer)) expect(divisionOf(o)!.id).not.toBe(answerDiv);
    }
  });
});

describe("silhouette bbox", () => {
  it("parses all 64 districts inside the map, with the centroid inside the box", () => {
    const ids = Object.keys(DISTRICT_SHAPES);
    expect(ids).toHaveLength(64);
    for (const id of ids) {
      const s = DISTRICT_SHAPES[id]!;
      const b = bboxOf(s.d);
      expect(b.w, id).toBeGreaterThan(0);
      expect(b.h, id).toBeGreaterThan(0);
      expect(b.x, id).toBeGreaterThanOrEqual(0);
      expect(b.y, id).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w, id).toBeLessThanOrEqual(MAP_VIEWBOX.width + 0.5);
      expect(b.y + b.h, id).toBeLessThanOrEqual(MAP_VIEWBOX.height + 0.5);
      expect(s.cx >= b.x && s.cx <= b.x + b.w && s.cy >= b.y && s.cy <= b.y + b.h, id).toBe(true);
    }
  });

  it("handles absolute/relative M, L, H, V, C and Z", () => {
    expect(bboxOf("M10 10L20 30H5V2Z")).toEqual({ x: 5, y: 2, w: 15, h: 28 });
    expect(bboxOf("m10 10l5 5h-10v-20z")).toEqual({ x: 5, y: -5, w: 10, h: 20 });
    expect(bboxOf("M0 0C10 -5 20 5 30 0")).toEqual({ x: 0, y: -5, w: 30, h: 10 });
  });
});

describe("clue validation", () => {
  it("accepts good clues and the shipped data", () => {
    expect(validateClues(content([clue("a-1", "sylhet")]))).toEqual([]);
    expect(validateClues(clueContent())).toEqual([]);
  });

  it("rejects missing or unknown sources, unknown districts and duplicate ids", () => {
    expect(validateClues(content([clue("a-1", "sylhet", { sources: [] })])).join()).toMatch(/at least one source/);
    expect(validateClues(content([clue("a-1", "sylhet", { sources: ["ghost"] })])).join()).toMatch(/unknown source "ghost"/);
    expect(validateClues(content([clue("a-1", "narnia")])).join()).toMatch(/unknown district "narnia"/);
    expect(validateClues(content([clue("a-1", "sylhet"), clue("a-1", "khulna")])).join()).toMatch(/duplicate id/);
  });

  it("rejects clues that name the district (EN, BN or an old spelling)", () => {
    const giveaway = (en: string, bn: string, district: string) =>
      validateClues(content([clue("a-1", district, { clue: { en, bn } })])).join();
    expect(giveaway("Famous in SYLHET for test", "পরীক্ষা", "sylhet")).toMatch(/gives away/);
    expect(giveaway("Test", "সিলেটের পরীক্ষা", "sylhet")).toMatch(/gives away/);
    expect(giveaway("Old Chittagong test", "পরীক্ষা", "chattogram")).toMatch(/gives away/);
    expect(giveaway("A Comilla test", "পরীক্ষা", "cumilla")).toMatch(/gives away/);
  });

  it("only verified clues reach rounds, sorted by id", () => {
    const pool = verifiedClues(
      content([clue("z-1", "sylhet"), clue("a-1", "khulna"), clue("m-1", "bhola", { status: "needs_review" }), clue("r-1", "feni", { status: "rejected" })]),
    );
    expect(pool.map((c) => c.id)).toEqual(["a-1", "z-1"]);
  });
});

describe("score, ranks, grid, daily", () => {
  it("rank boundaries", () => {
    expect([0, 3, 4, 6, 7, 8, 9, 10].map(rankFor)).toEqual([
      "lost-tourist",
      "lost-tourist",
      "bus-window-expert",
      "bus-window-expert",
      "local-guide",
      "local-guide",
      "human-gps",
      "district-legend",
    ]);
  });

  it("grid + per-type scores from real answers", () => {
    const r = buildRound([], 77);
    const answers = r.map((q, i) => (i % 3 === 0 ? q.options.find((o) => o !== q.answer)! : q.answer));
    const results = correctness(r, answers);
    expect(gridOf(results)).toBe(results.map((ok) => (ok ? "🟩" : "🟥")).join(""));
    const types = typeScores(r, results);
    expect(types.locate!.total).toBe(4);
    expect(types.shape!.total).toBe(6);
    expect(types.clue).toBeUndefined();
    expect(types.locate!.correct + types.shape!.correct).toBe(results.filter(Boolean).length);
  });

  it("daily seed and number are stable per Bangladesh date", () => {
    expect(dailyNumber(EPOCH_KEY)).toBe(1);
    expect(dailyNumber("2026-11-04")).toBe(dailyNumber(EPOCH_KEY) + 9);
    expect(dailySeed("2026-11-04")).toBe(dailySeed("2026-11-04"));
    expect(dailySeed("2026-11-04")).not.toBe(dailySeed("2026-11-05"));
  });

  it("gd challenge tokens round-trip and cap at 10", () => {
    const token = encodeChallenge({ game: "guess-district", seed: 123456, score: 8 })!;
    expect(token).toMatch(/^1gd\./);
    expect(decodeChallenge(token)).toEqual({ game: "guess-district", seed: 123456, score: 8 });
    expect(encodeChallenge({ game: "guess-district", seed: 1, score: 11 })).toBeNull();
  });
});
