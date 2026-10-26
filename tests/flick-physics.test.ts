import { describe, expect, it } from "vitest";
import { aimAt, blockers, gauss } from "@/lib/flick/ai";
import { aimFromDrag, pingPong, rotateDir } from "@/lib/flick/aim";
import { cloneWorld, DT, firstTouch, simulate, speedFor, step, stopDistance, type Body, type World } from "@/lib/flick/physics";
import { createRng } from "@/lib/random";

const ball = (id: string, x: number, y: number, vx = 0, vy = 0): Body => ({ id, x, y, vx, vy, r: 8, mass: 1 });
const world = (bodies: Body[], extra: Partial<World> = {}): World => ({
  bodies,
  holes: [],
  bounds: { x0: -1e4, y0: -1e4, x1: 1e4, y1: 1e4 },
  friction: 700,
  restitution: 0.9,
  lipSpeed: 130,
  wallBounce: 0.35,
  steps: 0,
  ...extra,
});

describe("rolling", () => {
  it("a lone body stops at the formula distance (±1)", () => {
    for (const v of [60, 250, 600, 820]) {
      const w = world([ball("a", 0, 0, v, 0)]);
      simulate(w);
      expect(Math.abs(w.bodies[0]!.x - stopDistance(v, 700))).toBeLessThan(1);
      expect(w.bodies[0]!.y).toBe(0);
    }
  });

  it("speedFor inverts stopDistance", () => {
    for (const d of [20, 100, 280, 450]) expect(Math.abs(stopDistance(speedFor(d, 700), 700) - d)).toBeLessThan(1.5);
  });
});

describe("collisions", () => {
  it("head-on equal masses: momentum conserved, the striker nearly stops", () => {
    const w = world([ball("a", 0, 0, 400, 0), ball("b", 30, 0)], { friction: 0 });
    let p0 = 0;
    for (const b of w.bodies) p0 += b.vx;
    for (let i = 0; i < 20; i++) step(w);
    const [a, b] = w.bodies;
    expect(a!.vx + b!.vx).toBeCloseTo(p0, 6);
    expect(b!.vx).toBeGreaterThan(a!.vx);
    expect(a!.vx).toBeCloseTo(400 * 0.05, 0); // (1 − e) / 2 of the speed stays
  });

  it("never leaves bodies overlapping after a step", () => {
    const w = world([ball("a", 0, 0, 600, 3), ball("b", 20, 0), ball("c", 36, 2), ball("d", 52, -1)]);
    for (let i = 0; i < 200; i++) {
      step(w);
      for (let x = 0; x < w.bodies.length; x++)
        for (let y = x + 1; y < w.bodies.length; y++) {
          const p = w.bodies[x]!;
          const q = w.bodies[y]!;
          expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeGreaterThan(16 - 0.05);
        }
    }
  });

  it("records contacts in first-touch order", () => {
    const w = world([ball("s", 0, 0, 500, 0), ball("t", 40, 0), ball("u", 80, 0)]);
    const e = simulate(w);
    expect(e.contacts.map((c) => [c.a, c.b])).toEqual([
      ["s", "t"],
      ["t", "u"],
    ]);
    expect(firstTouch(e.contacts, "s")).toBe("t");
    expect(firstTouch(e.contacts, "u")).toBe("t");
    expect(firstTouch([], "s")).toBeUndefined();
  });
});

describe("holes and walls", () => {
  const hole = { x: 100, y: 0, r: 13 };
  it("catches a slow body, lets a fast one skip over", () => {
    const slow = world([ball("a", 0, 0, speedFor(100, 700), 0)], { holes: [hole] });
    expect(simulate(slow).holed).toEqual(["a"]);
    const fast = world([ball("a", 0, 0, 800, 0)], { holes: [hole] });
    expect(simulate(fast).holed).toEqual([]);
    expect(fast.bodies[0]!.x).toBeGreaterThan(200);
  });

  it("keeps bodies inside the walls", () => {
    const w = world([ball("a", 50, 50, -900, 0)], { bounds: { x0: 0, y0: 0, x1: 300, y1: 300 } });
    simulate(w);
    expect(w.bodies[0]!.x).toBeGreaterThanOrEqual(8);
  });
});

describe("determinism", () => {
  it("same inputs → identical world after N steps", () => {
    const make = () => world([ball("a", 0, 0, 640, 37), ball("b", 60, 10), ball("c", 75, -6), ball("d", 120, 4)], { holes: [{ x: 150, y: 0, r: 13 }] });
    const a = make();
    const b = cloneWorld(make());
    for (let i = 0; i < 500; i++) {
      step(a);
      step(b);
    }
    expect(a).toEqual(b);
  });
});

