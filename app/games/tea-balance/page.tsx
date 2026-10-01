import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeaBalanceGame } from "@/components/games/tea-balance-game";
import { accentText } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { legacyChallenge } from "@/lib/challenge";
import { decodeScore, decodeSeed } from "@/lib/games/shared";
import { GAME_SLUG } from "@/lib/games/tea-balance";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

type Props = { searchParams: Promise<{ seed?: string | string[]; s?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const metadata: Metadata = game
  ? {
      title: game.seo.title,
      description: game.seo.description,
      alternates: { canonical: `/games/${GAME_SLUG}` },
      openGraph: { type: "website", url: `/games/${GAME_SLUG}`, title: game.seo.title, description: game.seo.description },
      twitter: { card: "summary_large_image", title: game.seo.title, description: game.seo.description },
    }
  : {};

export default async function TeaBalancePage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);

  // Shared link: ?seed=<base36>&s=<score> → same road + friend's score to beat.
  const seed = decodeSeed(params.seed);
  const score = decodeScore(params.s);
  const challenge = legacyChallenge(GAME_SLUG, seed, score);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: t(game.title, "en"),
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    genre: "Arcade",
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">{d.backGames}</Link>
      </nav>
      <header className="mb-6 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>
          🎮 {d.navGames} · ⏱️ {fmt(d.gameSeconds, { n: num(game.durationSec, lang) })}
        </p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">
          {game.emoji} {t(game.title, lang)}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(game.description, lang)}</p>
      </header>
      <TeaBalanceGame challenge={challenge} />
    </main>
  );
}
