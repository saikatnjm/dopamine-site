// বই ক্রিকেট — pure, deterministic Book Cricket rules (no DOM/React).
//
// The back-bench classic: open the book at a random (even) page; its last
// digit decides the ball. The player only chooses DEFEND or SLOG.
// Determinism: the target, the teacher-alert ball and every page come from
// separate seeded streams keyed by (seed, decision, deliveryIndex) — pages
// never depend on the player's choices, so two friends on the same seed get
// the same pages and target; only their choices (and HIDE reflexes) differ.
//
// Outcome table (digit = page % 10):
//   0 → SLOG: out · DEFEND: dot, but page % 100 === 0 is out   (free hit: dot)
//   2 → SLOG 2 · DEFEND 1     4 → SLOG FOUR · DEFEND 1     6 → SLOG SIX · DEFEND 2
//   8 → no ball: +1, not a legal ball, next delivery is a free hit
//       (after MAX_NO_BALLS no-balls an 8 is a dot: "Sir confiscated the extra pages")
// Innings: LEGAL_BALLS legal balls or WICKETS wickets — never ends early on
// passing the target, so challenge scores stay comparable.

import { createRng, hashString } from "@/lib/random";

export const GAME_SLUG = "book-cricket";
export const LEGAL_BALLS = 12;
export const WICKETS = 3;
export const MAX_NO_BALLS = 6;
/** Time to tap HIDE when the teacher comes (ms). */
export const TEACHER_WINDOW_MS = 1200;
/** Target = TARGET_MIN + 0…TARGET_SPAN-1 (bot-tuned, see AGENTS.md). */
export const TARGET_MIN = 24;
export const TARGET_SPAN = 27;

export type Choice = "defend" | "slog";
export type BallKind = "out" | "dot" | "one" | "two" | "four" | "six" | "no-ball" | "teacher";

export type Ball = {
  /** null when the teacher caught you (the page was drawn and skipped). */
  page: number | null;
  choice: Choice | null;
  kind: BallKind;
  runs: number;
  legal: boolean;
  /** This delivery was a free hit. */
  freeHit: boolean;
  /** You hid the book in time just before this ball. */
  teacherSaved?: boolean;
  /** Index of this delivery (every delivery, no-balls included). */
  index: number;
};

export type Match = { seed: number; target: number; teacherBall: number };

export type Innings = {
  runs: number;
  wickets: number;
  legal: number;
  deliveries: number;
  noBalls: number;
  freeHit: boolean;
  teacherDone: boolean;
  balls: Ball[];
  /** Index in `balls` of the delivery that first took runs past the target (−1 = not yet). */
  passedAt: number;
};

function rng(seed: number, key: string, index = 0): number {
  return createRng(hashString(`${GAME_SLUG}:${seed >>> 0}:${key}:${index}`))();
}

export function createMatch(seed: number): Match {
  return {
    seed: seed >>> 0,
    target: TARGET_MIN + Math.floor(rng(seed, "target") * TARGET_SPAN),
    // The Nth legal ball (4–10) is when Sir walks in.
    teacherBall: 4 + Math.floor(rng(seed, "teacher") * 7),
  };
}

/** Even page 2–400 for a delivery index. Never depends on choices. */
export function pageFor(seed: number, deliveryIndex: number): number {
  return 2 * (1 + Math.floor(rng(seed, "page", deliveryIndex) * 200));
}

export function newInnings(): Innings {
  return { runs: 0, wickets: 0, legal: 0, deliveries: 0, noBalls: 0, freeHit: false, teacherDone: false, balls: [], passedAt: -1 };
}

export function isOver(s: Innings): boolean {
  return s.legal >= LEGAL_BALLS || s.wickets >= WICKETS;
}

/** Does the teacher come before the next delivery? (Once per match, at a legal ball.) */
export function teacherDue(s: Innings, m: Match): boolean {
  return !s.teacherDone && !isOver(s) && s.legal + 1 === m.teacherBall;
}

function outcome(choice: Choice, page: number, freeHit: boolean, noBallsLeft: boolean): { kind: BallKind; runs: number; legal: boolean } {
  const digit = page % 10;
  if (digit === 8) return noBallsLeft ? { kind: "no-ball", runs: 1, legal: false } : { kind: "dot", runs: 0, legal: true };
  if (digit === 0) {
    const out = choice === "slog" || page % 100 === 0;
    return { kind: out && !freeHit ? "out" : "dot", runs: 0, legal: true };
  }
  if (choice === "defend") return digit === 6 ? { kind: "two", runs: 2, legal: true } : { kind: "one", runs: 1, legal: true };
  if (digit === 2) return { kind: "two", runs: 2, legal: true };
  if (digit === 4) return { kind: "four", runs: 4, legal: true };
  return { kind: "six", runs: 6, legal: true };
}

