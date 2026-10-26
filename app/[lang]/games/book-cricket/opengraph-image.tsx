import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Book Cricket — the classroom page-flip cricket game, online";

export default function Image() {
  return renderOgCard({
    eyebrow: "🏏 Book Cricket",
    emoji: "📖",
    title: "Open the book. Pray for a 6.",
    subtitle: "The back-bench classic: the page number decides the ball. 2 overs, 3 wickets, chase the target.",
    cta: "Bat now",
    accent: "lime",
  });
}
