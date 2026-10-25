import { describe, expect, it } from "vitest";
import { DISTRICTS } from "@/data/dialects/districts";
import { divisionProblems, DIVISIONS } from "@/data/divisions";
import {
  badgesFor,
  cleanVisited,
  decodeVisited,
  DISTRICT_BIT_ORDER,
  encodeVisited,
  HILL_TRACTS,
  mapStats,
  titleFor,
} from "@/lib/games/my-bangladesh";

const ALL = DISTRICTS.map((d) => d.id);
const division = (id: string) => DIVISIONS.find((d) => d.id === id)!.districts;

describe("district data", () => {
  it("bit order has 64 unique ids, the same set as DISTRICTS", () => {
    expect(DISTRICT_BIT_ORDER).toHaveLength(64);
    expect(new Set(DISTRICT_BIT_ORDER).size).toBe(64);
    expect([...DISTRICT_BIT_ORDER].sort()).toEqual([...ALL].sort());
  });

  it("8 divisions cover all 64 districts exactly once", () => {
    expect(DIVISIONS).toHaveLength(8);
    expect(divisionProblems(DIVISIONS, ALL)).toEqual([]);
    expect(DIVISIONS.reduce((n, d) => n + d.districts.length, 0)).toBe(64);
  });

  it("reports broken division data", () => {
    const dup = DIVISIONS.map((d) => (d.id === "sylhet" ? { ...d, districts: [...d.districts, "dhaka"] } : d));
    expect(divisionProblems(dup, ALL).join()).toMatch(/both dhaka and sylhet/);
    const missing = DIVISIONS.map((d) => (d.id === "sylhet" ? { ...d, districts: d.districts.slice(1) } : d));
    expect(divisionProblems(missing, ALL).join()).toMatch(/"sylhet" is in no division/);
    expect(divisionProblems(DIVISIONS.slice(1), ALL).join()).toMatch(/expected 8 divisions/);
  });
});

describe("share codes", () => {
  const roundTrip = (ids: string[]) => decodeVisited(encodeVisited(ids));

  it("round-trips empty, all, a subset and the edge bits", () => {
    expect(encodeVisited([])).toBe("0");
    expect(roundTrip([])).toEqual([]);
    expect(roundTrip(ALL)).toEqual(DISTRICT_BIT_ORDER);
    expect(encodeVisited(ALL).length).toBeLessThanOrEqual(13);
    const subset = ["sylhet", "dhaka", "bandarban", "satkhira", "panchagarh"];
    expect(roundTrip(subset)).toEqual(cleanVisited(subset));
    expect(roundTrip([DISTRICT_BIT_ORDER[0]!])).toEqual([DISTRICT_BIT_ORDER[0]]);
    expect(roundTrip([DISTRICT_BIT_ORDER[63]!])).toEqual([DISTRICT_BIT_ORDER[63]]);
  });

  it("is order-independent and ignores unknown or repeated ids", () => {
    expect(encodeVisited(["sylhet", "dhaka"])).toBe(encodeVisited(["dhaka", "sylhet", "dhaka", "narnia"]));
  });

  it("decode never throws and rejects junk", () => {
    expect(decodeVisited("!!")).toBeNull();
    expect(decodeVisited("abc-def")).toBeNull();
    expect(decodeVisited("")).toBeNull();
    expect(decodeVisited("a".repeat(14))).toBeNull(); // too long
    expect(decodeVisited("zzzzzzzzzzzzz")).toBeNull(); // 13 chars but ≥ 2^64
    expect(decodeVisited((1n << 64n).toString(36))).toBeNull();
    expect(decodeVisited(((1n << 64n) - 1n).toString(36))).toEqual(DISTRICT_BIT_ORDER);
    expect(decodeVisited(undefined)).toBeNull();
    expect(decodeVisited(42)).toBeNull();
    expect(decodeVisited({})).toBeNull();
    expect(decodeVisited(["1", "2"])).toEqual([DISTRICT_BIT_ORDER[0]]);
    expect(decodeVisited(" 1Z ")).toEqual(decodeVisited("1z"));
  });
});

describe("titles", () => {
  it("changes exactly at the documented boundaries", () => {
    const at = (n: number) => titleFor(n);
    expect([1].map(at)).toEqual(["never-left"]);
    expect([2, 5].map(at)).toEqual(["weekend-tripper", "weekend-tripper"]);
    expect([6, 12].map(at)).toEqual(["eid-bus-veteran", "eid-bus-veteran"]);
    expect([13, 24].map(at)).toEqual(["launch-ghat-regular", "launch-ghat-regular"]);
    expect([25, 40].map(at)).toEqual(["desh-explorer", "desh-explorer"]);
    expect([41, 63].map(at)).toEqual(["walking-atlas", "walking-atlas"]);
    expect(at(64)).toBe("all-64");
  });
});

describe("badges", () => {
  it("all-divisions needs one district in each of the 8", () => {
    const one = DIVISIONS.map((d) => d.districts[0]!);
    expect(badgesFor(one)).toContain("all-divisions");
    expect(badgesFor(one.slice(1))).not.toContain("all-divisions");
  });

  it("completes a division only when every district is visited", () => {
    expect(badgesFor([...division("sylhet")])).toContain("division-sylhet");
    expect(badgesFor(division("sylhet").slice(1))).not.toContain("division-sylhet");
  });

  it("hill tracts trio and the Dhaka bubble", () => {
    expect(badgesFor([...HILL_TRACTS])).toContain("hill-tracts");
    expect(badgesFor(["dhaka", "gazipur", "tangail"])).toContain("dhaka-bubble");
    expect(badgesFor(["dhaka", "gazipur"])).not.toContain("dhaka-bubble"); // needs ≥ 3
    expect(badgesFor(["dhaka", "gazipur", "sylhet"])).not.toContain("dhaka-bubble");
  });

  it("orders by rarity: all divisions, completed (smallest first), hill tracts, bubble", () => {
    expect(badgesFor(ALL)).toEqual([
      "all-divisions",
      "division-sylhet",
      "division-mymensingh",
      "division-barishal",
      "division-rajshahi",
      "division-rangpur",
      "division-khulna",
      "division-chattogram",
      "division-dhaka",
      "hill-tracts",
    ]);
    expect(badgesFor([...division("dhaka")])).toEqual(["division-dhaka", "dhaka-bubble"]);
  });
});

describe("map stats", () => {
  it("counts districts, divisions and share of the map", () => {
    expect(mapStats([])).toEqual({ districts: 0, divisions: 0, mapPercent: 0 });
    expect(mapStats(ALL)).toEqual({ districts: 64, divisions: 8, mapPercent: 100 });
    const s = mapStats(["dhaka", "gazipur", "sylhet", "narnia"]);
    expect(s.districts).toBe(3);
    expect(s.divisions).toBe(2);
    expect(s.mapPercent).toBeGreaterThan(0);
    expect(s.mapPercent).toBeLessThan(10);
  });
});
