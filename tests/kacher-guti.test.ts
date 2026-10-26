import { describe, expect, it } from "vitest";
import { decodeChallenge, encodeChallenge } from "@/lib/challenge";
import { aimAt } from "@/lib/flick/ai";
import {
  boardWorld,
  createMatch,
  cpuShot,
  cpuTarget,
  endingOf,
  HOLE,
  launchWorld,
  MAX_SPEED,
  nameTarget,
  opponentOf,
  OPPONENTS,
  packSeed,
  play,
  R,
  rankFor,
  resolve,
  shooterPos,
  shuffleOf,
  START_MARBLES,
  TOTAL_MARBLES,
  type KgState,
} from "@/lib/games/kacher-guti";
import { simulate } from "@/lib/flick/physics";
import { createRng } from "@/lib/random";

const SEED = packSeed(12345, "boro-bhai");
const perfect = (beyond = 45) => ({ beyond, angleError: 0, powerError: 0, rng: createRng(1), maxSpeed: MAX_SPEED });
const still = { dirX: 0, dirY: -1, speed: 0 };
const marbles = (s: KgState) => s.pockets.you + s.pockets.cpu + s.pot.length + (s.stage === "scatter" ? s.staked.you + s.staked.cpu : 0);

/** A shooting position: you to shoot at a 2-marble pot laid out by hand. */
function shootState(pot: { id: string; x: number; y: number }[], you = { x: 180, y: 330 }, cpu = { x: 40, y: 440 }): KgState {
  const s = createMatch(SEED);
  return {
    ...s,
    stage: "shoot",
    turn: "you",
    pockets: { you: 7, cpu: 13 - pot.length },
    staked: { you: 3, cpu: 3 },
    shooters: { you, cpu },
    pot: pot.map((m) => ({ ...m, tint: 0 })),
    target: pot[0]!.id,
  };
}

function shotAt(s: KgState, to: { x: number; y: number }, beyond = 45) {
  return aimAt(boardWorld(s), shooterPos(s, "you"), to, perfect(beyond));
}

describe("seed packing", () => {
  it("round-trips shuffle and opponent; unknown index → null", () => {
    for (const opp of OPPONENTS) {
      const seed = packSeed(0x3fffffff, opp);
      expect(opponentOf(seed)).toBe(opp);
      expect(shuffleOf(seed)).toBe(0x3fffffff);
    }
    expect(opponentOf(3)).toBeNull();
    expect(createMatch(packSeed(9, "champion")).opponent).toBe("champion");
  });

  it("kg challenge tokens round-trip; max 20", () => {
    const seed = packSeed(777, "champion");
    const token = encodeChallenge({ game: "kacher-guti", seed, score: 20 })!;
    expect(token).toMatch(/^1kg\./);
    expect(decodeChallenge(token)).toEqual({ game: "kacher-guti", seed, score: 20 });
    expect(encodeChallenge({ game: "kacher-guti", seed, score: 21 })).toBeNull();
  });
});

