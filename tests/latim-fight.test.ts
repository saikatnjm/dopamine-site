import { describe, expect, it } from "vitest";
import { decodeChallenge, encodeChallenge } from "@/lib/challenge";
import { simulate } from "@/lib/flick/physics";
import { createRng } from "@/lib/random";
import {
  applyKop,
  CIRCLE,
  cpuThrow,
  createMatch,
  endingOf,
  idealTarget,
  kopGrade,
  LR,
  MAX_BOUTS,
  opponentOf,
  OPPONENTS,
  ORIGIN,
  packSeed,
  play,
  rankFor,
  resolve,
  scoreOf,
  spinFor,
  throwAt,
  throwWorld,
  type LtState,
  type Throw,
} from "@/lib/games/latim-fight";

const SEED = packSeed(4242, "boro-bhai");
const exact = { angle: 0, power: 0, meter: 0 };
const toward = (s: LtState, p: { x: number; y: number }, spin = 1): Throw => ({ ...throwAt(s, p, exact, createRng(1)), spin });

/** An attack position laid out by hand: the defender spins at `d`. */
function attackState(d: { x: number; y: number; spin?: number; fallen?: boolean }, attacker: "you" | "cpu" = "you"): LtState {
  const s = createMatch(SEED);
  const defender = attacker === "you" ? "cpu" : "you";
  return {
    ...s,
    stage: "attack",
    turn: attacker,
    attacker,
    bouts: 1,
    latims: { you: null, cpu: null, [defender]: { x: d.x, y: d.y, spin: d.spin ?? 0.8, fallen: d.fallen ?? false } } as LtState["latims"],
  };
}

describe("seed + tokens", () => {
  it("packs the opponent; lt tokens round-trip with max 1000", () => {
    for (const o of OPPONENTS) expect(opponentOf(packSeed(99, o))).toBe(o);
    expect(opponentOf(3)).toBeNull();
    const seed = packSeed(7, "champion");
    const token = encodeChallenge({ game: "latim-fight", seed, score: 1000 })!;
    expect(token).toMatch(/^1lt\./);
    expect(decodeChallenge(token)).toEqual({ game: "latim-fight", seed, score: 1000 });
    expect(encodeChallenge({ game: "latim-fight", seed, score: 1001 })).toBeNull();
  });
});

describe("throws", () => {
  it("spin: 1 in the sweet spot, less (≥ 0.3) further off", () => {
    expect(spinFor(0.7, 0.7)).toBe(1);
    expect(spinFor(0.75, 0.7)).toBe(1);
    expect(spinFor(0.9, 0.7)).toBeLessThan(1);
    expect(spinFor(0, 1)).toBe(0.3);
  });

  it("order throw: farthest attacks first; an exact tie goes to you", () => {
    let s = createMatch(SEED);
    s = play(s, { dirX: 0, dirY: 1, power: 0.2, spin: 1 });
    expect(s.turn).toBe("cpu");
    s = play(s, { dirX: 0, dirY: 1, power: 0.9, spin: 1 });
    expect(s.attacker).toBe("cpu");
    expect(s.stage).toBe("defend");
    expect(s.turn).toBe("you");
    expect(s.bouts).toBe(1);

    let t = createMatch(SEED);
    t = play(t, { dirX: 0.6, dirY: 0.8, power: 0.5, spin: 1 });
    t = play(t, { dirX: 0.6, dirY: 0.8, power: 0.5, spin: 1 }); // the identical throw → same distance
    expect(t.attacker).toBe("you");
  });

  it("a defender landing outside the circle is set down inside, still spinning", () => {
    const s = { ...createMatch(SEED), stage: "defend" as const, turn: "you" as const, attacker: "cpu" as const, bouts: 1 };
    const n = play(s, { dirX: 0, dirY: 1, power: 0.05, spin: 1 }); // stays near the throwing spot
    expect(n.last?.kind).toBe("placed");
    const l = n.latims.you!;
    expect(Math.hypot(l.x - CIRCLE.x, l.y - CIRCLE.y)).toBeLessThanOrEqual(CIRCLE.r * 0.6 + 1e-9);
    expect(l.spin).toBeGreaterThan(0.5);
    expect(n.stage).toBe("attack");
    expect(n.turn).toBe("cpu");
  });
});

