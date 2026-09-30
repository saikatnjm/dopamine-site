// Chaos Machine — pure, deterministic scenario generator + rules (no DOM/React).
//
// createScenario(seed) rolls a coherent Dhaka trip: vehicle, destination,
// budget, weather, time, driver mood, traffic, mission and a chaos modifier.
// The trip is 5 events (4 picked from the eligible pool + the last stretch);
// each choice changes time / money / sanity (+ eggs / wet / flags). Effects are
// scaled by the scenario and a small seeded variance, so the same seed + the
// same choices always give the same story. Never use Math.random() here.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "chaos-machine";
export const STEPS = 5;

export type VehicleId = "cng" | "rickshaw" | "bus" | "bike" | "leguna" | "walk";
export type PlaceId = "dhanmondi" | "mirpur10" | "gulshan2" | "motijheel" | "uttara" | "old-dhaka" | "farmgate" | "jatrabari" | "bashundhara";
export type WeatherId = "heat" | "rain" | "storm" | "fog" | "pleasant";
export type MoodId = "suspicious" | "philosopher" | "sleepy" | "cheerful" | "singer" | "on-phone";
export type TrafficId = "empty" | "moving" | "slow" | "gridlock";
export type MissionId = "on-time" | "under-budget" | "stay-dry" | "eggs" | "calm";
export type ModifierId = "vip" | "wasa" | "goat" | "wedding" | "low-battery" | "hilsa" | "mom-call" | "exact-change";

const VEHICLES: readonly (readonly [VehicleId, number, [number, number]])[] = [
  ["cng", 5, [150, 450]],
  ["rickshaw", 4, [60, 200]],
  ["bus", 4, [30, 120]],
  ["bike", 3, [120, 350]],
  ["leguna", 2, [25, 90]],
  ["walk", 1, [20, 80]],
];
const PLACES: readonly PlaceId[] = ["dhanmondi", "mirpur10", "gulshan2", "motijheel", "uttara", "old-dhaka", "farmgate", "jatrabari", "bashundhara"];
const WEATHER: readonly (readonly [WeatherId, number])[] = [["heat", 3], ["rain", 3], ["storm", 1], ["fog", 1], ["pleasant", 2]];
const MOODS: readonly MoodId[] = ["suspicious", "philosopher", "sleepy", "cheerful", "singer", "on-phone"];
const MODIFIERS: readonly ModifierId[] = ["vip", "wasa", "goat", "wedding", "low-battery", "hilsa", "mom-call", "exact-change"];

const TRAFFIC_LEVEL: Record<TrafficId, number> = { empty: 0, moving: 1, slow: 2, gridlock: 3 };
/** Multiplies time costs. */
export const TRAFFIC_FACTOR: Record<TrafficId, number> = { empty: 0.6, moving: 0.9, slow: 1.1, gridlock: 1.4 };

export type Scenario = {
  seed: number;
  vehicle: VehicleId;
  destination: PlaceId;
  budget: number;
  weather: WeatherId;
  /** Minutes after midnight. */
  time: number;
  mood: MoodId;
  traffic: TrafficId;
  mission: MissionId;
  modifier: ModifierId;
  /** Minutes allowed to arrive. */
  deadline: number;
  /** 0–6: how chaotic the roll is (boosts the score multiplier). */
  chaos: number;
  /** Event ids for the 5 steps. */
  events: EventId[];
};

const pick = <T>(items: readonly T[], rng: () => number): T => items[Math.floor(rng() * items.length)]!;
const isWet = (w: WeatherId) => w === "rain" || w === "storm";
const isRush = (min: number) => (min >= 8 * 60 && min <= 10 * 60 + 30) || (min >= 17 * 60 && min <= 20 * 60 + 30);

