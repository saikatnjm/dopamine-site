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
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { activityLd } from "@/lib/seo";
import { gameMetadata } from "@/lib/seo-pages";
import { HowToPlay } from "@/components/seo/how-to";

type Props = { searchParams: Promise<{ v?: string | string[] }> };

const game = getGame(GAME_SLUG);

export const generateMetadata = () => gameMetadata(GAME_SLUG);

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
      <JsonLd ld={activityLd(`/games/${GAME_SLUG}`, jsonLd, lang)} />
      <Breadcrumbs items={[{ name: d.navGames, path: "/games" }, { name: t(game.title, lang) }]} />
      <header className="mb-4 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>🎮 {d.navGames}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">{t(copy.question, lang)}</h1>
      </header>
      <MyBangladeshGame friend={friend} />
      <HowToPlay activity={`g:${GAME_SLUG}`} name={t(game.title, lang)} />
      <RelatedLinks current={`g:${GAME_SLUG}`} />
    </main>
  );
}
