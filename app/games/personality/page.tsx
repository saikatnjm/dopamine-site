import Link from "next/link";
import { notFound } from "next/navigation";
import { PersonalityGame, type SharedPersonality } from "@/components/games/personality-game";
import { RelatedLinks } from "@/components/related/related-links";
import { accentText, chip } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { gameIsPlayable } from "@/lib/activities";
import { decodeAnswers, GAME_SLUG, isResultId, resultFor } from "@/lib/games/personality";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { activityLd } from "@/lib/seo";
import { gameMetadata } from "@/lib/seo-pages";

type Props = { searchParams: Promise<{ a?: string | string[]; r?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const metadata = gameMetadata(GAME_SLUG);

export default async function PersonalityPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);

  // Shared link: ?a=<8 answer letters>&r=<result id>. The stored result id wins
  // (later tuning never changes a shared result); invalid links are ignored.
  const answers = decodeAnswers(params.a);
  const r = Array.isArray(params.r) ? params.r[0] : params.r;
  const friend: SharedPersonality | null = answers ? { answers, result: isResultId(r) ? r : resultFor(answers) } : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "তুমি কোন টাইপের বাঙালি? — What Type of Bangali Are You?",
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    about: "A just-for-fun personality quiz about everyday Bangali habits",
    isAccessibleForFree: true,
    inLanguage: ["bn", "en"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd(`/games/${GAME_SLUG}`, jsonLd)} />
      <Breadcrumbs items={[{ name: d.navGames, path: "/games" }, { name: t(game.title, lang) }]} />
      <header className="mb-6 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>
          🎮 {d.navGames} · ⏱️ {fmt(d.gameSeconds, { n: num(game.durationSec, lang) })}
        </p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">
          {game.emoji} {t(game.title, lang)}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(game.description, lang)}</p>
      </header>
      <PersonalityGame friend={friend} />
      {gameIsPlayable("ancholik-quiz") && (
        <nav className="mt-8 flex flex-wrap gap-3">
          <Link href="/games/ancholik-quiz" className={chip}>
            🗣️ {d.footerDialect}
          </Link>
        </nav>
      )}
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
