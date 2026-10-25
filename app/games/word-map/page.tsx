import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WordMapExplorer } from "@/components/dialects/word-map-explorer";
import { RelatedLinks } from "@/components/related/related-links";
import { accentText, chip } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { mapCopy as copy } from "@/data/games/word-map";
import { conceptLite, conceptsByCoverage, formsForRegion, listRegions, publicForms, regionLite } from "@/lib/dialects/content";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

const SLUG = "word-map";
const game = getGame(SLUG);

type Props = { searchParams: Promise<{ c?: string | string[] }> };

export const metadata: Metadata = game
  ? {
      title: game.seo.title,
      description: game.seo.description,
      alternates: { canonical: `/games/${SLUG}` },
      openGraph: { type: "website", url: `/games/${SLUG}`, title: game.seo.title, description: game.seo.description },
      twitter: { card: "summary_large_image", title: game.seo.title, description: game.seo.description },
    }
  : {};

export default async function WordMapPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);
  const concepts = conceptsByCoverage(1).map(conceptLite);
  const regions = listRegions();
  if (concepts.length === 0) notFound();

  // ?c=<concept id> opens that word; anything else falls back to the cat (or the best-covered word).
  const raw = Array.isArray(params.c) ? params.c[0] : params.c;
  const initial = concepts.find((c) => c.id === raw)?.id ?? concepts.find((c) => c.id === "cat")?.id ?? concepts[0]!.id;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "শব্দের মানচিত্র — Bangladesh Dialect Word Map",
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${SLUG}`),
    inLanguage: ["bn", "en"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">
          {d.backGames}
        </Link>
      </nav>
      <header className="mb-5 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>🗺️ {d.navGames}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight" lang="bn">
          {game.emoji} {t(copy.title, "bn")}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>
      <WordMapExplorer concepts={concepts} regions={regions.map(regionLite)} forms={publicForms()} initialConcept={initial} />

      {/* Crawlable links to every region page. */}
      <nav aria-label={t(copy.regionsHeading, lang)} className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {regions
            .filter((r) => formsForRegion(r.id).length > 0)
            .map((r) => (
              <li key={r.id}>
                <Link href={`/games/${SLUG}/${r.id}`} className={chip}>
                  {r.emoji} {t(r.name, lang)}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      <RelatedLinks current={`g:${SLUG}`} />
    </main>
  );
}
