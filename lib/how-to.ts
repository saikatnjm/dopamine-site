// "How to play" + tips + FAQ for every activity (Phase 49 step C). Content in
// data/how-to/*.ts, keyed by activity key ("g:<slug>", "x:<slug>", "p:<id>").
// Pure: rendered by components/seo/how-to.tsx, checked by tests/how-to.test.ts.
//
// Rules: describe only what the activity really does (read its rules module),
// no invented numbers, no popularity claims, EN + BN for every line, and no
// paragraph may repeat across activities or guides (same check as lib/guides.ts).

import type { Text } from "@/lib/i18n/core";

export type Faq = { q: Text; a: Text };

export type HowTo = {
  /** 3–5 short steps, in play order. */
  steps: readonly Text[];
  /** 2–3 tips that help a first-time player. */
  tips: readonly Text[];
  /** Exactly 3 questions specific to this activity. */
  faq: readonly Faq[];
};

export const HOW_TO_LIMITS = { steps: [3, 5], tips: [2, 3], faq: 3, line: 220, answer: 360 } as const;

const bothLangs = (t: Text) => (typeof t === "string" ? [t] : [t.en, t.bn]);
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Problems with the how-to content (empty = OK). `required` = activities that must
 * have one (playable now), `allowed` = every registered activity (hidden ones may
 * keep theirs), `others` = paragraphs already used elsewhere (guides).
 */
export function howToProblems(
  all: Readonly<Record<string, HowTo>>,
  required: readonly string[],
  allowed: readonly string[],
  others: readonly Text[] = [],
): string[] {
  const problems: string[] = [];
  const keys = new Set(allowed);
  for (const k of required) if (!all[k]) problems.push(`${k}: missing how-to`);
  const seen = new Map<string, string>();
  for (const t of others.flatMap(bothLangs)) seen.set(norm(t), "a guide");
  for (const [key, h] of Object.entries(all)) {
    if (!keys.has(key)) problems.push(`${key}: not an activity`);
    const [smin, smax] = HOW_TO_LIMITS.steps;
    const [tmin, tmax] = HOW_TO_LIMITS.tips;
    if (h.steps.length < smin || h.steps.length > smax) problems.push(`${key}: ${h.steps.length} steps`);
    if (h.tips.length < tmin || h.tips.length > tmax) problems.push(`${key}: ${h.tips.length} tips`);
    if (h.faq.length !== HOW_TO_LIMITS.faq) problems.push(`${key}: ${h.faq.length} FAQ entries`);
    const lines = [...h.steps, ...h.tips, ...h.faq.map((f) => f.q)];
    for (const t of [...lines, ...h.faq.map((f) => f.a)]) {
      if (typeof t === "string" || !t.en.trim() || !t.bn.trim()) problems.push(`${key}: needs EN + BN: “${bothLangs(t)[0]?.slice(0, 40)}”`);
    }
    for (const t of lines.flatMap(bothLangs)) if (t.length > HOW_TO_LIMITS.line) problems.push(`${key}: line too long (${t.length})`);
    for (const t of h.faq.flatMap((f) => bothLangs(f.a))) if (t.length > HOW_TO_LIMITS.answer) problems.push(`${key}: answer too long (${t.length})`);
    // No paragraph twice anywhere (steps, tips, answers; questions may rhyme across games).
    for (const t of [...h.steps, ...h.tips, ...h.faq.map((f) => f.a)].flatMap(bothLangs)) {
      const n = norm(t);
      const prev = seen.get(n);
      if (prev) problems.push(`${key}: duplicated from ${prev}: “${t.slice(0, 50)}…”`);
      else seen.set(n, key);
    }
  }
  return problems;
}
