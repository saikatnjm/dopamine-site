import { notFound } from "next/navigation";
import { ExperiencePlayerBySlug } from "@/components/experience/experience-players";
import { accentText } from "@/components/ui/styles";
import { getCategory, getExperience, listExperiences } from "@/lib/experience/registry";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { RelatedLinks } from "@/components/related/related-links";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { activityLd } from "@/lib/seo";
import { experienceMetadata } from "@/lib/seo-pages";
import { HowToPlay } from "@/components/seo/how-to";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  return experienceMetadata((await params).slug);
}

export default async function ExperiencePage({ params }: Props) {
  const [{ slug }, { lang, d }] = await Promise.all([params, getI18n()]);
  const experience = getExperience(slug);
  if (!experience) notFound();
  const category = getCategory(experience.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: t(experience.title, "en"),
    description: t(experience.description, "en"),
    url: absoluteUrl(`/experiences/${experience.slug}`),
    genre: category && t(category.title, "en"),
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd(`/experiences/${experience.slug}`, jsonLd, lang)} />
      <Breadcrumbs items={[{ name: d.navExperiences, path: "/experiences" }, { name: t(experience.title, lang) }]} />
      <header className="mb-6 mt-4">
        {category && (
          <p className={`text-sm font-bold uppercase tracking-wide ${accentText[experience.accent]}`}>
            {category.emoji} {t(category.title, lang)}
          </p>
        )}
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">
          {t(experience.title, lang)}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(experience.description, lang)}</p>
      </header>
      <ExperiencePlayerBySlug slug={experience.slug} />
      <HowToPlay activity={`x:${experience.slug}`} name={t(experience.title, lang)} />
      <RelatedLinks current={`x:${experience.slug}`} />
    </main>
  );
}
