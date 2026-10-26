import { notFound } from "next/navigation";
import { DontTapGame } from "@/components/games/dont-tap-game";
import { accentText } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { legacyChallenge } from "@/lib/challenge";
import { decodeScore, decodeSeed } from "@/lib/games/shared";
import { GAME_SLUG } from "@/lib/games/dont-tap";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { RelatedLinks } from "@/components/related/related-links";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { activityLd } from "@/lib/seo";
import { gameMetadata } from "@/lib/seo-pages";

type Props = { searchParams: Promise<{ seed?: string | string[]; s?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const generateMetadata = () => gameMetadata(GAME_SLUG);

export default async function DontTapPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);

  // Shared link: ?seed=<base36>&s=<score> → same signals + friend's score to beat.
  const seed = decodeSeed(params.seed);
  const score = decodeScore(params.s);
  const challenge = legacyChallenge(GAME_SLUG, seed, score);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: t(game.title, "en"),
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    genre: "Reaction",
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd(`/games/${GAME_SLUG}`, jsonLd, lang)} />
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
      <DontTapGame challenge={challenge} />
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
