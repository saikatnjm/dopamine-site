import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoonCard, ExperienceCard } from "@/components/experience/experience-card";
import { chip } from "@/components/ui/styles";
import { upcoming } from "@/data/upcoming";
import { experiencesInCategory, getCategory, listCategories } from "@/lib/experience/registry";
import type { CategorySlug } from "@/lib/experience/types";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const live = experiencesInCategory(category.slug).length;
  const title = t(category.title, "en");
  return {
    title: `${title} Simulators`,
    description: `${t(category.description, "en")} Free one-minute ${title.toLowerCase()} simulators — no sign-up.`,
    alternates: { canonical: `/categories/${category.slug}` },
    // Categories with nothing playable yet are thin pages: keep them out of search.
    robots: live > 0 ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const [{ slug }, { lang, d }] = await Promise.all([params, getI18n()]);
  const category = getCategory(slug);
  if (!category) notFound();
  const experiences = experiencesInCategory(category.slug as CategorySlug);
  const soon = upcoming.filter((u) => u.category === category.slug);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6">
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
    </main>
  );
}
