// Delivery Simulator — pure, deterministic rules (no DOM/React).
//
// You are the rider. createOrder(seed) rolls the order (restaurant, food,
// area, distance, pay, weather, promised time) and one event for each of the
// 7 stages. Each event has 3 choices; some choices are seeded gambles. Every
// random decision uses its own RNG from (seed, stage, choice), so the same
// seed + the same choices always give the same story. Never use Math.random().
// Copy lives in data/games/delivery-sim.ts under the same ids.

import { createRng, hashString, weightedPick } from "@/lib/random";

export const GAME_SLUG = "delivery-sim";

export const STAGES = ["accept", "restaurant", "pickup", "find", "traffic", "contact", "deliver"] as const;
export type StageId = (typeof STAGES)[number];
export const STEPS = STAGES.length;

export type RestaurantId = "kacchi-kingdom" | "burger-bhai" | "tehari-house" | "pizza-para" | "cake-corner" | "fuchka-factory";
export type AreaId = "dhanmondi" | "mirpur" | "gulshan" | "uttara" | "mohammadpur" | "old-dhaka" | "banani" | "bashundhara";
export type WeatherId = "clear" | "rain" | "heat";

export type EventId =
  // accept
  | "normal-order"
  | "big-order"
  | "far-order"
  // restaurant
  | "not-ready"
  | "ready"
  | "missing-item"
  // pickup
  | "heavy-rain"
  | "low-battery"
  | "bag-tetris"
  // find
  | "wrong-address"
  | "location-change"
  | "vague-landmark"
  // traffic
  | "jam"
  | "cng-block"
  | "lucky-shortcut"
  // contact
  | "no-answer"
  | "come-down"
  | "shop-request"
  // deliver
  | "lift-broken"
  | "guard"
  | "cash-change";

/**
 * Effect of a choice. time = minutes added (negative = saved), money = ৳ to
 * your earnings, chaos/food/mood = ± points (0–100 scales).
 */
export type Fx = { time?: number; money?: number; chaos?: number; food?: number; mood?: number; wrong?: boolean; gone?: boolean };
/** A choice is a fixed effect or a seeded gamble. */
export type ChoiceRule = Fx | { chance: number; win: Fx; lose: Fx };

type EventRule = { stage: StageId; weight: (o: Order) => number; choices: [ChoiceRule, ChoiceRule, ChoiceRule] };

