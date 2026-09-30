// Bazar Bargain — pure, deterministic negotiation rules (no DOM, no React).
//
// A seed fixes the shopping list, budget, each stall's vendor personality,
// hidden "lowest price" (floor) and opening price. Every vendor reaction uses
// its own RNG from (seed, stall, turn, action), so the same seed + the same
// choices always play out identically.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "bazar-bargain";
export const LIST_SIZE = 5;

export type ItemId =
  | "hilsa"
  | "rui"
  | "chicken"
  | "eggs"
  | "potato"
  | "onion"
  | "rice"
  | "dal"
  | "chili"
  | "brinjal"
  | "beef"
  | "gourd";

/** Rough "fair" price in taka (game values, not a market report). */
export const FAIR_PRICE: Record<ItemId, number> = {
  hilsa: 900,
  rui: 350,
  chicken: 190,
  eggs: 150,
  potato: 60,
  onion: 90,
  rice: 350,
  dal: 130,
  chili: 40,
  brinjal: 70,
  beef: 780,
  gourd: 60,
};

const PROTEINS: readonly ItemId[] = ["hilsa", "rui", "chicken", "eggs", "beef"];
const OTHERS: readonly ItemId[] = ["potato", "onion", "rice", "dal", "chili", "brinjal", "gourd"];

export type PersonalityId = "stubborn" | "drama" | "friendly" | "sleepy" | "salesman" | "philosopher";

type Personality = {
  /** Opening price = fair × markup range. */
  markup: [number, number];
  /** Lowest acceptable = fair × floor range. */
  floor: [number, number];
  /** How far the vendor moves toward your offer (0–1). */
  concession: number;
  /** Rejections tolerated before refusing to sell. */
  patience: number;
  /** Chance of calling you back when you walk away. */
  callback: number;
  /** Chance a "regular customer" / "next shop" line works. */
  softness: number;
};

export const PERSONALITIES: Record<PersonalityId, Personality> = {
  stubborn: { markup: [1.25, 1.5], floor: [0.95, 1.0], concession: 0.25, patience: 2, callback: 0.25, softness: 0.3 },
  drama: { markup: [1.5, 1.9], floor: [0.88, 0.95], concession: 0.4, patience: 3, callback: 0.55, softness: 0.5 },
  friendly: { markup: [1.3, 1.6], floor: [0.85, 0.92], concession: 0.5, patience: 3, callback: 0.6, softness: 0.7 },
  sleepy: { markup: [1.3, 1.6], floor: [0.82, 0.9], concession: 0.55, patience: 1, callback: 0.3, softness: 0.5 },
  salesman: { markup: [1.6, 2.0], floor: [0.9, 0.97], concession: 0.35, patience: 4, callback: 0.7, softness: 0.4 },
  philosopher: { markup: [1.4, 1.7], floor: [0.88, 0.95], concession: 0.45, patience: 2, callback: 0.45, softness: 0.6 },
};
const PERSONALITY_IDS = Object.keys(PERSONALITIES) as PersonalityId[];

export type Stall = {
  item: ItemId;
  personality: PersonalityId;
  /** Hidden lowest price the vendor will accept. */
  floor: number;
  /** Opening price. */
  ask0: number;
};

export type Run = { seed: number; budget: number; stalls: Stall[] };

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);
const between = (rng: () => number, [a, b]: [number, number]) => a + (b - a) * rng();

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** The whole bazar for a seed: list, vendors, prices, budget. */
export function makeRun(seed: number): Run {
  const rng = createRng(hashString(`${GAME_SLUG}:${seed}:run`));
  const proteins = shuffle(PROTEINS, rng).slice(0, 2);
  const others = shuffle(OTHERS, rng).slice(0, LIST_SIZE - 2);
  const items = shuffle([...proteins, ...others], rng);
  const stalls = items.map((item): Stall => {
    const personality = PERSONALITY_IDS[Math.floor(rng() * PERSONALITY_IDS.length)]!;
    const p = PERSONALITIES[personality];
    const fair = FAIR_PRICE[item];
    const floor = round5(fair * between(rng, p.floor));
    return { item, personality, floor, ask0: Math.max(floor + 10, round5(fair * between(rng, p.markup))) };
  });
  // Enough for everything if you bargain a bit — not at opening prices.
  const fairTotal = stalls.reduce((sum, s) => sum + FAIR_PRICE[s.item], 0);
  const budget = Math.round((fairTotal * 1.25) / 50) * 50;
  return { seed, budget, stalls };
}

