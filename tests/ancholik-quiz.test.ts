import { describe, expect, it } from "vitest";
import { REGIONS } from "@/data/dialects/regions";
import { DIALECT_CONTENT } from "@/data/dialects";
import { buildQuizPool } from "@/lib/dialects/content";
import {
  buildRound,
  canPlay,
  freshConfig,
  isCorrect,
  LEVELS,
  MIN_QUESTIONS,
  MIXED,
  packSeed,
  parseQuizParams,
  poolFor,
  QUIZ_LENGTH,
  roundPath,
  roundSize,
  scoreRound,
  tierFor,
  unpackSeed,
  type QuizConfig,
} from "@/lib/games/ancholik-quiz";
import { fixture, form } from "./fixtures/dialects";

const pool = buildQuizPool(fixture());
const config: QuizConfig = { scope: "jashore-khulna", level: "hard", shuffle: 123_456 };

describe("seed packing", () => {
  it("round-trips every scope and level", () => {
    for (const scope of [MIXED, ...REGIONS.map((r) => r.id)]) {
      for (const level of LEVELS) {
        const c = { scope, level, shuffle: 0xabcdef };
        const seed = packSeed(c);
        expect(seed).not.toBeNull();
        expect(seed! >>> 0).toBe(seed);
        expect(unpackSeed(seed!)).toEqual(c);
      }
    }
  });

  it("rejects unknown scopes, levels and out-of-range seeds", () => {
    expect(packSeed({ scope: "atlantis", level: "easy", shuffle: 1 })).toBeNull();
    expect(packSeed({ scope: MIXED, level: "expert" as never, shuffle: 1 })).toBeNull();
    expect(unpackSeed(3)).toBeNull(); // level bits = 3
    expect(unpackSeed(63 << 2)).toBeNull(); // scope index with no region
    expect(unpackSeed(-1)).toBeNull();
    expect(unpackSeed(2 ** 32)).toBeNull();
    expect(unpackSeed(1.5)).toBeNull();
  });

  it("keeps only 24 bits of shuffle", () => {
    expect(freshConfig(MIXED, "easy", 0xffffffff).shuffle).toBe(0xffffff);
  });
});

describe("question selection", () => {
  it("filters by region and by difficulty ≤ level", () => {
    const easy = poolFor(pool, "jashore-khulna", "easy");
    expect(easy.length).toBeGreaterThan(0);
    expect(easy.every((q) => q.regionIds.includes("jashore-khulna") && q.difficulty === "easy")).toBe(true);
    expect(poolFor(pool, "jashore-khulna", "medium").every((q) => q.difficulty !== "hard")).toBe(true);
    expect(poolFor(pool, MIXED, "hard")).toHaveLength(pool.length);
    expect(poolFor(pool, "barishal", "hard")).toHaveLength(0);
  });

  it("builds a deterministic round with no duplicate questions", () => {
    const a = buildRound(pool, config);
    const b = buildRound(pool, config);
    expect(a).toEqual(b);
    expect(a).toHaveLength(QUIZ_LENGTH);
    expect(new Set(a.map((q) => q.id)).size).toBe(a.length);
  });

  it("doesn't depend on the order of the data files", () => {
    expect(buildRound([...pool].reverse(), config)).toEqual(buildRound(pool, config));
  });

  it("never repeats a question across many seeds", () => {
    for (let s = 0; s < 300; s++) {
      const r = buildRound(pool, { scope: MIXED, level: "hard", shuffle: s * 7919 });
      expect(new Set(r.map((q) => q.id)).size).toBe(r.length);
    }
  });

  it("shuffles options without losing or changing any", () => {
    for (const q of buildRound(pool, config)) {
      const original = pool.find((p) => p.id === q.id)!;
      expect([...q.options].sort((x, y) => x.id.localeCompare(y.id))).toEqual([...original.options].sort((x, y) => x.id.localeCompare(y.id)));
      expect(q.correctOptionId).toBe(original.correctOptionId);
    }
  });

  it("gives different rounds for different shuffles", () => {
    const orders = new Set(Array.from({ length: 20 }, (_, s) => buildRound(pool, { ...config, shuffle: s }).map((q) => q.id).join()));
    expect(orders.size).toBeGreaterThan(10);
  });

  it("puts questions of the chosen level first when there are enough", () => {
    // 2 districts × 12 → 8 hard questions in the mixed pool: all of them must be picked.
    const round = buildRound(pool, { scope: MIXED, level: "hard", shuffle: 42 });
    expect(round.filter((q) => q.difficulty === "hard")).toHaveLength(8);
  });

  it("uses a shorter round when the pool is small, and nothing below the minimum", () => {
    const small = buildQuizPool(fixture(MIN_QUESTIONS, ["sylhet"]));
    expect(roundSize(small, "sylhet", "hard")).toBe(MIN_QUESTIONS);
    expect(canPlay(small, "sylhet", "hard")).toBe(true);
    expect(canPlay(small, "sylhet", "easy")).toBe(false); // only 2 easy questions
    expect(canPlay([], MIXED, "hard")).toBe(false);
    expect(buildRound(small, { scope: "sylhet", level: "hard", shuffle: 1 })).toHaveLength(MIN_QUESTIONS);
  });
});

