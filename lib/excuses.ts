// Excuse Generator engine — pure and deterministic.
// generateExcuse(category, seed) always returns the same excuse, so a shared
// link (/excuses?c=<category>&s=<seed36>) reproduces it exactly.
// Fresh seeds come from newSeed(); freshSeed() skips recently used fragments
// so repeated presses feel varied.

import {
  CATEGORIES,
  categoryReasons,
  closers,
  openers,
  sharedReasons,
  twists,
  verdicts,
  type Category,
  type CategoryId,
  type Frag,
} from "@/data/excuses";
import { fmt, t, type Lang, type Text } from "@/lib/i18n/core";
import { createRng, hashString, newSeed, weightedPick } from "@/lib/random";

const REAL: readonly Category[] = CATEGORIES.filter((c): c is Category => c !== "random");

/** Situations some categories make easier to believe. */
const BASE_CRED: Record<Category, number> = {
  office: 52,
  university: 48,
  late: 58,
  friends: 62,
  family: 46,
  dating: 42,
  unfinished: 44,
};

export type Excuse = {
  requested: CategoryId;
  category: Category;
  seed: number;
  opener: Frag;
  reason: Frag;
  twist: Frag;
  closer: Frag;
  /** 0–100 */
  credibility: number;
  /** 0–100 */
  chaos: number;
  verdict: Text;
};

export function isCategory(value: unknown): value is CategoryId {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));
const pick = <T>(items: readonly T[], rng: () => number): T => items[Math.floor(rng() * items.length)]!;

export function generateExcuse(requested: CategoryId, seed: number): Excuse {
  const rng = createRng(hashString(`excuse:${requested}:${seed >>> 0}`));
  const category = requested === "random" ? pick(REAL, rng) : requested;
  const opener = pick(openers[category], rng);
  // Category-flavoured reasons are a bit more likely than shared ones.
  const pool = [...categoryReasons[category].map((f) => ({ f, w: 1.6 })), ...sharedReasons.map((f) => ({ f, w: 1 }))];
  const reason = weightedPick(pool, (x) => x.w, rng)!.f;
  const twist = pick(twists, rng);
  const closer = pick(closers, rng);

  const credibility = clamp(BASE_CRED[category] + opener.cred + reason.cred + twist.cred + closer.cred + (rng() - 0.5) * 12, 3, 97);
  const chaos = clamp(opener.chaos + reason.chaos + twist.chaos + closer.chaos + rng() * 12, 5, 99);
  const band = verdicts.find((v) => credibility <= v.maxCred) ?? verdicts[verdicts.length - 1]!;
  const verdict = pick(band.lines, rng);

  return { requested, category, seed: seed >>> 0, opener, reason, twist, closer, credibility, chaos, verdict };
}

/** The excuse as one sentence in a language. */
export function excuseText(ex: Excuse, lang: Lang): string {
  const stop = lang === "bn" ? "।" : ".";
  const opener = t(ex.opener.text, lang);
  const reason = t(ex.reason.text, lang);
  const twist = t(ex.twist.text, lang);
  const closer = t(ex.closer.text, lang);
  let s = `${opener} ${reason}`;
  if (twist) s += `, ${twist}`;
  s += stop;
  if (closer) s += ` ${closer}`;
  return s.replace(/\s+/g, " ").trim();
}

/** A new seed whose excuse avoids recently used reasons/twists. */
export function freshSeed(requested: CategoryId, recent: readonly string[]): number {
  let seed = newSeed();
  for (let i = 0; i < 12; i++) {
    const ex = generateExcuse(requested, seed);
    const twistRepeat = t(ex.twist.text, "en") !== "" && recent.includes(ex.twist.id);
    if (!recent.includes(ex.reason.id) && !recent.includes(ex.opener.id) && !twistRepeat) return seed;
    seed = newSeed();
  }
  return seed;
}

/** Ids to remember for the no-repeat check. */
export function usedIds(ex: Excuse): string[] {
  return [ex.opener.id, ex.reason.id, ex.twist.id];
}

/** Share message (no URL inside). */
export function shareMessage(template: Text, ex: Excuse, lang: Lang, num: (n: number, l: Lang) => string): string {
  return fmt(t(template, lang), { cred: num(ex.credibility, lang), chaos: num(ex.chaos, lang), excuse: excuseText(ex, lang) });
}