describe("opening + stake", () => {
  it("in the hole beats closest; exact tie goes to you", () => {
    let s = createMatch(SEED);
    // You barely move; the computer rolls straight into the hole.
    s = play(s, still);
    expect(s.turn).toBe("cpu");
    s = play(s, aimAt(boardWorld(s), shooterPos(s, "cpu"), HOLE, perfect(0)));
    expect(s.openingHoled.cpu).toBe(true);
    expect(s.stage).toBe("scatter");
    expect(s.turn).toBe("cpu");

    // Tie: both stay on the line at the same distance.
    let t = createMatch(SEED);
    t = { ...t, shooters: { you: null, cpu: null } };
    t = play(t, still);
    t = { ...t, shooters: { ...t.shooters, cpu: { x: 2 * HOLE.x - t.shooters.you!.x, y: t.shooters.you!.y } }, turn: "cpu" };
    const w = boardWorld(t);
    t = resolve(t, w, simulate(w));
    expect(t.turn).toBe("you");
  });

  it("stakes 3 each, fewer when a pocket is low", () => {
    let s = { ...createMatch(SEED), pockets: { you: 2, cpu: 10 } };
    s = play(play(s, still), still);
    expect(s.staked).toEqual({ you: 2, cpu: 3 });
    expect(s.pockets).toEqual({ you: 0, cpu: 7 });
  });

  it("scatter: same seed + power → same pattern; holed pot marbles go to the scatterer", () => {
    let s = play(play(createMatch(SEED), still), still);
    const a = play(s, 0.4);
    const b = play(s, 0.4);
    expect(a.pot).toEqual(b.pot);
    expect(a.pot.length).toBeGreaterThan(0);
    expect(marbles(a)).toBe(TOTAL_MARBLES);
    // Force a pot marble into the hole: a weak scatter keeps them near the lip.
    s = { ...s, staked: { you: 3, cpu: 3 } };
    const weak = play(s, 0);
    const scatterer = s.turn;
    expect(weak.pockets[scatterer] - s.pockets[scatterer]).toBe(6 - weak.pot.length);
  });
});

describe("shots", () => {
  const pot = [
    { id: "t", x: 180, y: 250 },
    { id: "o", x: 300, y: 120 },
  ];

  it("clean hit: win the target, shoot again, the computer names the next one", () => {
    const s = shootState(pot);
    const n = play(s, shotAt(s, pot[0]!));
    expect(n.last).toMatchObject({ kind: "clean", side: "you" });
    expect(n.pockets.you).toBe(s.pockets.you + 1);
    expect(n.pot.map((m) => m.id)).toEqual(["o"]);
    expect(n.stage).toBe("shoot");
    expect(n.turn).toBe("you");
    expect(n.target).toBe("o");
    expect(n.stats.clean.you).toBe(1);
  });

  it("another marble first = foul: pay 1, turn passes, you name the computer's target", () => {
    const s = { ...shootState(pot), target: "o" };
    const n = play(s, shotAt(s, pot[0]!));
    expect(n.last).toMatchObject({ kind: "foul", side: "you", reason: "wrong", paid: true });
    expect(n.pockets).toEqual({ you: s.pockets.you - 1, cpu: s.pockets.cpu + 1 });
    expect(n.stage).toBe("name");
    expect(n.turn).toBe("cpu");
    expect(nameTarget(n, "ghost")).toBe(n);
    expect(nameTarget(n, n.pot[0]!.id)).toMatchObject({ stage: "shoot", target: n.pot[0]!.id });
  });

  it("a miss is a foul; with an empty pocket nothing is paid", () => {
    const s = { ...shootState(pot), pockets: { you: 0, cpu: 18 } };
    const n = play(s, { dirX: -1, dirY: 0, speed: 200 });
    expect(n.last).toMatchObject({ kind: "foul", reason: "miss", paid: false });
    expect(n.pockets.you).toBe(0);
  });

  it("shooter in the hole = foul (placed back at the lip); holed pot marbles go to the shooter", () => {
    // Target right in front of the hole: the shooter knocks it in and follows.
    const s = shootState([{ id: "t", x: HOLE.x, y: HOLE.y + 2 * R + 6 }, { id: "o", x: 300, y: 400 }], { x: HOLE.x, y: HOLE.y + 120 });
    const n = play(s, shotAt(s, HOLE, 0));
    const holedT = !n.pot.some((m) => m.id === "t");
    expect(holedT).toBe(true);
    expect(marbles(n)).toBe(TOTAL_MARBLES);
    if (n.last?.kind === "foul") {
      expect(n.last.reason).toBe("holed");
      expect(n.shooters.you!.y).toBeGreaterThan(HOLE.y + HOLE.r);
    }
  });

  it("emptying the pot ends the round; the side with fewer marbles throws first next", () => {
    const s = shootState([{ id: "t", x: 180, y: 250 }]);
    const n = play(s, shotAt(s, { x: 180, y: 250 }));
    expect(n.round).toBe(2);
    expect(n.stage).toBe("opening");
    expect(n.first).toBe(n.pockets.you <= n.pockets.cpu ? "you" : "cpu");
    expect(n.shooters).toEqual({ you: null, cpu: null });
  });

  it("the match ends after round 3, or when a side has 0 at a round's end", () => {
    const s = { ...shootState([{ id: "t", x: 180, y: 250 }]), round: 3 };
    expect(play(s, shotAt(s, { x: 180, y: 250 })).stage).toBe("over");
    const broke = { ...shootState([{ id: "t", x: 180, y: 250 }]), pockets: { you: 19, cpu: 0 } };
    const end = play(broke, shotAt(broke, { x: 180, y: 250 }));
    expect(end.stage).toBe("over");
    expect(endingOf(end)).toBe("clean-sweep");
  });

  it("computer decisions are seeded: same state → same target and shot", () => {
    const s = { ...shootState(pot), turn: "cpu" as const, target: "t" };
    expect(cpuShot(s)).toEqual(cpuShot(s));
    const named = { ...shootState(pot), target: null };
    expect(cpuTarget(named)).toBe(cpuTarget(named));
  });

  it("launchWorld only moves the acting shooter", () => {
    const s = shootState(pot);
    const w = launchWorld(s, { dirX: 0, dirY: -1, speed: 300 });
    expect(w.bodies.find((b) => b.id === "you")!.vy).toBe(-300);
    expect(w.bodies.filter((b) => b.vx !== 0 || b.vy !== 0)).toHaveLength(1);
  });
});

