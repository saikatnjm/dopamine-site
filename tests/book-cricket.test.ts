import { describe, expect, it } from "vitest";
import { decodeChallenge, encodeChallenge } from "@/lib/challenge";
import {
  createMatch,
  endingOf,
  firstBallOut,
  isOver,
  LEGAL_BALLS,
  MAX_NO_BALLS,
  newInnings,
  pageFor,
  playBall,
  rankFor,
  TARGET_MIN,
  TARGET_SPAN,
  teacherCaught,
  teacherDue,
  WICKETS,
  type Ball,
  type Choice,
  type Innings,
  type Match,
} from "@/lib/games/book-cricket";

/** Find a seed whose first page satisfies `want` (pages are fixed per seed). */
function seedWhere(want: (page: number) => boolean, index = 0): number {
  for (let s = 1; s < 200_000; s++) if (want(pageFor(s, index))) return s;
  throw new Error("no seed found");
}
const first = (seed: number, choice: Choice): Ball => playBall(newInnings(), createMatch(seed), choice).balls[0]!;
const fake = (target: number): Match => ({ seed: 1, target, teacherBall: 99 });
const ball = (b: Partial<Ball>): Ball => ({ page: 22, choice: "slog", kind: "two", runs: 2, legal: true, freeHit: false, index: 0, ...b });
const innings = (balls: Ball[], target: number): Innings => {
  let s = newInnings();
  const m = fake(target);
  for (const b of balls) {
    const runs = s.runs + b.runs;
    s = {
      ...s,
      runs,
      wickets: s.wickets + (b.kind === "out" ? 1 : 0),
      legal: s.legal + (b.legal ? 1 : 0),
      balls: [...s.balls, b],
      passedAt: s.passedAt < 0 && runs > m.target ? s.balls.length : s.passedAt,
    };
  }
  return s;
};

describe("determinism", () => {
  it("same seed → same target, teacher ball and pages, whatever the choices", () => {
    const m = createMatch(12345);
    expect(createMatch(12345)).toEqual(m);
    expect(m.target).toBeGreaterThanOrEqual(TARGET_MIN);
    expect(m.target).toBeLessThan(TARGET_MIN + TARGET_SPAN);
    expect(m.teacherBall).toBeGreaterThanOrEqual(4);
    expect(m.teacherBall).toBeLessThanOrEqual(10);
    let a = newInnings();
    let b = newInnings();
    for (let i = 0; i < 8; i++) {
      a = playBall(a, m, "slog");
      b = playBall(b, m, "defend");
    }
    const pagesA = a.balls.map((x) => x.page);
    const pagesB = b.balls.map((x) => x.page);
    expect(pagesA.slice(0, Math.min(pagesA.length, pagesB.length))).toEqual(pagesB.slice(0, Math.min(pagesA.length, pagesB.length)));
  });

  it("pages are even, 2–400", () => {
    for (let i = 0; i < 500; i++) {
      const p = pageFor(99, i);
      expect(p % 2).toBe(0);
      expect(p).toBeGreaterThanOrEqual(2);
      expect(p).toBeLessThanOrEqual(400);
    }
  });
});

describe("outcome table", () => {
  it("digit 0: slog out, defend dot (but x00 is out)", () => {
    const zero = seedWhere((p) => p % 10 === 0 && p % 100 !== 0);
    expect(first(zero, "slog").kind).toBe("out");
    expect(first(zero, "defend").kind).toBe("dot");
    const hundred = seedWhere((p) => p % 100 === 0);
    expect(first(hundred, "defend").kind).toBe("out");
  });

  it("digits 2/4/6: slog 2/4/6, defend 1/1/2", () => {
    for (const [d, slog, defend] of [[2, 2, 1], [4, 4, 1], [6, 6, 2]] as const) {
      const s = seedWhere((p) => p % 10 === d);
      expect(first(s, "slog").runs).toBe(slog);
      expect(first(s, "defend").runs).toBe(defend);
      expect(first(s, "slog").legal).toBe(true);
    }
  });

  it("digit 8: no ball (+1, not legal) then a free hit that can't get you out", () => {
    const nb = seedWhere((p) => p % 10 === 8);
    expect(first(nb, "slog")).toMatchObject({ kind: "no-ball", runs: 1, legal: false });
    let st = playBall(newInnings(), createMatch(nb), "slog");
    expect(st.freeHit).toBe(true);
    expect(st.legal).toBe(0);
    // A free hit on a 0 page is a dot, not out.
    // Find a seed whose second page is a 0 after a first-page 8.
    const s2 = (() => {
      for (let x = 1; x < 200_000; x++) if (pageFor(x, 0) % 10 === 8 && pageFor(x, 1) % 10 === 0) return x;
      throw new Error("none");
    })();
    st = playBall(newInnings(), createMatch(s2), "slog");
    st = playBall(st, createMatch(s2), "slog");
    expect(st.balls[1]).toMatchObject({ kind: "dot", freeHit: true });
    expect(st.wickets).toBe(0);
  });

  it("caps no-balls at MAX_NO_BALLS (then an 8 is a dot)", () => {
    // Scan seeds for one with ≥ 7 eights among the first deliveries of a slog innings.
    for (let x = 1; x < 50_000; x++) {
      const m = createMatch(x);
      let st = newInnings();
      while (!isOver(st)) st = playBall(st, m, "defend");
      const eights = st.balls.filter((b) => b.page !== null && b.page % 10 === 8);
      if (eights.length > MAX_NO_BALLS) {
        expect(st.noBalls).toBe(MAX_NO_BALLS);
        expect(eights[MAX_NO_BALLS]).toMatchObject({ kind: "dot", legal: true });
        return;
      }
    }
    throw new Error("no seed with enough no-balls");
  });

  it("teacher catch is a legal dot that still uses up a page index", () => {
    for (let x = 1; x < 1000; x++) {
      const m = createMatch(x);
      let st = newInnings();
      while (!teacherDue(st, m) && !isOver(st)) st = playBall(st, m, "defend");
      if (isOver(st)) continue;
      const before = st.deliveries;
      const caught = teacherCaught(st, m);
      expect(caught.balls.at(-1)).toMatchObject({ kind: "teacher", legal: true, page: null, runs: 0 });
      expect(caught.legal).toBe(st.legal + 1);
      expect(caught.deliveries).toBe(before + 1);
      expect(caught.teacherDone).toBe(true);
      // The next real ball uses the page *after* the skipped one.
      expect(playBall(caught, m, "slog").balls.at(-1)!.page).toBe(pageFor(m.seed, before + 1));
      return;
    }
    throw new Error("no seed reached the teacher ball");
  });
});

