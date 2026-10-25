import { describe, expect, it } from "vitest";
import { DIALECT_CONTENT } from "@/data/dialects";
import { buildPublicForms } from "@/lib/dialects/content";
import {
  buildRound,
  eligibleConcepts,
  MAX_OPTIONS,
  MIN_QUESTIONS,
  MIN_REGIONS,
  optionsFor,
  OTHER,
  parseSharedRegion,
  ROUND_LENGTH,
  scoreAnswers,
  type DetectiveForm,
  type DetectiveQuestion,
} from "@/lib/games/which-region";

const ORDER = ["a", "b", "c", "d", "e", "f", "g", "h"];
const f = (id: string, conceptId: string, form: string, regions: string[]): DetectiveForm => ({ id, conceptId, form, regions });

describe("options", () => {
  it("merges forms with the same spelling across regions", () => {
    const opts = optionsFor("cat", [f("1", "cat", "বিলাই", ["a"]), f("2", "cat", "বিলাই ", ["b"]), f("3", "cat", "মেকুর", ["c"])], ORDER);
    expect(opts).toHaveLength(2);
    expect(opts.find((o) => o.text === "বিলাই")!.regions).toEqual(["a", "b"]);
  });

  it("caps options while covering as many regions as possible", () => {
    const forms = ORDER.flatMap((r, i) => [f(`${r}1`, "x", `শব্দ-${i}`, [r]), f(`${r}2`, "x", `অন্য-${i}`, [r])]);
    const opts = optionsFor("x", forms, ORDER);
    expect(opts).toHaveLength(MAX_OPTIONS);
    expect(new Set(opts.flatMap((o) => o.regions)).size).toBe(MAX_OPTIONS); // 7 options → 7 different regions
  });

  it("only concepts reaching MIN_REGIONS regions are eligible", () => {
    const forms = [
      ...["a", "b", "c", "d"].map((r, i) => f(`w${r}`, "wide", `শ-${i}`, [r])),
      ...["a", "b"].map((r, i) => f(`n${r}`, "narrow", `ন-${i}`, [r])),
    ];
    expect(MIN_REGIONS).toBe(4);
    expect(eligibleConcepts(["wide", "narrow"], forms, ORDER)).toEqual(["wide"]);
  });
});

describe("rounds", () => {
  const forms = Array.from({ length: 14 }, (_, c) => ["a", "b", "c", "d", "e"].map((r, i) => f(`${c}-${r}`, `c${c}`, `শব্দ-${c}-${i}`, [r]))).flat();
  const eligible = eligibleConcepts(Array.from({ length: 14 }, (_, c) => `c${c}`), forms, ORDER);

  it("is deterministic per seed with distinct concepts", () => {
    const a = buildRound(eligible, forms, ORDER, 7);
    expect(a).toEqual(buildRound(eligible, forms, ORDER, 7));
    expect(a).toHaveLength(ROUND_LENGTH);
    expect(new Set(a.map((q) => q.conceptId)).size).toBe(ROUND_LENGTH);
  });

  it("varies between seeds", () => {
    const orders = new Set(Array.from({ length: 15 }, (_, s) => buildRound(eligible, forms, ORDER, s).map((q) => q.conceptId).join()));
    expect(orders.size).toBeGreaterThan(8);
  });
});

describe("scoring", () => {
  const q = (conceptId: string, options: [string, string[]][]): DetectiveQuestion => ({
    conceptId,
    options: options.map(([id, regions]) => ({ id, text: id, regions })),
  });
  const round = [
    q("1", [["a1", ["a"]], ["b1", ["b"]], ["ab1", ["a", "b", "c", "d"]]]),
    q("2", [["a2", ["a"]], ["b2", ["b"]], ["c2", ["c"]]]),
    q("3", [["a3", ["a"]], ["b3", ["b"]], ["d3", ["d"]]]),
  ];

  it("picks the region whose words you chose", () => {
    expect(scoreAnswers(round, ["b1", "b2", "b3"], ORDER).top).toBe("b");
    const r = scoreAnswers(round, ["a1", "a2", "b3"], ORDER);
    expect(r.top).toBe("a");
    expect(r.ranking[0]).toMatchObject({ region: "a", hits: 2, chances: 3 });
    expect(r.answered).toBe(3);
  });

  it("a word shared by many regions counts less than a unique one", () => {
    // ab1 is used in 4 regions, b2 + b3 only in b → b wins over a.
    expect(scoreAnswers(round, ["ab1", "b2", "b3"], ORDER).top).toBe("b");
  });

  it("smooths by chances so one lucky match doesn't win", () => {
    // c had 2 chances (q1 via ab1, q2), matched once uniquely; a matched twice in 3.
    const r = scoreAnswers(round, ["a1", "c2", "a3"], ORDER);
    expect(r.top).toBe("a");
  });

  it("breaks exact ties by matching answers, then the fixed region order", () => {
    const tie = [q("1", [["a1", ["a"]], ["b1", ["b"]]]), q("2", [["a2", ["a"]], ["b2", ["b"]]])];
    expect(scoreAnswers(tie, ["a1", "b2"], ORDER).top).toBe("a");
    expect(scoreAnswers(tie, ["a1", "b2"], ["b", "a"]).top).toBe("b");
  });

  it("all 'something else' (or junk ids) gives no result", () => {
    const r = scoreAnswers(round, [OTHER, OTHER, "nonsense"], ORDER);
    expect(r.top).toBeNull();
    expect(r.answered).toBe(0);
    expect(scoreAnswers([], [], ORDER).top).toBeNull();
  });
});

describe("shared links", () => {
  it("accepts only known region ids", () => {
    expect(parseSharedRegion("barishal", ["barishal"])).toBe("barishal");
    expect(parseSharedRegion(["barishal", "x"], ["barishal"])).toBe("barishal");
    expect(parseSharedRegion("narnia", ["barishal"])).toBeNull();
    expect(parseSharedRegion("<script>", ["barishal"])).toBeNull();
    expect(parseSharedRegion(undefined, ["barishal"])).toBeNull();
  });
});

describe("with the shipped (source-backed) content", () => {
  const forms = buildPublicForms(DIALECT_CONTENT);
  const order = DIALECT_CONTENT.regions.map((r) => r.id);
  const eligible = eligibleConcepts(DIALECT_CONTENT.concepts.map((c) => c.id), forms, order);

  it("has enough good questions to play", () => {
    expect(eligible.length).toBeGreaterThanOrEqual(MIN_QUESTIONS);
  });

  it("every region that has words can win", () => {
    // Answering every question with a region's own words makes that region the top guess.
    for (const region of order) {
      const round = buildRound(eligible, forms, order, 1).filter((q) => q.options.some((o) => o.regions.includes(region)));
      if (round.length < 3) continue;
      const answers = round.map((q) => [...q.options].sort((x, y) => x.regions.length - y.regions.length).find((o) => o.regions.includes(region))!.id);
      expect(scoreAnswers(round, answers, order).top, region).toBe(region);
    }
  });
});
