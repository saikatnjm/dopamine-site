import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperiencePlayer } from "@/components/experience/experience-player";
import { accentText } from "@/components/ui/styles";
import { getCategory, getExperience, listExperiences } from "@/lib/experience/registry";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return {};
  const url = `/experiences/${experience.slug}`;
  return {
    title: experience.seo.title,
    description: experience.seo.description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: experience.seo.title, description: experience.seo.description },
    twitter: { card: "summary_large_image", title: experience.seo.title, description: experience.seo.description },
  };
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/experiences" className="hover:text-ink">{d.backAll}</Link>
      </nav>
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
      <ExperiencePlayer slug={experience.slug} />
    </main>
  );
}
