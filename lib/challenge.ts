// "Challenge a Friend": compact, URL-safe challenge tokens shared by all games.
//
// Token v1:  1<code>.<seed36>.<score36>.<check>   e.g.  1cc.3ol2kf.1hc.7q
//   code   2-letter game code (below; never reuse or rename)
//   seed   game seed, base36 (uint32)
//   score  the challenger's score, base36 (≤ the game's maxScore)
//   check  2-char base36 checksum — catches truncated/edited links.
// It is NOT a signature: there are no secrets client-side, so a determined
// person can forge a score. The UI only ever says "your friend scored X".
// Links live at /c/<token> (short). Old /games/<slug>?seed=&s= links still work.

import { hashString } from "@/lib/random";

export const CHALLENGE_GAMES = {
  "cng-catch": { code: "cc", maxScore: 30_000 },
  "traffic-dodge": { code: "td", maxScore: 50_000 },
  "bazar-bargain": { code: "bb", maxScore: 8_000 },
  "tea-balance": { code: "tb", maxScore: 1_200 },
  "dont-tap": { code: "dt", maxScore: 3_000 },
} as const;

export type ChallengeGame = keyof typeof CHALLENGE_GAMES;

/** What a game component needs to replay a friend's round. */
export type FriendChallenge = { seed: number; score: number };

export type Challenge = FriendChallenge & { game: ChallengeGame };

const VERSION = "1";
const TOKEN_RE = /^1([a-z]{2})\.([0-9a-z]{1,7})\.([0-9a-z]{1,4})\.([0-9a-z]{2})$/;
const MAX_TOKEN_LENGTH = 32;

const BY_CODE = new Map<string, ChallengeGame>(
  (Object.keys(CHALLENGE_GAMES) as ChallengeGame[]).map((g) => [CHALLENGE_GAMES[g].code, g]),
);

export function isChallengeGame(slug: string): slug is ChallengeGame {
  return Object.hasOwn(CHALLENGE_GAMES, slug);
}

function checksum(code: string, seed: number, score: number): string {
  return (hashString(`hottogol:challenge:${VERSION}:${code}:${seed}:${score}`) % 1296).toString(36).padStart(2, "0");
}

function validNumbers(game: ChallengeGame, seed: number, score: number): boolean {
  return (
    Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff &&
    Number.isInteger(score) && score >= 0 && score <= CHALLENGE_GAMES[game].maxScore
  );
}

/** Build a token. Returns null for values a valid game can't produce. */
export function encodeChallenge(c: Challenge): string | null {
  if (!isChallengeGame(c.game) || !validNumbers(c.game, c.seed, c.score)) return null;
  const { code } = CHALLENGE_GAMES[c.game];
  return `${VERSION}${code}.${(c.seed >>> 0).toString(36)}.${c.score.toString(36)}.${checksum(code, c.seed >>> 0, c.score)}`;
}

/** Parse and validate a token. Never throws; anything odd returns null. */
export function decodeChallenge(token: unknown): Challenge | null {
  if (typeof token !== "string" || token.length > MAX_TOKEN_LENGTH) return null;
  let raw = token;
  try {
    raw = decodeURIComponent(token).trim().toLowerCase();
  } catch {
    return null;
  }
  const m = TOKEN_RE.exec(raw);
  if (!m) return null;
  const [, code, seed36, score36, check] = m;
  const game = BY_CODE.get(code!);
  if (!game) return null;
  const seed = parseInt(seed36!, 36);
  const score = parseInt(score36!, 36);
  if (!validNumbers(game, seed, score)) return null;
  if (checksum(code!, seed, score) !== check) return null;
  return { game, seed, score };
}

/** Path for a challenge, e.g. /c/1cc.3ol2kf.1hc.7q (null if invalid). */
export function challengePath(c: Challenge): string | null {
  const token = encodeChallenge(c);
  return token ? `/c/${token}` : null;
}