// ---------------------------------------------------------------------------
// Negotiation
// ---------------------------------------------------------------------------

export type Action =
  | { kind: "accept" }
  | { kind: "offer"; price: number }
  | { kind: "walk" }
  | { kind: "regular" }
  | { kind: "neighbor" }
  | { kind: "skip" };

/** What the vendor says (maps to copy in data/games/bazar-bargain.ts). */
export type Line =
  | "greet"
  | "counter"
  | "offended"
  | "final"
  | "deal"
  | "deal-full"
  | "freebie"
  | "refuse"
  | "callback"
  | "letgo"
  | "regular-yes"
  | "regular-no"
  | "neighbor-yes"
  | "neighbor-no"
  | "skip"
  | "broke";

export type StallStatus = "open" | "bought" | "refused" | "walked" | "skipped" | "broke";

export type StallState = {
  ask: number;
  patience: number;
  turn: number;
  walks: number;
  usedRegular: boolean;
  usedNeighbor: boolean;
  status: StallStatus;
  paid: number | null;
  freebie: boolean;
  line: Line;
};

export function isClosed(st: StallState): boolean {
  return st.status !== "open";
}

/** Open a stall. If you can't afford even the lowest price, you're broke here. */
export function openStall(run: Run, index: number, budgetLeft: number): StallState {
  const stall = run.stalls[index]!;
  const broke = budgetLeft < stall.floor;
  return {
    ask: stall.ask0,
    patience: PERSONALITIES[stall.personality].patience,
    turn: 0,
    walks: 0,
    usedRegular: false,
    usedNeighbor: false,
    status: broke ? "broke" : "open",
    paid: null,
    freebie: false,
    line: broke ? "broke" : "greet",
  };
}

/** Three offers below the current ask (≈55 / 70 / 85 %), deduped. */
export function offerOptions(st: StallState): number[] {
  const offers = [0.55, 0.7, 0.85].map((f) => round5(st.ask * f)).filter((p) => p < st.ask);
  return [...new Set(offers)];
}

/** Apply one action. Pure: returns the next state. */
export function act(run: Run, index: number, st: StallState, action: Action, budgetLeft: number): StallState {
  if (st.status !== "open") return st;
  const stall = run.stalls[index]!;
  const p = PERSONALITIES[stall.personality];
  const rng = createRng(hashString(`${GAME_SLUG}:${run.seed}:${index}:${st.turn}:${action.kind}`));
  const next: StallState = { ...st, turn: st.turn + 1 };

  switch (action.kind) {
    case "accept": {
      if (budgetLeft < st.ask) return st;
      next.status = "bought";
      next.paid = st.ask;
      // Paying the opening price makes vendors generous, occasionally.
      next.freebie = st.ask >= stall.ask0 && rng() < 0.02;
      next.line = next.freebie ? "freebie" : "deal-full";
      return next;
    }
    case "offer": {
      const price = action.price;
      if (price > budgetLeft || price >= st.ask) return st;
      if (price >= stall.floor) {
        next.status = "bought";
        next.paid = price;
        const skill = (stall.ask0 - price) / Math.max(1, stall.ask0 - stall.floor);
        next.freebie = skill >= 0.8 && rng() < 0.05;
        next.line = next.freebie ? "freebie" : "deal";
        return next;
      }
      const insult = price < stall.floor * 0.7;
      next.patience -= insult ? 2 : 1;
      if (next.patience < 0) {
        next.status = "refused";
        next.line = "refuse";
        return next;
      }
      const moved = round5(st.ask - (st.ask - price) * p.concession * (0.8 + 0.4 * rng()));
      next.ask = Math.max(stall.floor, Math.min(st.ask, moved));
      next.line = next.ask === stall.floor ? "final" : insult ? "offended" : "counter";
      return next;
    }
    case "walk": {
      next.walks += 1;
      const chance = (p.callback / next.walks) * (st.ask > stall.floor * 1.05 ? 1 : 0.3);
      if (rng() < chance) {
        next.ask = Math.max(stall.floor, round5(stall.floor + (st.ask - stall.floor) * (0.2 + 0.3 * rng())));
        next.line = "callback";
      } else {
        next.status = "walked";
        next.line = "letgo";
      }
      return next;
    }
    case "regular": {
      if (!st.usedRegular && rng() < p.softness) {
        next.ask = Math.max(stall.floor, round5(st.ask * (0.86 + 0.06 * rng())));
        next.line = "regular-yes";
      } else {
        next.patience -= 1;
        next.line = "regular-no";
      }
      next.usedRegular = true;
      if (next.patience < 0) {
        next.status = "refused";
        next.line = "refuse";
      }
      return next;
    }
    case "neighbor": {
      if (!st.usedNeighbor && rng() < p.softness) {
        next.ask = Math.max(stall.floor, round5(st.ask * (0.82 + 0.08 * rng())));
        next.line = "neighbor-yes";
      } else {
        next.patience -= 1;
        next.line = "neighbor-no";
      }
      next.usedNeighbor = true;
      if (next.patience < 0) {
        next.status = "refused";
        next.line = "refuse";
      }
      return next;
    }
    case "skip": {
      next.status = "skipped";
      next.line = "skip";
      return next;
    }
  }
}

