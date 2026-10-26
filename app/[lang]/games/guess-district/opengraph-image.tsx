import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Guess the District — a daily Bangladesh map quiz on Hottogol";

export default function Image() {
  return renderOgCard({
    eyebrow: "📍 Guess the District",
    emoji: "🗺️",
    title: "10 districts. How well do you know your desh?",
    subtitle: "Spot it on the map, guess it from its shape or a clue. Same puzzle for everyone today.",
    cta: "Play today's puzzle",
    accent: "sky",
  });
}
