import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "What Type of Bangali Are You? — a just-for-fun personality test on Hottogol";

export default function Image() {
  return renderOgCard({
    eyebrow: "🎭 Personality test",
    emoji: "☕",
    title: "What type of Bangali are you?",
    subtitle: "Adda emperor, meme lord or tea-stall philosopher? 8 quick questions, just for fun.",
    cta: "Find your type",
    accent: "violet",
  });
}
