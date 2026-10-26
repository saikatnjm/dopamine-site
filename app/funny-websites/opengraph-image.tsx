import { ogContentType, ogSize } from "@/lib/og";
import { guideOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Funny websites for when you need a laugh";

export default function Image() {
  return guideOgImage("funny-websites");
}