describe("aim + ai", () => {
  it("drag → slingshot aim with dead zone and clamp", () => {
    expect(aimFromDrag({ x: 100, y: 100 }, { x: 105, y: 100 })).toBeNull();
    const a = aimFromDrag({ x: 100, y: 100 }, { x: 100, y: 400 })!;
    expect(a.dirX).toBeCloseTo(0);
    expect(a.dirY).toBeCloseTo(-1);
    expect(a.power).toBe(1);
  });

  it("rotateDir keeps unit length; 30 steps ≈ 90°", () => {
    const r = rotateDir(0, -1, 30);
    expect(Math.hypot(r.dirX, r.dirY)).toBeCloseTo(1, 9);
    expect(r.dirX).toBeCloseTo(1, 6);
    expect(rotateDir(1, 0, -30).dirY).toBeCloseTo(-1, 6);
  });

  it("pingPong goes 0 → 1 → 0", () => {
    expect([0, 400, 800, 1200, 1600].map((ms) => pingPong(ms, 1600))).toEqual([0, 0.5, 1, 0.5, 0]);
  });

  it("gauss is centred with σ ≈ 1", () => {
    const rng = createRng(7);
    const xs = Array.from({ length: 20000 }, () => gauss(rng));
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
    expect(Math.abs(mean)).toBeLessThan(0.03);
    expect(Math.abs(sd - 1)).toBeLessThan(0.03);
  });

  it("a perfect aim hits the target; blockers are counted", () => {
    const w = world([ball("s", 0, 0), ball("t", 120, 40)]);
    const shot = aimAt(w, { x: 0, y: 0 }, { x: 120, y: 40 }, { beyond: 40, angleError: 0, powerError: 0, rng: createRng(1), maxSpeed: 900 });
    w.bodies[0]!.vx = shot.dirX * shot.speed;
    w.bodies[0]!.vy = shot.dirY * shot.speed;
    expect(firstTouch(simulate(w).contacts, "s")).toBe("t");
    expect(blockers([ball("s", 0, 0), ball("t", 100, 0), ball("x", 50, 4)], ball("s", 0, 0), ball("t", 100, 0))).toBe(1);
  });
});

describe("spinning tops (Latim Fight model)", () => {
  const model = { decay: 0.12, gyro: 1.6, loss: 0.0009, wobbleAt: 0.25, drift: 10, fallenFriction: 2400, seed: 7 };
  const top = (id: string, x: number, y: number, spin: number, vx = 0): Body => ({ id, x, y, vx, vy: 0, r: 13, mass: 1, spin });

  it("spin decays to 0 in spin / decay seconds, then the top falls", () => {
    const w = world([top("a", 0, 0, 0.6)], { spin: model });
    const fallen: string[] = [];
    let steps = 0;
    while (!w.bodies[0]!.fallen && steps < 2000) {
      fallen.push(...step(w).fallen);
      steps++;
    }
    expect(Math.abs(steps - 0.6 / 0.12 / DT)).toBeLessThanOrEqual(1);
    expect(fallen).toEqual(["a"]);
    expect(w.bodies[0]!.spin).toBe(0);
  });

  it("a higher-spin top is pushed less by the same hit, and loses less spin", () => {
    // Measured right after the first contact (before either can fall over).
    const hit = (spin: number) => {
      const w = world([top("s", 0, 0, 0.5, 300), top("t", 40, 0, spin)], { spin: model, friction: 0 });
      const before = spin - model.decay * DT;
      while (!step(w).contacts.length);
      return { v: w.bodies[1]!.vx, lost: before - w.bodies[1]!.spin! };
    };
    const low = hit(0.4);
    const high = hit(1);
    expect(high.v).toBeLessThan(low.v);
    expect(high.lost).toBeLessThan(low.lost);
  });

  it("flags a body whose centre leaves the arena (no wall)", () => {
    const w = world([top("a", 0, 0, 1, 400)], { spin: model, arena: { x: 0, y: 0, r: 100 } });
    simulate(w);
    expect(w.bodies[0]!.out).toBe(true);
    expect(w.bodies[0]!.x).toBeGreaterThan(100);
  });

  it("replays identically, wobble included", () => {
    const make = () => world([top("a", 0, 0, 0.3, 120), top("b", 60, 4, 0.2)], { spin: model, arena: { x: 0, y: 0, r: 90 } });
    const a = make();
    const b = make();
    for (let i = 0; i < 900; i++) {
      step(a);
      step(b);
    }
    expect(a).toEqual(b);
    expect(a.bodies.every((x) => x.fallen)).toBe(true);
  });
});
