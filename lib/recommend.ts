// "You might also like": pure scoring over the activity registry.
// Relatedness: same category +3, same mechanic +2, each shared tag +2, each
// shared mood +1. History: played in the last 5 −5, played earlier −2, ever
// finished (achievement stats) −1. A little jitter breaks ties so repeat
// visits vary. Unrelated activities (relatedness 0) are never suggested; if
// fewer than `count` qualify, returns [] so the caller hides the section.

import type { Activity } from "@/lib/activities";
import type { RecentPlay } from "@/lib/recent-plays";

export const ALSO_LIKE_COUNT = 3;

type Scorable = Pick<Activity, "key" | "category" | "mechanic" | "tags" | "moods">;

const overlap = <T,>(a: readonly T[], b: readonly T[]) => a.filter((x) => b.includes(x)).length;

export function relatedness(a: Scorable, b: Scorable): number {
  return (
    (a.category === b.category ? 3 : 0) +
    (a.mechanic === b.mechanic ? 2 : 0) +
    2 * overlap(a.tags, b.tags) +
    overlap(a.moods, b.moods)
  );
}

export function recommend<T extends Scorable>(
  currentKey: string,
  all: readonly T[],
  recent: readonly RecentPlay[],
  completed: ReadonlySet<string>,
  rand: () => number,
  count: number = ALSO_LIKE_COUNT,
): T[] {
  const current = all.find((a) => a.key === currentKey);
  if (!current) return [];
  const recentIndex = new Map(recent.map((r, i) => [r.key, i]));
  const scored = all
    .filter((a) => a.key !== currentKey)
    .map((a) => {
      const rel = relatedness(current, a);
      const idx = recentIndex.get(a.key);
      const history = idx === undefined ? (completed.has(a.key) ? 1 : 0) : idx < 5 ? 5 : 2;
      return { a, rel, score: rel - history + rand() * 0.75 };
    })
    .filter((s) => s.rel > 0)
    .sort((x, y) => y.score - x.score);
  return scored.length >= count ? scored.slice(0, count).map((s) => s.a) : [];
}
