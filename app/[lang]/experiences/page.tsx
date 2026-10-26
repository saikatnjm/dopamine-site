import { ComingSoonCard, ExperienceCard } from "@/components/experience/experience-card";
import { upcoming } from "@/data/upcoming";
import { listExperiences } from "@/lib/experience/registry";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { staticPageMetadata } from "@/lib/seo-pages";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { itemListLd } from "@/lib/seo";

export const generateMetadata = () => staticPageMetadata("experiences", "/experiences");

export default async function ExperiencesPage() {
  const { lang, d } = await getI18n();
  const experiences = listExperiences();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6">
      <JsonLd ld={itemListLd(d.navExperiences, experiences.map((e) => ({ name: t(e.title, lang), path: `/experiences/${e.slug}` })), lang)} />
      <Breadcrumbs items={[{ name: d.navExperiences }]} />
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
        {d.allTitle} <span aria-hidden>🕹️</span>
      </h1>
      <p className="mt-2 text-lg text-ink-muted">
        {upcoming.length > 0
          ? fmt(d.allSub, { live: num(experiences.length, lang), soon: num(upcoming.length, lang) })
          : fmt(d.allSubLive, { live: num(experiences.length, lang) })}
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((e, i) => (
          <ExperienceCard key={e.slug} experience={e} lang={lang} index={i} />
        ))}
      </div>
      {upcoming.length > 0 && (
        <>
          <h2 className="mt-14 font-display text-2xl font-extrabold">
            {d.comingSoon} <span aria-hidden>🍳</span>
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {upcoming.map((item) => (
              <ComingSoonCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