export function createScenario(seed: number): Scenario {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}:scenario`));
  const [vehicle, , [lo, hi]] = weightedPick(VEHICLES, (v) => v[1], rng)!;
  const budget = Math.round(lo + rng() * (hi - lo));
  const destination = pick(PLACES, rng);
  const weather = weightedPick(WEATHER, (w) => w[1], rng)![0];
  const time = 7 * 60 + Math.floor(rng() * 16 * 60); // 7:00–22:59
  const mood = pick(MOODS, rng);

  // Traffic follows the clock and the sky (Eid-empty roads are a rare miracle).
  let level = isRush(time) ? 2 + (rng() < 0.5 ? 1 : 0) : 1 + (rng() < 0.4 ? 1 : 0);
  if (isWet(weather)) level += 1;
  if (!isRush(time) && rng() < 0.06) level = 0;
  const traffic: TrafficId = (["empty", "moving", "slow", "gridlock"] as const)[Math.min(3, level)] ?? "gridlock";

  const missions: MissionId[] = ["on-time", "on-time", "under-budget", "eggs", "calm"];
  if (isWet(weather)) missions.push("stay-dry", "stay-dry");
  const mission = pick(missions, rng);

  const fareVehicle = vehicle === "cng" || vehicle === "rickshaw" || vehicle === "leguna" || vehicle === "bus";
  const modifier = pick(MODIFIERS.filter((m) => m !== "exact-change" || fareVehicle), rng);

  const deadline = Math.round(10 + 17 * TRAFFIC_FACTOR[traffic] + rng() * 5);
  const chaos =
    TRAFFIC_LEVEL[traffic] + (weather === "storm" ? 2 : isWet(weather) || weather === "fog" ? 1 : 0) + (modifier === "vip" || modifier === "wasa" ? 1 : 0);

  const scenario: Scenario = { seed, vehicle, destination, budget, weather, time, mood, traffic, mission, modifier, deadline, chaos, events: [] };
  scenario.events = pickEvents(scenario, rng);
  return scenario;
}

// ---------------------------------------------------------------------------
// Events: rules only (copy lives in data/games/chaos-machine.ts, same ids).
// ---------------------------------------------------------------------------

export type EventId =
  | "fare-hike"
  | "jam"
  | "flood"
  | "heat"
  | "fog"
  | "mood"
  | "bus-helper"
  | "footpath"
  | "helmet"
  | "vip"
  | "wasa"
  | "goat"
  | "wedding"
  | "low-battery"
  | "hilsa"
  | "mom-call"
  | "exact-change"
  | "pothole"
  | "fuchka"
  | "shortcut"
  | "last-stretch";

/** Effect of a choice. time/money are costs (negative = spend), sanity ±. */
export type Fx = {
  time?: number;
  money?: number;
  sanity?: number;
  eggs?: number;
  wet?: boolean;
  wrongPlace?: boolean;
  giveUp?: boolean;
};

type EventRule = { when: (s: Scenario) => boolean; choices: [Fx, Fx, Fx] };

const fareVehicles: readonly VehicleId[] = ["cng", "rickshaw", "leguna", "bike"];

export const EVENTS: Record<EventId, EventRule> = {
  "fare-hike": {
    when: (s) => fareVehicles.includes(s.vehicle),
    choices: [{ money: -40, sanity: 5 }, { time: -5, sanity: -10, money: -15 }, { time: -8, sanity: -4 }],
  },
  jam: {
    when: (s) => s.traffic === "slow" || s.traffic === "gridlock",
    choices: [{ time: -12, sanity: -8 }, { time: -12, money: -20, sanity: 10 }, { time: -6, sanity: -15 }],
  },
  flood: {
    when: (s) => isWet(s.weather),
    choices: [{ time: -3, wet: true, sanity: -5 }, { time: -10, money: -15, sanity: 12 }, { time: -4, money: -50 }],
  },
  heat: {
    when: (s) => s.weather === "heat",
    choices: [{ time: -3, money: -20, sanity: 12 }, { sanity: -15 }, { time: -8, sanity: 15 }],
  },
  fog: {
    when: (s) => s.weather === "fog",
    choices: [{ time: -6, sanity: -8 }, { time: -2, sanity: -4, wrongPlace: true }, { time: -10, sanity: 5 }],
  },
  mood: {
    when: (s) => s.vehicle !== "walk" && s.vehicle !== "bus",
    choices: [{ time: -2, sanity: 10 }, { sanity: 3 }, { money: -20, sanity: 12 }],
  },
  "bus-helper": {
    when: (s) => s.vehicle === "bus" || s.vehicle === "leguna",
    choices: [{ sanity: -12, eggs: -4 }, { time: -10 }, { time: -4, money: -40, sanity: 5 }],
  },
  footpath: {
    when: (s) => s.vehicle === "walk" || s.vehicle === "rickshaw",
    choices: [{ time: -3, sanity: -8 }, { time: -8, money: -30, sanity: 12 }, { time: -6 }],
  },
  helmet: {
    when: (s) => s.vehicle === "bike",
    choices: [{ sanity: -5 }, { time: -3, money: -20, sanity: 5 }, { time: -6, sanity: 12 }],
  },
  vip: {
    when: (s) => s.modifier === "vip",
    choices: [{ time: -15, sanity: -10 }, { time: -8, sanity: -5, wet: true }, { time: -15, sanity: 15 }],
  },
  wasa: {
    when: (s) => s.modifier === "wasa",
    choices: [{ time: -3, sanity: -10, eggs: -4 }, { time: -10 }, { time: -4, money: -30 }],
  },
  goat: {
    when: (s) => s.modifier === "goat",
    choices: [{ time: -2, sanity: 15 }, { time: -5, sanity: -5 }, { time: -10, sanity: -5 }],
  },
  wedding: {
    when: (s) => s.modifier === "wedding",
    choices: [{ time: -10, sanity: 20 }, { time: -4, sanity: -8, eggs: -3 }, { time: -6, sanity: 10 }],
  },
  "low-battery": {
    when: (s) => s.modifier === "low-battery",
    choices: [{ time: -8, money: -10, sanity: 5 }, { time: -2, wrongPlace: true }, { time: -5, sanity: 5 }],
  },
  hilsa: {
    when: (s) => s.modifier === "hilsa",
    choices: [{ time: -2, sanity: -10, eggs: -2 }, { time: -3, sanity: 10 }, { time: -6, sanity: -5 }],
  },
  "mom-call": {
    when: (s) => s.modifier === "mom-call",
    choices: [{ sanity: -5 }, { sanity: -12 }, { time: -4, sanity: 15 }],
  },
  "exact-change": {
    when: (s) => s.modifier === "exact-change",
    choices: [{ money: -40, sanity: 5 }, { time: -6, money: -20 }, { time: -10 }],
  },
  // Always eligible, so every trip has enough events.
  pothole: {
    when: () => true,
    choices: [{ time: -3, sanity: -6, eggs: -3 }, { time: -5 }, { time: -2, sanity: 5 }],
  },
  fuchka: {
    when: () => true,
    choices: [{ time: -5, money: -30, sanity: 15 }, { sanity: -5 }, { time: -2, money: -10, sanity: 8 }],
  },
  shortcut: {
    when: () => true,
    choices: [{ time: 5, sanity: -8 }, { time: -3 }, { time: -6, sanity: 6 }],
  },
  "last-stretch": {
    when: () => true,
    choices: [{ time: -5, sanity: -3, wet: true }, { time: -2, money: -30 }, { giveUp: true }],
  },
};

const MODIFIER_EVENT: Record<ModifierId, EventId> = {
  vip: "vip",
  wasa: "wasa",
  goat: "goat",
  wedding: "wedding",
  "low-battery": "low-battery",
  hilsa: "hilsa",
  "mom-call": "mom-call",
  "exact-change": "exact-change",
};

function pickEvents(s: Scenario, rng: () => number): EventId[] {
  const first = MODIFIER_EVENT[s.modifier];
  const pool = (Object.keys(EVENTS) as EventId[]).filter(
    (id) => id !== first && id !== "last-stretch" && !Object.values(MODIFIER_EVENT).includes(id) && EVENTS[id].when(s),
  );
  // Seeded shuffle.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const middle = pool.slice(0, 3);
  // Modifier event lands at a seeded spot among the first four.
  const at = Math.floor(rng() * (middle.length + 1));
  middle.splice(at, 0, first);
  return [...middle, "last-stretch"];
}

// ---------------------------------------------------------------------------
// Run state
// ---------------------------------------------------------------------------

export type RunState = {
  step: number;
  timeLeft: number;
  money: number;
  sanity: number;
  eggs: number;
  wet: boolean;
  wrongPlace: boolean;
  gaveUp: boolean;
  /** Choice index per completed step. */
  choices: number[];
  /** Applied effect of the last choice (for the feedback chips). */
  last: Required<Pick<Fx, "time" | "money" | "sanity">> | null;
};

export function startRun(s: Scenario): RunState {
  return { step: 0, timeLeft: s.deadline, money: s.budget, sanity: 55, eggs: 12, wet: false, wrongPlace: false, gaveUp: false, choices: [], last: null };
}

/** The effect a choice would have (scaled + seeded variance). */
export function effectOf(s: Scenario, step: number, choice: number): Fx {
  const base = EVENTS[s.events[step]!].choices[choice as 0 | 1 | 2];
  const rng = createRng(hashString(`${GAME_SLUG}:${s.seed}:${step}:${choice}`));
  const vary = () => 0.85 + rng() * 0.3;
  const out: Fx = { ...base };
  if (base.time) out.time = Math.round(base.time * TRAFFIC_FACTOR[s.traffic] * vary());
  if (base.money) out.money = Math.round(base.money * vary() / 5) * 5;
  if (base.sanity) out.sanity = Math.round(base.sanity * (base.sanity < 0 && s.weather === "storm" ? 1.2 : 1) * vary());
  return out;
}

export function canAfford(s: Scenario, st: RunState, choice: number): boolean {
  const fx = effectOf(s, st.step, choice);
  return st.money + (fx.money ?? 0) >= 0;
}

export function choose(s: Scenario, st: RunState, choice: number): RunState {
  if (st.step >= STEPS || st.gaveUp || !canAfford(s, st, choice)) return st;
  const fx = effectOf(s, st.step, choice);
  return {
    step: fx.giveUp ? STEPS : st.step + 1,
    timeLeft: st.timeLeft + (fx.time ?? 0),
    money: st.money + (fx.money ?? 0),
    sanity: Math.max(0, Math.min(100, st.sanity + (fx.sanity ?? 0))),
    eggs: Math.max(0, st.eggs + (fx.eggs ?? 0)),
    wet: st.wet || (fx.wet === true && isWet(s.weather)),
    wrongPlace: st.wrongPlace || fx.wrongPlace === true,
    gaveUp: st.gaveUp || fx.giveUp === true,
    choices: [...st.choices, choice],
    last: { time: fx.time ?? 0, money: fx.money ?? 0, sanity: fx.sanity ?? 0 },
  };
}

export function isDone(st: RunState): boolean {
  return st.step >= STEPS;
}

// ---------------------------------------------------------------------------
// Outcomes and score
// ---------------------------------------------------------------------------

export type OutcomeId =
  | "early-miracle"
  | "mission-complete"
  | "late-but-alive"
  | "broke"
  | "soaked"
  | "omelette"
  | "meltdown"
  | "wrong-destination"
  | "went-home"
  | "total-chaos";

/** Rare by design. */
export const LEGENDARY_OUTCOMES: readonly OutcomeId[] = ["early-miracle"];

export function missionMet(s: Scenario, st: RunState): boolean {
  switch (s.mission) {
    case "on-time":
      return st.timeLeft >= 0;
    case "under-budget":
      return st.money >= s.budget * 0.4;
    case "stay-dry":
      return !st.wet;
    case "eggs":
      return st.eggs >= 10;
    case "calm":
      return st.sanity >= 50;
  }
}

export function outcomeOf(s: Scenario, st: RunState): OutcomeId {
  if (st.gaveUp) return "went-home";
  if (st.wrongPlace) return "wrong-destination";
  if (st.timeLeft < 0 && st.money <= s.budget * 0.1) return "total-chaos";
  if (st.sanity <= 10) return "meltdown";
  const met = missionMet(s, st);
  if (met && st.timeLeft >= s.deadline * 0.3 && st.sanity >= 75 && st.money >= s.budget * 0.5) return "early-miracle";
  if (met) return "mission-complete";
  if (s.mission === "stay-dry") return "soaked";
  if (s.mission === "eggs") return "omelette";
  if (s.mission === "under-budget") return "broke";
  if (s.mission === "calm") return "meltdown";
  return "late-but-alive";
}

/** Chaos Score: how well you survived, boosted by how chaotic the roll was. */
export function chaosScore(s: Scenario, st: RunState): number {
  const outcome = outcomeOf(s, st);
  const arrived = outcome !== "went-home" && outcome !== "wrong-destination";
  const base =
    200 +
    Math.max(0, st.timeLeft) * 12 +
    Math.round((Math.max(0, st.money) / Math.max(1, s.budget)) * 250) +
    st.sanity * 4 +
    (arrived ? 150 : 0) +
    (missionMet(s, st) && arrived ? 350 : 0) +
    (outcome === "early-miracle" ? 300 : 0);
  return Math.round(base * (1 + s.chaos * 0.12));
}

export type RankId = "chaos-lord" | "dhaka-native" | "street-survivor" | "confused-tourist" | "chaos-victim";

/** Title from score (pure). Never rename ids. */
export function rankFor(score: number): RankId {
  if (score >= 2200) return "chaos-lord";
  if (score >= 1650) return "dhaka-native";
  if (score >= 1150) return "street-survivor";
  if (score >= 700) return "confused-tourist";
  return "chaos-victim";
}

/** Deterministic pick of a line variant. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
