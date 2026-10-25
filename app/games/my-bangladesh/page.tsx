import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MyBangladeshGame } from "@/components/games/my-bangladesh-game";
import { RelatedLinks } from "@/components/related/related-links";
import { accentText } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { myBdCopy as copy } from "@/data/games/my-bangladesh";
import { decodeVisited, GAME_SLUG } from "@/lib/games/my-bangladesh";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

type Props = { searchParams: Promise<{ v?: string | string[] }> };

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

export default async function MyBangladeshPage({ searchParams }: Props) {
  if (!game) notFound();
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);

  // Friend link: ?v=<base36 mask> — validated, never trusted; a bad or empty code
  // just shows the normal page. It is never written to the visitor's own map.
  const decoded = decodeVisited(params.v);
  const friend = decoded && decoded.length > 0 ? decoded : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "আমার বাংলাদেশ — My Bangladesh Map",
    description: t(game.description, "en"),
    url: absoluteUrl(`/games/${GAME_SLUG}`),
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
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
      <header className="mb-4 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>🎮 {d.navGames}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">{t(copy.question, lang)}</h1>
      </header>
      <MyBangladeshGame friend={friend} />
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
