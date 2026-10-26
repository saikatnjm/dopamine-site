import { getGame } from "@/data/games";
import { decodeChallenge } from "@/lib/challenge";
import { t } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "A friend's challenge";

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const challenge = decodeChallenge(token);
  const game = challenge && getGame(challenge.game);

  if (!challenge || !game) {
    return renderOgCard({
      eyebrow: siteConfig.name,
      emoji: "🤷",
      title: "Challenge link broken",
      subtitle: siteConfig.tagline,
      cta: "Play a game",
      accent: "violet",
    });
  }

  return renderOgCard({
    eyebrow: `${game.emoji} ${t(game.title, "en")}`,
    emoji: "😏",
    title: `${challenge.score.toLocaleString("en-US")} to beat`,
    subtitle: "Your friend challenged you. Same round, same timing — can you do better?",
    cta: "Accept the challenge",
    accent: game.accent,
  });
}
