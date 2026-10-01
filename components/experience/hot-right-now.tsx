import { ActivityCard } from "@/components/experience/activity-card";
import { HOT_MAX, HOT_MIN, HOT_RIGHT_NOW, type HotLabel } from "@/data/hot";
import type { Activity } from "@/lib/activities";
import type { Lang } from "@/lib/i18n/core";
import { getDictionary, type Dict } from "@/lib/i18n/dictionary";

const LABEL: Record<HotLabel, { text: (d: Dict) => string; bg: string }> = {
  hot: { text: (d) => d.hotLabelHot, bg: "bg-chili" },
  try: { text: (d) => d.hotLabelTry, bg: "bg-marigold" },
  quick: { text: (d) => d.hotLabelQuick, bg: "bg-lime" },
  friend: { text: (d) => d.hotLabelFriend, bg: "bg-sky" },
};

/** Curated keys that don't resolve to a registered activity (checked at build time). */
export function unknownHotKeys(all: readonly Activity[]): string[] {
  const known = new Set(all.map((a) => a.key));
  return HOT_RIGHT_NOW.map((h) => h.key).filter((k) => !known.has(k));
}

/** "🔥 HOT RIGHT NOW" — hand-picked activities from data/hot.ts (server-rendered, no JS). */
export function HotRightNow({ activities, lang }: { activities: readonly Activity[]; lang: Lang }) {
  const d = getDictionary(lang);
  const byKey = new Map(activities.map((a) => [a.key, a]));
  const picks = HOT_RIGHT_NOW.flatMap((h) => {
    const a = byKey.get(h.key);
    return a ? [{ a, label: h.label }] : [];
  }).slice(0, HOT_MAX);
  if (picks.length < HOT_MIN) return null;

  return (
    <section aria-labelledby="hot-title">
      <h2 id="hot-title" className="font-display text-3xl font-extrabold sm:text-4xl">
        {d.hotTitle}
      </h2>
      <p className="mt-1 text-ink-muted">{d.hotSub}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {picks.map(({ a, label }, i) => (
          <li key={a.key} className="relative pt-3">
            <span
              className={`${LABEL[label].bg} absolute -top-0.5 left-2 z-10 -rotate-3 rounded-pill border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold shadow-pop`}
            >
              {LABEL[label].text(d)}
            </span>
            <ActivityCard activity={a} lang={lang} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
