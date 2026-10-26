import Link from "@/components/i18n/link";
import { notFound } from "next/navigation";
import { DialectMap } from "@/components/dialects/dialect-map";
import { accentBg, btnPrimary, card, chip } from "@/components/ui/styles";
import { DISTRICTS } from "@/data/dialects/districts";
import { mapCopy as copy } from "@/data/games/word-map";
import { formsForRegion, getRegion, listConcepts, listRegions } from "@/lib/dialects/content";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { regionMetadata } from "@/lib/seo-pages";
import { localePath } from "@/lib/i18n/paths";

// One dialect region: every sourced word, grouped by concept, with sources.
// Server-rendered (no JS). Indexed only once it has enough words to be useful.

type Props = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Props) {
  return regionMetadata((await params).region);
}

export default async function RegionPage({ params }: Props) {
  const [{ region: id }, { lang }] = await Promise.all([params, getI18n()]);
  const region = getRegion(id);
  if (!region) notFound();
  const forms = formsForRegion(region.id);
  const name = t(region.name, lang);
  const districts = region.districts.map((d) => DISTRICTS.find((x) => x.id === d)).filter((d) => d !== undefined);
  const groups = listConcepts()
    .map((c) => ({ c, fs: forms.filter((f) => f.conceptId === c.id) }))
    .filter((g) => g.fs.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${t(region.name, "bn")}-এর আঞ্চলিক শব্দ`,
    url: absoluteUrl(localePath(`/games/word-map/${region.id}`, lang)),
    inLanguage: "bn",
    hasDefinedTerm: groups.slice(0, 50).flatMap((g) => g.fs.map((f) => ({ "@type": "DefinedTerm", name: f.form, description: g.c.standard }))),
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={jsonLd} />
      <Breadcrumbs items={[{ name: t(copy.title, lang), path: "/games/word-map" }, { name }]} />
      <header className="mb-4 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
          {region.emoji} {fmt(t(copy.regionTitle, lang), { region: name })}
        </h1>
        <p className="mt-2 text-lg font-bold" lang="bn">
          {t(region.blurb, lang)}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {t(copy.regionDistricts, lang)}: {districts.map((d) => t(d.name, lang)).join(", ")}
        </p>
      </header>

      <DialectMap regions={listRegions()} highlight={[region.id]} labels={[{ region: region.id, text: name, strong: true }]} title={name} className="mx-auto max-w-xs" />

      <p className="mt-4 inline-block -rotate-1 rounded-pill border-2 border-ink bg-lime px-3 py-0.5 text-sm font-extrabold">
        {fmt(t(copy.regionCount, lang), { n: num(forms.length, lang) })}
      </p>

      {groups.length === 0 ? (
        <p className={`${card} mt-4 p-4 font-bold`}>{t(copy.regionEmpty, lang)}</p>
      ) : (
        <dl className={`${card} mt-4 divide-y-2 divide-dashed divide-ink/20 p-4`}>
          {groups.map(({ c, fs }) => (
            <div key={c.id} className="grid grid-cols-[1fr_auto] items-start gap-x-3 gap-y-1 py-3">
              <dt className="font-bold">
                <span aria-hidden>{c.emoji}</span> <span lang="bn">{c.standard}</span>
                {lang === "en" && <span className="block text-xs text-ink-muted">{c.en}</span>}
              </dt>
              <dd className="text-right">
                {fs.map((f) => (
                  <span key={f.id} className="block">
                    <span lang="bn" className="font-display text-xl font-black">
                      {f.form}
                    </span>
                    {f.area && <span className="block text-xs text-ink-muted">{f.area}</span>}
                  </span>
                ))}
                <Link href={`/games/word-map?c=${c.id}`} className="text-xs font-extrabold underline">
                  {t(copy.seeOnMap, lang)}
                </Link>
              </dd>
              {fs.some((f) => f.example) && (
                <dd className="col-span-2 text-sm font-semibold" lang="bn">
                  {fs.filter((f) => f.example).map((f) => `“${f.example}”`).join(" · ")}
                </dd>
              )}
              <dd className="col-span-2 text-xs text-ink-muted">
                {t(copy.source, lang)}:{" "}
                {[...new Map(fs.flatMap((f) => f.sources).map((s) => [s.title, s])).values()].map((s, i) => (
                  <span key={s.title}>
                    {i > 0 && " · "}
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-3 text-xs font-bold text-ink-muted">
        {t(copy.sourced, lang)} · {t(copy.borders, lang)}
      </p>
      <Link href="/games/which-region" className={`${btnPrimary} ${accentBg.violet} mt-6 w-full`}>
        {t(copy.detectiveCta, lang)}
      </Link>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label={t(copy.regionsHeading, lang)}>
        {listRegions()
          .filter((r) => r.id !== region.id && formsForRegion(r.id).length > 0)
          .map((r) => (
            <Link key={r.id} href={`/games/word-map/${r.id}`} className={chip}>
              {r.emoji} {t(r.name, lang)}
            </Link>
          ))}
      </nav>
    </main>
  );
}