export const EVENTS: Record<EventId, EventRule> = {
  "normal-order": { stage: "accept", weight: () => 3, choices: [{}, { time: 1, mood: 10 }, { time: 4, chaos: 5, mood: -5 }] },
  "big-order": { stage: "accept", weight: () => 2, choices: [{ food: -10 }, { time: 3, mood: 8 }, { time: 1, chaos: 12, food: -15 }] },
  "far-order": {
    stage: "accept",
    weight: (o) => (o.distance >= 7 ? 4 : 1),
    choices: [{ time: 2, money: 20 }, { money: 30, mood: -10 }, { time: 1, chaos: -5 }],
  },

  "not-ready": { stage: "restaurant", weight: () => 4, choices: [{ time: 9 }, { time: 5, chaos: 12 }, { time: 6, food: -8, chaos: 6, mood: 5 }] },
  ready: { stage: "restaurant", weight: () => 2, choices: [{}, { time: 2, food: 5, mood: 5 }, { time: 1, chaos: 5 }] },
  "missing-item": { stage: "restaurant", weight: () => 2, choices: [{ time: 6 }, { mood: -20 }, { time: 2, money: -30, mood: 8 }] },

  "heavy-rain": {
    stage: "pickup",
    weight: (o) => (o.weather === "rain" ? 8 : 0),
    choices: [{ time: 2, food: -15, chaos: 12 }, { time: 8, mood: -5 }, { time: 3, money: -10 }],
  },
  "low-battery": {
    stage: "pickup",
    weight: () => 2,
    choices: [{ time: 6, money: -10 }, { chance: 0.5, win: { time: -1 }, lose: { time: 7, chaos: 15 } }, { time: 3, chaos: 10 }],
  },
  "bag-tetris": { stage: "pickup", weight: () => 2, choices: [{ time: 1 }, { food: -25, chaos: 5 }, { food: -5, chaos: 12 }] },

  "wrong-address": {
    stage: "find",
    weight: () => 3,
    choices: [
      { time: 4, mood: -5 },
      { chance: 0.6, win: { time: 2, chaos: 5 }, lose: { time: 3, wrong: true, chaos: 10 } },
      { chance: 0.3, win: { chaos: 10 }, lose: { wrong: true, chaos: 15 } },
    ],
  },
  "location-change": { stage: "find", weight: () => 2, choices: [{ time: 7, mood: 10 }, { time: 7, money: 20, mood: -15 }, { time: 4, chaos: 6 }] },
  "vague-landmark": { stage: "find", weight: () => 3, choices: [{ time: 6, chaos: 10 }, { time: 4, chaos: 5 }, { time: 3, mood: 5 }] },

  jam: {
    stage: "traffic",
    weight: (o) => (o.weather === "rain" ? 5 : 3),
    choices: [{ time: 10, mood: -5 }, { time: 5, chaos: 10 }, { time: 7, money: -10 }],
  },
  "cng-block": {
    stage: "traffic",
    weight: () => 3,
    choices: [{ time: 4 }, { chance: 0.6, win: { time: 1, chaos: 5 }, lose: { time: 7, chaos: 12 } }, { time: 5 }],
  },
  "lucky-shortcut": {
    stage: "traffic",
    weight: () => 1.5,
    choices: [{ time: -6, chaos: 5 }, { time: 3 }, { chance: 0.7, win: { time: -9 }, lose: { time: -3, food: -20, chaos: 10 } }],
  },

  "no-answer": {
    stage: "contact",
    weight: () => 3,
    choices: [
      { chance: 0.65, win: { time: 5 }, lose: { time: 6, gone: true } },
      { time: 6, mood: 5 },
      { chance: 0.5, win: { time: 2, chaos: 15, mood: 10 }, lose: { time: 2, chaos: 20, mood: -15 } },
    ],
  },
  "come-down": { stage: "contact", weight: () => 3, choices: [{ time: 3, mood: 5, chaos: 5 }, { time: 5, chaos: 15 }, { time: 2 }] },
  "shop-request": { stage: "contact", weight: () => 2, choices: [{ time: 3, money: -20, mood: 20 }, { mood: -10 }, { time: 3, money: 10, mood: -5 }] },

  "lift-broken": {
    stage: "deliver",
    weight: () => 3,
    choices: [{ time: 6, food: -5, mood: 15 }, { time: 4, mood: -15 }, { chance: 0.6, win: { time: 2 }, lose: { time: 2, food: -20, mood: -10 } }],
  },
  guard: { stage: "deliver", weight: () => 3, choices: [{ time: 5 }, { time: 1, money: -10, chaos: -5 }, { time: 4, mood: -10 }] },
  "cash-change": { stage: "deliver", weight: () => 2, choices: [{ time: 5, mood: 10 }, { money: -30, mood: 25 }, { time: 1 }] },
};

export const RESTAURANTS: readonly RestaurantId[] = ["kacchi-kingdom", "burger-bhai", "tehari-house", "pizza-para", "cake-corner", "fuchka-factory"];
export const AREAS: readonly AreaId[] = ["dhanmondi", "mirpur", "gulshan", "uttara", "mohammadpur", "old-dhaka", "banani", "bashundhara"];
const WEATHER: readonly (readonly [WeatherId, number])[] = [["clear", 3], ["rain", 2], ["heat", 2]];
/** Delicate food takes more damage. */
const FRAGILE: Record<RestaurantId, number> = {
  "kacchi-kingdom": 1,
  "burger-bhai": 1,
  "tehari-house": 1,
  "pizza-para": 1.2,
  "cake-corner": 1.5,
  "fuchka-factory": 1.4,
};

/** Base minutes each stage takes before any event (find/traffic scale with distance). */
function baseMinutes(stage: StageId, distance: number): number {
  switch (stage) {
    case "accept":
      return 1;
    case "restaurant":
      return 4;
    case "pickup":
      return 2;
    case "find":
      return Math.round(distance * 1.6);
    case "traffic":
      return Math.round(distance * 1.4);
    case "contact":
      return 1;
    case "deliver":
      return 2;
  }
}

