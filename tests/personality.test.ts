import { describe, expect, it } from "vitest";
import { questions, results, traitInfo } from "@/data/games/personality";
import {
  compareTraits,
  decodeAnswers,
  encodeAnswers,
  MAX,
  OPTION_KEYS,
  QUESTION_COUNT,
  QUESTION_RULES,
  RESULT_IDS,
  RESULT_TRAIT,
  resultFor,
  topTraits,
  traitPoints,
  TRAITS,
  type OptionKey,
  type Trait,
} from "@/lib/games/personality";

const zero = () => Object.fromEntries(TRAITS.map((t) => [t, 0])) as Record<Trait, number>;

describe("trait aggregation", () => {
  it("adds each answer's fixed points", () => {
    const pts = traitPoints(["a", "b"]); // trip-plan a: adda 2 meme 1; guests b: adda 3
    expect(pts.adda).toBe(5);
    expect(pts.meme).toBe(1);
    expect(pts.village).toBe(0);
  });

  it("ignores answers beyond the quiz and unknown keys", () => {
    expect(traitPoints([...Array(QUESTION_COUNT + 3).fill("a")] as OptionKey[])).toEqual(traitPoints(Array(QUESTION_COUNT).fill("a") as OptionKey[]));
    expect(traitPoints(["x" as OptionKey])).toEqual(zero());
  });

  it("computes each trait's maximum from the rules", () => {
    for (const t of TRAITS) {
      const best = QUESTION_RULES.reduce((s, q) => s + Math.max(...OPTION_KEYS.map((k) => q.options[k][t] ?? 0)), 0);
      expect(MAX[t]).toBe(best);
      expect(MAX[t]).toBeGreaterThan(0);
    }
  });
});

describe("result and tie-breaking", () => {
  it("is deterministic", () => {
    const answers: OptionKey[] = ["c", "d", "c", "b", "b", "a", "d", "a"];
    expect(resultFor(answers)).toBe(resultFor([...answers]));
  });

  it("ranks by level (points ÷ max) first", () => {
    const pts = zero();
    pts.village = 6; // 6/12 = 50 %
    pts.meme = 7; // 7/15 ≈ 47 % — more points, lower level
    expect(compareTraits("village", "meme", pts)).toBeLessThan(0);
  });

  it("breaks equal levels by raw points", () => {
    const pts = zero();
    pts.village = MAX.village; // 100 %
    pts.meme = MAX.meme; // 100 %, more raw points
    expect(MAX.meme).toBeGreaterThan(MAX.village);
    expect(compareTraits("meme", "village", pts)).toBeLessThan(0);
  });

  it("breaks full ties by the fixed trait order", () => {
    const pts = zero();
    expect(compareTraits("adda", "foodie", pts)).toBeLessThan(0);
    expect(compareTraits("foodie", "adda", pts)).toBeGreaterThan(0);
    expect(resultFor([])).toBe("adda-emperor");
  });

  it("maps every trait to exactly one result", () => {
    expect(new Set(Object.values(RESULT_TRAIT)).size).toBe(TRAITS.length);
    expect(RESULT_IDS).toHaveLength(TRAITS.length);
  });

  it("reaches every result with a sensible share over all 4^8 answer sets", () => {
    const counts = new Map<string, number>();
    let n = 0;
    const walk = (prefix: OptionKey[]) => {
      if (prefix.length === QUESTION_COUNT) {
        const r = resultFor(prefix);
        counts.set(r, (counts.get(r) ?? 0) + 1);
        n++;
        return;
      }
      for (const k of OPTION_KEYS) walk([...prefix, k]);
    };
    walk([]);
    for (const id of RESULT_IDS) {
      const share = (counts.get(id) ?? 0) / n;
      expect(share, id).toBeGreaterThan(0.08);
      expect(share, id).toBeLessThan(0.25);
    }
  });

  it("reports top traits as real percentages", () => {
    const answers = Array(QUESTION_COUNT).fill("a") as OptionKey[];
    const top = topTraits(answers);
    expect(top.length).toBeLessThanOrEqual(3);
    const pts = traitPoints(answers);
    for (const { trait, percent } of top) expect(percent).toBe(Math.round((pts[trait] / MAX[trait]) * 100));
  });
});

describe("share links", () => {
  it("round-trips answers and rejects bad input", () => {
    const answers: OptionKey[] = ["a", "b", "c", "d", "a", "b", "c", "d"];
    expect(decodeAnswers(encodeAnswers(answers))).toEqual(answers);
    expect(decodeAnswers("ABCDABCD")).toEqual(answers);
    expect(decodeAnswers(["abcdabcd", "x"])).toEqual(answers);
    expect(decodeAnswers("abcdabc")).toBeNull();
    expect(decodeAnswers("abcdabcz")).toBeNull();
    expect(decodeAnswers(undefined)).toBeNull();
    expect(decodeAnswers(12345678)).toBeNull();
  });
});

describe("copy matches the rules", () => {
  it("has a question per rule with the same ids and all four options", () => {
    expect(questions.map((q) => q.id)).toEqual(QUESTION_RULES.map((q) => q.id));
    for (const q of questions) expect(Object.keys(q.options).sort()).toEqual([...OPTION_KEYS]);
  });

  it("has copy for every result and trait", () => {
    expect(Object.keys(results).sort()).toEqual([...RESULT_IDS].sort());
    expect(Object.keys(traitInfo).sort()).toEqual([...TRAITS].sort());
  });
});
