import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/experience/activity-card";
import { accentBg, btnPrimary, card, chip } from "@/components/ui/styles";
import type { Activity } from "@/lib/activities";
import { getGuide, guides, type GuideSlug } from "@/lib/guides";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl, siteConfig } from "@/lib/site";

// One template for every SEO guide page (content in data/guides.ts).
// Server-rendered, no client JS beyond the site shell.

export function guideMetadata(slug: GuideSlug): Metadata {
  const { title, description } = guides[slug].seo;
  const url = `/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

function duration(a: Activity, d: Dict, lang: Lang): string | null {
  if (a.durationSec === undefined) return null;
  return a.durationSec >= 90
    ? fmt(d.minutes, { n: num(Math.round(a.durationSec / 60), lang) })
    : fmt(d.gameSeconds, { n: num(a.durationSec, lang) });
}

export async function GuidePage({ slug }: { slug: GuideSlug }) {
  const { lang, d } = await getI18n();
  const { guide, picks, related } = getGuide(slug, lang);
  const h1 = t(guide.h1, lang);
  const name = t(guide.name, lang);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: guide.seo.title,
      description: guide.seo.description,
      url: absoluteUrl(`/${slug}`),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: picks.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.activity.title, url: absoluteUrl(p.activity.href) })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name, item: absoluteUrl(`/${slug}`) },
      ],
    },
    ...(guide.faq?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faq.map((f) => ({ "@type": "Question", name: t(f.q, lang), acceptedAnswer: { "@type": "Answer", text: t(f.a, lang) } })),
          },
        ]
      : []),
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              {siteConfig.name}
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-bold text-ink">
            {name}
          </li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {h1} <span aria-hidden>{guide.emoji}</span>
        </h1>
        {guide.intro.map((p, i) => (
          <p key={i} className={`mt-3 text-lg ${i === 0 ? "" : "text-ink-muted"}`}>
            {t(p, lang)}
          </p>
        ))}
      </header>

      <section aria-labelledby="guide-picks" className="mt-10">
        <h2 id="guide-picks" className="font-display text-3xl font-extrabold">
          {d.guidePicks}
        </h2>
        <ol className="mt-5 grid gap-5">
          {picks.map(({ activity: a, why }, i) => {
            const time = duration(a, d, lang);
            return (
              <li key={a.key} className={`${card} overflow-hidden`}>
                <article aria-labelledby={`pick-${a.key}`} className="flex flex-col sm:flex-row">
                  <div className={`${accentBg[a.accent]} flex items-center gap-3 border-b-2 border-ink px-5 py-4 sm:w-40 sm:flex-col sm:justify-center sm:border-b-0 sm:border-r-2`}>
                    <span className="font-display text-2xl font-black tabular-nums">{num(i + 1, lang)}.</span>
                    <span aria-hidden className="text-5xl leading-none">
                      {a.emoji}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                      {a.kindLabel}
                      {time ? ` · ⏱️ ${time}` : ""}
                    </p>
                    <h3 id={`pick-${a.key}`} className="font-display text-2xl font-extrabold leading-tight">
                      {a.title}
                    </h3>
                    <p className="font-bold italic">{a.tagline}</p>
                    <p className="text-ink-muted">{why}</p>
                    <Link href={a.href} className={`${btnPrimary} ${accentBg[a.accent]} mt-2 w-full sm:w-fit`} aria-label={`${d.guidePlay} — ${a.title}`}>
                      {d.guidePlay}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="guide-related" className="mt-12">
          <h2 id="guide-related" className="font-display text-2xl font-extrabold sm:text-3xl">
            {d.guideMore}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {related.map((a, i) => (
              <li key={a.key}>
                <ActivityCard activity={a} lang={lang} index={i} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-labelledby="guide-other" className="mt-12">
        <h2 id="guide-other" className="font-display text-2xl font-extrabold sm:text-3xl">
          {d.guideOther}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {guide.guides.map((s) => (
            <li key={s}>
              <Link href={`/${s}`} className={chip}>
                <span aria-hidden>{guides[s].emoji}</span> {t(guides[s].name, lang)}
              </Link>
            </li>
          ))}
          {(guide.links ?? []).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={chip}>
                {t(l.label, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {guide.faq && guide.faq.length > 0 && (
        <section aria-labelledby="guide-faq" className="mt-12">
          <h2 id="guide-faq" className="font-display text-2xl font-extrabold sm:text-3xl">
            {d.guideFaq}
          </h2>
          <div className="mt-4 grid gap-3">
            {guide.faq.map((f, i) => (
              <div key={i} className={`${card} p-5`}>
                <h3 className="font-display text-xl font-extrabold">{t(f.q, lang)}</h3>
                <p className="mt-1 text-ink-muted">{t(f.a, lang)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
