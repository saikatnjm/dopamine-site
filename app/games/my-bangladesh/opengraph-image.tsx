import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx). Static for v1 (owner decision).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "My Bangladesh Map — how many of the 64 districts have you been to?";

export default function Image() {
  return renderOgCard({
    eyebrow: "🗺️ My Bangladesh Map",
    emoji: "🇧🇩",
    title: "How many of the 64 districts have you been to?",
    subtitle: "Tap every district you've visited. Get a title, badges and a poster to post.",
    cta: "Make my map",
    accent: "marigold",
  });
}