describe("innings length", () => {
  it("ends at exactly 12 legal balls or 3 wickets — never early on passing the target", () => {
    for (let x = 1; x < 400; x++) {
      const m = { ...createMatch(x), target: 0 }; // passed on the first run scored
      let st = newInnings();
      while (!isOver(st)) st = playBall(st, m, x % 2 ? "slog" : "defend", teacherDue(st, m));
      expect(st.legal === LEGAL_BALLS || st.wickets === WICKETS).toBe(true);
      expect(st.legal).toBeLessThanOrEqual(LEGAL_BALLS);
      expect(playBall(st, m, "slog")).toBe(st); // no-op once over
    }
  });
});

describe("endings and ranks", () => {
  const twelve = (last: Ball) => [...Array.from({ length: 11 }, () => ball({ kind: "dot", runs: 0 })), last];

  it("checks endings in order", () => {
    expect(endingOf(innings(twelve(ball({ kind: "six", runs: 6 })), 5), fake(5))).toBe("last-ball-win");
    expect(endingOf(innings([ball({ kind: "six", runs: 6 }), ...Array.from({ length: 11 }, () => ball({ kind: "dot", runs: 0 }))], 5), fake(5))).toBe("won-chase");
    expect(endingOf(innings(twelve(ball({ kind: "two", runs: 2 })), 2), fake(2))).toBe("tie");
    const allOut = [ball({ kind: "out", runs: 0 }), ball({ kind: "out", runs: 0 }), ball({ kind: "out", runs: 0 })];
    expect(endingOf(innings(allOut, 10), fake(10))).toBe("all-out");
    expect(endingOf(innings(twelve(ball({ kind: "one", runs: 1 })), 10), fake(10))).toBe("lost-chase");
  });

  it("passing the target on a no-ball before the last legal ball is not a last-ball win", () => {
    const balls = [...Array.from({ length: 11 }, () => ball({ kind: "dot", runs: 0 })), ball({ kind: "no-ball", runs: 1, legal: false }), ball({ kind: "dot", runs: 0 })];
    expect(endingOf(innings(balls, 0), fake(0))).toBe("won-chase");
  });

  it("rank boundaries", () => {
    expect([0, 1, 9, 10, 19, 20, 29, 30, 39, 40, 78].map(rankFor)).toEqual([
      "duck",
      "tailender",
      "tailender",
      "tiffin-batter",
      "tiffin-batter",
      "back-bench-hitter",
      "back-bench-hitter",
      "class-captain",
      "class-captain",
      "book-legend",
      "book-legend",
    ]);
  });

  it("detects a first-ball duck (ignoring no-balls before it)", () => {
    expect(firstBallOut(innings([ball({ kind: "no-ball", runs: 1, legal: false }), ball({ kind: "out", runs: 0 })], 9))).toBe(true);
    expect(firstBallOut(innings([ball({ kind: "dot", runs: 0 }), ball({ kind: "out", runs: 0 })], 9))).toBe(false);
  });
});

describe("challenge links", () => {
  it("round-trips bk, accepts 200, rejects 201", () => {
    const token = encodeChallenge({ game: "book-cricket", seed: 4_000_000_000, score: 34 })!;
    expect(token).toMatch(/^1bk\./);
    expect(decodeChallenge(token)).toEqual({ game: "book-cricket", seed: 4_000_000_000, score: 34 });
    expect(encodeChallenge({ game: "book-cricket", seed: 1, score: 200 })).not.toBeNull();
    expect(encodeChallenge({ game: "book-cricket", seed: 1, score: 201 })).toBeNull();
  });
});
