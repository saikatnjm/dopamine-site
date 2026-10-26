import { ogContentType, ogSize } from "@/lib/og";
import { guideOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Games to play when you're bored";

export default function Image() {
  return guideOgImage("games-to-play-when-bored");
}
