import type { Metadata } from "next";
import Link from "next/link";
import { GameCard } from "@/components/games/game-card";
import { chip } from "@/components/ui/styles";
import { listGames } from "@/data/games";
import { gameIsPlayable } from "@/lib/activities";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Games — Free 30-Second Reflex Games",
  description: "Quick, funny reflex games about everyday Dhaka chaos. About 30 seconds each, free, no sign-up.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage() {
  const { lang, d } = await getI18n();
  const games = listGames();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6">
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
        {d.gamesTitle} <span aria-hidden>🎮</span>
      </h1>
      <p className="mt-2 text-lg text-ink-muted">{d.gamesSub}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/achievements" className={chip}>
          {d.achLink}
        </Link>
        <Link href="/games/words" className={chip}>
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
