// আমার বাংলাদেশ — pure rules for the "districts I've been to" map (no DOM/React).
//
// The visited set travels in share links as a 64-bit mask (one bit per
// district, DISTRICT_BIT_ORDER) written in base36: ≤ 13 characters, e.g.
// /games/my-bangladesh?v=1z141z4. Decoding never throws and never trusts the
// input. The count is self-reported, so there is no score to beat and no
// challenge token — just "how many have you been to?".

import { DISTRICT_SHAPES } from "@/data/dialects/map";
import { DIVISIONS } from "@/data/divisions";

export const GAME_SLUG = "my-bangladesh";
export const TOTAL_DISTRICTS = 64;

/**
 * Bit order for share codes. FROZEN: never reorder, insert or remove — every
 * shared link depends on it. A test checks it is the same set as DISTRICTS.
 */
export const DISTRICT_BIT_ORDER: readonly string[] = [
  "dhaka", "faridpur", "gazipur", "gopalganj", "kishoreganj", "madaripur", "manikganj", "munshiganj",
  "narayanganj", "narsingdi", "rajbari", "shariatpur", "tangail", "mymensingh", "jamalpur", "netrokona",
  "sherpur", "chattogram", "coxsbazar", "cumilla", "brahmanbaria", "chandpur", "feni", "lakshmipur",
  "noakhali", "rangamati", "khagrachhari", "bandarban", "khulna", "bagerhat", "chuadanga", "jashore",
  "jhenaidah", "kushtia", "magura", "meherpur", "narail", "satkhira", "barishal", "barguna",
  "bhola", "jhalokati", "patuakhali", "pirojpur", "sylhet", "habiganj", "moulvibazar", "sunamganj",
  "rangpur", "dinajpur", "gaibandha", "kurigram", "lalmonirhat", "nilphamari", "panchagarh", "thakurgaon",
  "rajshahi", "bogura", "chapainawabganj", "joypurhat", "naogaon", "natore", "pabna", "sirajganj",
];

const BIT = new Map(DISTRICT_BIT_ORDER.map((id, i) => [id, i]));
const MAX = (1n << 64n) - 1n;
const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export function isDistrict(id: unknown): id is string {
  return typeof id === "string" && BIT.has(id);
}

/** Known district ids only, deduplicated, in bit order (unknown ids are dropped). */
export function cleanVisited(ids: Iterable<unknown>): string[] {
  const set = new Set<string>();
  for (const id of ids) if (isDistrict(id)) set.add(id);
  return DISTRICT_BIT_ORDER.filter((id) => set.has(id));
}

/** Visited ids → base36 code ("0" for none). Unknown ids are ignored. */
export function encodeVisited(ids: Iterable<string>): string {
  let mask = 0n;
  for (const id of ids) {
    const bit = BIT.get(id);
    if (bit !== undefined) mask |= 1n << BigInt(bit);
  }
  return mask.toString(36);
}

/** Code → visited ids in bit order; null for anything that isn't a valid code. Never throws. */
export function decodeVisited(code: unknown): string[] | null {
  const raw = Array.isArray(code) ? code[0] : code;
  if (typeof raw !== "string") return null;
  const s = raw.trim().toLowerCase();
  if (!/^[0-9a-z]{1,13}$/.test(s)) return null;
  let mask = 0n;
  for (const ch of s) mask = mask * 36n + BigInt(DIGITS.indexOf(ch));
  if (mask > MAX) return null;
  return DISTRICT_BIT_ORDER.filter((_, i) => (mask >> BigInt(i)) & 1n);
}

// ---------------------------------------------------------------------------
// Titles (ids permanent; copy lives in data/games/my-bangladesh.ts)
// ---------------------------------------------------------------------------

export const TITLE_IDS = ["never-left", "weekend-tripper", "eid-bus-veteran", "launch-ghat-regular", "desh-explorer", "walking-atlas", "all-64"] as const;
export type TitleId = (typeof TITLE_IDS)[number];

/** 1 / 2–5 / 6–12 / 13–24 / 25–40 / 41–63 / 64. (0 shows no title; treated as 1.) */
export function titleFor(count: number): TitleId {
  if (count >= TOTAL_DISTRICTS) return "all-64";
  if (count >= 41) return "walking-atlas";
  if (count >= 25) return "desh-explorer";
  if (count >= 13) return "launch-ghat-regular";
  if (count >= 6) return "eid-bus-veteran";
  if (count >= 2) return "weekend-tripper";
  return "never-left";
}

// ---------------------------------------------------------------------------
// Badges (ids permanent): all-divisions · division-<id> · hill-tracts · dhaka-bubble
// ---------------------------------------------------------------------------

export type BadgeId = "all-divisions" | `division-${string}` | "hill-tracts" | "dhaka-bubble";
export const HILL_TRACTS = ["rangamati", "khagrachhari", "bandarban"] as const;
const DHAKA = DIVISIONS.find((d) => d.id === "dhaka")!;

/** Ordered by rarity: all divisions, completed divisions (smallest first), hill tracts, Dhaka bubble. */
export function badgesFor(visited: readonly string[]): BadgeId[] {
  const set = new Set(cleanVisited(visited));
  const out: BadgeId[] = [];
  if (DIVISIONS.every((d) => d.districts.some((id) => set.has(id)))) out.push("all-divisions");
  const completed = DIVISIONS.filter((d) => d.districts.every((id) => set.has(id))).sort(
    (a, b) => a.districts.length - b.districts.length || DIVISIONS.indexOf(a) - DIVISIONS.indexOf(b),
  );
  for (const d of completed) out.push(`division-${d.id}`);
  if (HILL_TRACTS.every((id) => set.has(id))) out.push("hill-tracts");
  if (set.size >= 3 && [...set].every((id) => DHAKA.districts.includes(id))) out.push("dhaka-bubble");
  return out;
}

const TOTAL_AREA = DISTRICT_BIT_ORDER.reduce((sum, id) => sum + (DISTRICT_SHAPES[id]?.area ?? 0), 0);

/** Real numbers only. mapPercent is share of the drawn (projected) map — "of the map", not "of the country". */
export function mapStats(visited: readonly string[]): { districts: number; divisions: number; mapPercent: number } {
  const ids = cleanVisited(visited);
  const set = new Set(ids);
  const area = ids.reduce((sum, id) => sum + (DISTRICT_SHAPES[id]?.area ?? 0), 0);
  return {
    districts: ids.length,
    divisions: DIVISIONS.filter((d) => d.districts.some((id) => set.has(id))).length,
    mapPercent: TOTAL_AREA > 0 ? Math.round((area / TOTAL_AREA) * 100) : 0,
  };
}