describe("whole matches", () => {
  it("conserves marbles and is deterministic for the same inputs", () => {
    const run = (seed: number) => {
      let s = createMatch(seed);
      const rng = createRng(seed);
      for (let guard = 0; s.stage !== "over" && guard < 400; guard++) {
        expect(marbles(s)).toBe(TOTAL_MARBLES);
        if (s.stage === "name") s = nameTarget(s, s.pot[0]!.id);
        else if (s.stage === "scatter") s = play(s, rng());
        else if (s.turn === "cpu") s = play(s, s.stage === "shoot" ? cpuShot(s) : aimAt(boardWorld(s), shooterPos(s, "cpu"), HOLE, perfect(0)));
        else s = play(s, { ...aimAt(boardWorld(s), shooterPos(s, "you"), s.pot.find((m) => m.id === s.target) ?? HOLE, { ...perfect(), angleError: 0.05, rng }) });
      }
      return s;
    };
    for (const seed of [1, 2, 3, packSeed(99, "champion"), packSeed(5, "choto-bhai")]) {
      const a = run(seed);
      expect(a.stage).toBe("over");
      expect(a.pockets.you + a.pockets.cpu).toBe(TOTAL_MARBLES);
      expect(run(seed)).toEqual(a);
    }
  });
});

describe("endings + ranks", () => {
  it("endings in order", () => {
    expect(endingOf({ pockets: { you: 20, cpu: 0 } })).toBe("clean-sweep");
    expect(endingOf({ pockets: { you: 12, cpu: 8 } })).toBe("won");
    expect(endingOf({ pockets: { you: 10, cpu: 10 } })).toBe("draw");
    expect(endingOf({ pockets: { you: 3, cpu: 17 } })).toBe("lost");
    expect(endingOf({ pockets: { you: 0, cpu: 20 } })).toBe("empty-pocket");
  });

  it("rank boundaries", () => {
    expect([0, 4, 5, 9, 10, 14, 15, 19, 20].map(rankFor)).toEqual([
      "rookie",
      "rookie",
      "gali-player",
      "gali-player",
      "sharpshooter",
      "sharpshooter",
      "guti-ustad",
      "guti-ustad",
      "guti-legend",
    ]);
    expect(START_MARBLES).toBe(10);
  });
});
