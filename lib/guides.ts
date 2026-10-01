// Guide pages: validation + resolution of data/guides.ts against the real
// activity registry. Validation throws (dev server / build) so a renamed
// slug, a thin list or a copy-pasted paragraph can never ship.

import { GUIDE_SLUGS, guides, type Guide, type GuideSlug } from "@/data/guides";
import { listActivities, type Activity } from "@/lib/activities";
import { t, type Lang, type Text } from "@/lib/i18n/core";

export const GUIDE_MIN_PICKS = 5;
export const GUIDE_MAX_PICKS = 7;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const bothLangs = (x: Text): string[] => (typeof x === "string" ? [x] : [x.en, x.bn]);

/** Every problem with the guide content; [] when valid. Pure (testable). */
export function guideProblems(all: readonly Activity[]): string[] {
  const keys = new Set(all.map((a) => a.key));
  const problems: string[] = [];
  const seen = new Map<string, string>();
  for (const slug of GUIDE_SLUGS) {
    const g = guides[slug];
    if (g.slug !== slug) problems.push(`${slug}: slug mismatch`);
    const picks = g.picks.map((p) => p.key);
    if (picks.length < GUIDE_MIN_PICKS || picks.length > GUIDE_MAX_PICKS) problems.push(`${slug}: needs ${GUIDE_MIN_PICKS}–${GUIDE_MAX_PICKS} picks`);
    for (const k of [...picks, ...g.related]) if (!keys.has(k)) problems.push(`${slug}: unknown activity ${k}`);
    if (new Set(picks).size !== picks.length) problems.push(`${slug}: duplicate pick`);
    for (const k of g.related) if (picks.includes(k)) problems.push(`${slug}: related ${k} repeats a pick`);
    for (const other of g.guides) if (other === slug || !GUIDE_SLUGS.includes(other)) problems.push(`${slug}: bad guide link ${other}`);
    // No paragraph may appear twice anywhere (intros, why-lines, FAQ answers).
    const paragraphs = [...g.intro, ...g.picks.map((p) => p.why), ...(g.faq ?? []).map((f) => f.a)];
    for (const text of paragraphs.flatMap(bothLangs)) {
      if (!text.trim()) problems.push(`${slug}: empty text`);
      const k = norm(text);
      const prev = seen.get(k);
      if (prev) problems.push(`${slug}: paragraph duplicated from ${prev}: “${text.slice(0, 50)}…”`);
      else seen.set(k, slug);
    }
  }
  return problems;
}

if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
  const problems = guideProblems(listActivities("en"));
  if (problems.length) throw new Error(`Invalid guide content (data/guides.ts):\n- ${problems.join("\n- ")}`);
}

export type ResolvedGuide = {
  guide: Guide;
  picks: { activity: Activity; why: string }[];
  related: Activity[];
};

export function getGuide(slug: GuideSlug, lang: Lang): ResolvedGuide {
  const guide = guides[slug];
  const byKey = new Map(listActivities(lang).map((a) => [a.key, a]));
  return {
    guide,
    picks: guide.picks.flatMap((p) => {
      const activity = byKey.get(p.key);
      return activity ? [{ activity, why: t(p.why, lang) }] : [];
    }),
    related: guide.related.flatMap((k) => byKey.get(k) ?? []),
  };
}

export { GUIDE_SLUGS, guides, type GuideSlug };
