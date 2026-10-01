import { VIRAL_PICKS } from "@/data/viral";
import { listActivities, type Activity } from "@/lib/activities";
import type { Lang } from "@/lib/i18n/core";

const SLUG_RE = /^[a-z0-9-]{1,40}$/;

/** Curated keys that don't exist in the registry (checked at build/dev). */
export function unknownViralKeys(all: readonly Activity[]): string[] {
  const known = new Set(all.map((a) => a.key));
  return VIRAL_PICKS.filter((k) => !known.has(k));
}

if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
  const missing = unknownViralKeys(listActivities("en"));
  if (missing.length) throw new Error(`data/viral.ts references unknown activities: ${missing.join(", ")}`);
}

/**
 * `?play=<slug>` from a social post → that activity (any registered game,
 * simulator, quiz or tool), else null. Garbage is ignored.
 */
export function deepLinked(all: readonly Activity[], play: unknown): Activity | null {
  if (typeof play !== "string") return null;
  const slug = play.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) return null;
  return all.find((a) => a.key === `g:${slug}` || a.key === `x:${slug}` || a.key === `p:${slug}`) ?? null;
}

export type ViralView = { featured: Activity; rest: Activity[]; deepLink: boolean };

export function viralView(lang: Lang, play: unknown): ViralView | null {
  const all = listActivities(lang);
  const byKey = new Map(all.map((a) => [a.key, a]));
  const curated = VIRAL_PICKS.flatMap((k) => byKey.get(k) ?? []);
  const linked = deepLinked(all, play);
  const featured = linked ?? curated[0];
  if (!featured) return null;
  return { featured, rest: curated.filter((a) => a.key !== featured.key), deepLink: linked !== null };
}
