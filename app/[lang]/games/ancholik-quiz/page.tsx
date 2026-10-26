import Link from "@/components/i18n/link";
import { notFound } from "next/navigation";
import { AncholikQuizGame } from "@/components/games/ancholik-quiz-game";
import { RelatedLinks } from "@/components/related/related-links";
import { accentText, chip } from "@/components/ui/styles";
import { quizCopy } from "@/data/games/ancholik-quiz";
import { getGame } from "@/data/games";
import { listRegions, quizPool } from "@/lib/dialects/content";
import { GAME_SLUG, parseQuizParams } from "@/lib/games/ancholik-quiz";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { activityLd } from "@/lib/seo";
import { gameMetadata } from "@/lib/seo-pages";
import { HowToPlay } from "@/components/seo/how-to";

type Props = { searchParams: Promise<{ district?: string | string[]; level?: string | string[]; seed?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const generateMetadata = () => gameMetadata(GAME_SLUG);

export default async function AncholikQuizPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);

  // ?district=jashore&level=easy&seed=<base36> — validated, never trusted.
  const initial = parseQuizParams(params);
  const districts = listRegions().map(({ id, name, emoji }) => ({ id, name, emoji }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "আঞ্চলিক ভাষার লড়াই — Bangladesh Regional Dialect Quiz",
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    about: "Regional dialects of Bangladesh (আঞ্চলিক ভাষা)",
    educationalLevel: "Beginner to advanced",
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
          {game.emoji} {t(quizCopy.title, "bn")}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(quizCopy.subtitle, lang)}</p>
      </header>
      <AncholikQuizGame pool={quizPool()} districts={districts} initial={initial} challenge={null} />
      <nav className="mt-8 flex flex-wrap gap-3">
        <Link href="/games/word-map" className={chip}>
          {d.wordsChip}
        </Link>
        <Link href="/games/personality" className={chip}>
          🎭 {d.footerPersonality}
        </Link>
      </nav>
      <HowToPlay activity={`g:${GAME_SLUG}`} name={t(game.title, lang)} />
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
