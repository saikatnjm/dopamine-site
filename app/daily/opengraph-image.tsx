import { ogContentType, ogSize } from "@/lib/og";
import { pageOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Daily Hottogol — one mini-game challenge a day";

export default function Image() {
  return pageOgImage("daily");
}
