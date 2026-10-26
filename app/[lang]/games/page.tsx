import Link from "@/components/i18n/link";
import { GameCard } from "@/components/games/game-card";
import { chip } from "@/components/ui/styles";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { gameIsPlayable } from "@/lib/activities";
import { getI18n } from "@/lib/i18n/server";
import { staticPageMetadata } from "@/lib/seo-pages";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { itemListLd } from "@/lib/seo";
import { t } from "@/lib/i18n/core";

export const generateMetadata = () => staticPageMetadata("games", "/games");

export default async function GamesPage() {
  const { lang, d } = await getI18n();
  const games = listGames();
  const listed = games.filter((g) => !(g.slug in GAME_HREF_OVERRIDES) && gameIsPlayable(g.slug));
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6">
      <JsonLd ld={itemListLd(d.navGames, listed.map((g) => ({ name: t(g.title, lang), path: `/games/${g.slug}` })), lang)} />
      <Breadcrumbs items={[{ name: d.navGames }]} />
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
        {d.gamesTitle} <span aria-hidden>🎮</span>
      </h1>
      <p className="mt-2 text-lg text-ink-muted">{d.gamesSub}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/achievements" className={chip}>
          {d.achLink}
        </Link>
        <Link href="/games/word-map" className={chip}>
          {d.wordsChip}
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => (
          <GameCard key={g.slug} game={g} lang={lang} index={i} soon={!gameIsPlayable(g.slug)} />
        ))}
      </div>
    </main>
  );
}
