import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Latim Fight — the Bangladeshi spinning-top battle, online vs the computer";

export default function Image() {
  return renderOgCard({
    eyebrow: "🌀 Latim Fight",
    emoji: "⭕",
    title: "Knock them out of the circle.",
    subtitle: "Wind the string, throw your latim, crash the other one out of the circle. First to 3 wins.",
    cta: "Throw now",
    accent: "tangerine",
  });
}
