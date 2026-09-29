import Link from "next/link";
import { accentBg, card, cardHover } from "@/components/ui/styles";
import type { Game } from "@/data/games";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { getDictionary } from "@/lib/i18n/dictionary";

const tilts = ["rotate-1", "-rotate-1", "rotate-0"] as const;

export function GameCard({ game, lang, index = 0 }: { game: Game; lang: Lang; index?: number }) {
  const d = getDictionary(lang);
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`${card} ${cardHover} ${tilts[index % tilts.length]} group flex flex-col overflow-hidden hover:rotate-0`}
    >
      <div className={`${accentBg[game.accent]} relative flex h-32 items-center justify-center border-b-2 border-ink`}>
        <span aria-hidden className="text-7xl drop-shadow-[3px_3px_0_rgb(26_19_37)] group-hover:animate-wiggle">
          {game.emoji}
        </span>
        <span className="absolute right-3 top-3 rotate-3 rounded-pill border-2 border-ink bg-surface px-2.5 py-0.5 text-xs font-extrabold">
          ⏱️ {fmt(d.gameSeconds, { n: num(game.durationSec, lang) })}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">🎮 {d.navGames}</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight">{t(game.title, lang)}</h3>
        <p className="mt-1 text-ink-muted">{t(game.tagline, lang)}</p>
        <span className="mt-4 inline-flex w-fit items-center rounded-pill border-2 border-ink bg-ink px-4 py-1.5 font-bold text-bg">
          {d.cardPlay}
        </span>
      </div>
    </Link>
  );
}