function record(s: Innings, m: Match, ball: Ball): Innings {
  const runs = s.runs + ball.runs;
  const balls = [...s.balls, ball];
  return {
    runs,
    wickets: s.wickets + (ball.kind === "out" ? 1 : 0),
    legal: s.legal + (ball.legal ? 1 : 0),
    deliveries: s.deliveries + 1,
    noBalls: s.noBalls + (ball.kind === "no-ball" ? 1 : 0),
    freeHit: ball.kind === "no-ball",
    teacherDone: s.teacherDone || ball.kind === "teacher" || Boolean(ball.teacherSaved),
    balls,
    passedAt: s.passedAt < 0 && runs > m.target ? balls.length - 1 : s.passedAt,
  };
}

/** Play the next delivery with a choice. `teacherSaved` = the alert came and you hid the book. No-op once the innings is over. */
export function playBall(s: Innings, m: Match, choice: Choice, teacherSaved = false): Innings {
  if (isOver(s)) return s;
  const page = pageFor(m.seed, s.deliveries);
  const o = outcome(choice, page, s.freeHit, s.noBalls < MAX_NO_BALLS);
  return record(s, m, { page, choice, ...o, freeHit: s.freeHit, index: s.deliveries, ...(teacherSaved ? { teacherSaved: true } : {}) });
}

/** Too slow to hide the book: a legal dot ball. The page index is still used up, so later pages stay identical. */
export function teacherCaught(s: Innings, m: Match): Innings {
  if (isOver(s)) return s;
  return record(s, m, { page: null, choice: null, kind: "teacher", runs: 0, legal: true, freeHit: s.freeHit, index: s.deliveries });
}

// ---------------------------------------------------------------------------
// Endings + ranks (ids permanent)
// ---------------------------------------------------------------------------

export const ENDING_IDS = ["last-ball-win", "won-chase", "tie", "all-out", "lost-chase"] as const;
export type EndingId = (typeof ENDING_IDS)[number];

export function endingOf(s: Innings, m: Match): EndingId {
  if (s.runs > m.target) {
    const passing = s.balls[s.passedAt];
    const legalBefore = s.balls.slice(0, s.passedAt).filter((b) => b.legal).length;
    return passing?.legal && legalBefore + 1 === LEGAL_BALLS ? "last-ball-win" : "won-chase";
  }
  if (s.runs === m.target) return "tie";
  if (s.wickets >= WICKETS) return "all-out";
  return "lost-chase";
}

export const RANK_IDS = ["duck", "tailender", "tiffin-batter", "back-bench-hitter", "class-captain", "book-legend"] as const;
export type RankId = (typeof RANK_IDS)[number];

export function rankFor(runs: number): RankId {
  if (runs >= 40) return "book-legend";
  if (runs >= 30) return "class-captain";
  if (runs >= 20) return "back-bench-hitter";
  if (runs >= 10) return "tiffin-batter";
  if (runs >= 1) return "tailender";
  return "duck";
}

/** Overs as "x.y" from legal balls (6 per over). */
export function oversOf(legal: number): string {
  return `${Math.floor(legal / 6)}.${legal % 6}`;
}

export function strikeRate(s: Innings): number {
  return s.legal === 0 ? 0 : Math.round((s.runs / s.legal) * 100);
}

/** Out on the very first legal ball (for the hidden "golden duck" achievement). */
export function firstBallOut(s: Innings): boolean {
  return s.balls.find((b) => b.legal)?.kind === "out";
}

/** Which of the 3 commentary variants to show for a delivery — seeded, never Math.random(). */
export function lineVariant(seed: number, deliveryIndex: number): number {
  return Math.floor(rng(seed, "line", deliveryIndex) * 3);
}

/** Ball strip symbol: 6 4 2 1 • W NB 🧑‍🏫 */
export function ballSymbol(b: Ball): string {
  switch (b.kind) {
    case "out":
      return "W";
    case "dot":
      return "•";
    case "no-ball":
      return "NB";
    case "teacher":
      return "🧑‍🏫";
    default:
      return String(b.runs);
  }
}
