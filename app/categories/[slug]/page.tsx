import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoonCard, ExperienceCard } from "@/components/experience/experience-card";
import { chip } from "@/components/ui/styles";
import { upcoming } from "@/data/upcoming";
import { experiencesInCategory, getCategory, listCategories } from "@/lib/experience/registry";
import type { CategorySlug } from "@/lib/experience/types";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { RelatedLinks } from "@/components/related/related-links";
import { categoryMetadata } from "@/lib/seo-pages";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { itemListLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata((await params).slug);
}

export default async function CategoryPage({ params }: Props) {
  const [{ slug }, { lang, d }] = await Promise.all([params, getI18n()]);
  const category = getCategory(slug);
  if (!category) notFound();
  const experiences = experiencesInCategory(category.slug as CategorySlug);
  const soon = upcoming.filter((u) => u.category === category.slug);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6">
      {experiences.length > 0 && (
        <JsonLd ld={itemListLd(`${t(category.title, "en")} simulators`, experiences.map((e) => ({ name: t(e.title, "en"), path: `/experiences/${e.slug}` })))} />
      )}
      <Breadcrumbs items={[{ name: d.navExperiences, path: "/experiences" }, { name: t(category.title, lang) }]} />
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
        <span aria-hidden>{category.emoji}</span> {t(category.title, lang)}
      </h1>
      <p className="mt-2 text-lg text-ink-muted">{t(category.description, lang)}</p>

      {experiences.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((e, i) => (
            <ExperienceCard key={e.slug} experience={e} lang={lang} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-card border-2 border-dashed border-ink/60 bg-surface/60 p-6 text-lg">
          {d.categoryEmpty} <span aria-hidden>⏳</span>
        </p>
      )}

      {soon.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl font-extrabold">{d.comingSoon}</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {soon.map((item) => (
              <ComingSoonCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-12 font-display text-xl font-extrabold">{d.otherCategories}</h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {listCategories()
          .filter((c) => c.slug !== category.slug)
          .map((c) => (
            <li key={c.slug}>
              <Link href={`/categories/${c.slug}`} className={chip}>
                <span aria-hidden>{c.emoji}</span> {t(c.title, lang)}
              </Link>
            </li>
          ))}
      </ul>
      <RelatedLinks pageKey={`category:${category.slug}`} sections={[{ id: "games", max: 4 }]} pool={(a) => a.kind === "game" && a.category === category.slug} bored={false} />
    </main>
  );
}
