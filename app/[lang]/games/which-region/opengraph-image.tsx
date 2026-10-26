import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Which region of Bangladesh are you from? A dialect detective game on Hottogol";

export default function Image() {
  return renderOgCard({
    eyebrow: "🕵️ Dialect detective",
    emoji: "🇧🇩",
    title: "Which region are you from?",
    subtitle: "Tell us what you call 10 everyday things. We'll guess your corner of Bangladesh.",
    cta: "Get guessed",
    accent: "violet",
  });
}
