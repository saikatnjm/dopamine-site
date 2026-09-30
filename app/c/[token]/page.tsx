import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { accentText } from "@/components/ui/styles";
import { getGame } from "@/data/games";
import { decodeChallenge, type ChallengeGame, type FriendChallenge } from "@/lib/challenge";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";

// /c/<token> — a friend's challenge. The token (see lib/challenge.ts) holds the
// game, seed and score; this page renders that game on that exact seed.
// Each game is code-split so a challenge link only loads its own game.

type Props = { params: Promise<{ token: string }> };
type GameProps = { challenge: FriendChallenge | null };

const GAMES: Record<ChallengeGame, ComponentType<GameProps>> = {
  "cng-catch": dynamic(() => import("@/components/games/cng-catch-game").then((m) => m.CngCatchGame)),
  "traffic-dodge": dynamic(() => import("@/components/games/traffic-dodge-game").then((m) => m.TrafficDodgeGame)),
  "bazar-bargain": dynamic(() => import("@/components/games/bazar-bargain-game").then((m) => m.BazarBargainGame)),
  "tea-balance": dynamic(() => import("@/components/games/tea-balance-game").then((m) => m.TeaBalanceGame)),
  "dont-tap": dynamic(() => import("@/components/games/dont-tap-game").then((m) => m.DontTapGame)),
  "chaos-machine": dynamic(() => import("@/components/games/chaos-machine-game").then((m) => m.ChaosMachineGame)),
  "delivery-sim": dynamic(() => import("@/components/games/delivery-sim-game").then((m) => m.DeliverySimGame)),
  "chicken-crossing": dynamic(() => import("@/components/games/chicken-crossing-game").then((m) => m.ChickenCrossingGame)),
  "traffic-controller": dynamic(() => import("@/components/games/traffic-controller-game").then((m) => m.TrafficControllerGame)),
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const challenge = decodeChallenge(token);
  const game = challenge && getGame(challenge.game);
  if (!challenge || !game) return { title: "Challenge link broken", robots: { index: false } };
  const title = `Beat ${challenge.score.toLocaleString("en-US")} pts in ${t(game.title, "en")} ${game.emoji}`;
  const description = "Your friend challenged you — same round, same timing. Can you beat their score? Free, no sign-up.";
  // Personal links: keep them out of search, but give chat apps a rich preview.
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: { type: "website", url: `/c/${token}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ChallengePage({ params }: Props) {
  const [{ token }, { lang, d }] = await Promise.all([params, getI18n()]);
  const challenge = decodeChallenge(token);
  const game = challenge && getGame(challenge.game);
  if (!challenge || !game) notFound();
  const Game = GAMES[challenge.game];

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">
          {d.backGames}
        </Link>
      </nav>
      <header className="mb-6 mt-4">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentText[game.accent]}`}>
          {d.chBadge} · 🎮 {d.navGames} · ⏱️ {fmt(d.gameSeconds, { n: num(game.durationSec, lang) })}
        </p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight">
          {game.emoji} {t(game.title, lang)}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(game.tagline, lang)}</p>
      </header>
      <Game challenge={{ seed: challenge.seed, score: challenge.score }} />
    </main>
  );
}