export type Order = {
  seed: number;
  restaurant: RestaurantId;
  area: AreaId;
  /** km */
  distance: number;
  /** ৳ base pay */
  pay: number;
  /** ৳ order bill (for the cash-change event) */
  bill: number;
  weather: WeatherId;
  /** Minutes promised to the customer. */
  promised: number;
  /** Event id per stage. */
  events: EventId[];
};

const pick = <T>(items: readonly T[], rng: () => number): T => items[Math.floor(rng() * items.length)]!;
const BASE_TOTAL = (distance: number) => STAGES.reduce((s, st) => s + baseMinutes(st, distance), 0);

export function createOrder(seed: number): Order {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:order`));
  const restaurant = pick(RESTAURANTS, rng);
  const area = pick(AREAS, rng);
  const distance = 3 + Math.floor(rng() * 8); // 3–10 km
  const pay = Math.round((40 + distance * 9 + rng() * 20) / 5) * 5;
  const bill = Math.round((350 + rng() * 900) / 10) * 10;
  const weather = weightedPick(WEATHER, (w) => w[1], rng)![0];
  const promised = BASE_TOTAL(distance) + 21 + Math.floor(rng() * 5);
  const order: Order = { seed: seed >>> 0, restaurant, area, distance, pay, bill, weather, promised, events: [] };
  order.events = STAGES.map((stage) => {
    const pool = (Object.keys(EVENTS) as EventId[]).filter((id) => EVENTS[id].stage === stage && EVENTS[id].weight(order) > 0);
    return weightedPick(pool, (id) => EVENTS[id].weight(order), rng)!;
  });
  return order;
}

// ---------------------------------------------------------------------------
// Run state
// ---------------------------------------------------------------------------

export type RunState = {
  step: number;
  /** Minutes since accepting. */
  elapsed: number;
  /** ৳ earned so far (pay counted at the end). */
  money: number;
  chaos: number;
  food: number;
  /** Customer mood 0–100. */
  mood: number;
  wrong: boolean;
  gone: boolean;
  /** Choice index per completed stage. */
  choices: number[];
  /** Did each gamble win? (index = stage; undefined = no gamble) */
  won: (boolean | undefined)[];
  /** Applied effect of the last choice (for feedback chips). */
  last: { time: number; money: number; chaos: number; food: number } | null;
};

export function startRun(o: Order): RunState {
  return {
    step: 0,
    elapsed: 0,
    money: 0,
    chaos: o.weather === "rain" ? 20 : o.weather === "heat" ? 12 : 5,
    food: 100,
    mood: 65,
    wrong: false,
    gone: false,
    choices: [],
    won: [],
    last: null,
  };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Resolve a choice for this order + stage (seeded gamble, small variance). */
export function resolve(o: Order, step: number, choice: number): { fx: Fx; won?: boolean } {
  const rule = EVENTS[o.events[step]!].choices[choice as 0 | 1 | 2];
  const rng = createRng(hashString(`${GAME_SLUG}:${o.seed}:${step}:${choice}`));
  let fx: Fx;
  let won: boolean | undefined;
  if ("chance" in rule) {
    won = rng() < rule.chance;
    fx = { ...(won ? rule.win : rule.lose) };
  } else {
    fx = { ...rule };
  }
  const vary = () => 0.85 + rng() * 0.3;
  if (fx.time) fx.time = Math.round(fx.time * vary());
  if (fx.food) fx.food = Math.round(fx.food * FRAGILE[o.restaurant] * vary());
  if (fx.money) fx.money = Math.round((fx.money * vary()) / 5) * 5;
  return { fx, won };
}

export function choose(o: Order, st: RunState, choice: number): RunState {
  if (st.step >= STEPS || choice < 0 || choice > 2) return st;
  const { fx, won } = resolve(o, st.step, choice);
  const stage = STAGES[st.step]!;
  const time = baseMinutes(stage, o.distance) + (fx.time ?? 0);
  const won_ = [...st.won];
  won_[st.step] = won;
  const gone = st.gone || fx.gone === true;
  return {
    // A vanished customer ends the run right there.
    step: gone ? STEPS : st.step + 1,
    elapsed: Math.max(0, st.elapsed + time),
    money: st.money + (fx.money ?? 0),
    chaos: clamp(st.chaos + (fx.chaos ?? 0)),
    food: clamp(st.food + (fx.food ?? 0)),
    mood: clamp(st.mood + (fx.mood ?? 0)),
    wrong: st.wrong || fx.wrong === true,
    gone,
    choices: [...st.choices, choice],
    won: won_,
    last: { time: fx.time ?? 0, money: fx.money ?? 0, chaos: fx.chaos ?? 0, food: fx.food ?? 0 },
  };
}

export function isDone(st: RunState): boolean {
  return st.step >= STEPS;
}

// ---------------------------------------------------------------------------
// Endings, rating, earnings, score
// ---------------------------------------------------------------------------

export type EndingId = "legendary" | "perfect" | "delivered" | "late" | "customer-gone" | "food-damaged" | "wrong-address" | "total-chaos";
/** Rare by design. */
export const LEGENDARY_ENDINGS: readonly EndingId[] = ["legendary"];

/** Mood drops as you run late. */
function finalMood(o: Order, st: RunState): number {
  const late = Math.max(0, st.elapsed - o.promised);
  return clamp(st.mood - late * 3 - (100 - st.food) * 0.3);
}

export function endingOf(o: Order, st: RunState): EndingId {
  if (st.gone) return "customer-gone";
  if (st.wrong) return "wrong-address";
  if (st.chaos >= 60) return "total-chaos";
  if (st.food <= 60) return "food-damaged";
  const onTime = st.elapsed <= o.promised;
  const mood = finalMood(o, st);
  if (!onTime) return "late";
  if (st.elapsed <= o.promised - 10 && st.food >= 92 && mood >= 82 && st.chaos <= 25) return "legendary";
  if (st.food >= 75 && mood >= 55) return "perfect";
  return "delivered";
}

/** 1–5 stars. */
export function ratingOf(o: Order, st: RunState): number {
  const e = endingOf(o, st);
  if (e === "customer-gone" || e === "wrong-address") return 1;
  if (e === "legendary") return 5;
  const stars = 1 + (finalMood(o, st) / 100) * 3 + (st.food / 100) * 1.2 - (e === "total-chaos" ? 1 : 0);
  return Math.max(1, Math.min(5, Math.round(stars)));
}

/** Base pay + choice money + a tip that follows the rating (deterministic). */
export function earningsOf(o: Order, st: RunState): { total: number; tip: number } {
  const e = endingOf(o, st);
  const delivered = e !== "customer-gone" && e !== "wrong-address";
  const stars = ratingOf(o, st);
  const tip = delivered ? [0, 0, 0, 10, 30, 60][stars]! + (e === "legendary" ? 50 : 0) : 0;
  const base = delivered ? o.pay : Math.round(o.pay * 0.3);
  return { total: Math.max(0, base + st.money + tip), tip };
}

/** Delivery Score. Max stays well under CHALLENGE_GAMES maxScore. */
export function deliveryScore(o: Order, st: RunState): number {
  const e = endingOf(o, st);
  const delivered = e !== "customer-gone" && e !== "wrong-address";
  const spare = o.promised - st.elapsed;
  const score =
    300 +
    (delivered ? 600 : 0) +
    Math.max(-400, Math.min(300, spare * 25)) +
    st.food * 6 +
    ratingOf(o, st) * 150 +
    earningsOf(o, st).total * 2 +
    Math.round(st.chaos * 3) + // surviving chaos is worth something
    (e === "legendary" ? 800 : e === "perfect" ? 300 : 0);
  return Math.max(0, Math.round(score));
}

export type RankId = "delivery-legend" | "pro-rider" | "gps-believer" | "lane-explorer" | "chaos-courier";

/** Title from score (pure). Never rename ids. */
export function rankFor(score: number): RankId {
  if (score >= 3400) return "delivery-legend";
  if (score >= 2550) return "pro-rider";
  if (score >= 2100) return "gps-believer";
  if (score >= 1300) return "lane-explorer";
  return "chaos-courier";
}