describe("bouts", () => {
  it("knockout: +1 for the attacker, then your kop, then you attack again", () => {
    const s = attackState({ x: CIRCLE.x, y: CIRCLE.y - CIRCLE.r + 20, spin: 0.3 });
    const n = play(s, toward(s, { x: CIRCLE.x, y: CIRCLE.y - CIRCLE.r + 20 + LR * 2.2 }));
    expect(n.last).toEqual({ kind: "knockout", side: "you" });
    expect(n.won.you).toBe(1);
    expect(n.stage).toBe("kop");
    const k = applyKop(n, "perfect");
    expect(scoreOf(k)).toBe(150);
    expect(k.stage).toBe("defend");
    expect(k.attacker).toBe("you");
    expect(k.turn).toBe("cpu");
    expect(k.bouts).toBe(2);
  });

  it("no knockout swaps roles", () => {
    const s = attackState({ x: CIRCLE.x, y: CIRCLE.y });
    const n = play(s, { dirX: 1, dirY: 0, power: 0.2, spin: 1 }); // nowhere near it
    expect(n.last).toMatchObject({ kind: "swap", hit: false });
    expect(n.attacker).toBe("cpu");
    expect(n.stage).toBe("defend");
    expect(n.turn).toBe("you");
  });

  it("a fallen defender stuck inside gives the attacker one more throw", () => {
    const s = attackState({ x: CIRCLE.x, y: CIRCLE.y, spin: 0, fallen: true });
    const miss = { dirX: 1, dirY: 0, power: 0.2, spin: 1 };
    const n = play(s, miss);
    expect(n.last).toEqual({ kind: "stuck", side: "cpu" });
    expect(n.stage).toBe("attack");
    expect(n.turn).toBe("you");
    expect(play(n, miss).last?.kind).toBe("swap");
  });

  it("first to 3 ends the match; so does the bout cap", () => {
    const s = { ...attackState({ x: CIRCLE.x, y: CIRCLE.y - CIRCLE.r + 20, spin: 0.3 }, "cpu"), won: { you: 1, cpu: 2 } };
    const n = play(s, { ...throwAt(s, { x: CIRCLE.x, y: CIRCLE.y - CIRCLE.r + 20 + LR * 2.2 }, exact, createRng(1)), spin: 1 });
    expect(n.won.cpu).toBe(3);
    expect(n.stage).toBe("over");
    const capped = { ...attackState({ x: CIRCLE.x, y: CIRCLE.y }), bouts: MAX_BOUTS };
    expect(play(capped, { dirX: 1, dirY: 0, power: 0.2, spin: 1 }).stage).toBe("over");
  });

  it("the attack world decays the defender's spin by a fixed aim time, not wall-clock", () => {
    const s = attackState({ x: 180, y: 200, spin: 0.5 });
    const w = throwWorld(s, { dirX: 0, dirY: -1, power: 0.5, spin: 1 });
    expect(w.bodies[0]!.spin).toBeCloseTo(0.38, 9);
    expect(w.bodies[1]!.x).toBeCloseTo(ORIGIN.x);
  });
});

describe("whole matches", () => {
  it("finish within the cap and replay identically", () => {
    const run = (seed: number) => {
      let s = createMatch(seed);
      const rng = createRng(seed);
      for (let g = 0; s.stage !== "over" && g < 100; g++) {
        if (s.stage === "kop") s = applyKop(s, kopGrade(rng() * 300 - 150));
        else s = play(s, s.turn === "you" ? throwAt(s, idealTarget(s, 0.3), { angle: 0.06, power: 0.11, meter: 0.15 }, rng) : cpuThrow(s));
      }
      return s;
    };
    for (const seed of [1, 2, packSeed(5, "champion"), packSeed(6, "choto-bhai")]) {
      const a = run(seed);
      expect(a.stage).toBe("over");
      expect(a.bouts).toBeLessThanOrEqual(MAX_BOUTS);
      expect(run(seed)).toEqual(a);
    }
  });

  it("resolve with the animated world equals play()", () => {
    const s = attackState({ x: 190, y: 180 });
    const th = { dirX: 0.05, dirY: -0.99875, power: 0.6, spin: 0.9 };
    const w = throwWorld(s, th);
    expect(resolve(s, w, simulate(w), th)).toEqual(play(s, th));
  });
});

describe("kop, endings, ranks", () => {
  it("kop timing windows", () => {
    expect([0, 70, -70, 71, 170, -170, 171, null].map((e) => kopGrade(e))).toEqual(["perfect", "perfect", "perfect", "good", "good", "good", "miss", "miss"]);
  });

  it("endings in order", () => {
    expect(endingOf({ won: { you: 3, cpu: 0 } })).toBe("flawless");
    expect(endingOf({ won: { you: 3, cpu: 2 } })).toBe("won");
    expect(endingOf({ won: { you: 1, cpu: 1 } })).toBe("draw");
    expect(endingOf({ won: { you: 1, cpu: 3 } })).toBe("lost");
    expect(endingOf({ won: { you: 0, cpu: 2 } })).toBe("lost");
    expect(endingOf({ won: { you: 0, cpu: 3 } })).toBe("cracked");
  });

  it("score and rank boundaries", () => {
    expect(scoreOf({ won: { you: 2, cpu: 0 }, kops: ["perfect", "good"] })).toBe(270);
    expect([0, 99, 100, 199, 200, 299, 300, 450].map(rankFor)).toEqual([
      "wobbly",
      "wobbly",
      "string-winder",
      "string-winder",
      "circle-boss",
      "circle-boss",
      "latim-legend",
      "latim-legend",
    ]);
  });
});
