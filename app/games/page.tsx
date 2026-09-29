import type { Metadata } from "next";
import { GameCard } from "@/components/games/game-card";
import { listGames } from "@/data/games";
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
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => (
          <GameCard key={g.slug} game={g} lang={lang} index={i} />
        ))}
      </div>
    </main>
  );
}
