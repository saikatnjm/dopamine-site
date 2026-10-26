import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Kacher Guti — the Bangladeshi marble game, online vs the computer";

export default function Image() {
  return renderOgCard({
    eyebrow: "🔮 Kacher Guti",
    emoji: "🕳️",
    title: "Hit the marble they pick.",
    subtitle: "The para marble game: throw at the hole, then flick your guti at the one your opponent names. Miss and pay up.",
    cta: "Play now",
    accent: "sky",
  });
}
