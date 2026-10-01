import Link from "next/link";
import { ActivityCard } from "@/components/experience/activity-card";
import { chip } from "@/components/ui/styles";
import { guides, type GuideSlug } from "@/data/guides";
import { listActivities, type Activity } from "@/lib/activities";
import { getCategory } from "@/lib/experience/registry";
import { fmt, t } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";
import { getI18n } from "@/lib/i18n/server";
import { activityPagePlan, boredGuidesFor, relatedSections, type RelatedPlan, type RelatedSectionId } from "@/lib/related";

// Crawlable "keep playing" links under an activity or content page.
// Server-rendered (no client JS); logic lives in lib/related.ts.

function heading(id: RelatedSectionId, d: Dict, categoryTitle: string | null): string {
  switch (id) {
    case "games":
      return d.relGames;
    case "simulators":
      return d.relSims;
    case "category":
      return categoryTitle ? fmt(d.relCategory, { category: categoryTitle }) : d.relAlsoLike;
    case "alsoLike":
      return d.relAlsoLike;
  }
}

export async function RelatedLinks({
  current,
  sections,
  anchors: anchorKeys,
  exclude,
  pool,
  pageKey,
  bored = true,
}: {
  /** Activity key of this page ("g:cng-catch"); uses the standard plan. */
  current?: string;
  /** Override sections (pages without their own activity). */
  sections?: RelatedPlan["sections"];
  /** Override anchors (e.g. a guide's picks). */
  anchors?: readonly string[];
  exclude?: readonly string[];
  pool?: (a: Activity) => boolean;
  pageKey?: string;
  /** Show "More things to do when bored" (/bored + 2 fitting guides). */
  bored?: boolean;
}) {
  const { lang, d } = await getI18n();
  const all = listActivities(lang);
  const self = current ? all.find((a) => a.key === current) ?? null : null;
  const base = self ? activityPagePlan(self) : null;
  const anchors = anchorKeys ? all.filter((a) => anchorKeys.includes(a.key)) : (base?.anchors ?? []);
  const plan: RelatedPlan = {
    anchors,
    sections: sections ?? base?.sections ?? [{ id: "alsoLike", max: 3 }],
    exclude,
    pool,
    pageKey: pageKey ?? base?.pageKey ?? "page",
  };
  const found = relatedSections(all, plan);
  const categoryTitle = self ? (getCategory(self.category) ? t(getCategory(self.category)!.title, lang) : null) : null;
  const guideSlugs: GuideSlug[] = bored ? boredGuidesFor(self) : [];
  if (found.length === 0 && guideSlugs.length === 0) return null;

  return (
    <aside aria-label={d.relAria} className="mt-12 grid gap-8 border-t-2 border-dashed border-ink/30 pt-8">
      {found.map((s) => (
        <section key={s.id} aria-labelledby={`rel-${s.id}`}>
          <h2 id={`rel-${s.id}`} className="font-display text-2xl font-extrabold">
            {heading(s.id, d, categoryTitle)}
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {s.items.map((a, i) => (
              <li key={a.key}>
                <ActivityCard activity={a} lang={lang} index={i} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      {guideSlugs.length > 0 && (
        <nav aria-labelledby="rel-bored">
          <h2 id="rel-bored" className="font-display text-2xl font-extrabold">
            {d.relBored}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            <li>
              <Link href="/bored" className={chip}>
                {d.footerBored}
              </Link>
            </li>
            {guideSlugs.map((g) => (
              <li key={g}>
                <Link href={`/${g}`} className={chip}>
                  <span aria-hidden>{guides[g].emoji}</span> {t(guides[g].name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
