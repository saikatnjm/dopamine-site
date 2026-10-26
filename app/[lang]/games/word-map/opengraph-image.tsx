import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Bangladesh Word Map — the same thing, a different name in every region";

export default function Image() {
  return renderOgCard({
    eyebrow: "🗺️ Bangladesh Word Map",
    emoji: "🐈",
    title: "Same cat. Different name in every region.",
    subtitle: "See what Sylhet, Chattogram, Noakhali, Barishal, Rangpur and more call everyday things.",
    cta: "Explore the map",
    accent: "sky",
  });
}