// ---------------------------------------------------------------------------
// Scoring and endings
// ---------------------------------------------------------------------------

export type EndingId =
  | "amma-approved"
  | "free-lemon"
  | "banned"
  | "broke"
  | "empty-bag"
  | "walking-atm"
  | "sharp-bargainer"
  | "decent-bazar";

/** Legendary endings are rare by design. */
export const LEGENDARY: readonly EndingId[] = ["amma-approved", "free-lemon"];

export type Summary = {
  score: number;
  saved: number;
  spent: number;
  bought: number;
  refusals: number;
  freebies: number;
  /** Average negotiation skill over bought items, 0–100. */
  skill: number;
  ending: EndingId;
};

export function summarize(run: Run, states: readonly StallState[]): Summary {
  let saved = 0;
  let spent = 0;
  let bought = 0;
  let refusals = 0;
  let freebies = 0;
  let broke = 0;
  let skillSum = 0;
  states.forEach((st, i) => {
    const stall = run.stalls[i]!;
    if (st.status === "refused") refusals += 1;
    if (st.status === "broke") broke += 1;
    if (st.freebie) freebies += 1;
    if (st.status === "bought" && st.paid !== null) {
      bought += 1;
      spent += st.paid;
      saved += stall.ask0 - st.paid;
      skillSum += Math.min(1, Math.max(0, (stall.ask0 - st.paid) / Math.max(1, stall.ask0 - stall.floor)));
    }
  });
  const skill = bought ? skillSum / bought : 0;
  const score = Math.max(0, saved + bought * 120 + Math.round(skill * 100) * bought + freebies * 150 - refusals * 60);
  const all = bought === run.stalls.length;

  let ending: EndingId;
  if (all && skill >= 0.95 && refusals === 0) ending = "amma-approved";
  else if (freebies >= 1 && bought >= run.stalls.length - 1 && skill >= 0.5) ending = "free-lemon";
  else if (refusals >= 2) ending = "banned";
  else if (broke >= 1) ending = "broke";
  else if (bought <= 1) ending = "empty-bag";
  else if (bought >= 3 && skill < 0.25) ending = "walking-atm";
  else if (skill >= 0.6) ending = "sharp-bargainer";
  else ending = "decent-bazar";

  return { score, saved, spent, bought, refusals, freebies, skill: Math.round(skill * 100), ending };
}

/** Deterministic pick of a funny line variant. */
export function pickLine<T>(items: readonly T[], seed: number, key: string): T {
  return items[hashString(`${GAME_SLUG}:${seed}:${key}`) % items.length] as T;
}
