import Link from "@/components/i18n/link";
import { notFound } from "next/navigation";
import { WhichRegionGame } from "@/components/games/which-region-game";
import { RelatedLinks } from "@/components/related/related-links";
import { accentBg, accentText, btnPrimary, card } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { detectiveCopy as copy } from "@/data/games/which-region";
import { conceptLite, listConcepts, listRegions, publicForms, regionLite } from "@/lib/dialects/content";
import { eligibleConcepts, GAME_SLUG, MIN_QUESTIONS, parseSharedRegion } from "@/lib/games/which-region";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { activityLd } from "@/lib/seo";
import { gameMetadata } from "@/lib/seo-pages";

type Props = { searchParams: Promise<{ r?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const generateMetadata = () => gameMetadata(GAME_SLUG);

export default async function WhichRegionPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);
  const regions = listRegions();
  const regionIds = regions.map((r) => r.id);
  const forms = publicForms().map(({ id, conceptId, form, regions: rs }) => ({ id, conceptId, form, regions: rs }));
  const eligible = eligibleConcepts(
    listConcepts().map((c) => c.id),
    forms,
    regionIds,
  );
  const usedForms = forms.filter((f) => eligible.includes(f.conceptId));
  // Shared link: ?r=<region> or ?r=mystery — validated; it's only the friend's guess.
  const raw = Array.isArray(params.r) ? params.r[0] : params.r;
  const friend = raw === "mystery" ? "mystery" : parseSharedRegion(raw, regionIds);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "তুমি কোন এলাকার মানুষ? — Which Region of Bangladesh Are You From?",
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    about: "Regional dialects of Bangladesh",
    isAccessibleForFree: true,
    inLanguage: ["bn", "en"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd(`/games/${GAME_SLUG}`, jsonLd, lang)} />
      <Breadcrumbs items={[{ name: d.navGames, path: "/games" }, { name: t(game.title, lang) }]} />
      <header className="mb-6 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>
          🎮 {d.navGames} · ⏱️ {fmt(d.gameSeconds, { n: num(game.durationSec, lang) })}
        </p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight" lang="bn">
          {game.emoji} {t(copy.title, "bn")}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>
      {eligible.length >= MIN_QUESTIONS ? (
        <WhichRegionGame
          eligible={eligible}
          forms={usedForms}
          concepts={listConcepts().filter((c) => eligible.includes(c.id)).map(conceptLite)}
          regions={regions.map(regionLite)}
          friend={friend}
        />
      ) : (
        <div className={`${card} grid gap-4 p-6 text-center`} role="status">
          <p aria-hidden className="text-6xl">
            🛠️
          </p>
          <h2 className="font-display text-3xl font-black" lang="bn">
            {t(copy.buildingTitle, lang)}
          </h2>
          <p className="font-bold text-ink-muted">{t(copy.buildingBody, lang)}</p>
          <Link href="/games/word-map" className={`${btnPrimary} ${accentBg.sky}`}>
            {t(copy.mapLink, lang)}
          </Link>
        </div>
      )}
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
