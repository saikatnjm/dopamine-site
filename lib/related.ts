// Server-side, crawlable internal links between activities (see
// components/related/related-links.tsx). Deterministic on purpose: crawlers
// and users see the same links on every visit (the client-side "LIKED THAT?"
// on result screens is the personalised one).
//
// Ranking: summed relatedness() to the page's anchor activities (category,
// mechanic, tags, moods — lib/recommend.ts). Ties are broken by a hash of
// (page, candidate) so equally related activities rotate across pages
// instead of every page linking the same favourites. On one page each
// activity appears at most once across all sections, never the page itself.

import type { GuideSlug } from "@/data/guides";
import type { Activity } from "@/lib/activities";
import { hashString } from "@/lib/random";
import { relatedness } from "@/lib/recommend";

export type RelatedSectionId = "games" | "simulators" | "category" | "alsoLike";

export type RelatedSection = { id: RelatedSectionId; items: Activity[] };

export type RelatedPlan = {
  /** Activities the links should relate to (usually the page's own activity). */
  anchors: readonly Activity[];
  /** Sections in display order, each with a max item count. */
  sections: readonly { id: RelatedSectionId; max: number }[];
  /** Keys already linked on the page (never repeated). */
  exclude?: readonly string[];
  /** Extra filter on candidates (e.g. quick games on /daily). */
  pool?: (a: Activity) => boolean;
  /** Stable id of the page, for tie-break rotation. */
  pageKey: string;
  /** Cap on activity links across all sections (default 5). */
  maxTotal?: number;
};

/** Max score shuffle between near-equal matches (relatedness points). */
const ROTATION = 2.5;

/** A section with fewer items than this is dropped (not worth a heading). */
export const MIN_SECTION_ITEMS = 2;

const FILTER: Record<RelatedSectionId, (a: Activity, anchors: readonly Activity[]) => boolean> = {
  games: (a) => a.kind === "game",
  simulators: (a) => a.kind === "experience",
  category: (a, anchors) => anchors.length > 0 && anchors.every((x) => x.category === a.category),
  alsoLike: () => true,
};

export function relatedSections(all: readonly Activity[], plan: RelatedPlan): RelatedSection[] {
  const used = new Set<string>([...plan.anchors.map((a) => a.key), ...(plan.exclude ?? [])]);
  const degree = new Map(all.map((a) => [a.key, all.reduce((sum, b) => (b.key === a.key ? sum : sum + relatedness(a, b)), 0)]));
  const avgDegree = Math.max(1, [...degree.values()].reduce((x, y) => x + y, 0) / Math.max(1, degree.size));
  const ranked = all
    .filter((a) => !used.has(a.key) && (plan.pool?.(a) ?? true))
    .map((a) => {
      const rel = plan.anchors.reduce((sum, x) => sum + relatedness(x, a), 0);
      // Hub damping: an activity related to everything (e.g. shares the
      // common "traffic" tag) is scaled down so it doesn't top every page.
      const hub = Math.sqrt((degree.get(a.key) ?? avgDegree) / avgDegree);
      const tie = hashString(`${plan.pageKey}|${a.key}`);
      // Deterministic per-page jitter (< ROTATION) lets near-equal matches
      // rotate across pages, so no activity hoards every link.
      return { a, rel, score: rel / hub + ((tie % 1000) / 1000) * ROTATION };
    })
    // With anchors, only genuinely related activities qualify.
    .filter((r) => plan.anchors.length === 0 || r.rel > 0)
    .sort((x, y) => y.score - x.score);

  const out: RelatedSection[] = [];
  let left = plan.maxTotal ?? 5;
  for (const { id, max } of plan.sections) {
    if (left < MIN_SECTION_ITEMS) break;
    const items: Activity[] = [];
    for (const { a } of ranked) {
      if (items.length >= Math.min(max, left)) break;
      if (used.has(a.key) || !FILTER[id](a, plan.anchors)) continue;
      items.push(a);
    }
    if (items.length < MIN_SECTION_ITEMS) continue;
    items.forEach((a) => used.add(a.key));
    left -= items.length;
    out.push({ id, items });
  }
  return out;
}

/** The two guide pages that best fit an activity (for "More things to do when bored"). */
export function boredGuidesFor(a: Activity | null): GuideSlug[] {
  if (!a) return ["one-minute-games", "games-to-play-when-bored"];
  if (a.kind === "game") {
    return ["games-to-play-when-bored", (a.durationSec ?? 99) <= 60 ? "one-minute-games" : "funny-online-games"];
  }
  if (a.kind === "experience") return ["funny-websites", "random-things-to-do-online"];
  return ["random-things-to-do-online", "funny-websites"];
}

/** Standard plan for an activity's own page. */
export function activityPagePlan(current: Activity): Pick<RelatedPlan, "anchors" | "sections" | "pageKey"> {
  const sections: RelatedPlan["sections"] =
    current.kind === "game"
      ? [
          { id: "games", max: 3 },
          { id: "simulators", max: 2 },
        ]
      : current.kind === "experience"
        ? [
            { id: "category", max: 3 },
            { id: "simulators", max: 2 },
            { id: "games", max: 2 },
          ]
        : [{ id: "alsoLike", max: 3 }];
  return { anchors: [current], sections, pageKey: current.key };
}