describe("answers and score", () => {
  const round = buildRound(pool, config);

  it("checks answers strictly", () => {
    const q = round[0]!;
    expect(isCorrect(q, q.correctOptionId)).toBe(true);
    expect(isCorrect(q, q.options.find((o) => o.id !== q.correctOptionId)!.id)).toBe(false);
    expect(isCorrect(q, "z")).toBe(false);
    expect(isCorrect(q, undefined)).toBe(false);
    expect(isCorrect(q, 1)).toBe(false);
    expect(isCorrect({ options: [], correctOptionId: "a" }, "a")).toBe(false);
  });

  it("scores all, none, some and missing answers", () => {
    const right = round.map((q) => q.correctOptionId);
    const wrong = round.map((q) => q.options.find((o) => o.id !== q.correctOptionId)!.id);
    expect(scoreRound(round, right)).toEqual({ correct: 10, total: 10, percent: 100 });
    expect(scoreRound(round, wrong)).toEqual({ correct: 0, total: 10, percent: 0 });
    const mixed = right.map((r, i) => (i % 3 === 0 ? wrong[i]! : r));
    expect(scoreRound(round, mixed).correct).toBe(6);
    expect(scoreRound(round, right.slice(0, 4))).toEqual({ correct: 4, total: 10, percent: 40 });
    expect(scoreRound(round, [...right, "a", "b"]).correct).toBe(10);
    expect(scoreRound([], [])).toEqual({ correct: 0, total: 0, percent: 0 });
  });

  it("maps scores to tiers at the documented boundaries", () => {
    const tiers = Array.from({ length: 11 }, (_, n) => tierFor(n, 10));
    expect(tiers).toEqual(["beginner", "beginner", "beginner", "beginner", "practice", "practice", "practice", "boss", "boss", "legend", "legend"]);
    expect(tierFor(0, 0)).toBe("beginner");
    expect(tierFor(5, 5)).toBe("legend");
    expect(tierFor(2, 5)).toBe("practice"); // 40 %
  });
});

describe("URL params", () => {
  it("accepts regions, districts (any common spelling) and mixed; rejects junk", () => {
    expect(parseQuizParams({ district: "jashore-khulna" }).scope).toBe("jashore-khulna");
    expect(parseQuizParams({ district: "jashore" }).scope).toBe("jashore-khulna");
    expect(parseQuizParams({ district: "Jessore" }).scope).toBe("jashore-khulna");
    expect(parseQuizParams({ district: ["chittagong", "x"] }).scope).toBe("chattogram");
    expect(parseQuizParams({ district: "feni" }).scope).toBe("noakhali");
    expect(parseQuizParams({ district: "bandarban" }).scope).toBeNull(); // in no dialect region
    expect(parseQuizParams({ district: "mixed" }).scope).toBe(MIXED);
    expect(parseQuizParams({ district: "<script>" }).scope).toBeNull();
    expect(parseQuizParams({ district: "x".repeat(500) }).scope).toBeNull();
    expect(parseQuizParams({ level: "hard" }).level).toBe("hard");
    expect(parseQuizParams({ level: "impossible" }).level).toBeNull();
    expect(parseQuizParams({ seed: "!!!" }).config).toBeNull();
    expect(parseQuizParams({ seed: "zzzzzzzz" }).config).toBeNull();
    expect(parseQuizParams({}).config).toBeNull();
  });

  it("lets a valid seed win over district/level and round-trips roundPath", () => {
    const url = new URL(roundPath(config), "https://example.test");
    const params = { district: "sylhet", level: "easy", seed: url.searchParams.get("seed") ?? "" };
    expect(parseQuizParams(params)).toEqual({ scope: "jashore-khulna", level: "hard", config });
  });
});

describe("unverified content is never scored", () => {
  it("builds questions only from verified Bangla-script forms", () => {
    const content = fixture(6, ["jashore-khulna"]);
    const extra = {
      ...content,
      forms: [
        ...content.forms,
        form("draft", "c0", ["barishal"], { status: "draft" }),
        form("review", "c1", ["barishal"], { status: "needs_review", confidence: "high" }),
        form("rejected", "c2", ["barishal"], { status: "rejected" }),
        form("roman", "c3", ["barishal"], { status: "needs_review", script: "romanized", text: "bilai" }),
      ],
    };
    const ids = buildQuizPool(extra).map((q) => q.id);
    expect(ids).toHaveLength(6);
    expect(ids.some((id) => /draft|review|rejected|roman/.test(id))).toBe(false);
  });

  it("makes four distinct options with the concept as the right answer", () => {
    for (const q of buildQuizPool(fixture(6, ["jashore-khulna"]))) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
      expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
    }
  });

  it("every scored question in the shipped content comes from a verified form", () => {
    const status = new Map(DIALECT_CONTENT.forms.map((f) => [`q-${f.id}`, f.status]));
    for (const q of buildQuizPool(DIALECT_CONTENT)) expect(status.get(q.id)).toBe("verified");
  });
});
